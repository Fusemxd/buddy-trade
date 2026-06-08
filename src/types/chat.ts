import type { AgentDiscussionResult } from "./agentDiscussion";

export type ChatRole = "user" | "assistant";

export type ChatAttachment = {
  id: string;
  type: "image";
  name: string;
  dataUrl: string;
};

export type ChatActionCard =
  | { type: "risk_calculator" }
  | { type: "checklist" }
  | { type: "journal_save" }
  | { type: "agent_discussion" }
  | { type: "exit_plan" }
  | { type: "warning"; message: string };

export type ChatMessage = {
  id: string;
  role: ChatRole;
  createdAt: string;
  text: string;
  attachments?: ChatAttachment[];
  actionCards?: ChatActionCard[];
  discussion?: AgentDiscussionResult;
};

export type ChatContext = {
  riskWarnings?: string[];
  checklistWarnings?: string[];
  marketNotes?: string[];
};
