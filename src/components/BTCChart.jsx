import React, { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";

const DAY = 24 * 60 * 60 * 1000;
const YEARS = (n) => Math.round(n * 365 * DAY);

// ---- Data sources ----
async function fetchCoinCapDaily(startMs, endMs) {
  const url = `https://api.coincap.io/v2/assets/bitcoin/history?interval=d1&start=${startMs}&end=${endMs}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`CoinCap HTTP ${res.status}`);
  const json = await res.json();
  if (!json?.data?.length) throw new Error("CoinCap empty data");
  return json.data.map((p) => ({
    time: Math.floor(Number(p.time) / 1000),
    value: Number(p.priceUsd),
  }));
}

async function fetchCoinGeckoDaily(startMs, endMs) {
  const from = Math.floor(startMs / 1000);
  const to = Math.floor(endMs / 1000);
  const url = `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=usd&from=${from}&to=${to}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`CoinGecko HTTP ${res.status}`);
  const json = await res.json();
  if (!json?.prices?.length) throw new Error("CoinGecko empty data");
  // CoinGecko returns [ms, price] tuples, possibly > daily granularity; downsample to daily
  const byDay = new Map();
  for (const [ts, price] of json.prices) {
    const day = Math.floor(ts / DAY) * DAY;
    byDay.set(day, price);
  }
  return Array.from(byDay.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([ts, price]) => ({ time: Math.floor(ts / 1000), value: Number(price) }));
}

async function fetchDailyPrices(startMs, endMs) {
  try {
    console.log("[BTCChart] Fetching CoinCap…");
    return await fetchCoinCapDaily(startMs, endMs);
  } catch (e) {
    console.warn("[BTCChart] CoinCap failed, falling back to CoinGecko:", e?.message || e);
    return await fetchCoinGeckoDaily(startMs, endMs);
  }
}

// ---- Component ----
export default function BTCChart() {
  const boxRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const [rangeYears, setRangeYears] = useState(10);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [error, setError] = useState("");

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;

    console.log("[BTCChart] mount, rangeYears:", rangeYears);
    setStatus("loading");
    setError("");

    const chart = createChart(el, {
      width: el.clientWidth,
      height: 380,
      layout: {
        background: { type: "Solid", color: "transparent" },
        textColor: document.documentElement.classList.contains("dark") ? "#e5e7eb" : "#0f172a",
      },
      rightPriceScale: { borderVisible: false },
      timeScale: { borderVisible: false, rightBarStaysOnScroll: true },
      grid: {
        vertLines: { color: "rgba(128,128,128,0.1)" },
        horzLines: { color: "rgba(128,128,128,0.1)" },
      },
      crosshair: { mode: 0 },
    });
    const series = chart.addAreaSeries({
      lineColor: "#0ea5e9",
      topColor: "rgba(14,165,233,0.3)",
      bottomColor: "rgba(14,165,233,0.05)",
    });
    chartRef.current = chart;
    seriesRef.current = series;

    const ro = new ResizeObserver(() => chart.applyOptions({ width: el.clientWidth }));
    ro.observe(el);

    // Enforce minimum 1y visible window
    const MIN_WINDOW = YEARS(1) / 1000;
    const clampToMin = (tr) => {
      const span = (tr?.to ?? 0) - (tr?.from ?? 0);
      if (span && span < MIN_WINDOW) {
        const to = tr.to;
        chart.timeScale().setVisibleRange({ from: to - MIN_WINDOW, to });
      }
    };
    const unsub = chart.timeScale().subscribeVisibleTimeRangeChange(clampToMin);

    const now = Date.now();
    const start10y = now - YEARS(10);
    let mounted = true;

    (async () => {
      try {
        const data = await fetchDailyPrices(start10y, now);
        if (!mounted) return;
        console.log("[BTCChart] data points:", data.length);
        series.setData(data);
        chart.timeScale().setVisibleRange({ from: Math.floor(start10y / 1000), to: Math.floor(now / 1000) });
        setStatus("ready");
      } catch (e) {
        console.error("[BTCChart] initial load failed:", e);
        setError(e?.message || "Failed to load BTC data");
        setStatus("error");
      }
    })();

    // Refresh every 60s
    const iv = setInterval(async () => {
      try {
        const end = Date.now();
        const startShort = end - YEARS(rangeYears);
        const data = await fetchDailyPrices(startShort, end);
        series.setData(data);
        const to = Math.floor(end / 1000);
        const from = to - Math.floor((rangeYears === 10 ? YEARS(10) : YEARS(rangeYears)) / 1000);
        chart.timeScale().setVisibleRange({ from, to });
      } catch (e) {
        console.warn("[BTCChart] refresh failed:", e);
      }
    }, 60000);

    // React to dark mode changes
    const mo = new MutationObserver(() => {
      const dark = document.documentElement.classList.contains("dark");
      chart.applyOptions({
        layout: { textColor: dark ? "#e5e7eb" : "#0f172a", background: { type: "Solid", color: "transparent" } },
        grid: {
          vertLines: { color: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" },
          horzLines: { color: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" },
        },
      });
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      mounted = false;
      clearInterval(iv);
      ro.disconnect();
      unsub && unsub();
      mo.disconnect();
      chart.remove();
    };
  }, [rangeYears]);

  const setYears = (n) => {
    setRangeYears(n);
    const chart = chartRef.current;
    if (!chart) return;
    const to = Math.floor(Date.now() / 1000);
    const from = to - Math.floor((n === 10 ? YEARS(10) : YEARS(n)) / 1000);
    chart.timeScale().setVisibleRange({ from, to });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm">
        <h3 className="font-medium">Live BTC/USD (daily)</h3>
        <div className="ml-auto flex gap-1">
          {[10,5,3,2,1].map((y) => (
            <button
              key={y}
              onClick={() => setYears(y)}
              className={`px-2 py-1 rounded ${y===rangeYears ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              title={`Show ${y}y`}
            >
              {y}y
            </button>
          ))}
        </div>
      </div>

      {status === "loading" && (
        <div className="w-full rounded-2xl border p-6 text-sm text-muted-foreground">
          Loading BTC chart…
        </div>
      )}

      {status === "error" && (
        <div className="w-full rounded-2xl border p-6 text-sm">
          <div className="text-red-600 font-medium mb-1">Couldn’t load BTC data.</div>
          <div className="text-muted-foreground">{error}</div>
        </div>
      )}

      <div
        ref={boxRef}
        className={`w-full rounded-2xl border overflow-hidden ${status !== "ready" ? "h-0" : ""}`}
        style={status === "ready" ? undefined : { minHeight: 0 }}
      />
      <p className="text-xs text-muted-foreground">
        Data: CoinCap (fallback CoinGecko). Default window: 10y. Minimum zoom enforced: 1y.
      </p>
    </div>
  );
}
