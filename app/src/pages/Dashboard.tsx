import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { api } from "../lib/api";
import type { SheetSummary } from "../lib/types";
import { SheetCard } from "../components/SheetCard";

export function Dashboard({ refreshKey }: { refreshKey: number }) {
  const [sheets, setSheets] = useState<SheetSummary[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api
      .listSheets()
      .then(setSheets)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load sheets."))
      .finally(() => setLoading(false));
  }, [refreshKey]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sheets;
    return sheets.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.subtitle.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [sheets, query]);

  return (
    <main className="pt-28 sm:pt-32 pb-20 max-w-6xl mx-auto px-4 sm:px-8">
      <section className="max-w-3xl mx-auto mb-16">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-black border-b-2 border-primary/30 py-5 pl-14 pr-6 focus:outline-none focus:border-primary transition-colors text-lg text-white placeholder-zinc-700"
            placeholder="Find a cheat sheet…"
            type="text"
          />
        </div>
      </section>

      {loading && <p className="text-center text-on-surface-variant text-sm">Loading…</p>}
      {error && <p className="text-center text-secondary text-sm">{error}</p>}

      {!loading && !error && filtered.length === 0 && (
        <p className="text-center text-on-surface-variant text-sm">
          No cheat sheets match "{query}".
        </p>
      )}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((sheet) => (
          <SheetCard key={sheet.id} sheet={sheet} />
        ))}
      </section>
    </main>
  );
}
