"use client";

import { useRouter } from "next/navigation";

export default function QuickActions() {
  const router = useRouter();

  return (
    <div className="quick-actions-card glass-card">
      {/* Left: text */}
      <div className="qa-text">
        <p className="qa-eyebrow">Get started</p>
        <h2 className="qa-title">Transcribe a new recording</h2>
        <p className="qa-sub">
          Upload a piano audio file and let MusicSheets convert it into editable sheet music, MIDI, and visual keynotes in seconds.
        </p>
      </div>

      {/* Right: actions */}
      <div className="qa-actions">
        <button
          id="qa-upload-btn"
          type="button"
          className="btn-primary qa-btn-primary"
          onClick={() => router.push("/upload")}
          aria-label="Upload a new audio recording"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Upload New Recording
        </button>

        <div className="qa-secondary-actions">
          <button
            id="qa-sheets-btn"
            type="button"
            className="qa-chip"
            onClick={() => router.push("/my-sheets")}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
            </svg>
            Browse My Sheets
          </button>
          <button
            id="qa-midi-btn"
            type="button"
            className="qa-chip"
            onClick={() => {/* future: open MIDI export flow */}}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export to MIDI
          </button>
        </div>
      </div>

      <style>{`
        .quick-actions-card {
          padding: 1.75rem;
          display: flex;
          align-items: center;
          gap: 2rem;
          position: relative;
          overflow: hidden;
        }

        /* Decorative glow blob */
        .quick-actions-card::before {
          content: "";
          position: absolute;
          top: -30px;
          right: -30px;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%);
          pointer-events: none;
        }

        @media (max-width: 640px) {
          .quick-actions-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 1.25rem;
          }
        }

        /* ── Text ── */
        .qa-text {
          flex: 1;
          min-width: 0;
        }
        .qa-eyebrow {
          margin: 0 0 0.25rem;
          font-size: 0.6875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--accent-from);
        }
        .qa-title {
          margin: 0 0 0.5rem;
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }
        .qa-sub {
          margin: 0;
          font-size: 0.875rem;
          color: var(--text-muted);
          line-height: 1.6;
        }

        /* ── Actions ── */
        .qa-actions {
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
          flex-shrink: 0;
          width: 220px;
        }
        @media (max-width: 640px) {
          .qa-actions {
            width: 100%;
          }
        }

        .qa-btn-primary {
          width: 100%;
          gap: 0.5rem;
          font-size: 0.875rem;
          padding: 0.625rem 1.25rem;
          border-radius: 0.75rem;
        }

        .qa-secondary-actions {
          display: flex;
          gap: 0.5rem;
        }

        .qa-chip {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          padding: 0.45rem 0.75rem;
          border-radius: 0.625rem;
          border: 1px solid var(--glass-border);
          background: rgba(255, 255, 255, 0.9);
          color: var(--text-muted);
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: border-color 0.18s var(--ease-default),
                      color 0.18s var(--ease-default),
                      background 0.18s var(--ease-default);
          white-space: nowrap;
        }
        .qa-chip:hover {
          border-color: rgba(99, 102, 241, 0.3);
          color: var(--accent-from);
          background: rgba(99, 102, 241, 0.06);
        }
      `}</style>
    </div>
  );
}
