import { useState } from "react";
import { Save, X } from "lucide-react";

// Shared markdown source editor used by both Edit (SheetView) and Create
// (CreateModal). Owns its own draft + saving + error state; the parent stays
// mounted on error so the user can fix and retry.
export function SheetEditor({
  initialValue,
  onSave,
  onCancel,
  saveLabel = "Save",
}: {
  initialValue: string;
  onSave: (text: string) => Promise<void>;
  onCancel: () => void;
  saveLabel?: string;
}) {
  const [draft, setDraft] = useState(initialValue);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setSaving(true);
    setError(null);
    try {
      await onSave(draft);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="w-full">
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        spellCheck={false}
        autoFocus
        className="w-full h-[50vh] sm:h-[60vh] bg-black border border-primary/20 rounded-lg p-3 sm:p-4 font-mono text-xs leading-relaxed text-white focus:outline-none focus:border-primary transition-colors resize-y"
      />
      <p className="mt-3 text-xs text-on-surface-variant leading-relaxed">
        Markdown source — frontmatter (title, subtitle, icon, color, tags) followed by{" "}
        <code className="font-mono text-primary">## Heading</code> sections and{" "}
        <code className="font-mono text-primary">| Command | Description |</code> tables.
      </p>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-5">
        <button
          onClick={submit}
          disabled={saving}
          className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 border border-primary rounded text-primary text-[11px] font-bold tracking-widest uppercase hover:bg-primary/10 transition-colors disabled:opacity-40"
        >
          <Save size={13} /> {saving ? "Saving…" : saveLabel}
        </button>
        <button
          onClick={onCancel}
          disabled={saving}
          className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 border border-white/15 rounded text-on-surface-variant text-[11px] font-bold tracking-widest uppercase hover:text-white hover:border-white/40 transition-colors disabled:opacity-40"
        >
          <X size={13} /> Cancel
        </button>
      </div>
      {error && <p className="mt-4 text-xs text-secondary">{error}</p>}
    </div>
  );
}
