(() => {
  const ID = "gs-btc-widget";
  if (document.getElementById(ID)) return;

  // Styles
  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = "/gs-btc.css";
  document.head.appendChild(css);

  // Container
  const wrap = document.createElement("div");
  wrap.id = ID;
  wrap.innerHTML = `
    <button class="gsb-refresh" title="Refresh">↻</button>
    <div class="gsb-row">
      <span class="gsb-label">BTC</span>
      <span class="gsb-price gsb-dim">Loading…</span>
    </div>
    <div class="gsb-src">Source: CoinDesk</div>
  `;
  document.body.appendChild(wrap);

  const $price = wrap.querySelector(".gsb-price");

  async function fetchPrice(attempt = 1) {
    try {
      wrap.classList.remove("gsb-error");
      $price.textContent = "Loading…";
      const r = await fetch("https://api.coindesk.com/v1/bpi/currentprice.json", { headers: { accept: "application/json" } });
      if (!r.ok) throw new Error("HTTP " + r.status);
      const j = await r.json();
      const p = Number(j?.bpi?.USD?.rate_float);
      if (!p) throw new Error("Bad data");
      $price.textContent = "$" + Math.round(p).toLocaleString();
      $price.classList.remove("gsb-dim");
    } catch (e) {
      if (attempt < 2) return fetchPrice(attempt + 1);
      wrap.classList.add("gsb-error");
      $price.textContent = "Error";
    }
  }

  wrap.querySelector(".gsb-refresh").addEventListener("click", fetchPrice);
  fetchPrice();
})();
