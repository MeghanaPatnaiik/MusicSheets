"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";

async function registerUser(name: string, email: string, password: string) {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    // Pydantic validation errors return detail as an array of {msg, loc} objects
    const detail = err?.detail;
    if (Array.isArray(detail)) {
      throw new Error(detail.map((d: { msg: string }) => d.msg).join(" "));
    }
    throw new Error(typeof detail === "string" ? detail : "Registration failed");
  }
  return res.json();
}

export default function LoginPage() {
  const { user, loading, login } = useAuth();
  const router = useRouter();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (mode === "register") await registerUser(name, email, password);
      await login(email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = (next: "login" | "register") => {
    setMode(next);
    setError("");
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <>
      <style>{`
        /* ── Reset ── */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── Palette ── */
        :root {
          --c1: #659287;
          --c2: #88BDA4;
          --c3: #B1D3B9;
          --c4: #E6F2DD;
          --text-dark: #1a2e25;
          --text-mid:  #3a5246;
          --text-soft: #5a7a6a;
        }

        /* ── Root ── */
        .lp-root {
          display: flex;
          min-height: 100vh;
          background: #ffffff;
          font-family: 'Inter', system-ui, sans-serif;
        }

        /* ══════════════════════════════
           LEFT PANEL — full-bleed image
        ══════════════════════════════ */
        .lp-left {
          flex: 1;
          position: relative;
          overflow: hidden;
          min-height: 100vh;
        }
        .lp-left-img {
          object-fit: cover;
          object-position: center;
        }
        /* Subtle green tint overlay so the image blends with palette */
        .lp-left-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            160deg,
            rgba(101,146,135,0.22) 0%,
            rgba(177,211,185,0.18) 100%
          );
        }
        /* Divider line */
        .lp-divider {
          width: 5px;
          background: linear-gradient(180deg, var(--c1) 0%, var(--c3) 100%);
          flex-shrink: 0;
        }

        /* ══════════════════════════════
           RIGHT PANEL — auth card
        ══════════════════════════════ */
        .lp-right {
          width: 560px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          padding: 2.5rem 2.5rem;
        }
        .lp-card {
          width: 100%;
          max-width: 500px;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        /* ── Logo + title ── */
        .lp-brand {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          text-align: center;
        }
        .lp-logo {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid var(--c3);
          box-shadow: 0 4px 20px rgba(101,146,135,0.25);
        }
        .lp-title {
          font-size: 2.25rem;
          font-weight: 900;
          letter-spacing: -0.03em;
          color: var(--text-dark);
          line-height: 1.1;
        }
        .lp-subtitle {
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--text-soft);
          letter-spacing: 0.01em;
        }

        /* ── Tab bar ── */
        .lp-tabs {
          display: flex;
          background: var(--c4);
          border-radius: 0.75rem;
          padding: 4px;
          gap: 4px;
        }
        .lp-tab {
          flex: 1;
          padding: 0.55rem 0;
          border: none;
          border-radius: 0.55rem;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s, color 0.2s, box-shadow 0.2s;
          background: transparent;
          color: var(--text-soft);
        }
        .lp-tab[aria-pressed="true"] {
          background: var(--c1);
          color: #ffffff;
          box-shadow: 0 2px 10px rgba(101,146,135,0.4);
        }

        /* ── Form ── */
        .lp-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .lp-field {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .lp-field label {
          font-size: 0.8125rem;
          font-weight: 700;
          color: var(--text-mid);
          letter-spacing: 0.03em;
          text-transform: uppercase;
        }
        .lp-input {
          width: 100%;
          padding: 0.7rem 0.9rem;
          border-radius: 0.625rem;
          border: 1.5px solid var(--c3);
          background: var(--c4);
          color: var(--text-dark);
          font-size: 0.9375rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-weight: 500;
        }
        .lp-input::placeholder { color: #aac4b4; }
        .lp-input:focus {
          border-color: var(--c1);
          box-shadow: 0 0 0 3px rgba(101,146,135,0.2);
          background: #ffffff;
        }

        /* ── Error ── */
        .lp-error {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          padding: 0.7rem 0.875rem;
          border-radius: 0.625rem;
          background: #fff0f0;
          border: 1px solid #f5c6c6;
          color: #c0392b;
          font-size: 0.875rem;
          font-weight: 600;
          animation: slide-in 0.2s ease;
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Submit button ── */
        .lp-btn {
          width: 100%;
          padding: 0.8rem 1.5rem;
          border-radius: 0.75rem;
          border: none;
          font-size: 1rem;
          font-weight: 800;
          cursor: pointer;
          background: var(--c1);
          color: #ffffff;
          letter-spacing: 0.02em;
          margin-top: 0.25rem;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(101,146,135,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .lp-btn:hover:not(:disabled) {
          background: var(--text-mid);
          transform: translateY(-1px);
          box-shadow: 0 6px 22px rgba(101,146,135,0.45);
        }
        .lp-btn:active:not(:disabled) { transform: translateY(0); }
        .lp-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        /* ── Spinner ── */
        .lp-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.65s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Name field slide-in ── */
        .lp-field-in {
          animation: field-in 0.22s ease;
        }
        @keyframes field-in {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Footer note ── */
        .lp-footer {
          text-align: center;
          font-size: 0.75rem;
          color: #aac4b4;
          line-height: 1.5;
        }

        /* ── Responsive: stack on small screens ── */
        @media (max-width: 768px) {
          .lp-left, .lp-divider { display: none; }
          .lp-right { width: 100%; padding: 2rem 1.25rem; }
        }
      `}</style>

      <div className="lp-root">

        {/* ── LEFT: full-bleed image ── */}
        <div className="lp-left">
          <Image
            src="/image1.jpg"
            alt="A cat resting on piano keys — oil painting"
            fill
            className="lp-left-img"
            priority
            quality={100}
            sizes="50vw"
          />
          <div className="lp-left-overlay" />
        </div>

        {/* ── DIVIDER ── */}
        <div className="lp-divider" aria-hidden="true" />

        {/* ── RIGHT: auth card ── */}
        <div className="lp-right">
          <div className="lp-card">

            {/* Brand */}
            <div className="lp-brand">
              <Image
                src="/Picture2.png"
                alt="MusicSheets logo"
                width={110}
                height={110}
                className="lp-logo"
                priority
              />
              <h1 className="lp-title">MusicSheets</h1>
              <p className="lp-subtitle">AI Piano Transcription</p>
            </div>

            {/* Tabs */}
            <div className="lp-tabs" role="tablist" aria-label="Authentication mode">
              <button
                id="tab-login"
                className="lp-tab"
                type="button"
                role="tab"
                aria-pressed={mode === "login"}
                onClick={() => switchMode("login")}
              >
                Log in
              </button>
              <button
                id="tab-register"
                className="lp-tab"
                type="button"
                role="tab"
                aria-pressed={mode === "register"}
                onClick={() => switchMode("register")}
              >
                Register
              </button>
            </div>

            {/* Form */}
            <form
              className="lp-form"
              onSubmit={handleSubmit}
              aria-label={mode === "login" ? "Login form" : "Register form"}
            >
              {mode === "register" && (
                <div className="lp-field lp-field-in">
                  <label htmlFor="name">Full name</label>
                  <input
                    id="name"
                    className="lp-input"
                    type="text"
                    placeholder="Jane Smith"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="name"
                  />
                </div>
              )}

              <div className="lp-field">
                <label htmlFor="email">Email address</label>
                <input
                  id="email"
                  className="lp-input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="lp-field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  className="lp-input"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                />
              </div>

              {error && (
                <div className="lp-error" role="alert" aria-live="assertive">
                  <span aria-hidden="true">⚠️</span> {error}
                </div>
              )}

              <button
                id="submit-btn"
                className="lp-btn"
                type="submit"
                disabled={submitting}
              >
                {submitting
                  ? <><span className="lp-spinner" aria-hidden="true" /> Please wait…</>
                  : mode === "login" ? "Log in" : "Create account"
                }
              </button>
            </form>

            <p className="lp-footer">
              By continuing you agree to our Terms &amp; Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
