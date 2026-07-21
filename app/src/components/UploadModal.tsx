import { useRef, useState } from "react";
import { FileUp, X } from "lucide-react";
import { api } from "../lib/api";

export function UploadModal({
  onClose,
  onUploaded,
}: {
  onClose: () => void;
  onUploaded: () => void;
}) {
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!file.name.endsWith(".md")) {
      setError("Only .md files are supported.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await api.uploadSheet(file);
      onUploaded();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start sm:items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="glass-card rounded-xl p-6 sm:p-8 w-full max-w-md relative my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-white transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <h3 className="text-lg font-bold text-white mb-1">Import Cheat Sheet</h3>
        <p className="text-xs text-on-surface-variant mb-6">
          Markdown with{" "}
          <code className="font-mono text-primary">## Heading</code> sections and command
          tables. Frontmatter (title, icon, color) is optional — sensible defaults are
          generated if it's missing.
        </p>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
          onClick={() => inputRef.current?.click()}
          className={`rounded-lg border-2 border-dashed p-8 sm:p-10 text-center cursor-pointer transition-colors ${
            dragOver ? "border-primary bg-primary/5" : "border-primary/20 hover:border-primary/40"
          }`}
        >
          <FileUp className="mx-auto mb-3 text-primary" size={28} strokeWidth={1.5} />
          <p className="text-sm text-white font-medium">
            {busy ? "Uploading…" : "Drop a .md file or click to browse"}
          </p>
          <input
            ref={inputRef}
            type="file"
            accept=".md"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </div>

        {error && <p className="mt-4 text-xs text-secondary">{error}</p>}
      </div>
    </div>
  );
}
