"use client";

import { ChangeEvent, ClipboardEvent, FormEvent, useRef, useState } from "react";
import type { ChatAttachment } from "@/types/chat";

const MAX_FILE_SIZE = 2.5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

export default function ChatInputBar({ onSend }: { onSend: (text: string, attachments: ChatAttachment[]) => void }) {
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function addFile(file: File) {
    setError("");
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError("รองรับเฉพาะไฟล์ png, jpg, jpeg, webp เท่านั้น");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("ไฟล์ใหญ่เกินไป กรุณาใช้รูปไม่เกิน 2.5 MB");
      return;
    }

    const dataUrl = await readFileAsDataUrl(file);
    setAttachments((current) => [...current, { id: crypto.randomUUID(), type: "image", name: file.name, dataUrl }]);
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    for (const file of files) {
      await addFile(file);
    }
    event.target.value = "";
  }

  async function handlePaste(event: ClipboardEvent<HTMLTextAreaElement>) {
    const files = Array.from(event.clipboardData.files ?? []).filter((file) => file.type.startsWith("image/"));
    if (!files.length) return;
    event.preventDefault();
    for (const file of files) {
      await addFile(file);
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed && attachments.length === 0) return;
    onSend(trimmed || "แนบรูปกราฟ", attachments);
    setText("");
    setAttachments([]);
    setError("");
  }

  return (
    <form className="sticky bottom-0 space-y-3 border-t border-slate-700 bg-slate-950/95 pt-3 backdrop-blur" onSubmit={submit}>
      {attachments.length ? (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {attachments.map((attachment) => (
            <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-xl border border-cyan-300/30 bg-slate-900" key={attachment.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="h-full w-full object-cover" src={attachment.dataUrl} alt={attachment.name} />
              <button className="absolute right-1 top-1 rounded-full bg-slate-950/85 px-2 py-1 text-xs font-black text-white" type="button" onClick={() => setAttachments((current) => current.filter((item) => item.id !== attachment.id))}>
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {error ? <p className="rounded-lg border border-red-400/40 bg-red-400/10 p-3 text-sm font-bold text-red-100">{error}</p> : null}

      <div className="flex items-end gap-2 rounded-2xl border border-slate-700 bg-slate-900/90 p-2">
        <input ref={fileInputRef} className="hidden" type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={handleFileChange} />
        <button className="min-h-12 rounded-xl border border-slate-700 px-3 text-sm font-black text-slate-300" type="button" onClick={() => fileInputRef.current?.click()}>
          Attach
        </button>
        <textarea className="max-h-36 min-h-12 flex-1 resize-none bg-transparent px-2 py-3 text-sm font-semibold text-white outline-none placeholder:text-slate-600" value={text} onChange={(event) => setText(event.target.value)} onPaste={handlePaste} placeholder="พิมพ์แผนเทรด หรือ paste รูปกราฟ..." rows={1} />
        <button className="min-h-12 rounded-xl bg-cyan-300 px-4 text-sm font-black text-slate-950">Send</button>
      </div>
    </form>
  );
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read image file."));
    reader.readAsDataURL(file);
  });
}
