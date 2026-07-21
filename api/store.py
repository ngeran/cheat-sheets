"""
Storage backend for core-sheets.

Two implementations behind one interface:
  - FSStore:        markdown files on disk (local dev / k3s PVC).
  - PostgresStore:  Neon / Vercel Postgres — the persistent store on Vercel
                    serverless, whose filesystem is ephemeral/read-only.

Selection is env-driven: DATABASE_URL -> Postgres (Vercel), else filesystem.
setup() is idempotent: it creates the table (Postgres) and, on an empty store,
seeds the bundled api/seed/*.md sheets so prod isn't blank on first deploy.
"""

import os
from abc import ABC, abstractmethod
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path

HERE = Path(__file__).parent
# Bundled, read-only seed shipped inside the image/function bundle.
SEED_DIR = Path(os.environ.get("SEED_DIR", HERE / "seed"))


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _iso(dt) -> str:
    return dt.isoformat() if dt else _now_iso()


class ReadOnlyStore(Exception):
    """Raised when the store can't persist — e.g. a serverless read-only FS.
    Routes translate this into a clear 503."""


class Store(ABC):
    @abstractmethod
    def list(self) -> list[tuple[str, str, str]]:
        """All sheets as (id, raw_markdown, updated_at_iso)."""

    @abstractmethod
    def read(self, sheet_id: str) -> tuple[str, str] | None:
        """(raw_markdown, updated_at_iso) or None if missing."""

    @abstractmethod
    def write(self, sheet_id: str, raw: str) -> str:
        """Write raw markdown; return updated_at_iso."""

    @abstractmethod
    def delete(self, sheet_id: str) -> bool:
        """True if a sheet was deleted, False if it didn't exist."""

    @abstractmethod
    def is_empty(self) -> bool: ...

    def setup(self) -> None:
        """Idempotent one-time init (schema for Postgres, then seed)."""
        self.seed_if_empty()

    def seed_if_empty(self) -> None:
        if not self.is_empty() or not SEED_DIR.is_dir():
            return
        for f in sorted(SEED_DIR.glob("*.md")):
            self.write(f.stem, f.read_text(encoding="utf-8"))


class FSStore(Store):
    def __init__(self, root: Path):
        self.root = root
        try:
            self.root.mkdir(parents=True, exist_ok=True)
        except OSError:
            # Read-only filesystem (serverless without a DB). Reads still work
            # via the seed fallback in _entries(); writes fail at call time.
            pass

    def _path(self, sheet_id: str) -> Path:
        return self.root / f"{sheet_id}.md"

    def _entries(self) -> list[Path]:
        # Serve the data dir; fall back to the bundled seed when it's empty
        # (e.g. a read-only serverless FS), so a fresh deploy still shows sheets.
        files = sorted(self.root.glob("*.md"))
        if not files and SEED_DIR.is_dir():
            files = sorted(SEED_DIR.glob("*.md"))
        return files

    def list(self) -> list[tuple[str, str, str]]:
        out = []
        for p in self._entries():
            raw = p.read_text(encoding="utf-8")
            ts = datetime.fromtimestamp(p.stat().st_mtime, tz=timezone.utc).isoformat()
            out.append((p.stem, raw, ts))
        return out

    def read(self, sheet_id: str) -> tuple[str, str] | None:
        p = self._path(sheet_id)
        if not p.is_file() and SEED_DIR.is_dir():
            seeded = SEED_DIR / f"{sheet_id}.md"
            if seeded.is_file():
                p = seeded
        if not p.is_file():
            return None
        raw = p.read_text(encoding="utf-8")
        ts = datetime.fromtimestamp(p.stat().st_mtime, tz=timezone.utc).isoformat()
        return (raw, ts)

    def write(self, sheet_id: str, raw: str) -> str:
        p = self._path(sheet_id)
        try:
            p.write_text(raw, encoding="utf-8")
        except OSError as e:  # read-only filesystem (serverless without a DB)
            raise ReadOnlyStore() from e
        return datetime.fromtimestamp(p.stat().st_mtime, tz=timezone.utc).isoformat()

    def delete(self, sheet_id: str) -> bool:
        p = self._path(sheet_id)
        if not p.is_file():
            return False
        try:
            p.unlink()
        except OSError as e:  # read-only filesystem (serverless without a DB)
            raise ReadOnlyStore() from e
        return True

    def is_empty(self) -> bool:
        return len(self._entries()) == 0


class PostgresStore(Store):
    SCHEMA = (
        "CREATE TABLE IF NOT EXISTS sheets ("
        "  id TEXT PRIMARY KEY,"
        "  body TEXT NOT NULL,"
        "  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()"
        ")"
    )

    def setup(self) -> None:
        self._ensure_schema()
        self.seed_if_empty()

    @staticmethod
    @contextmanager
    def _cursor():
        import psycopg  # lazy: dev (FSStore) never needs psycopg installed

        conn = psycopg.connect(os.environ["DATABASE_URL"], autocommit=True)
        try:
            with conn.cursor() as cur:
                yield cur
        finally:
            conn.close()

    def _ensure_schema(self) -> None:
        with self._cursor() as cur:
            cur.execute(self.SCHEMA)

    def list(self) -> list[tuple[str, str, str]]:
        with self._cursor() as cur:
            cur.execute("SELECT id, body, updated_at FROM sheets ORDER BY id")
            rows = cur.fetchall()
        return [(r[0], r[1], _iso(r[2])) for r in rows]

    def read(self, sheet_id: str) -> tuple[str, str] | None:
        with self._cursor() as cur:
            cur.execute("SELECT body, updated_at FROM sheets WHERE id = %s", (sheet_id,))
            r = cur.fetchone()
        return None if not r else (r[0], _iso(r[1]))

    def write(self, sheet_id: str, raw: str) -> str:
        with self._cursor() as cur:
            cur.execute(
                "INSERT INTO sheets (id, body, updated_at) VALUES (%s, %s, now()) "
                "ON CONFLICT (id) DO UPDATE SET body = EXCLUDED.body, updated_at = now() "
                "RETURNING updated_at",
                (sheet_id, raw),
            )
            r = cur.fetchone()
        return _iso(r[0])

    def delete(self, sheet_id: str) -> bool:
        with self._cursor() as cur:
            cur.execute("DELETE FROM sheets WHERE id = %s", (sheet_id,))
            return cur.rowcount > 0

    def is_empty(self) -> bool:
        with self._cursor() as cur:
            cur.execute("SELECT count(*) FROM sheets")
            return cur.fetchone()[0] == 0


def get_store() -> Store:
    if os.environ.get("DATABASE_URL"):
        store: Store = PostgresStore()
    else:
        root = Path(os.environ.get("SHEETS_DIR", HERE / "data" / "sheets"))
        store = FSStore(root)
    store.setup()
    return store
