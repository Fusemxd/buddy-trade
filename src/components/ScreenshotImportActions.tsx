import type { ScreenshotImportMode } from "@/types/screenshotImport";

export default function ScreenshotImportActions({ onConfirm }: { onConfirm: (mode: ScreenshotImportMode) => void }) {
  const buttons: Array<[ScreenshotImportMode, string]> = [
    ["watchlist", "Add to Watchlist"],
    ["trade_plan", "Create Trade Plan"],
    ["journal", "Save Journal Draft"],
    ["exit_plan", "Create Exit Plan"]
  ];
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {buttons.map(([mode, label]) => <button className="min-h-12 rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-4 font-black text-cyan-100" key={mode} onClick={() => onConfirm(mode)} type="button">{label}</button>)}
    </div>
  );
}
