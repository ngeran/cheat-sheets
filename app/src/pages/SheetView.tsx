import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { api } from "../lib/api";
import type { SheetDetail } from "../lib/types";
import { parseSheet } from "../lib/parseSheet";
import { SheetEditor } from "../components/SheetEditor";

const ACCENT_TEXT = {
  primary: "text-primary",
  secondary: "text-secondary",
  tertiary: "text-tertiary",
} as const;

const ACCENT_BORDER = {
  primary: "border-primary/10",
  secondary: "border-secondary/10",
  tertiary: "border-tertiary/10",
} as const;

// Rebuild the canonical markdown source (frontmatter + body) for the editor.
// Matches what upload_sheet writes so what you see is exactly what's stored.
function toSource(s: SheetDetail): string {
  return [
    "---",
    `title: ${s.title}`,
    `subtitle: ${s.subtitle}`,
    `icon: ${s.icon}`,
    `color: ${s.color}`,
    `tags: [${s.tags.join(", ")}]`,
    "---",
    "",
    s.body,
  ].join("\n");
}

export function SheetView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sheet, setSheet] = useState<SheetDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setSheet(null);
    setError(null);
    setEditing(false);
    api.getSheet(id).catch((e) => setError(e instanceof Error ? e.message : "Not found.")).then(
      (s) => s && setSheet(s),
    );
  }, [id]);

  const sections = useMemo(() => (sheet ? parseSheet(sheet.body) : []), [sheet]);

  const filteredSections = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sections;
    return sections
      .map((s) => ({
        ...s,
        rows: s.rows.filter(
          (r) => r.cmd.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q),
        ),
      }))
      .filter((s) => s.rows.length > 0);
  }, [sections, query]);

  async function saveEdit(text: string) {
    if (!id) return;
    const updated = await api.updateSheet(id, text);
    setSheet(updated);
    setEditing(false);
  }

  async function handleDelete() {
    if (!id || !sheet) return;
    if (!window.confirm(`Delete “${sheet.title}”? This can’t be undone.`)) return;
    setDeleting(true);
    setActionError(null);
    try {
      await api.deleteSheet(id);
      navigate("/");
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Delete failed.");
      setDeleting(false);
    }
  }

  if (error) {
    return (
      <main className="pt-32 pb-20 max-w-3xl mx-auto px-4 sm:px-8 text-center">
        <p className="text-secondary mb-6">{error}</p>
        <Link to="/" className="text-primary text-sm font-bold tracking-widest uppercase">
          ← Back to dashboard
        </Link>
      </main>
    );
  }

  if (!sheet) {
    return (
      <main className="pt-32 pb-20 max-w-3xl mx-auto px-4 sm:px-8 text-center">
        <p className="text-on-surface-variant text-sm">Loading…</p>
      </main>
    );
  }

  const accentText = ACCENT_TEXT[sheet.color] ?? ACCENT_TEXT.primary;
  const accentBorder = ACCENT_BORDER[sheet.color] ?? ACCENT_BORDER.primary;
  const Icon = (Icons[sheet.icon as keyof typeof Icons] as LucideIcon) ?? Icons.Terminal;

  return (
    <main className="pt-24 sm:pt-28 pb-20 max-w-6xl mx-auto px-4 sm:px-8">
      <div className="flex items-center justify-between gap-3 mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-on-surface-variant hover:text-primary transition-colors"
        >
          <ArrowLeft size={14} /> All sheets
        </Link>
        {!editing && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActionError(null);
                setEditing(true);
              }}
              disabled={deleting}
              className="flex items-center gap-2 px-3 py-2 border border-primary/40 rounded text-primary text-[11px] font-bold tracking-widest uppercase hover:border-primary hover:bg-primary/5 transition-colors disabled:opacity-40"
            >
              <Pencil size={13} /> Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 px-3 py-2 border border-secondary/40 rounded text-secondary text-[11px] font-bold tracking-widest uppercase hover:border-secondary hover:bg-secondary/5 transition-colors disabled:opacity-40"
            >
              <Trash2 size={13} /> {deleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 mb-2">
        <Icon className={accentText} size={32} strokeWidth={1.5} />
        <h1 className="text-2xl sm:text-3xl font-bold text-white">{sheet.title}</h1>
      </div>
      <p className={`font-mono text-xs ${accentText} tracking-[0.25em] uppercase mb-8`}>
        {sheet.subtitle}
      </p>

      {editing ? (
        <SheetEditor
          initialValue={toSource(sheet)}
          onSave={saveEdit}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <>
          <div className="relative max-w-xl mb-12">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter commands in this sheet…"
              className="w-full bg-black border border-primary/20 rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors placeholder-zinc-700"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {filteredSections.map((section) => (
              <div key={section.heading} className={`glass-card rounded-lg overflow-hidden border ${accentBorder}`}>
                <div className={`px-3 sm:px-4 py-3 border-b ${accentBorder} font-mono text-xs font-bold tracking-widest uppercase ${accentText}`}>
                  {section.heading}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <tbody>
                      {section.rows.map((row, i) => (
                        <tr key={i} className={i % 2 === 1 ? "bg-white/[0.02]" : ""}>
                          <td className="px-3 sm:px-4 py-2 font-mono text-xs text-secondary whitespace-nowrap border-b border-white/5 align-top">
                            {row.cmd}
                          </td>
                          <td className="px-3 sm:px-4 py-2 text-sm text-zinc-300 border-b border-white/5">
                            {row.desc}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          {filteredSections.length === 0 && (
            <p className="text-center text-on-surface-variant text-sm mt-12">
              No commands match "{query}".
            </p>
          )}
        </>
      )}

      {actionError && <p className="mt-6 text-xs text-secondary max-w-3xl">{actionError}</p>}
    </main>
  );
}
