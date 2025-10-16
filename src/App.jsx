import React from "react";
import { HashRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import BTCChart from "./components/BTCChart.jsx";

function Container({ children }) {
  return <div className="mx-auto max-w-7xl p-4">{children}</div>;
}
function Section({ title, lead, children }) {
  return (
    <Container>
      <h1 className="text-3xl font-semibold mb-2">{title}</h1>
      {lead && <p className="text-muted-foreground mb-6">{lead}</p>}
      {children}
    </Container>
  );
}
function ResearchPage() {
  return (
    <Section
      title="Research"
      lead="Live BTC/USD 10-year chart with zoom presets."
    >
      <BTCChart />
    </Section>
  );
}
function Home() {
  return (
    <Section title="Home">
      <NavLink to="/research" className="underline">
        Go to Research
      </NavLink>
    </Section>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/research" element={<ResearchPage />} />
      </Routes>
    </Router>
  );
}
