import { Link } from "react-router-dom";
import { FilePlus, TerminalSquare, Upload } from "lucide-react";

export function Header({
  onImportClick,
  onCreateClick,
}: {
  onImportClick: () => void;
  onCreateClick: () => void;
}) {
  return (
    <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-primary/20 h-20 flex items-center">
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-8 flex justify-between items-center gap-2">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 min-w-0">
          <TerminalSquare className="text-primary shrink-0" size={26} strokeWidth={1.75} />
          <h1 className="text-lg sm:text-xl font-bold tracking-[0.1em] sm:tracking-[0.2em] text-white truncate">
            CORE_SHEETS
          </h1>
        </Link>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onCreateClick}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-primary/40 rounded text-primary text-[11px] font-bold tracking-widest uppercase hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <FilePlus size={14} />
            <span className="hidden sm:inline">Create</span>
          </button>
          <button
            onClick={onImportClick}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-primary/40 rounded text-primary text-[11px] font-bold tracking-widest uppercase hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <Upload size={14} />
            <span className="hidden sm:inline">Import</span>
          </button>
        </div>
      </div>
    </header>
  );
}
