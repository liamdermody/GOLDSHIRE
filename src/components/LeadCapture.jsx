import React, { useState } from "react";

/**
 * Wire this POST endpoint to Xpress Leads (or your webhook) when ready.
 * For now, it attempts a POST; if blocked on Pages, it falls back to mailto.
 */
const ENDPOINT = "" // e.g. "https://xpressleads.example.com/api/leads"

export default function LeadCapture() {
  const [status, setStatus] = useState("idle");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");

    const data = Object.fromEntries(new FormData(e.currentTarget));

    if (!ENDPOINT) {
      setStatus("fallback");
      return;
    }

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("success");
      e.currentTarget.reset();
    } catch (err) {
      console.error(err);
      setStatus("fallback");
    }
  }

  const mailto = `mailto:info@goldshirefinancial.com?subject=Lead%20from%20Website&body=${
    encodeURIComponent("Name: \nEmail: \nPhone: \nMessage: ")
  }`;

  return (
    <div className="card">
      <div className="card-title">Get in touch</div>
      <form className="form stack gap-sm" onSubmit={handleSubmit}>
        <div className="grid">
          <label className="field">
            <span>Name</span>
            <input name="name" required placeholder="Your name" />
          </label>
          <label className="field">
            <span>Email</span>
            <input name="email" type="email" required placeholder="you@domain.com" />
          </label>
        </div>
        <label className="field">
          <span>Phone</span>
          <input name="phone" placeholder="+1 (___) ___-____" />
        </label>
        <label className="field">
          <span>Message</span>
          <textarea name="message" rows="4" placeholder="Tell us what you’re building" />
        </label>

        <div className="row">
          <button className="button" type="submit" disabled={status==="submitting"}>
            {status==="submitting" ? "Sending..." : "Send"}
          </button>

          {status === "success" && <span className="ok">Thanks — we’ll reach out.</span>}
          {status === "fallback" && (
            <a className="button ghost" href={mailto}>Email Instead</a>
          )}
        </div>
      </form>
    </div>
  );
}
