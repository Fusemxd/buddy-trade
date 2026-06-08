export default function ToolsPanel() {
  return (
    <section className="grid gap-4">
      <div className="rounded-3xl border border-slate-700/70 bg-slate-950/65 p-5">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">Tools / Settings</p>
        <h2 className="mt-1 text-2xl font-black text-white">เครื่องมือ</h2>
        <p className="mt-2 text-sm text-slate-400">พื้นที่สำหรับจัดการข้อมูลและการตั้งค่าในอนาคต ยังไม่มีการเชื่อมต่อ API หรือบัญชี Exchange</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <ToolCard title="Data Management" helper="TODO: เพิ่ม export/import local data ในอนาคต" />
        <ToolCard title="AI API Settings" helper="TODO: เพิ่มเฉพาะ server route ภายหลัง ตอนนี้ปิดไว้และไม่ต้องใช้ env" />
        <ToolCard title="User Guide" helper="อ่าน README สำหรับวิธีใช้งานและข้อจำกัดด้านความเสี่ยง" />
        <ToolCard title="Privacy" helper="Journal, chat, screenshots และ expenses เก็บใน localStorage ของเครื่องนี้" />
      </div>
    </section>
  );
}

function ToolCard({ title, helper }: { title: string; helper: string }) {
  return (
    <article className="rounded-3xl border border-slate-700 bg-slate-900/70 p-4">
      <h3 className="text-lg font-black text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-400">{helper}</p>
    </article>
  );
}
