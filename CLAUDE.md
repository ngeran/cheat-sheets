# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A cheat-sheets web app: a FastAPI backend (`api/`) serves markdown cheat sheets stored as files, and a React + Vite + Tailwind SPA (`app/`) renders them. Deployed via Nix → OCI image → local k3s cluster (the Nikos dev pipeline — `flake.nix` + `direnv` + `just` + `skopeo` + a `localhost:5000` registry). The `/project-pipeline` skill covers this whole pipeline and is the right tool for build/deploy failures here.

## Commands

Frontend and API run as **two separate processes** in dev (Vite proxies `/api` → `:8080`):

```bash
# API (FastAPI) — run from api/, needs uv/python on the host (not in the nix shell)
cd api && uv run uvicorn main:app --port 8080

# Frontend (Vite HMR) — http://localhost:5173, first run needs npm install
cd app && npm install && npm run dev
```

Build / deploy / quality (run from repo root, these wrap the Nix + k3s pipeline):

- `just check` — type-check (`tsc --noEmit`) + eslint in `app/`. Needs `node_modules` installed first.
- `just relock` — recompute `npmDepsHash` after changing `app/package-lock.json` and write it into `flake.nix`. **Required** or `nix build` fails.
- `just build` — `nix build .#image` → `result` (an OCI image, no Dockerfile/docker).
- `just test` — loads the built image into docker, curls `/`, expects 200 (container smoke test, **not** unit tests — there is no test framework in this repo).
- `just build && just push && just deploy` — full deploy: build → skopeo push to local registry → `kubectl apply -f manifests/` → rollout.
- `just doctor` — pre-flight: k3s up, registry reachable, git index clean.
- `just logs` / `just forward` (8080:80) / `just serve` (HMR).

k3s + registry must be running first: `sudo systemctl start k3s`.

## Architecture

**Two services, one Ingress.** `manifests/ingress.yaml` routes host `cheatsheets.home`:
- `/api` → `cheatsheets-api` (FastAPI, port 8080)
- `/`  → `cheatsheets-web` (nginx serving the built SPA, port 8080)

The SPA calls same-origin `/api` (`app/src/lib/api.ts`, `BASE = "/api"`). In dev, Vite's `server.proxy` forwards it. In prod, nginx/Ingress does. Both frontend and API agree on the sheet shape defined in `app/src/lib/types.ts` / the Pydantic models in `api/main.py`.

**A cheat sheet = one markdown file** with YAML frontmatter + a body of `## Heading` sections each followed by a `| Command | Description |` table. See `api/data/sheets/neovim.md` for the canonical example. Frontmatter fields: `title`, `subtitle`, `icon` (any `lucide-react` icon name), `color` (`primary` | `secondary` | `tertiary`), `tags`.

**Sheets live in two places** (`api/main.py`): `SHEETS_DIR` is the read/write store (`api/data/sheets` in dev, `/data/sheets` on a PVC in prod). `SEED_DIR` ships inside the image and seeds `SHEETS_DIR` only when it's empty (fresh PVC), so prod isn't blank on first deploy. Uploads write new `.md` files there; deletes unlink them.

**Cross-file invariant — keep the table parser in sync.** Command-counting in `api/main.py:count_commands` must mirror table parsing in `app/src/lib/parseSheet.ts` (both ignore header + separator rows, count data rows after a `## heading`). If you change what counts as a command/table row, update **both** — the count shown on cards comes from the API, the rendered rows from the frontend.

**Tailwind v4 styling rules** (breaking these silently breaks the build/UI):
- Theme tokens are defined in `app/src/index.css` under `@theme` — accent colors are `primary` (teal `#00dce5`), `secondary` (orange), `tertiary` (purple). The frontmatter `color` field maps to these.
- Tailwind v4's scanner needs **literal class strings**, not interpolated ones. `app/src/components/SheetCard.tsx` resolves accent colors through a static `ACCENT` lookup object precisely because `text-${color}` templates would be purged. When adding color-dependent classes, follow the same static-lookup pattern.
- OLED/black design: active/selected states use a border + glow (`.glass-card`, `.glow-primary`), never a solid highlight fill.

## Pipeline gotchas

- **`npmDepsHash` in `flake.nix` must match `app/package-lock.json`.** Change deps → `(cd app && npm install)` → `just relock` → `just build`.
- **Nix evaluates the git *index*, not the worktree.** Untracked or unstaged files are invisible to `nix build`. `git add` new/edited files under `app/` and `flake.nix` before building, or your changes are silently ignored (`just doctor` warns about this). This bites often since `api/` and several manifests are currently untracked.
- **nginx runs as non-root UID 1000 on port 8080** (baked into `flake.nix`; `manifests/deployment.yaml` sets `runAsUser: 1000`). Non-root can't bind <1024, which is why everything is on 8080.

## Current build/deploy state (in progress)

The Nix flake and `justfile` still target the **original single-service `react-app` template**: they build/deploy only the web image as `localhost:5000/react-app` (`just`'s `dep=react-app`, `manifests/deployment.yaml` + `manifests/service.yaml`). The newer full-stack setup — `api/`, `manifests/{api-deployment,web-deployment,ingress}.yaml`, and image names `cheatsheets-api` / `cheatsheets-web` — is **not yet wired into the Nix build or `justfile`**. So today `just build/push/deploy` covers only the SPA; there is no flake package or `just` target that builds the API image yet. When extending the pipeline to both services, expect to add a second `buildNpmPackage`-style image build for the API and reconcile the image names with the manifests.
