"use client";

import { useCallback, useState } from "react";
import type { RiskResult } from "@/lib/risk";
import DashboardOverview from "./DashboardOverview";
import DirectionBiasCard from "./DirectionBiasCard";
import ImageRecordsPage from "./image-records/ImageRecordsPage";
import MobileBottomNav, { type MobileWarRoomPanel } from "./MobileBottomNav";
import RiskCalculator from "./RiskCalculator";
import SetupChecklist from "./SetupChecklist";
import SidebarNav from "./SidebarNav";
import ToolsPanel from "./ToolsPanel";
import TopBar from "./TopBar";
import TradeJournal from "./TradeJournal";
import TradePlanBuilder from "./TradePlanBuilder";
import WatchlistScanner from "./WatchlistScanner";

export default function TradeBuddyWarRoom() {
  const [risk, setRisk] = useState<RiskResult | undefined>();
  const [page, setPage] = useState<MobileWarRoomPanel>("scanner");
  const [planSymbol, setPlanSymbol] = useState("BTCUSDT");
  const handleRiskChange = useCallback((nextRisk: RiskResult) => setRisk(nextRisk), []);

  function openPlan(symbol?: string) {
    if (symbol) setPlanSymbol(symbol);
    setPage("plan");
  }

  return (
    <main className="bright-theme min-h-screen overflow-x-hidden pb-28 text-slate-950 lg:pb-0">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_12%_4%,rgba(45,212,191,0.28),transparent_30%),radial-gradient(circle_at_86%_0%,rgba(96,165,250,0.24),transparent_32%),radial-gradient(circle_at_55%_100%,rgba(253,224,71,0.22),transparent_34%),linear-gradient(135deg,#f8fafc,#eef9ff_44%,#f7fff7)]" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.035)_1px,transparent_1px)] bg-[size:44px_44px] opacity-60" />

      <div className="relative flex min-h-screen">
        <SidebarNav activePanel={page} onSelect={setPage} />
        <div className="min-w-0 flex-1">
          <div className="mx-auto flex w-full max-w-[1540px] flex-col gap-3 px-3 pb-6 pt-3 sm:px-4 lg:pb-4 xl:px-6">
            <TopBar />
            {renderPage(page, {
              risk,
              onRiskChange: handleRiskChange,
              onNavigate: setPage,
              onBuildPlan: openPlan,
              planSymbol
            })}
          </div>
        </div>
      </div>
      <MobileBottomNav activePanel={toBottomPage(page)} onChange={setPage} />
    </main>
  );
}

function renderPage(page: MobileWarRoomPanel, props: { risk?: RiskResult; onRiskChange: (risk: RiskResult) => void; onNavigate: (page: MobileWarRoomPanel) => void; onBuildPlan: (symbol?: string) => void; planSymbol: string }) {
  if (page === "dashboard") return <DashboardOverview onNavigate={(next) => props.onNavigate(next)} />;
  if (page === "scanner") return <WatchlistScanner onBuildPlan={props.onBuildPlan} />;
  if (page === "plan") {
    return (
      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.85fr)]">
        <TradePlanBuilder initialSymbol={props.planSymbol} />
        <div className="grid min-w-0 content-start gap-4">
          <DirectionBiasCard initialInput={{ symbol: props.planSymbol }} />
          <RiskCalculator onRiskChange={props.onRiskChange} />
          <SetupChecklist risk={props.risk} />
        </div>
      </div>
    );
  }
  if (page === "journal") return <TradeJournal />;
  if (page === "imageRecords") return <ImageRecordsPage />;
  if (page === "expenses") return <ImageRecordsPage initialTab="receipt" />;
  if (page === "tools" || page === "guide") return <ToolsPanel />;
  if (page === "more") {
    return (
      <div className="grid gap-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MoreButton label="รายการจากรูป" onClick={() => props.onNavigate("imageRecords")} />
          <MoreButton label="ค่าใช้จ่าย" onClick={() => props.onNavigate("expenses")} />
          <MoreButton label="เครื่องมือ" onClick={() => props.onNavigate("tools")} />
          <MoreButton label="คู่มือ" onClick={() => props.onNavigate("guide")} />
        </div>
        <ToolsPanel />
      </div>
    );
  }
  return null;
}

function MoreButton({ label, onClick }: { label: string; onClick: () => void }) {
  return <button className="trade-button-secondary min-h-16 rounded-2xl px-4 text-lg font-black" onClick={onClick} type="button">{label}</button>;
}

function toBottomPage(page: MobileWarRoomPanel) {
  return page === "imageRecords" || page === "expenses" || page === "tools" || page === "guide" ? "more" : page;
}
