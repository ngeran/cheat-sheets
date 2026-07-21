"""
CORE_SHEETS API — serves markdown cheat sheets stored as files with YAML
frontmatter under SHEETS_DIR (default ./data/sheets, /data/sheets in prod).

Frontmatter shape:
---
title: Neovim Cheatsheet
subtitle: The Editor
icon: TerminalSquare      # any lucide-react icon name
color: primary            # primary | secondary | tertiary
tags: [editor, cli]
---

Body: ## headings each followed by a `| Command | Description |` table.
See app/src/lib/parseSheet.ts for exactly how the frontend renders it.
"""

import os
import re
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Literal

import yaml
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

SHEETS_DIR = Path(os.environ.get("SHEETS_DIR", "data/sheets"))
SHEETS_DIR.mkdir(parents=True, exist_ok=True)

# On a fresh PVC, SHEETS_DIR starts empty. SEED_DIR ships inside the image
# (built from api/data/sheets) so the app isn't blank on first deploy.
SEED_DIR = Path(os.environ.get("SEED_DIR", "seed"))
if SEED_DIR.is_dir() and not any(SHEETS_DIR.glob("*.md")):
    for seed_file in SEED_DIR.glob("*.md"):
        (SHEETS_DIR / seed_file.name).write_text(
            seed_file.read_text(encoding="utf-8"), encoding="utf-8"
        )

AccentColor = Literal["primary", "secondary", "tertiary"]

app = FastAPI(title="core-sheets-api")

# Same-origin via nginx proxy in prod; permissive here so local dev works
# even without the Vite proxy configured.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class SheetSummary(BaseModel):
    id: str
    title: str
    subtitle: str
    icon: str
    color: AccentColor
    tags: list[str]
    command_count: int
    updated_at: str


class SheetDetail(SheetSummary):
    body: str


class SheetUpdate(BaseModel):
    body: str  # full markdown source: optional frontmatter + body


def slugify(text: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return slug or uuid.uuid4().hex[:8]


def split_frontmatter(raw: str) -> tuple[dict, str]:
    """Returns (metadata, body). Missing/malformed frontmatter -> ({}, raw)."""
    if not raw.startswith("---"):
        return {}, raw
    parts = raw.split("---", 2)
    if len(parts) < 3:
        return {}, raw
    try:
        meta = yaml.safe_load(parts[1]) or {}
    except yaml.YAMLError:
        meta = {}
    return meta, parts[2].lstrip("\n")


def count_commands(body: str) -> int:
    """Count table data rows (lines starting with | that aren't the header
    or the --- separator). Mirrors the frontend's parseSheet.ts logic."""
    count = 0
    seen_separator_since_heading = False
    for line in body.splitlines():
        line = line.strip()
        if line.startswith("## "):
            seen_separator_since_heading = False
            continue
        if not line.startswith("|"):
            continue
        cells = [c.strip() for c in line.split("|")[1:-1]]
        if len(cells) < 2:
            continue
        if all(re.fullmatch(r":?-+:?", c) for c in cells):
            seen_separator_since_heading = True
            continue
        if seen_separator_since_heading:
            count += 1
    return count


def load_sheet(path: Path) -> SheetDetail:
    raw = path.read_text(encoding="utf-8")
    meta, body = split_frontmatter(raw)
    sheet_id = path.stem
    title = meta.get("title") or sheet_id.replace("-", " ").title()
    return SheetDetail(
        id=sheet_id,
        title=title,
        subtitle=meta.get("subtitle", ""),
        icon=meta.get("icon", "Terminal"),
        color=meta.get("color", "primary"),
        tags=meta.get("tags", []),
        command_count=count_commands(body),
        updated_at=datetime.fromtimestamp(path.stat().st_mtime, tz=timezone.utc).isoformat(),
        body=body,
    )


@app.get("/api/sheets", response_model=list[SheetSummary])
def list_sheets():
    sheets = [load_sheet(p) for p in sorted(SHEETS_DIR.glob("*.md"))]
    return sorted(sheets, key=lambda s: s.title.lower())


@app.get("/api/sheets/{sheet_id}", response_model=SheetDetail)
def get_sheet(sheet_id: str):
    path = SHEETS_DIR / f"{sheet_id}.md"
    if not path.is_file():
        raise HTTPException(status_code=404, detail="Sheet not found")
    return load_sheet(path)


@app.post("/api/sheets", response_model=SheetSummary)
async def upload_sheet(file: UploadFile = File(...)):
    if not file.filename or not file.filename.endswith(".md"):
        raise HTTPException(status_code=400, detail="Only .md files are accepted")

    raw = (await file.read()).decode("utf-8", errors="replace")
    meta, body = split_frontmatter(raw)

    title = meta.get("title") or Path(file.filename).stem.replace("-", " ").title()
    sheet_id = slugify(Path(file.filename).stem)

    path = SHEETS_DIR / f"{sheet_id}.md"
    if path.exists():
        sheet_id = f"{sheet_id}-{uuid.uuid4().hex[:6]}"
        path = SHEETS_DIR / f"{sheet_id}.md"

    frontmatter = yaml.safe_dump(
        {
            "title": title,
            "subtitle": meta.get("subtitle", ""),
            "icon": meta.get("icon", "Terminal"),
            "color": meta.get("color", "primary"),
            "tags": meta.get("tags", []),
        },
        sort_keys=False,
    )
    path.write_text(f"---\n{frontmatter}---\n\n{body}", encoding="utf-8")

    return load_sheet(path)


@app.put("/api/sheets/{sheet_id}", response_model=SheetDetail)
def update_sheet(sheet_id: str, update: SheetUpdate):
    """Replace a sheet's markdown source verbatim. Frontmatter is re-parsed
    on read (load_sheet), so what's written is exactly what's stored."""
    path = SHEETS_DIR / f"{sheet_id}.md"
    if not path.is_file():
        raise HTTPException(status_code=404, detail="Sheet not found")
    path.write_text(update.body, encoding="utf-8")
    return load_sheet(path)


@app.delete("/api/sheets/{sheet_id}", status_code=204)
def delete_sheet(sheet_id: str):
    path = SHEETS_DIR / f"{sheet_id}.md"
    if not path.is_file():
        raise HTTPException(status_code=404, detail="Sheet not found")
    path.unlink()
