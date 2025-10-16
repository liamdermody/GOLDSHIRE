import React, { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";

const DAY = 24 * 60 * 60 * 1000;
const YEARS = (n) => Math.round(n * 365 * DAY);

async function fetchCoinCap(start, end) {
  const url = `https://api.coincap.io/v2/assets/bitcoin/history?interval=d1&start=${start}&end=${end}`;
  const res = await fetch(url);
  const j = await res.json();
  if (!j.data?.length) throw new Error("CoinCap empty");
  return j.data.map((d) => ({ time: d.time / 1000, value: +d.priceUsd }));
}
async function fetchGecko(start, end) {
  const from = Math.floor(start / 1000);
  const to = Math.floor(end / 1000);
  const url = `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=usd&from=${from}&to=${to}`;
  const res = await fetch(url);
  const j = await res.json();
  if (!j.prices?.length) throw new Error("CoinGecko empty");
  const byDay = new Map();
  for (const [t, v] of j.prices) {
    const day = Math.floor(t / DAY) * DAY;
    byDay.set(day, v);
  }
  return Array.from(byDay.entries()).map(([t, v]) => ({
    time: t / 1000,
    value: +v,
  }));
}
function fakeData(start, end) {
  const arr = [];
  let val = 10000;
  for (let t = start; t < end; t += DAY) {
    val += (Math.random() - 0.5) * 200;
    arr.push({ time: t / 1000, value: val });
  }
  return arr;
}

export default function BTCChart() {
  const ref = useRef(null);
  const [years, setYears] = useState(10);
  const [error, setError] = useState("");
  useEffect(() => {
    const el = ref.current;
    const chart = createChart(el, {
      width: el.clientWidth,
      height: 380,
      layout: { background: { type: "Solid", color: "transparent" }, textColor: "#111" },
      grid: { vertLines: { color: "#eee" }, horzLines: { color: "#eee" } },
    });
    const series = chart.addAreaSeries({
      lineColor: "#0ea5e9",
      topColor: "rgba(14,165,233,0.3)",
      bottomColor: "rgba(14,165,233,0.05)",
    });
    const now = Date.now();
    const start = now - YEARS(10);
    (async () => {
      try {
        let data = await fetchCoinCap(start, now);
        if (!data?.length) throw new Error("No data");
        series.setData(data);
      } catch (e) {
        try {
          let data = await fetchGecko(start, now);
          series.setData(data);
          setError("CoinCap failed; using CoinGecko");
        } catch {
          series.setData(fakeData(start, now));
          setError("API error — showing sample data");
        }
      }
    })();
    new ResizeObserver(() =>
      chart.applyOptions({ width: el.clientWidth })
    ).observe(el);
    return () => chart.remove();
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm">
        <h3 className="font-medium">Live BTC/USD (daily)</h3>
        <div className="ml-auto flex gap-1">
          {[10, 5, 3, 2, 1].map((y) => (
            <button
              key={y}
              onClick={() => setYears(y)}
              className={`px-2 py-1 rounded ${
                years === y ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              {y}y
            </button>
          ))}
        </div>
      </div>
      {error && (
        <div className="text-xs text-red-600 border rounded p-2">{error}</div>
      )}
      <div
        ref={ref}
        className="w-full border rounded-2xl"
        style={{ height: 380 }}
      ></div>
      <p className="text-xs text-muted-foreground">
        Default view: 10y. Data from CoinCap (fallback CoinGecko).
      </p>
    </div>
  );
}
