export type AgentStatus = "ready" | "warning" | "blocked";

export type AgentToolType = "market" | "risk" | "checklist" | "journal" | "chat";

export type TradeBuddyAgent = {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  statusText: string;
  description: string;
  toolType: AgentToolType;
  accent: "green" | "yellow" | "blue" | "purple" | "cyan";
};

export type AgentTool = AgentToolType;

export type AgentDeskItem = {
  id: AgentTool;
  title: string;
  subtitle: string;
  status: string;
};
