import type { SheetDetail, SheetSummary } from "./types";

// Same-origin in prod (nginx proxies /api -> the FastAPI service).
// In local dev, Vite's server.proxy in vite.config.ts forwards this too.
const BASE = "/api";

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  listSheets: () => fetch(`${BASE}/sheets`).then((r) => json<SheetSummary[]>(r)),

  getSheet: (id: string) => fetch(`${BASE}/sheets/${id}`).then((r) => json<SheetDetail>(r)),

  updateSheet: (id: string, body: string) =>
    fetch(`${BASE}/sheets/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    }).then((r) => json<SheetDetail>(r)),

  uploadSheet: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return fetch(`${BASE}/sheets`, { method: "POST", body: form }).then((r) =>
      json<SheetSummary>(r),
    );
  },

  deleteSheet: (id: string) =>
    fetch(`${BASE}/sheets/${id}`, { method: "DELETE" }).then((r) => {
      if (!r.ok) throw new Error(`${r.status}: failed to delete`);
    }),
};
