"use client";

import { useAuth } from "@/lib/auth-context";
import StatCard from "@/components/StatCard";
import QuickActions from "@/components/QuickActions";
import TranscriptionTable, { Transcription } from "@/components/TranscriptionTable";

// ---------------------------------------------------------------------------
// Mock data — replace with real API calls
// ---------------------------------------------------------------------------

const MOCK_TRANSCRIPTIONS: Transcription[] = [
  {
    id: "t1",
    title: "Moonlight Sonata — Mvt. 1",
    source: "recording_beethoven_01.mp3",
    date: "2026-08-23T14:30:00Z",
    duration: "5:12",
    status: "ready",
  },
  {
    id: "t2",
    title: "Clair de Lune",
    source: "clair_de_lune_take2.wav",
    date: "2026-08-22T09:15:00Z",
    duration: "4:48",
    status: "exported",
  },
  {
    id: "t3",
    title: "Für Elise",
    source: "fur_elise_practice.mp3",
    date: "2026-08-24T18:05:00Z",
    duration: "2:56",
    status: "processing",
  },
  {
    id: "t4",
    title: "Nocturne in E-flat, Op.9 No.2",
    source: "chopin_nocturne_raw.m4a",
    date: "2026-08-21T11:45:00Z",
    duration: "4:30",
    status: "ready",
  },
  {
    id: "t5",
    title: "Gymnopédie No. 1",
    source: "satie_gymnopedie.wav",
    date: "2026-08-20T16:20:00Z",
    duration: "3:08",
    status: "failed",
  },
];

// ---------------------------------------------------------------------------
// Stat icons
// ---------------------------------------------------------------------------

const IconSheets = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
  </svg>
);

const IconMidi = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="8" width="20" height="8" rx="2" />
    <path d="M6 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
    <line x1="6" y1="12" x2="6" y2="12" strokeWidth="3" strokeLinecap="round" />
    <line x1="10" y1="12" x2="10" y2="12" strokeWidth="3" strokeLinecap="round" />
    <line x1="14" y1="12" x2="14" y2="12" strokeWidth="3" strokeLinecap="round" />
    <line x1="18" y1="12" x2="18" y2="12" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const IconQueue = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DashboardPage() {
  const { user, loading } = useAuth();

  const readyCount   = MOCK_TRANSCRIPTIONS.filter((t) => t.status === "ready").length;
  const exportCount  = MOCK_TRANSCRIPTIONS.filter((t) => t.status === "exported").length;
  const queueCount   = MOCK_TRANSCRIPTIONS.filter((t) => t.status === "processing").length;
  const totalCount   = MOCK_TRANSCRIPTIONS.length;

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <div className="dashboard-page">

      {/* ── Hero ── */}
      <header className="dashboard-hero">
        {loading ? (
          <>
            <div className="skeleton" style={{ width: 140, height: 13 }} />
            <div className="skeleton" style={{ width: 300, height: 36, marginTop: 6 }} />
          </>
        ) : (
          <>
            <p className="dash-eyebrow">{greeting} 👋</p>
            <h1 className="dash-headline">
              Welcome back,{" "}
              <span className="gradient-text">{user?.name?.split(" ")[0] ?? "Musician"}</span>
            </h1>
            <p className="dash-sub">Here's what's happening with your transcriptions today.</p>
          </>
        )}
      </header>

      {/* ── Stat cards ── */}
      <section aria-label="Summary statistics" className="stats-grid">
        <StatCard
          icon={IconSheets}
          label="Total Transcriptions"
          value={loading ? "—" : totalCount}
          color="indigo"
          trend={{ direction: "up", label: "+2 this week" }}
        />
        <StatCard
          icon={IconMidi}
          label="Saved MIDI Files"
          value={loading ? "—" : exportCount}
          color="violet"
          trend={{ direction: "neutral", label: "No change" }}
        />
        <StatCard
          icon={IconQueue}
          label="Processing Queue"
          value={loading ? "—" : queueCount}
          color="amber"
          subtext={queueCount === 0 ? "Queue is empty" : undefined}
        />
      </section>

      {/* ── Quick actions ── */}
      <section aria-label="Quick actions" className="dashboard-section">
        <QuickActions />
      </section>

      {/* ── Recent transcriptions ── */}
      <section aria-label="Recent transcriptions" className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Recent Transcriptions</h2>
          <span className="section-badge">{totalCount} total</span>
        </div>
        <TranscriptionTable items={MOCK_TRANSCRIPTIONS} loading={loading} />
      </section>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .skeleton {
          border-radius: 0.5rem;
          background: linear-gradient(90deg,
            #e2e8f0 25%,
            #f1f5f9 50%,
            #e2e8f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s ease-in-out infinite;
        }

        /* ── Page layout ── */
        .dashboard-page {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        /* ── Hero ── */
        .dashboard-hero {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .dash-eyebrow {
          margin: 0;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-muted);
        }
        .dash-headline {
          margin: 0;
          font-size: clamp(1.6rem, 3vw, 2.25rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1.1;
          color: var(--text-primary);
        }
        .dash-sub {
          margin: 0.375rem 0 0;
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        /* ── Stats grid ── */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }

        /* ── Generic section ── */
        .dashboard-section {
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
        }

        /* ── Section header ── */
        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .section-title {
          margin: 0;
          font-size: 1.0625rem;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }
        .section-badge {
          font-size: 0.75rem;
          color: var(--text-muted);
          background: rgba(99,102,241,0.08);
          border: 1px solid rgba(99,102,241,0.18);
          border-radius: 9999px;
          padding: 0.2rem 0.65rem;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
