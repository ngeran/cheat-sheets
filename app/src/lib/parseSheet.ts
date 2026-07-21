import type { SheetSection } from "./types";

/**
 * Expected markdown body shape (after frontmatter is stripped):
 *
 *   ## Section Title
 *   | Command | Description |
 *   |---|---|
 *   | `dd` | Delete line |
 *
 * Each `## heading` starts a new card. The first table found under a
 * heading becomes that card's command list. Anything else is ignored for
 * now (kept simple + predictable for hand-written or LLM-authored sheets).
 */
export function parseSheet(body: string): SheetSection[] {
  const lines = body.split("\n");
  const sections: SheetSection[] = [];
  let current: SheetSection | null = null;
  let sawSeparatorRow = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line.startsWith("## ")) {
      if (current) sections.push(current);
      current = { heading: line.slice(3).trim(), rows: [] };
      sawSeparatorRow = false;
      continue;
    }

    if (!current || !line.startsWith("|")) continue;

    const cells = line
      .split("|")
      .slice(1, -1)
      .map((c) => c.trim());

    if (cells.length < 2) continue;

    // Table separator row, e.g. | --- | --- |
    if (cells.every((c) => /^:?-+:?$/.test(c))) {
      sawSeparatorRow = true;
      continue;
    }

    // First row before the separator is the header (Command / Description) - skip it
    if (!sawSeparatorRow) continue;

    const [cmd, desc] = cells;
    current.rows.push({ cmd: stripInlineCode(cmd), desc: stripInlineCode(desc) });
  }

  if (current) sections.push(current);
  return sections;
}

function stripInlineCode(text: string): string {
  return text.replace(/`([^`]+)`/g, "$1");
}
