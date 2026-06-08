export default function ChatRiskCard({ compact = false }: { compact?: boolean }) {
  return (
    <div className="rounded-xl border border-yellow-300/30 bg-yellow-300/10 p-3 text-sm">
      <p className="font-black text-yellow-100">{compact ? "Risk Calculator" : "Risk Desk Snapshot"}</p>
      <p className="mt-1 text-slate-300">Capital 500 THB, risk per trade 5-10 THB, daily stop -20 THB.</p>
    </div>
  );
}
