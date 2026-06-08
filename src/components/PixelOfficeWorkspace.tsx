"use client";

import { useCallback, useMemo, useState } from "react";
import type { RiskResult } from "@/lib/risk";
import type { MarketSignal } from "@/types/market";
import AgentDesk from "./AgentDesk";
import MarketDashboard from "./MarketDashboard";
import MobileBottomNav from "./MobileBottomNav";
import RiskCalculator from "./RiskCalculator";
import SetupChecklist from "./SetupChecklist";
import TradeBuddyChat from "./TradeBuddyChat";
import TradeJournal from "./TradeJournal";

const emptyRisk: RiskResult = {
  riskAmountThb: 5,
  positionSize: 1,
  rewardMultiple: 2,
  rewardRatioText: "1:2",
  riskDistance: 0,
  rewardDistance: 0,
  isRewardValid: true,
  isRiskAmountValid: true,
  hasStopLoss: true,
  dailyStopClear: true,
  primaryMessage: "Initial risk/reward condition passed.",
  warnings: [],
  status: "disciplined"
};

export default function PixelOfficeWorkspace() {
  const [risk, setRisk] = useState<RiskResult>(emptyRisk);
  const [market, setMarket] = useState<MarketSignal | null>(null);
  const handleRiskChange = useCallback((nextRisk: RiskResult) => setRisk(nextRisk), []);
  const handleMarketChange = useCallback((nextMarket: MarketSignal | null) => setMarket(nextMarket), []);
  const chatContext = useMemo(
    () => ({
      riskWarnings: risk.warnings,
      checklistWarnings: risk.warnings,
      marketNotes: market?.notes ?? []
    }),
    [market?.notes, risk.warnings]
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#123047_0,#070b12_34%,#05070b_100%)] pb-20 text-slate-100 md:pb-8">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <header className="rounded-lg border border-office-line bg-office-panel/90 p-5 shadow-neon">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-office-glow">Rule-based trading discipline office</p>
          <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">Trade Buddy Office</h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-300">
            ระบบนี้ช่วยจัดแผนและเช็กความเสี่ยงเท่านั้น ไม่ใช่คำสั่งซื้อขายหรือการรับประกันกำไร
          </p>
        </header>

        <AgentDesk />

        <div id="market">
          <MarketDashboard onMarketChange={handleMarketChange} />
        </div>

        <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <div id="risk">
            <RiskCalculator onRiskChange={handleRiskChange} />
          </div>
          <SetupChecklist risk={risk} />
        </section>

        <div id="chat">
          <TradeBuddyChat context={chatContext} />
        </div>

        <div id="journal">
          <TradeJournal />
        </div>
      </main>
      <MobileBottomNav />
    </div>
  );
}
