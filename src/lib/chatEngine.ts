import type { ChatAttachment, ChatContext, ChatMessage } from "@/types/chat";
import { generateAgentDiscussion } from "./agentDiscussion";
import { generateBuddyReply } from "./chatRules";

export type BuddyMessageInput = {
  text: string;
  context: ChatContext;
  attachments?: ChatAttachment[];
};

export function sendMessageToBuddy(input: BuddyMessageInput): ChatMessage {
  // TODO: Replace rule-based reply with API route later
  // TODO: Send text and image to AI Vision later
  // TODO: Inject current market data into chat context
  // TODO: Inject risk calculator data into chat context
  // TODO: Inject journal summary into chat context
  // TODO: Add AI API environment variables later
  // TODO: Never expose API keys on the client
  const reply = generateBuddyReply(input.text, input.context, Boolean(input.attachments?.length));
  const discussion = shouldGenerateDiscussion(input.text) ? generateAgentDiscussion({ userMessage: input.text, hasImage: Boolean(input.attachments?.length), hasStopLoss: /sl|stop loss/i.test(input.text), hasTakeProfit: /tp|take profit/i.test(input.text) }) : undefined;

  return {
    id: crypto.randomUUID(),
    role: "assistant",
    text: discussion ? discussion.finalSummary : reply.text,
    actionCards: discussion?.actionCards ?? reply.actionCards,
    discussion,
    createdAt: new Date().toISOString()
  };
}

export function createChatExchange(text: string, context: ChatContext, attachments: ChatAttachment[] = []): ChatMessage[] {
  const now = new Date().toISOString();

  return [
    { id: crypto.randomUUID(), role: "user", text, attachments, createdAt: now },
    sendMessageToBuddy({ text, context, attachments })
  ];
}

function shouldGenerateDiscussion(text: string) {
  const lowered = text.toLowerCase();
  return ["agent", "team", "tp", "sl", "exit", "take profit", "เข้าไหม", "ควรเข้า", "น่าสนใจ", "วิเคราะห์", "ปิดยัง", "ออกตอนไหน"].some((item) => lowered.includes(item));
}
