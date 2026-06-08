"use client";

import { useCallback, useState } from "react";
import type { RiskResult } from "@/lib/risk";
import BuddyHeroCard from "./BuddyHeroCard";
import DashboardOverview from "./DashboardOverview";
import DirectionBiasCard from "./DirectionBiasCard";
import ImageRecordsPage from "./image-records/ImageRecordsPage";
import MobileBottomNav, { type MobileWarRoomPanel } from "./MobileBottomNav";
import RiskCalculator from "./RiskCalculator";
import SetupChecklist from "./SetupChecklist";
import SidebarNav from "./SidebarNav";
import ToolsPanel from "./ToolsPanel";
import TopBar from "./TopBar";
import TradeBuddyChat from "./TradeBuddyChat";
import TradeJournal from "./TradeJournal";
import TradePlanBuilder from "./TradePlanBuilder";
import WatchlistScanner from "./WatchlistScanner";

const DISCLAIMER_TEXT = "ระบบนี้ช่วยจัดแผนและเช็กความเสี่ยงเท่านั้น ไม่ใช่คำสั่งซื้อขายหรือการรับประกันกำไร";

export default function TradeBuddyWarRoom() {
  const [risk, setRisk] = useState<RiskResult | undefined>();
  const [page, setPage] = useState<MobileWarRoomPanel>("dashboard");
  const [planSymbol, setPlanSymbol] = useState("BTCUSDT");
  const handleRiskChange = useCallback((nextRisk: RiskResult) => setRisk(nextRisk), []);

  function openPlan(symbol?: string) {
    if (symbol) setPlanSymbol(symbol);
    setPage("plan");
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 pb-28 text-slate-100 lg:pb-0">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.22),transparent_32%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.14),transparent_28%),linear-gradient(180deg,#020617,#0f172a_58%,#020617)]" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] bg-[size:36px_36px]" />

      <div className="relative flex min-h-screen">
        <SidebarNav activePanel={page} onSelect={setPage} />
        <div className="min-w-0 flex-1">
          <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-4 px-3 pb-6 pt-4 sm:px-5 lg:pb-4 xl:px-6">
            <TopBar />
            <header className="rounded-3xl border border-slate-700/70 bg-slate-950/60 p-4 shadow-[0_0_60px_rgba(34,211,238,0.1)] backdrop-blur">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-200">Semi-Auto Trading Helper</p>
                  <h1 className="mt-2 break-words text-3xl font-black text-white sm:text-5xl">Trade Buddy War Room</h1>
                  <p className="mt-2 text-sm font-semibold text-slate-300">{pageTitle(page)}</p>
                </div>
                <div className="max-w-xl rounded-2xl border border-yellow-300/25 bg-yellow-300/10 p-3 text-sm font-semibold leading-relaxed text-yellow-100">{DISCLAIMER_TEXT}</div>
              </div>
            </header>

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
  if (page === "dashboard") {
    return (
      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)]">
        <DashboardOverview onNavigate={(next) => props.onNavigate(next)} />
        <div className="grid min-w-0 content-start gap-4">
          <BuddyHeroCard />
          <TradeBuddyChat context={{ riskWarnings: props.risk?.warnings ?? [] }} />
        </div>
      </div>
    );
  }
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
  return <button className="min-h-16 rounded-3xl border border-cyan-300/30 bg-cyan-300/10 px-4 text-lg font-black text-cyan-100" onClick={onClick} type="button">{label}</button>;
}

function toBottomPage(page: MobileWarRoomPanel) {
  return page === "imageRecords" || page === "expenses" || page === "tools" || page === "guide" ? "more" : page;
}

function pageTitle(page: MobileWarRoomPanel) {
  if (page === "dashboard") return "ภาพรวมสั้น ๆ เพื่อเริ่มจาก action ที่ถูกต้อง";
  if (page === "scanner") return "สแกนตลาดและดู setup readiness";
  if (page === "plan") return "สร้างแผน คำนวณ risk และเช็ก checklist";
  if (page === "journal") return "บันทึกเพื่อจับนิสัยการเทรดของตัวเอง";
  if (page === "imageRecords") return "รายการจากรูป ใบเสร็จ ภาพเทรด และสรุปจากข้อมูล local";
  if (page === "expenses") return "ใบเสร็จและค่าใช้จ่ายในหน้าเดียวกับรายการจากรูป";
  if (page === "guide") return "คู่มือและข้อจำกัดการใช้งาน";
  return "เครื่องมือและการตั้งค่า";
}
