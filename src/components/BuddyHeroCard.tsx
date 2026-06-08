export default function BuddyHeroCard() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-cyan-300/20 bg-slate-950/75 p-5 shadow-[0_0_70px_rgba(34,211,238,0.14)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.22),transparent_34%),linear-gradient(rgba(56,189,248,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.04)_1px,transparent_1px)] bg-[size:auto,28px_28px,28px_28px]" />
      <div className="relative flex flex-col gap-5 md:flex-row md:items-center">
        <div className="mx-auto grid h-28 w-28 shrink-0 place-items-center rounded-full border border-cyan-200/30 bg-cyan-300/10 shadow-[0_0_45px_rgba(34,211,238,0.28)] md:mx-0">
          <div className="grid h-20 w-20 place-items-center rounded-3xl border border-white/20 bg-slate-950 text-5xl">🤖</div>
        </div>
        <div className="text-center md:text-left">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-200">Trade Buddy War Room</p>
          <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">สวัสดีครับ ผม Buddy พร้อมช่วยเช็กความเสี่ยง</h2>
          <p className="mt-3 text-sm font-semibold leading-6 text-slate-300">
            ส่งแผนเทรด รูปกราฟ หรือ Entry / SL / TP มาได้เลย ระบบนี้ช่วยจัดแผนและเช็กความเสี่ยงเท่านั้น ไม่ใช่คำสั่งซื้อขายหรือการรับประกันกำไร
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {["เช็กแผนก่อนไม้", "คำนวณความเสี่ยง", "ถาม Buddy"].map((label) => (
              <button className="min-h-12 rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-3 text-sm font-black text-cyan-100 transition hover:bg-cyan-300 hover:text-slate-950" key={label} type="button">
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
