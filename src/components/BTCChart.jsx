import React, { useState } from "react";

/**
 * Fastest safe path: use CoinGecko's public widget in an iframe.
 * - Avoids CORS / heavy chart libs on Pages
 * - Still responsive and reliable
 */
export default function BTCChart() {
  const [failed, setFailed] = useState(false);

  return (
    <div className="stack gap-sm">
      <div className="section-title">Bitcoin Price (24h)</div>
      {!failed ? (
        <div className="iframe-wrap">
          <iframe
            title="BTC Chart"
            src="https://www.coingecko.com/en/widgets/price-chart/bitcoin/usd?chart_type=area"
            loading="lazy"
            onError={() => setFailed(true)}
          />
        </div>
      ) : (
        <div className="card">
          <div className="card-title">Chart unavailable</div>
          <div className="muted">
            If your network blocks iframes, view the chart on CoinGecko.
          </div>
          <a className="button" href="https://www.coingecko.com/en/coins/bitcoin" target="_blank" rel="noreferrer">
            Open on CoinGecko
          </a>
        </div>
      )}
    </div>
  );
}
