"use client";

interface TopBarProps {
  pageTitle: string;
  onMenuToggle: () => void;
  isSidebarOpen: boolean;
}

export default function TopBar({ pageTitle, onMenuToggle, isSidebarOpen }: TopBarProps) {
  return (
    <header className="topbar" role="banner">
      {/* Hamburger — mobile only */}
      <button
        id="topbar-menu-btn"
        type="button"
        className="topbar-menu-btn"
        aria-label={isSidebarOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isSidebarOpen}
        aria-controls="sidebar"
        onClick={onMenuToggle}
      >
        {isSidebarOpen ? (
          /* X icon */
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          /* Hamburger icon */
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>

      {/* Page title — desktop shows it in top bar, mobile shows logo */}
      <div className="topbar-title-area">
        {/* Mobile: MusicSheets logo */}
        <span className="topbar-mobile-logo">
          <span aria-hidden="true">🎵</span>
          <span className="gradient-text topbar-mobile-logo-text">MusicSheets</span>
        </span>
        {/* Desktop: page title breadcrumb */}
        <span className="topbar-page-title" aria-label={`Current page: ${pageTitle}`}>
          {pageTitle}
        </span>
      </div>

      {/* Right side spacer (reserved for future: search, notifications) */}
      <div className="topbar-right" aria-hidden="true" />

      <style>{`
        .topbar {
          position: sticky;
          top: 0;
          z-index: 30;
          height: var(--topbar-height);
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0 1.5rem;
          background: rgba(245, 246, 250, 0.85);
          border-bottom: 1px solid var(--glass-border);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
        }

        /* ── Hamburger (mobile only) ── */
        .topbar-menu-btn {
          display: none;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 0.625rem;
          border: 1px solid var(--glass-border);
          background: var(--glass-bg);
          color: var(--text-muted);
          cursor: pointer;
          flex-shrink: 0;
          transition: color 0.18s var(--ease-default),
                      background 0.18s var(--ease-default),
                      border-color 0.18s var(--ease-default);
        }
        .topbar-menu-btn:hover {
          color: var(--text-primary);
          background: rgba(15, 23, 42, 0.06);
          border-color: rgba(15, 23, 42, 0.14);
        }

        @media (max-width: 767px) {
          .topbar-menu-btn {
            display: flex;
          }
        }

        /* ── Title area ── */
        .topbar-title-area {
          display: flex;
          align-items: center;
          flex: 1;
          min-width: 0;
        }

        /* Mobile logo — shown only on small screens */
        .topbar-mobile-logo {
          display: none;
          align-items: center;
          gap: 0.5rem;
          font-size: 1rem;
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        .topbar-mobile-logo-text {
          font-size: 1rem;
        }

        /* Desktop page title — hidden on mobile */
        .topbar-page-title {
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--text-muted);
          letter-spacing: -0.01em;
        }

        @media (max-width: 767px) {
          .topbar-mobile-logo {
            display: flex;
          }
          .topbar-page-title {
            display: none;
          }
        }

        .topbar-right {
          flex-shrink: 0;
          width: 38px;
        }
        @media (max-width: 767px) {
          .topbar-right {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
