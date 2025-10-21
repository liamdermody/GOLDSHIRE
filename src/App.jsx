import React from 'react'
import BTCWidget from './components/BTCWidget.jsx'

export default function App() {
  return (
    <div className="container">
      <header className="header">
        <h1>Goldshire Financial</h1>
        <p>Turning Digital Gold Into Real Assets</p>
      </header>

      <section className="card">
        <h2>Status</h2>
        <p>If you can read this, the blank-screen issue is fixed.</p>
      </section>

      <section className="card">
        <h2>BTC Price (7d sparkline)</h2>
        <BTCWidget />
      </section>

      <footer className="footer">© {new Date().getFullYear()} Goldshire</footer>
    </div>
  )
}
