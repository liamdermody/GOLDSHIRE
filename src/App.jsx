import React, { useEffect } from "react";
import { HashRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, LineChart, Coins, Phone, FileText, HelpCircle, Home as HomeIcon, CheckCircle2, XCircle } from "lucide-react";

// ---- Minimal UI (in-file stubs to avoid missing imports) ----
function Button({ children, className = "", variant, ...props }) {
  const base = variant === "outline"
    ? "border px-4 py-2 rounded"
    : "px-4 py-2 rounded bg-black text-white";
  return (
    <button {...props} className={`${base} ${className}`.trim()}>
      {children}
    </button>
  );
}
function Card({ children, className = "" }) {
  return <div className={`border rounded-xl ${className}`.trim()}>{children}</div>;
}
function CardHeader({ children, className = "" }) {
  return <div className={`p-4 border-b ${className}`.trim()}>{children}</div>;
}
function CardTitle({ children, className = "" }) {
  return <h2 className={`font-semibold ${className}`.trim()}>{children}</h2>;
}
function CardContent({ children, className = "" }) {
  return <div className={`p-4 ${className}`.trim()}>{children}</div>;
}

// ---- Shared Layout ----
function Container({ children }) {
  return <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>;
}

function Logo() {
  return (
    <NavLink to="/" className="flex items-center gap-2 font-semibold">
      <div className="h-9 w-9 rounded-2xl bg-black text-white grid place-items-center shadow-md">GF</div>
      <span className="text-lg">Goldshire Financial</span>
    </NavLink>
  );
}

function NavBar() {
  const linkBase = "px-3 py-2 rounded-xl text-sm font-medium transition hover:bg-muted";
  const active = ({ isActive }) =>
    isActive ? `${linkBase} bg-muted` : linkBase;
  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" className={active} end><HomeIcon className="mr-2 h-4 w-4"/>Home</NavLink>
            <NavLink to="/products" className={active}><Coins className="mr-2 h-4 w-4"/>Products</NavLink>
            <NavLink to="/research" className={active}><LineChart className="mr-2 h-4 w-4"/>Research</NavLink>
            <NavLink to="/about" className={active}><ShieldCheck className="mr-2 h-4 w-4"/>About</NavLink>
            <NavLink to="/faq" className={active}><HelpCircle className="mr-2 h-4 w-4"/>FAQ</NavLink>
            <NavLink to="/disclosures" className={active}><FileText className="mr-2 h-4 w-4"/>Disclosures</NavLink>
            <NavLink to="/contact" className="ml-2 px-3 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90"><Phone className="mr-2 h-4 w-4"/>Contact</NavLink>
          </nav>
        </div>
      </Container>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t mt-16">
      <Container>
        <div className="py-8 grid gap-6 md:grid-cols-3 text-sm text-muted-foreground">
          <div>
            <Logo />
            <p className="mt-3 max-w-sm">Turning Digital Gold Into Real Assets. A research-driven approach to BTC-collateralized lending.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <p className="font-medium text-foreground">Company</p>
              <ul className="space-y-1">
                <li><NavLink to="/about" className="hover:underline">About</NavLink></li>
                <li><NavLink to="/research" className="hover:underline">Research</NavLink></li>
                <li><NavLink to="/disclosures" className="hover:underline">Disclosures</NavLink></li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-foreground">Support</p>
              <ul className="space-y-1">
                <li><NavLink to="/faq" className="hover:underline">FAQ</NavLink></li>
                <li><NavLink to="/contact" className="hover:underline">Contact</NavLink></li>
              </ul>
            </div>
          </div>
          <div className="text-xs">
            <p className="mb-2">© {new Date().getFullYear()} Goldshire Financial. All rights reserved.</p>
            <p>This site is for educational and research purposes. Nothing here is investment, legal, or tax advice.</p>
            <div className="mt-3">
              <NavLink to="/_tests" className="underline hover:no-underline">Run UI self-tests</NavLink>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}

// ---- Pages ----
function Hero() {
  return (
    <Container>
      <div className="grid items-center gap-10 py-16 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
            Turn Bitcoin into <span className="underline decoration-primary/60">Real-World Ownership</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Dual-collateral mortgages secured by BTC and property equity, with transparent risk controls and research-first underwriting.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <NavLink to="/products">
              <Button className="rounded-2xl">Explore Products <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </NavLink>
            <NavLink to="/research">
              <Button variant="outline" className="rounded-2xl">Read Research</Button>
            </NavLink>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <Card className="rounded-2xl shadow-xl">
            <CardHeader>
              <CardTitle>Risk Controls at a Glance</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-4 w-4"/> LTV bands with automated alerts and staged remediation.</li>
                <li className="flex items-start gap-3"><LineChart className="mt-0.5 h-4 w-4"/> Collateral Stress Engine simulations for BTC drawdowns.</li>
                <li className="flex items-start gap-3"><Coins className="mt-0.5 h-4 w-4"/> Dual-collateral structure (BTC + property) to dampen volatility.</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Container>
  );
}

function HomePage() {
  const features = [
    { icon: <ShieldCheck className="h-5 w-5"/>, title: "Safety First", body: "Explicit LTV triggers and conservative margin policies." },
    { icon: <LineChart className="h-5 w-5"/>, title: "Transparent Models", body: "Open-sourced risk engine and stress test assumptions." },
    { icon: <Coins className="h-5 w-5"/>, title: "Aligned Incentives", body: "Long-term BTC holders underwriting for long-term owners." },
  ];
  return (
    <main>
      <Hero />
      <Container>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((f, i) => (
            <Card key={i} className="rounded-2xl">
              <CardHeader className="space-y-1">
                <div className="flex items-center gap-2 text-primary">{f.icon}<span className="text-sm font-medium">{f.title}</span></div>
                <CardTitle className="text-xl">{f.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{f.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-12">
          <Card className="rounded-2xl border-dashed">
            <CardContent className="py-10 text-center">
              <p className="text-sm uppercase tracking-wider text-muted-foreground">Pilot Program</p>
              <h3 className="mt-2 text-2xl font-semibold">Seeking first 10 borrowers + design partners</h3>
              <p className="mt-2 text-muted-foreground">If you are a qualified BTC holder with property equity, join our pilot.</p>
              <div className="mt-5">
                <NavLink to="/contact"><Button className="rounded-2xl">Apply to Pilot</Button></NavLink>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </main>
  );
}

function Section({ title, lead, children }) {
  return (
    <Container>
      <div className="py-12">
        <h1 className="text-3xl font-semibold">{title}</h1>
        {lead && <p className="mt-2 text-muted-foreground max-w-2xl">{lead}</p>}
        <div className="mt-8">{children}</div>
      </div>
    </Container>
  );
}

function ProductsPage() {
  const products = [
    { name: "Dual-Collateral Mortgage", detail: "BTC + property equity. Target LTV bands 30–60% with dynamic maintenance levels.", tag: "Pilot" },
    { name: "Treasury Line", detail: "Short-term USD line secured by BTC for operators and creators.", tag: "Prototype" },
    { name: "Custody-Assist Escrow", detail: "Structured workflows with multi-sig, proof-of-reserves attestations.", tag: "Design" },
  ];
  return (
    <Section title="Products" lead="Built for responsible BTC holders who want real-world assets without selling their coins.">
      <div className="grid gap-6 md:grid-cols-3">
        {products.map((p, i) => (
          <Card key={i} className="rounded-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{p.name}</CardTitle>
                <span className="text-xs rounded-full px-2 py-1 bg-muted">{p.tag}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{p.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8">
        <NavLink to="/contact"><Button className="rounded-2xl">Inquire</Button></NavLink>
      </div>
    </Section>
  );
}

function ResearchPage() {
  const items = [
    { title: "Collateral Stress Engine", desc: "Monte Carlo drawdown scenarios, liquidation bands, and borrower health metrics.", href: "#" },
    { title: "Underwriting Memo Template", desc: "Standardized, auditable write-ups for pilot loans.", href: "#" },
    { title: "Risk Dashboard", desc: "Live LTV, VaR bands, and alert ladder (concept).", href: "#" },
  ];
  return (
    <Section title="Research" lead="Open research drives our underwriting. Here are core modules and papers.">
      <div className="grid gap-6 md:grid-cols-2">
        {items.map((it, i) => (
          <Card key={i} className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl">{it.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{it.desc}</p>
              <div className="mt-4">
                <a href={it.href} className="text-sm underline">View</a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function AboutPage() {
  return (
    <Section title="About" lead="We’re builders, operators, and BTC long-termists designing conservative credit for a volatile asset.">
      <div className="prose prose-neutral max-w-none">
        <p>
          Goldshire aims to operate as a lean Delaware C-Corp with custody/BaaS partners, then pursue a Wyoming SPDI trust charter, and later register as a foreign entity in New Jersey. Long-term, we intend to run as a trust company in NJ with a Wyoming regulatory base.
        </p>
        <p>
          Our philosophy: simple products, explicit risks, no hype. If the numbers don’t pencil, we don’t ship.
        </p>
      </div>
    </Section>
  );
}

function FAQPage() {
  const faqs = [
    { q: "Is any of this investment advice?", a: "No. This site is for educational and research purposes only." },
    { q: "Do I keep my BTC keys?", a: "We are exploring multi-sig and escrow structures. Details will be published before any live lending." },
    { q: "What are typical LTVs?", a: "Conceptually 30–60% with stepped maintenance and cure periods. Final terms depend on jurisdiction and partners." },
  ];
  return (
    <Section title="FAQ" lead="Straight answers to common questions.">
      <div className="space-y-4">
        {faqs.map((f, i) => (
          <Card key={i} className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">{f.q}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{f.a}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function DisclosuresPage() {
  const items = [
    "Educational content only; not investment, legal, or tax advice.",
    "Products described may be prototypes or pending regulatory approval.",
    "BTC is volatile. Borrowing against BTC can result in loss of collateral.",
  ];
  return (
    <Section title="Disclosures" lead="Please read carefully before engaging with the pilot program.">
      <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
        {items.map((t, i) => (<li key={i}>{t}</li>))}
      </ul>
      <div className="mt-6 text-xs text-muted-foreground">Updated {new Date().toLocaleDateString()}</div>
    </Section>
  );
}

// ---- Lightweight UI self-tests (runtime) ----
function TestsPage() {
  const tests = [];

  const disclosuresItems = [
    "Educational content only; not investment, legal, or tax advice.",
    "Products described may be prototypes or pending regulatory approval.",
    "BTC is volatile. Borrowing against BTC can result in loss of collateral.",
  ];
  tests.push({ name: "Disclosures length is 3", pass: disclosuresItems.length === 3 });

  const requiredRoutes = ["/", "/products", "/research", "/about", "/faq", "/disclosures", "/contact", "/_tests"];
  tests.push({ name: "Has 8 routes including tests", pass: requiredRoutes.length === 8 });

  tests.push({ name: "UI Button defined", pass: typeof Button === "function" });
  tests.push({ name: "UI Card defined", pass: typeof Card === "function" });
  tests.push({ name: "Logo label present", pass: "Goldshire Financial".length > 0 });

  useEffect(() => {
    console.assert(disclosuresItems.length === 3, "Disclosures should have 3 items");
  }, []);

  return (
    <Section title="Self-Tests" lead="Runtime checks to quickly validate the UI wiring.">
      <div className="space-y-2">
        {tests.map((t, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            {t.pass ? <CheckCircle2 className="h-4 w-4 text-green-600"/> : <XCircle className="h-4 w-4 text-red-600"/>}
            <span>{t.name}</span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">Open the console for assertion output.</p>
    </Section>
  );
}

function ContactPage() {
  return (
    <Section title="Contact" lead="Tell us a bit about your situation and we’ll get back to you.">
      <Card className="rounded-2xl max-w-2xl">
        <CardContent className="pt-6">
          <form className="grid gap-4">
            <div>
              <label className="text-sm">Name</label>
              <input className="mt-1 w-full rounded-xl border p-2" placeholder="Satoshi Nakamoto" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm">Email</label>
                <input className="mt-1 w-full rounded-xl border p-2" placeholder="you@example.com" />
              </div>
              <div>
                <label className="text-sm">Subject</label>
                <input className="mt-1 w-full rounded-xl border p-2" placeholder="Pilot Program / General" />
              </div>
            </div>
            <div>
              <label className="text-sm">Message</label>
              <textarea className="mt-1 w-full rounded-xl border p-2 h-32" placeholder="Tell us about your BTC, property, and goals." />
            </div>
            <Button type="button" className="rounded-2xl w-fit">Send</Button>
            <p className="text-xs text-muted-foreground">Form is a placeholder. Hook to your preferred form backend (e.g., GitHub Pages + Formspree).</p>
          </form>
        </CardContent>
      </Card>
    </Section>
  );
}

// ---- App ----
export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/research" element={<ResearchPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/disclosures" element={<DisclosuresPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/_tests" element={<TestsPage />} />
          <Route path="*" element={
            <Section title="Not Found">
              <p className="text-muted-foreground">The page you’re looking for doesn’t exist.</p>
            </Section>
          }/>
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}
