import { FilePlus, X } from "lucide-react";
import type { SheetSummary } from "../lib/types";
import { api } from "../lib/api";
import { SheetEditor } from "./SheetEditor";

const TEMPLATE = `---
title: New Sheet
subtitle: Short tagline
icon: Terminal
color: primary
tags: [tag1, tag2]
---

## Section
| Command | Description |
|---|---|
| \`cmd\` | what it does |
`;

// Full-screen on mobile (editing room), centered card on desktop. Creates a
// sheet by posting the markdown as a .md File through the existing upload
// endpoint — the server slugifies the title and returns the real id.
export function CreateModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (sheet: SheetSummary) => void;
}) {
  async function handleSave(text: string) {
    const title = (text.match(/^title:\s*(.+)$/m)?.[1] ?? "new-sheet").trim();
    const stem =
      title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "new-sheet";
    const file = new File([text], `${stem}.md`, { type: "text/markdown" });
    const summary = await api.uploadSheet(file);
    onCreated(summary);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex flex-col">
      <div className="flex items-center justify-between px-4 sm:px-6 h-16 border-b border-primary/20 shrink-0">
        <div className="flex items-center gap-2">
          <FilePlus className="text-primary" size={18} />
          <h3 className="text-base sm:text-lg font-bold text-white">New Cheat Sheet</h3>
        </div>
        <button
          onClick={onClose}
          className="text-on-surface-variant hover:text-white transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <SheetEditor
            initialValue={TEMPLATE}
            saveLabel="Create"
            onSave={handleSave}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}
