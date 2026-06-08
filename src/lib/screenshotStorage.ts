import type { ScreenshotImportDraft } from "@/types/screenshotImport";

const KEY = "trade-buddy-screenshot-imports";

export function loadScreenshotImports() {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as ScreenshotImportDraft[];
  } catch {
    return [];
  }
}

export function saveScreenshotImports(items: ScreenshotImportDraft[]) {
  window.localStorage.setItem(KEY, JSON.stringify(items));
}
