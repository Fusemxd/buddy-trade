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
    <main className="bright-theme min-h-screen overflow-x-hidden pb-28 text-slate-950 lg:pb-0">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_12%_4%,rgba(45,212,191,0.28),transparent_30%),radial-gradient(circle_at_86%_0%,rgba(96,165,250,0.24),transparent_32%),radial-gradient(circle_at_55%_100%,rgba(253,224,71,0.22),transparent_34%),linear-gradient(135deg,#f8fafc,#eef9ff_44%,#f7fff7)]" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.035)_1px,transparent_1px)] bg-[size:44px_44px] opacity-60" />
      <div className="pointer-events-none fixed inset-x-0 top-0 h-40 bg-gradient-to-b from-white/80 to-transparent" />

      <div className="relative flex min-h-screen">
        <SidebarNav activePanel={page} onSelect={setPage} />
        <div className="min-w-0 flex-1">
          <div className="mx-auto flex w-full max-w-[1540px] flex-col gap-4 px-3 pb-6 pt-3 sm:px-4 lg:pb-4 xl:px-6">
            <TopBar />
            <header className="trade-panel overflow-hidden rounded-[2rem] p-5 sm:p-7">
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br from-teal-200/70 via-sky-200/60 to-yellow-100/70 blur-2xl" />
              <div className="pointer-events-none absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-teal-300 via-sky-300 to-amber-200" />
              <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/75 px-3 py-2 text-xs font-black uppercase tracking-[0.2em] text-teal-700 shadow-sm ring-1 ring-teal-100">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.8)]" />
                    Rule-Based Risk Desk
                  </div>
                  <h1 className="mt-4 max-w-4xl break-words text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
                    Trade Buddy War Room
                  </h1>
                  <p className="mt-3 max-w-2xl text-base font-semibold leading-relaxed text-slate-600">{pageTitle(page)}</p>
                </div>
                <div className="max-w-xl rounded-2xl bg-amber-50/90 p-4 text-sm font-bold leading-relaxed text-amber-800 shadow-sm ring-1 ring-amber-200/80">
                  {DISCLAIMER_TEXT}
                </div>
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
      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.78fr)]">
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
  return <button className="trade-button-secondary min-h-16 rounded-2xl px-4 text-lg font-black" onClick={onClick} type="button">{label}</button>;
}

function toBottomPage(page: MobileWarRoomPanel) {
  return page === "imageRecords" || page === "expenses" || page === "tools" || page === "guide" ? "more" : page;
}

function pageTitle(page: MobileWarRoomPanel) {
  if (page === "dashboard") return "ภาพรวมสวย ๆ สำหรับเริ่มวัน: ดูทุน, คุมความเสี่ยง, แล้วเลือก action ที่ถูกต้อง";
  if (page === "scanner") return "สแกนตลาดจากข้อมูลสาธารณะ พร้อมกราฟและ bias เพื่อช่วยวางแผนอย่างมีวินัย";
  if (page === "plan") return "สร้างแผน, คำนวณ risk, เช็ก checklist และหลีกเลี่ยงการไล่ราคา";
  if (page === "journal") return "บันทึกผลแบบง่าย เพื่อจับพฤติกรรมการเทรดและหยุดเมื่อถึงลิมิต";
  if (page === "imageRecords") return "รวมภาพ, ใบเสร็จ, ภาพเทรด และสรุปข้อมูลที่บันทึกไว้ในเครื่อง";
  if (page === "expenses") return "ดูค่าใช้จ่ายและรายการจากรูป เพื่อไม่ให้ทุนรั่วโดยไม่รู้ตัว";
  if (page === "guide") return "คู่มือและข้อจำกัดการใช้งานของระบบ rule-based";
  return "เครื่องมือช่วยเทรดแบบ risk-first สำหรับมือใหม่ทุนเล็ก";
}
