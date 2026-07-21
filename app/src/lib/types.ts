export type AccentColor = "primary" | "secondary" | "tertiary";

export interface SheetSummary {
  id: string;
  title: string;
  subtitle: string;
  icon: string; // lucide-react icon name, e.g. "Terminal"
  color: AccentColor;
  tags: string[];
  command_count: number;
  updated_at: string; // ISO date
}

export interface SheetDetail extends SheetSummary {
  body: string; // raw markdown (frontmatter stripped)
}

export interface SheetSection {
  heading: string;
  rows: { cmd: string; desc: string }[];
}
