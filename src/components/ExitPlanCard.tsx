import type { ExitPlanAlert, ExitPlanInput } from "@/types/exitPlan";

const levelClass = {
  info: "border-cyan-300/35 bg-cyan-300/10 text-cyan-100",
  caution: "border-yellow-300/35 bg-yellow-300/10 text-yellow-100",
  warning: "border-orange-300/35 bg-orange-300/10 text-orange-100",
  blocked: "border-red-300/40 bg-red-300/10 text-red-100"
};

export default function ExitPlanCard({ input, alerts }: { input: ExitPlanInput; alerts: ExitPlanAlert[] }) {
  return (
    <section className="rounded-2xl border border-slate-700 bg-slate-950/75 p-4">
      <h3 className="text-lg font-black text-white">Exit Plan Alert</h3>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <Mini label="Symbol" value={input.symbol ?? "-"} />
        <Mini label="Direction" value={input.direction ?? "-"} />
        <Mini label="Entry" value={fmt(input.entryPrice)} />
        <Mini label="Current" value={fmt(input.currentPrice)} />
        <Mini label="Stop Loss" value={fmt(input.stopLoss)} />
        <Mini label="TP1" value={fmt(input.takeProfit1)} />
        <Mini label="TP2" value={fmt(input.takeProfit2)} />
      </div>
      <div className="mt-3 space-y-2">
        {alerts.map((alert) => (
          <div className={`rounded-xl border p-3 text-sm ${levelClass[alert.level]}`} key={alert.id}>
            <p className="font-black text-white">{alert.title}</p>
            <p className="mt-1 leading-6">{alert.message}</p>
            {alert.checklist?.length ? (
              <ul className="mt-2 space-y-1 text-xs text-slate-300">
                {alert.checklist.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-3">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 font-black text-white">{value}</p>
    </div>
  );
}

function fmt(value?: number) {
  return value === undefined ? "-" : String(value);
}
