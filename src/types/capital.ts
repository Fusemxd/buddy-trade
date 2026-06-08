export type CapitalTransactionType = "deposit" | "withdraw";

export type CapitalTransaction = {
  id: string;
  createdAt: string;
  type: CapitalTransactionType;
  amountUsd: number;
  note?: string;
};

export type CapitalSummary = {
  balanceUsd: number;
  depositsUsd: number;
  withdrawalsUsd: number;
};
