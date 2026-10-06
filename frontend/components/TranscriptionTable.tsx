// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TranscriptionStatus = "ready" | "processing" | "exported" | "failed";

export interface Transcription {
  id: string;
  title: string;
  source: string;          // e.g. "Recording_042.mp3"
  date: string;            // ISO date string
  duration: string;        // e.g. "3:42"
  status: TranscriptionStatus;
}

// ---------------------------------------------------------------------------
// Status badge
// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status: TranscriptionStatus }) {
  const label: Record<TranscriptionStatus, string> = {
    ready:      "Ready",
    processing: "Processing",
    exported:   "Exported",
    failed:     "Failed",
  };

  return (
    <span className={`status-badge status-badge--${status}`} role="status" aria-label={`Status: ${label[status]}`}>
      {status === "processing" && (
        <span className="status-pulse" aria-hidden="true" />
      )}
      {label[status]}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Format date helper
// ---------------------------------------------------------------------------
function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ---------------------------------------------------------------------------
// TranscriptionTable component
// ---------------------------------------------------------------------------

interface TranscriptionTableProps {
  items: Transcription[];
  loading?: boolean;
}

function SkeletonRow() {
  const pulse = {
    display: "block",
    height: "0.875rem",
    borderRadius: "0.375rem",
    background: "linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.4s ease-in-out infinite",
  } as React.CSSProperties;

  return (
    <tr className="table-row" aria-hidden="true">
      <td className="table-cell"><span style={{ ...pulse, width: "60%" }} /></td>
      <td className="table-cell table-cell--desktop"><span style={{ ...pulse, width: "70%" }} /></td>
      <td className="table-cell table-cell--desktop"><span style={{ ...pulse, width: "40%" }} /></td>
      <td className="table-cell table-cell--desktop"><span style={{ ...pulse, width: "50%" }} /></td>
      <td className="table-cell"><span style={{ ...pulse, width: "64px", height: "1.5rem", borderRadius: "9999px" }} /></td>
    </tr>
  );
}

export default function TranscriptionTable({ items, loading = false }: TranscriptionTableProps) {
  return (
    <div className="table-wrapper">
      <table className="transcription-table" aria-label="Recent transcriptions">
        <thead>
          <tr className="table-head-row">
            <th className="table-th" scope="col">Title</th>
            <th className="table-th table-cell--desktop" scope="col">Source File</th>
            <th className="table-th table-cell--desktop" scope="col">Date</th>
            <th className="table-th table-cell--desktop" scope="col">Duration</th>
            <th className="table-th" scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
            : items.map((item) => (
              <tr key={item.id} className="table-row">
                <td className="table-cell">
                  <div className="table-title-cell">
                    <span className="table-music-icon" aria-hidden="true">🎼</span>
                    <div>
                      <p className="table-title">{item.title}</p>
                      {/* Mobile: show source below title */}
                      <p className="table-source-mobile">{item.source}</p>
                    </div>
                  </div>
                </td>
                <td className="table-cell table-cell--desktop">
                  <span className="table-source">{item.source}</span>
                </td>
                <td className="table-cell table-cell--desktop">
                  <span className="table-date">{formatDate(item.date)}</span>
                </td>
                <td className="table-cell table-cell--desktop">
                  <span className="table-duration">{item.duration}</span>
                </td>
                <td className="table-cell">
                  <StatusBadge status={item.status} />
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {!loading && items.length === 0 && (
        <div className="table-empty">
          <span aria-hidden="true" style={{ fontSize: "2rem" }}>🎼</span>
          <p className="table-empty-title">No transcriptions yet</p>
          <p className="table-empty-sub">Upload a piano recording to get started.</p>
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ── Table wrapper ── */
        .table-wrapper {
          width: 100%;
          overflow-x: auto;
          border-radius: 1.25rem;
          border: 1px solid var(--glass-border);
          background: var(--glass-bg);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }

        /* ── Table ── */
        .transcription-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 380px;
        }

        .table-head-row {
          border-bottom: 1px solid var(--glass-border);
        }

        .table-th {
          padding: 0.875rem 1.25rem;
          text-align: left;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: var(--text-subtle);
        }

        .table-row {
          border-bottom: 1px solid rgba(15, 23, 42, 0.06);
          transition: background 0.15s var(--ease-default);
        }
        .table-row:last-child {
          border-bottom: none;
        }
        .table-row:hover {
          background: rgba(99, 102, 241, 0.04);
        }

        .table-cell {
          padding: 1rem 1.25rem;
          vertical-align: middle;
        }

        /* Hide on mobile */
        .table-cell--desktop {
          display: table-cell;
        }
        @media (max-width: 640px) {
          .table-cell--desktop {
            display: none;
          }
        }

        /* ── Title cell ── */
        .table-title-cell {
          display: flex;
          align-items: center;
          gap: 0.625rem;
        }
        .table-music-icon {
          font-size: 1.25rem;
          line-height: 1;
          flex-shrink: 0;
        }
        .table-title {
          margin: 0;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .table-source-mobile {
          margin: 0;
          font-size: 0.75rem;
          color: var(--text-muted);
          display: none;
        }
        @media (max-width: 640px) {
          .table-source-mobile { display: block; }
        }

        .table-source {
          font-size: 0.8125rem;
          color: var(--text-muted);
          font-family: ui-monospace, 'Cascadia Code', monospace;
        }
        .table-date {
          font-size: 0.8125rem;
          color: var(--text-muted);
        }
        .table-duration {
          font-size: 0.8125rem;
          color: var(--text-muted);
          font-variant-numeric: tabular-nums;
        }

        /* ── Status badges ── */
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.25rem 0.7rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          white-space: nowrap;
          border: 1px solid transparent;
        }
        .status-badge--ready {
          background: var(--status-ready-bg);
          border-color: var(--status-ready-border);
          color: var(--status-ready-text);
        }
        .status-badge--processing {
          background: var(--status-processing-bg);
          border-color: var(--status-processing-border);
          color: var(--status-processing-text);
        }
        .status-badge--exported {
          background: var(--status-exported-bg);
          border-color: var(--status-exported-border);
          color: var(--status-exported-text);
        }
        .status-badge--failed {
          background: var(--status-failed-bg);
          border-color: var(--status-failed-border);
          color: var(--status-failed-text);
        }

        /* ── Processing pulse dot ── */
        .status-pulse {
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--status-processing-text);
          animation: pulse-ring 1.5s ease-in-out infinite;
        }
        @keyframes pulse-ring {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.75); }
        }

        /* ── Empty state ── */
        .table-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 3rem 2rem;
          text-align: center;
        }
        .table-empty-title {
          margin: 0;
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .table-empty-sub {
          margin: 0;
          font-size: 0.8125rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
