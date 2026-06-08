import { quickPrompts } from "@/lib/chatRules";

export default function ChatQuickPrompts({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {quickPrompts.map((prompt) => (
        <button className="shrink-0 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs font-bold text-slate-300 transition hover:border-cyan-300/50 hover:text-cyan-100" key={prompt} onClick={() => onPick(prompt)}>
          {prompt}
        </button>
      ))}
    </div>
  );
}
