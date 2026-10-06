import { ReactNode } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  /** "indigo" | "green" | "amber" | "violet" */
  color?: "indigo" | "green" | "amber" | "violet";
  trend?: { direction: "up" | "down" | "neutral"; label: string };
}

// ---------------------------------------------------------------------------
// Color map
// ---------------------------------------------------------------------------

const COLOR_MAP = {
  indigo: {
    iconBg: "rgba(99,102,241,0.12)",
    iconColor: "#6366f1",
    glow: "rgba(99,102,241,0.18)",
  },
  green: {
    iconBg: "rgba(22,163,74,0.12)",
    iconColor: "#16a34a",
    glow: "rgba(22,163,74,0.16)",
  },
  amber: {
    iconBg: "rgba(217,119,6,0.12)",
    iconColor: "#b45309",
    glow: "rgba(217,119,6,0.16)",
  },
  violet: {
    iconBg: "rgba(139,92,246,0.12)",
    iconColor: "#7c3aed",
    glow: "rgba(139,92,246,0.18)",
  },
};

const TREND_ICONS = {
  up: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  ),
  down: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  neutral: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
};

// ---------------------------------------------------------------------------
// StatCard component
// ---------------------------------------------------------------------------

export default function StatCard({ icon, label, value, subtext, color = "indigo", trend }: StatCardProps) {
  const { iconBg, iconColor, glow } = COLOR_MAP[color];

  const trendColorMap = { up: "#16a34a", down: "#dc2626", neutral: "#64748b" };
  const trendColor = trend ? trendColorMap[trend.direction] : undefined;

  return (
    <article
      className="stat-card glass-card"
      style={{ "--glow": glow } as React.CSSProperties}
      aria-label={`${label}: ${value}`}
    >
      {/* Icon */}
      <div
        className="stat-card-icon"
        style={{ background: iconBg, color: iconColor }}
        aria-hidden="true"
      >
        {icon}
      </div>

      {/* Content */}
      <div className="stat-card-body">
        <p className="stat-card-label">{label}</p>
        <p className="stat-card-value">{value}</p>
        {(subtext || trend) && (
          <div className="stat-card-footer">
            {trend && (
              <span className="stat-card-trend" style={{ color: trendColor }}>
                {TREND_ICONS[trend.direction]}
                {trend.label}
              </span>
            )}
            {subtext && !trend && (
              <span className="stat-card-subtext">{subtext}</span>
            )}
          </div>
        )}
      </div>

      <style>{`
        .stat-card {
          padding: 1.375rem 1.25rem;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          transition: transform 0.2s var(--ease-default),
                      box-shadow 0.2s var(--ease-default);
          position: relative;
          overflow: hidden;
        }
        .stat-card::after {
          content: "";
          position: absolute;
          bottom: -20px;
          right: -20px;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: var(--glow);
          filter: blur(18px);
          pointer-events: none;
        }
        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 28px rgba(15, 23, 42, 0.10);
        }

        .stat-card-icon {
          width: 46px;
          height: 46px;
          border-radius: 0.875rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-card-body {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
          min-width: 0;
        }

        .stat-card-label {
          margin: 0;
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--text-muted);
          letter-spacing: 0.01em;
        }

        .stat-card-value {
          margin: 0;
          font-size: 1.875rem;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.04em;
          line-height: 1.15;
        }

        .stat-card-footer {
          margin-top: 0.25rem;
        }

        .stat-card-trend {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .stat-card-subtext {
          font-size: 0.75rem;
          color: var(--text-subtle);
        }
      `}</style>
    </article>
  );
}
