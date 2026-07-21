"""
CORE_SHEETS API — serves markdown cheat sheets.

Storage is pluggable (see store.py): filesystem in dev, Vercel KV in prod.
Routes are prefixed /api so Vercel can split /api/* (this function) from the
SPA (everything else).

Frontmatter shape:
---
title: Neovim Cheatsheet
subtitle: The Editor
icon: TerminalSquare      # any lucide-react icon name
color: primary            # primary | secondary | tertiary
tags: [editor, cli]
---

Body: ## headings each followed by a | Command | Description | table.
See app/src/lib/parseSheet.ts for how the frontend renders it.
"""

import re
import uuid
from pathlib import Path
from typing import Literal

import yaml
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from store import get_store

AccentColor = Literal["primary", "secondary", "tertiary"]

app = FastAPI(title="core-sheets-api")

# Same-origin in prod (Vercel rewrites /api/* to this function, served on the
# same domain as the SPA). Permissive here so local dev works without a proxy.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

store = get_store()


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


def load_sheet(sheet_id: str, raw: str, updated_at: str) -> SheetDetail:
    meta, body = split_frontmatter(raw)
    title = meta.get("title") or sheet_id.replace("-", " ").title()
    return SheetDetail(
        id=sheet_id,
        title=title,
        subtitle=meta.get("subtitle", ""),
        icon=meta.get("icon", "Terminal"),
        color=meta.get("color", "primary"),
        tags=meta.get("tags", []),
        command_count=count_commands(body),
        updated_at=updated_at,
        body=body,
    )


@app.get("/api/sheets", response_model=list[SheetSummary])
def list_sheets():
    sheets = [load_sheet(i, raw, ts) for (i, raw, ts) in store.list()]
    return sorted(sheets, key=lambda s: s.title.lower())


@app.get("/api/sheets/{sheet_id}", response_model=SheetDetail)
def get_sheet(sheet_id: str):
    got = store.read(sheet_id)
    if not got:
        raise HTTPException(status_code=404, detail="Sheet not found")
    return load_sheet(sheet_id, *got)


@app.post("/api/sheets", response_model=SheetSummary)
async def upload_sheet(file: UploadFile = File(...)):
    if not file.filename or not file.filename.endswith(".md"):
        raise HTTPException(status_code=400, detail="Only .md files are accepted")

    raw = (await file.read()).decode("utf-8", errors="replace")
    meta, body = split_frontmatter(raw)

    title = meta.get("title") or Path(file.filename).stem.replace("-", " ").title()
    sheet_id = slugify(Path(file.filename).stem)
    if store.read(sheet_id) is not None:  # dedup — don't clobber an existing sheet
        sheet_id = f"{sheet_id}-{uuid.uuid4().hex[:6]}"

    ts = store.write(sheet_id, raw)
    return load_sheet(sheet_id, raw, ts)


@app.put("/api/sheets/{sheet_id}", response_model=SheetDetail)
def update_sheet(sheet_id: str, update: SheetUpdate):
    """Replace a sheet's markdown source verbatim."""
    if store.read(sheet_id) is None:
        raise HTTPException(status_code=404, detail="Sheet not found")
    ts = store.write(sheet_id, update.body)
    return load_sheet(sheet_id, update.body, ts)


@app.delete("/api/sheets/{sheet_id}", status_code=204)
def delete_sheet(sheet_id: str):
    if not store.delete(sheet_id):
        raise HTTPException(status_code=404, detail="Sheet not found")
