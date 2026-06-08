export default function ChatRiskCard({ compact = false }: { compact?: boolean }) {
  return (
    <div className="rounded-xl border border-yellow-300/30 bg-yellow-300/10 p-3 text-sm">
      <p className="font-black text-yellow-100">{compact ? "Risk Calculator" : "Risk Desk Snapshot"}</p>
      <p className="mt-1 text-slate-300">Capital comes from deposits/withdrawals. Risk per trade 1-2%. Daily stop around -$0.61 (20.00 บาท).</p>
    </div>
  );
}
