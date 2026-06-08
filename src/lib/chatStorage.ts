import type { ChatMessage } from "@/types/chat";

const CHAT_KEY = "trade-buddy-war-room-chat";

export function loadChatHistory() {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(CHAT_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as ChatMessage[];
  } catch {
    return [];
  }
}

export function saveChatHistory(messages: ChatMessage[]) {
  window.localStorage.setItem(CHAT_KEY, JSON.stringify(messages));
}
