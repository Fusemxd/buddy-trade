"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createChatExchange } from "@/lib/chatEngine";
import { loadChatHistory, saveChatHistory } from "@/lib/chatStorage";
import type { ChatAttachment, ChatContext, ChatMessage } from "@/types/chat";
import ChatChecklistCard from "./ChatChecklistCard";
import ChatInputBar from "./ChatInputBar";
import ChatJournalCard from "./ChatJournalCard";
import ChatMessageBubble from "./ChatMessageBubble";
import ChatQuickPrompts from "./ChatQuickPrompts";
import ChatRiskCard from "./ChatRiskCard";

const SUBTITLE_TEXT = "\u0E0A\u0E48\u0E27\u0E22\u0E40\u0E0A\u0E47\u0E01\u0E41\u0E1C\u0E19\u0E40\u0E17\u0E23\u0E14\u0E41\u0E25\u0E30\u0E04\u0E27\u0E32\u0E21\u0E40\u0E2A\u0E35\u0E48\u0E22\u0E07 \u0E44\u0E21\u0E48\u0E43\u0E0A\u0E48\u0E04\u0E33\u0E2A\u0E31\u0E48\u0E07\u0E0B\u0E37\u0E49\u0E2D\u0E02\u0E32\u0E22";
const STARTER_TEXT = "\u0E2A\u0E48\u0E07\u0E41\u0E1C\u0E19\u0E40\u0E17\u0E23\u0E14\u0E2B\u0E23\u0E37\u0E2D\u0E23\u0E39\u0E1B\u0E01\u0E23\u0E32\u0E1F\u0E21\u0E32\u0E44\u0E14\u0E49\u0E40\u0E25\u0E22 Buddy \u0E08\u0E30\u0E0A\u0E48\u0E27\u0E22\u0E40\u0E0A\u0E47\u0E01 Stop Loss, R 1:2, \u0E17\u0E38\u0E19 500, \u0E41\u0E25\u0E30 daily stop \u0E41\u0E1A\u0E1A rule-based";

export default function TradeBuddyChat({ context = {} }: { context?: ChatContext }) {
  const starter = useMemo<ChatMessage>(
    () => ({
      id: "starter",
      role: "assistant",
      text: STARTER_TEXT,
      createdAt: new Date().toISOString(),
      actionCards: [{ type: "risk_calculator" }, { type: "checklist" }, { type: "journal_save" }]
    }),
    []
  );
  const [messages, setMessages] = useState<ChatMessage[]>([starter]);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const saved = loadChatHistory();
    if (saved.length) setMessages(saved);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  function send(text: string, attachments: ChatAttachment[] = []) {
    const next = [...messages, ...createChatExchange(text, context, attachments)];
    setMessages(next);
    saveChatHistory(next);
  }

  function clearChat() {
    const reset = [starter];
    setMessages(reset);
    saveChatHistory(reset);
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-cyan-300/20 bg-slate-950/80 shadow-[0_0_70px_rgba(34,211,238,0.12)]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="relative flex min-h-[720px] flex-col">
        <header className="border-b border-slate-700/80 bg-slate-950/90 p-4 backdrop-blur sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-200">Command Chat</p>
              <h2 className="mt-1 text-2xl font-black text-white">Trade Buddy Chat</h2>
              <p className="mt-1 text-sm font-semibold text-slate-300">{SUBTITLE_TEXT}</p>
            </div>
            <button className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-bold text-slate-300" onClick={clearChat}>Clear chat</button>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <InfoChip label="Capital" value="500 THB" />
            <InfoChip label="Risk per trade" value="5-10 THB" />
            <InfoChip label="Daily stop" value="-20 THB" />
          </div>
        </header>

        <div className="border-b border-slate-700/80 p-4">
          <ChatQuickPrompts onPick={(prompt) => send(prompt)} />
        </div>

        <div className="grid gap-3 border-b border-slate-700/80 p-4 md:grid-cols-3">
          <ChatRiskCard />
          <ChatChecklistCard />
          <ChatJournalCard />
        </div>

        <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
          {messages.map((message) => (
            <ChatMessageBubble key={message.id} message={message} />
          ))}
          <div ref={scrollRef} />
        </div>

        <div className="p-4 pt-0">
          <ChatInputBar onSend={send} />
        </div>
      </div>
    </section>
  );
}

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/75 p-3">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-black text-white">{value}</p>
    </div>
  );
}
