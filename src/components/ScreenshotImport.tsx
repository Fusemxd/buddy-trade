"use client";

import { useState } from "react";
import { parseScreenshotText } from "@/lib/screenshotParser";
import { loadScreenshotImports, saveScreenshotImports } from "@/lib/screenshotStorage";
import type { ExtractedScreenshotData, ScreenshotImportMode } from "@/types/screenshotImport";
import ScreenshotExtractedFields from "./ScreenshotExtractedFields";
import ScreenshotImportActions from "./ScreenshotImportActions";
import ScreenshotPreview from "./ScreenshotPreview";

export default function ScreenshotImport() {
  const [imageDataUrl, setImageDataUrl] = useState("");
  const [error, setError] = useState("");
  const [rawText, setRawText] = useState("");
  const [data, setData] = useState<ExtractedScreenshotData>(parseScreenshotText(""));

  async function handleFile(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("Accept image files only.");
    if (file.size > 2.5 * 1024 * 1024) return setError("File is too large. Please use an image under 2.5 MB.");
    const url = await readFile(file);
    setImageDataUrl(url);
    setError("");
  }

  function confirm(mode: ScreenshotImportMode) {
    if (!imageDataUrl) return;
    const items = loadScreenshotImports();
    saveScreenshotImports([{ id: crypto.randomUUID(), createdAt: new Date().toISOString(), imageDataUrl, mode, extracted: data, confirmed: true }, ...items]);
  }

  function parseRaw() {
    setData(parseScreenshotText(rawText));
  }

  return (
    <section className="rounded-3xl border border-slate-700 bg-slate-950/65 p-4">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">Screenshot Import</p>
      <h2 className="mt-1 text-xl font-black text-white">นำเข้าจากภาพหน้าจอ</h2>
      <p className="mt-2 text-sm text-slate-400">อัปโหลดภาพเพื่อช่วยกรอกข้อมูลเร็วขึ้น ต้องตรวจสอบก่อนบันทึกทุกครั้ง ไม่อัปโหลดรูปออกนอกเครื่องในเวอร์ชันนี้</p>
      <input className="mt-4 min-h-14 w-full rounded-2xl border border-slate-700 bg-slate-900 p-3 text-white" type="file" accept="image/*" onChange={(e) => void handleFile(e.target.files?.[0])} />
      {error ? <p className="mt-3 rounded-2xl border border-red-300/35 bg-red-300/10 p-3 text-red-100">{error}</p> : null}
      {imageDataUrl ? <div className="mt-4"><ScreenshotPreview dataUrl={imageDataUrl} onRemove={() => setImageDataUrl("")} /></div> : null}
      <textarea className="mt-4 min-h-24 w-full rounded-2xl border border-slate-700 bg-slate-900 p-3 text-white" placeholder="Optional OCR/raw text paste. TODO: Add OCR extraction using tesseract.js or AI Vision later." value={rawText} onChange={(e) => setRawText(e.target.value)} />
      <button className="mt-2 min-h-12 rounded-2xl border border-slate-700 px-4 font-black text-slate-300" onClick={parseRaw} type="button">Parse pasted text</button>
      <div className="mt-4"><ScreenshotExtractedFields data={data} onChange={setData} /></div>
      <p className="mt-4 rounded-2xl border border-yellow-300/30 bg-yellow-300/10 p-3 text-sm font-bold text-yellow-100">OCR อาจอ่านผิด กรุณาตรวจสอบตัวเลขก่อนบันทึก</p>
      <div className="mt-4"><ScreenshotImportActions onConfirm={confirm} /></div>
    </section>
  );
}

function readFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
