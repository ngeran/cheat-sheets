"""
Storage backend for core-sheets.

Two implementations behind one interface:
  - FSStore:   markdown files on disk (local dev / k3s PVC).
  - KVStore:   Vercel KV (Upstash Redis) — the only persistent option on
               Vercel serverless, whose filesystem is ephemeral/read-only.

Selection is env-driven: if KV_REST_API_URL is set (auto-injected by Vercel
when you create a KV store), KVStore is used; otherwise FSStore. The KV
client is imported lazily so dev never needs upstash-redis installed.

On a fresh store, seed_if_empty() copies the bundled api/seed/*.md sheets in
so prod isn't blank on first deploy.
"""

import os
from abc import ABC, abstractmethod
from datetime import datetime, timezone
from pathlib import Path

HERE = Path(__file__).parent
# Bundled, read-only seed shipped inside the image/function bundle.
SEED_DIR = Path(os.environ.get("SEED_DIR", HERE / "seed"))


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


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
            # Read-only filesystem (serverless without KV). Reads still work
            # via the seed fallback in _entries(); writes will fail at call time.
            pass

    def _path(self, sheet_id: str) -> Path:
        return self.root / f"{sheet_id}.md"

    def _entries(self) -> list[Path]:
        # Serve the data dir; fall back to the bundled seed when it's empty
        # (e.g. a read-only serverless FS before KV is provisioned), so a fresh
        # deploy still shows sheets instead of a blank page.
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
        p.write_text(raw, encoding="utf-8")
        return datetime.fromtimestamp(p.stat().st_mtime, tz=timezone.utc).isoformat()

    def delete(self, sheet_id: str) -> bool:
        p = self._path(sheet_id)
        if not p.is_file():
            return False
        p.unlink()
        return True

    def is_empty(self) -> bool:
        return len(self._entries()) == 0


def _val(resp):
    """upstash-redis wraps responses; newer versions return the value directly."""
    return resp.data if hasattr(resp, "data") else resp


class KVStore(Store):
    INDEX = "sheets:index"

    def __init__(self):
        from upstash_redis import Redis  # lazy: dev (FSStore) never imports this

        self.r = Redis(
            url=os.environ["KV_REST_API_URL"],
            token=os.environ["KV_REST_API_TOKEN"],
        )

    @staticmethod
    def _k(sheet_id: str) -> str:
        return f"sheet:{sheet_id}"

    @staticmethod
    def _m(sheet_id: str) -> str:
        return f"mtime:{sheet_id}"

    def _ids(self) -> list[str]:
        return sorted(_val(self.r.smembers(self.INDEX)) or [])

    def list(self) -> list[tuple[str, str, str]]:
        out = []
        for sheet_id in self._ids():
            raw = _val(self.r.get(self._k(sheet_id)))
            if raw is None:
                continue
            ts = _val(self.r.get(self._m(sheet_id))) or _now_iso()
            out.append((sheet_id, raw, ts))
        return out

    def read(self, sheet_id: str) -> tuple[str, str] | None:
        raw = _val(self.r.get(self._k(sheet_id)))
        if raw is None:
            return None
        ts = _val(self.r.get(self._m(sheet_id))) or _now_iso()
        return (raw, ts)

    def write(self, sheet_id: str, raw: str) -> str:
        ts = _now_iso()
        self.r.set(self._k(sheet_id), raw)
        self.r.set(self._m(sheet_id), ts)
        self.r.sadd(self.INDEX, sheet_id)
        return ts

    def delete(self, sheet_id: str) -> bool:
        existed = _val(self.r.get(self._k(sheet_id))) is not None
        self.r.delete(self._k(sheet_id), self._m(sheet_id))
        self.r.srem(self.INDEX, sheet_id)
        return existed

    def is_empty(self) -> bool:
        return len(self._ids()) == 0


def get_store() -> Store:
    if os.environ.get("KV_REST_API_URL"):
        store: Store = KVStore()
    else:
        root = Path(os.environ.get("SHEETS_DIR", HERE / "data" / "sheets"))
        store = FSStore(root)
    # On Vercel *without* KV provisioned, FSStore points at the read-only
    # function bundle — seeding would raise. Degrade to empty rather than
    # crashing every cold start (the fix is to provision KV).
    try:
        store.seed_if_empty()
    except Exception:
        pass
    return store
