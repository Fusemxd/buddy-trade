import type { AgentDeskItem, TradeBuddyAgent } from "@/types/agent";

export const tradeBuddyAgents: TradeBuddyAgent[] = [
  {
    id: "market-agent",
    name: "Market Agent",
    role: "Market Scanner",
    status: "ready",
    statusText: "กำลังสแกนตลาด",
    description: "Prepares public market context for later rule-based scans.",
    toolType: "market",
    accent: "green"
  },
  {
    id: "risk-agent",
    name: "Risk Agent",
    role: "Position-size Guard",
    status: "ready",
    statusText: "วันนี้ยังเสี่ยงได้",
    description: "Will guard capital, daily stop, and position-size checks.",
    toolType: "risk",
    accent: "yellow"
  },
  {
    id: "checklist-agent",
    name: "Checklist Agent",
    role: "Discipline Checklist",
    status: "warning",
    statusText: "รอเช็กแผนก่อนเข้า",
    description: "Keeps the user focused on Stop Loss, plan quality, and discipline.",
    toolType: "checklist",
    accent: "blue"
  },
  {
    id: "journal-agent",
    name: "Journal Agent",
    role: "Trade Record Keeper",
    status: "warning",
    statusText: "ยังไม่ได้บันทึกไม้วันนี้",
    description: "Will store reflection and trade notes locally for review.",
    toolType: "journal",
    accent: "purple"
  },
  {
    id: "ask-buddy",
    name: "Ask Buddy",
    role: "Rule-based Chat Assistant",
    status: "ready",
    statusText: "ส่งรูปกราฟมาได้เลย",
    description: "The main chat-first assistant for educational risk review.",
    toolType: "chat",
    accent: "cyan"
  }
];

export const agentDeskItems: AgentDeskItem[] = [
  { id: "market", title: "Market Monitor", subtitle: "Public Binance klines", status: "Rule-based" },
  { id: "risk", title: "Risk Desk", subtitle: "Deposit-based capital", status: "1-2% risk" },
  { id: "checklist", title: "Setup Review", subtitle: "No emotional entries", status: "Stop loss first" },
  { id: "journal", title: "Journal Cabinet", subtitle: "Saved locally", status: "localStorage" },
  { id: "chat", title: "Buddy Chat", subtitle: "Education support", status: "No trade calls" }
];
