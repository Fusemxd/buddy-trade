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
  const [savedMessage, setSavedMessage] = useState("");
  const [data, setData] = useState<ExtractedScreenshotData>(parseScreenshotText(""));

  async function handleFile(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("Accept image files only.");
    if (file.size > 2.5 * 1024 * 1024) return setError("File is too large. Please use an image under 2.5 MB.");
    setImageDataUrl(await readFile(file));
    setSavedMessage("");
    setError("");
  }

  function confirm(mode: ScreenshotImportMode) {
    if (!imageDataUrl) {
      setError("กรุณาเลือกรูปก่อนบันทึก");
      return;
    }
    const items = loadScreenshotImports();
    saveScreenshotImports([{ id: crypto.randomUUID(), createdAt: new Date().toISOString(), imageDataUrl, mode, extracted: data, confirmed: true }, ...items]);
    setSavedMessage("บันทึกภาพเทรดแล้ว ตรวจสอบข้อมูลในแท็บประวัติได้");
  }

  function parseRaw() {
    setData(parseScreenshotText(rawText));
  }

  return (
    <section className="rounded-3xl border border-slate-700 bg-slate-950/65 p-4">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">Screenshot Import</p>
      <h2 className="mt-1 text-xl font-black text-white">นำเข้าภาพเทรด</h2>
      <p className="mt-2 text-sm text-slate-400">
        อัปโหลดภาพเพื่อเก็บเป็นหลักฐานและสร้าง draft ในเครื่อง เวอร์ชันนี้ยังไม่อ่านตัวเลขจากภาพโดยตรงอัตโนมัติ ถ้ามีข้อความจาก OCR ให้ paste แล้วกด Parse ก่อนบันทึก
      </p>
      <p className="mt-3 rounded-2xl border border-yellow-300/25 bg-yellow-300/10 p-3 text-sm font-bold text-yellow-100">
        รูปจะไม่ถูกส่งออกนอกเครื่อง และข้อมูลที่อ่านจากภาพต้องตรวจสอบเองก่อนยืนยันทุกครั้ง
      </p>

      <input className="mt-4 min-h-14 w-full rounded-2xl border border-slate-700 bg-slate-900 p-3 text-white" type="file" accept="image/*" capture="environment" onChange={(e) => void handleFile(e.target.files?.[0])} />
      {error ? <p className="mt-3 rounded-2xl border border-red-300/35 bg-red-300/10 p-3 text-red-100">{error}</p> : null}
      {imageDataUrl ? <div className="mt-4"><ScreenshotPreview dataUrl={imageDataUrl} onRemove={() => setImageDataUrl("")} /></div> : null}

      <textarea className="mt-4 min-h-24 w-full rounded-2xl border border-slate-700 bg-slate-900 p-3 text-white" placeholder="วางข้อความจากภาพ/OCR เช่น BTCUSDT Entry 100 SL 95 TP 110" value={rawText} onChange={(e) => setRawText(e.target.value)} />
      <button className="mt-2 min-h-12 rounded-2xl border border-slate-700 px-4 font-black text-slate-300" onClick={parseRaw} type="button">Parse pasted text</button>
      <div className="mt-4"><ScreenshotExtractedFields data={data} onChange={setData} /></div>

      {savedMessage ? <p className="mt-3 rounded-2xl border border-emerald-300/30 bg-emerald-300/10 p-3 text-sm font-bold text-emerald-100">{savedMessage}</p> : null}
      <div className="mt-4">
        <ScreenshotImportActions onConfirm={confirm} />
      </div>
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
