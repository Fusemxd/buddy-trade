import type { ScreenshotImportMode } from "@/types/screenshotImport";

export default function ScreenshotImportActions({ onConfirm }: { onConfirm: (mode: ScreenshotImportMode) => void }) {
  const buttons: Array<[ScreenshotImportMode, string]> = [
    ["watchlist", "Add to Watchlist"],
    ["trade_plan", "Create Trade Plan Draft"],
    ["journal", "Save Journal Draft"],
    ["exit_plan", "Create Exit Plan Draft"]
  ];

  return (
    <div className="sticky bottom-20 z-20 grid gap-2 rounded-3xl border border-slate-700 bg-slate-950/95 p-2 shadow-[0_-16px_40px_rgba(2,6,23,0.45)] backdrop-blur sm:static sm:grid-cols-2 sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none">
      {buttons.map(([mode, label]) => (
        <button className="min-h-14 rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-4 font-black text-cyan-100 active:scale-[0.99] sm:min-h-12" key={mode} onClick={() => onConfirm(mode)} type="button">
          {label}
        </button>
      ))}
    </div>
  );
}
