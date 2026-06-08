export default function ReceiptPreview({ dataUrl, onRemove }: { dataUrl: string; onRemove: () => void }) {
  return (
    <div className="rounded-3xl border border-slate-700 bg-slate-900/70 p-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="max-h-80 w-full rounded-2xl object-contain" src={dataUrl} alt="Receipt preview" />
      <button className="mt-3 min-h-12 rounded-2xl border border-red-300/30 bg-red-300/10 px-4 font-black text-red-100" onClick={onRemove} type="button">
        Remove receipt
      </button>
    </div>
  );
}
