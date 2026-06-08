import { NextResponse } from "next/server";
import { fetchBinanceKlines } from "@/lib/binance";
import { analyzeKlines } from "@/lib/indicators";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol") ?? "BTCUSDT";
  const interval = searchParams.get("interval") ?? "15m";

  try {
    const candles = await fetchBinanceKlines(symbol, interval);
    return NextResponse.json(analyzeKlines(symbol.toUpperCase(), interval, candles));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Market data request failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
