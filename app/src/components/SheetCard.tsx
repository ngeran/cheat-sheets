import { Link } from "react-router-dom";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { SheetSummary } from "../lib/types";

// Tailwind v4's scanner needs literal class strings, not interpolated ones,
// so accent colors are resolved through this static lookup rather than
// `text-${color}` template strings.
const ACCENT = {
  primary: {
    text: "text-primary",
    border: "border-primary/40",
    borderSoft: "border-primary/10",
    bg: "bg-primary/5",
    dot: "bg-primary shadow-[0_0_8px_#00dce5]",
    ghost: "text-primary/10 group-hover:text-primary/20",
  },
  secondary: {
    text: "text-secondary",
    border: "border-secondary/40",
    borderSoft: "border-secondary/10",
    bg: "bg-secondary/5",
    dot: "bg-secondary",
    ghost: "text-secondary/10 group-hover:text-secondary/20",
  },
  tertiary: {
    text: "text-tertiary",
    border: "border-tertiary/40",
    borderSoft: "border-tertiary/10",
    bg: "bg-tertiary/5",
    dot: "bg-tertiary",
    ghost: "text-tertiary/10 group-hover:text-tertiary/20",
  },
} as const;

export function SheetCard({ sheet }: { sheet: SheetSummary }) {
  const accent = ACCENT[sheet.color] ?? ACCENT.primary;
  const Icon = (Icons[sheet.icon as keyof typeof Icons] as LucideIcon) ?? Icons.Terminal;

  return (
    <Link
      to={`/sheets/${sheet.id}`}
      className="glass-card group relative p-5 sm:p-8 rounded-xl block overflow-hidden"
    >
      <Icon
        className={`absolute top-6 right-6 transition-colors ${accent.ghost}`}
        size={96}
        strokeWidth={1}
      />
      <div className="relative z-10">
        <div
          className={`w-14 h-14 rounded border ${accent.border} ${accent.bg} flex items-center justify-center mb-8`}
        >
          <Icon className={accent.text} size={26} strokeWidth={1.75} />
        </div>
        <span
          className={`font-mono text-[10px] ${accent.text} tracking-[0.3em] uppercase mb-2 block`}
        >
          {sheet.subtitle}
        </span>
        <h2 className="text-2xl font-bold text-white mb-6">{sheet.title}</h2>
        <div className="flex items-center gap-3">
          <span className={`w-1.5 h-1.5 rounded-full ${accent.dot}`} />
          <span className="text-xs text-on-surface-variant font-bold tracking-widest uppercase">
            {sheet.command_count} Commands
          </span>
        </div>
      </div>
    </Link>
  );
}
