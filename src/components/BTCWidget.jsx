import React, { useEffect, useMemo, useState } from 'react'

const fetchJSON = async (url, { timeoutMs = 8000 } = {}) => {
  const ctr = new AbortController()
  const t = setTimeout(() => ctr.abort(), timeoutMs)
  try {
    const r = await fetch(url, { signal: ctr.signal, headers: { accept: 'application/json' } })
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    return await r.json()
  } finally {
    clearTimeout(t)
  }
}

const cgMarket7d = () =>
  fetchJSON('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7&interval=hourly')

const cgSpot = () =>
  fetchJSON('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')

const cdSpot = () =>
  fetchJSON('https://api.coindesk.com/v1/bpi/currentprice.json')

export default function BTCWidget() {
  const [state, setState] = useState({ loading: true, error: null, price: null, series: [] })

  const load = async () => {
    setState(s => ({ ...s, loading: true, error: null }))
    try {
      const [mkt, spot] = await Promise.allSettled([cgMarket7d(), cgSpot()])

      let series = []
      let price = null

      if (mkt.status === 'fulfilled' && Array.isArray(mkt.value?.prices)) {
        series = mkt.value.prices.map(([ts, v]) => ({ ts, v }))
      }
      if (spot.status === 'fulfilled') {
        price = spot.value?.bitcoin?.usd ?? null
      }

      if (price == null) {
        const cd = await cdSpot()
        price = Number(cd?.bpi?.USD?.rate_float) || null
      }

      if (!price) throw new Error('Unable to load BTC price')

      setState({ loading: false, error: null, price, series })
    } catch (e) {
      setState({ loading: false, error: e?.message || 'Failed to load', price: null, series: [] })
    }
  }

  useEffect(() => { load() }, [])

  const Spark = useMemo(() => {
    const w = 400, h = 96, p = 8
    const data = state.series.length ? state.series : []
    if (!data.length) return () => <div style={{ opacity: 0.6 }}>No sparkline data (fallback used)</div>
    const xs = data.map(d => d.ts)
    const ys = data.map(d => d.v)
    const xMin = Math.min(...xs), xMax = Math.max(...xs)
    const yMin = Math.min(...ys), yMax = Math.max(...ys)
    const sx = x => p + ((x - xMin) / (xMax - xMin)) * (w - 2 * p)
    const sy = y => h - p - ((y - yMin) / (yMax - yMin)) * (h - 2 * p)
    const path = data.map((d, i) => `${i ? 'L' : 'M'}${sx(d.ts)},${sy(d.v)}`).join(' ')
    const last = data[data.length - 1]
    return () => (
      <svg width={w} height={h} role="img" aria-label="BTC 7d sparkline">
        <path d={path} fill="none" strokeWidth="2" />
        <circle cx={sx(last.ts)} cy={sy(last.v)} r="3" />
      </svg>
    )
  }, [state.series])

  if (state.loading) return <div className="btcbox">Loading BTC…</div>
  if (state.error) return (
    <div className="btcbox error">
      <div>BTC load error: {state.error}</div>
      <button onClick={load}>Retry</button>
    </div>
  )

  return (
    <div className="btcbox">
      <div className="btcrow">
        <div className="btcbig">${state.price.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
        <button className="btn" onClick={load}>Refresh</button>
      </div>
      <Spark />
      <div className="btchint">Primary: CoinGecko • Fallback: CoinDesk</div>
    </div>
  )
}
