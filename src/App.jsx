import React from "react";
import { HashRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import BTCChart from "./components/BTCChart.jsx";
import LeadCapture from "./components/LeadCapture.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

function Shell({ children }) {
  return (
    <div className="container">
      <header className="nav">
        <div className="brand">Goldshire Financial</div>
        <nav className="links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="footer">
        <div>“Turning Digital Gold Into Real Assets.”</div>
        <div className="muted">© {new Date().getFullYear()} Goldshire Financial</div>
      </footer>
    </div>
  );
}

function Home() {
  return (
    <section className="stack gap-lg">
      <h1 className="h1">Turn BTC into real-world assets</h1>
      <p className="lede">
        We’re building mortgage workflows that accept Bitcoin as primary collateral.
      </p>
      <ErrorBoundary>
        <BTCChart />
      </ErrorBoundary>
      <ErrorBoundary>
        <LeadCapture />
      </ErrorBoundary>
    </section>
  );
}

function About() {
  return (
    <section className="stack gap-md">
      <h1 className="h1">About</h1>
      <p>
        Goldshire is exploring BTC-backed lending with dual collateral (BTC + property),
        conservative LTV triggers, and transparent risk dashboards.
      </p>
    </section>
  );
}

function Contact() {
  return (
    <section className="stack gap-md">
      <h1 className="h1">Contact</h1>
      <p>Questions? Partnerships? Pilot programs? Drop your info below.</p>
      <ErrorBoundary>
        <LeadCapture />
      </ErrorBoundary>
    </section>
  );
}

export default function App() {
  return (
    <Router>
      <Shell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Shell>
    </Router>
  );
}
