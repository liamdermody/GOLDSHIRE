import React, { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";

const DAY = 24 * 60 * 60 * 1000;
const YEARS = (n) => Math.round(n * 365 * DAY);

async function fetchDailyPrices(startMs, endMs) {
  const url = `https://api.coincap.io/v2/assets/bitcoin/history?interval=d1&start=${startMs}&end=${endMs}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch BTC history");
  const json = await res.json();
  return json.data.map((p) => ({
    time: Math.floor(Number(p.time) / 1000),
    value: Number(p.priceUsd),
  }));
}

export default function BTCChart() {
  const boxRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const [rangeYears, setRangeYears] = useState(10);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;

    const chart = createChart(el, {
      width: el.clientWidth,
      height: 380,
      layout: {
        background: { type: "Solid", color: "transparent" },
        textColor: document.documentElement.classList.contains("dark") ? "#e5e7eb" : "#0f172a",
      },
      rightPriceScale: { borderVisible: false },
      timeScale: {
        borderVisible: false,
        rightBarStaysOnScroll: true,
      },
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

    const MIN_WINDOW = YEARS(1) / 1000;
    const clampToMin = (tr) => {
      if (!tr?.from || !tr?.to) return;
      const span = tr.to - tr.from;
      if (span < MIN_WINDOW) {
        const to = tr.to;
        chart.timeScale().setVisibleRange({ from: to - MIN_WINDOW, to });
      }
    };
    const unsub = chart.timeScale().subscribeVisibleTimeRangeChange(clampToMin);

    const now = Date.now();
    const start = now - YEARS(10);
    let mounted = true;
    (async () => {
      try {
        const data = await fetchDailyPrices(start, now);
        if (!mounted) return;
        series.setData(data);
        chart.timeScale().setVisibleRange({ from: Math.floor(start / 1000), to: Math.floor(now / 1000) });
      } catch (e) { console.error(e); }
    })();

    const iv = setInterval(async () => {
      try {
        const end = Date.now();
        const startShort = end - YEARS(rangeYears);
        const data = await fetchDailyPrices(startShort, end);
        series.setData(data);
        const to = Math.floor(end / 1000);
        const from = to - Math.floor((rangeYears === 10 ? YEARS(10) : YEARS(rangeYears)) / 1000);
        chart.timeScale().setVisibleRange({ from, to });
      } catch (e) { console.error(e); }
    }, 60000);

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
        <span className="text-muted-foreground">BTC/USD</span>
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
      <div ref={boxRef} className="w-full rounded-2xl border overflow-hidden" />
      <p className="text-xs text-muted-foreground">
        Live daily data from CoinCap. Initial window: 10y. Minimum zoom enforced: 1y.
      </p>
    </div>
  );
}
