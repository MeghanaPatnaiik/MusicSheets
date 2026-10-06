"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

// ---------------------------------------------------------------------------
// Nav items
// ---------------------------------------------------------------------------

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    href: "/my-sheets",
    label: "My Sheet Music",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    ),
  },
  {
    href: "/upload",
    label: "Upload Audio",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
  },
  {
    href: "/settings",
    label: "Settings",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
        <path d="M12 2a10 10 0 0 1 7.07 2.93M12 2a10 10 0 0 0-7.07 2.93M12 22a10 10 0 0 1-7.07-2.93M12 22a10 10 0 0 0 7.07-2.93" />
      </svg>
    ),
  },
];

// ---------------------------------------------------------------------------
// Avatar helper
// ---------------------------------------------------------------------------
function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "linear-gradient(135deg, var(--accent-from), var(--accent-to))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.38,
        fontWeight: 700,
        color: "#fff",
        flexShrink: 0,
        letterSpacing: "-0.02em",
      }}
    >
      {initials}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sidebar component
// ---------------------------------------------------------------------------

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          aria-hidden="true"
          onClick={onClose}
        />
      )}

      <aside className={`sidebar${isOpen ? " sidebar--open" : ""}`} aria-label="Sidebar navigation">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon" aria-hidden="true">🎵</div>
          <span className="sidebar-logo-name gradient-text">MusicSheets</span>
        </div>

        {/* Nav links */}
        <nav className="sidebar-nav" aria-label="Primary">
          <p className="sidebar-section-label">Menu</p>
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link${active ? " sidebar-link--active" : ""}`}
                aria-current={active ? "page" : undefined}
                onClick={onClose}
              >
                <span className="sidebar-link-icon">{item.icon}</span>
                <span className="sidebar-link-label">{item.label}</span>
                {active && <span className="sidebar-active-dot" aria-hidden="true" />}
              </Link>
            );
          })}
        </nav>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* User profile section */}
        <div className="sidebar-profile">
          {user ? (
            <>
              <div className="sidebar-profile-info">
                <Avatar name={user.name} size={36} />
                <div className="sidebar-profile-text">
                  <p className="sidebar-profile-name">{user.name}</p>
                  <p className="sidebar-profile-email">{user.email}</p>
                </div>
              </div>
              <button
                id="sidebar-logout-btn"
                type="button"
                className="sidebar-logout-btn"
                onClick={handleLogout}
                aria-label="Log out of MusicSheets"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Log out
              </button>
            </>
          ) : (
            <div style={{ height: 72 }} />
          )}
        </div>
      </aside>

      <style>{`
        /* ── Sidebar shell ── */
        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          width: var(--sidebar-width);
          height: 100vh;
          display: flex;
          flex-direction: column;
          padding: 1.25rem 0.75rem;
          background: var(--bg-surface);
          border-right: 1px solid var(--glass-border);
          z-index: 40;
          overflow-y: auto;
          transition: transform 0.28s var(--ease-default);
        }

        /* ── Mobile: hidden off-screen, revealed via --open ── */
        @media (max-width: 767px) {
          .sidebar {
            transform: translateX(-100%);
          }
          .sidebar--open {
            transform: translateX(0);
            box-shadow: 4px 0 40px rgba(0, 0, 0, 0.12);
          }
        }

        /* ── Overlay behind sidebar on mobile ── */
        .sidebar-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.3);
          backdrop-filter: blur(2px);
          z-index: 39;
        }

        /* ── Logo ── */
        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.25rem 0.5rem 1.5rem;
          text-decoration: none;
        }
        .sidebar-logo-icon {
          width: 36px;
          height: 36px;
          border-radius: 0.625rem;
          background: linear-gradient(135deg, var(--accent-from), var(--accent-to));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          flex-shrink: 0;
          box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
        }
        .sidebar-logo-name {
          font-weight: 800;
          font-size: 1.0625rem;
          letter-spacing: -0.02em;
        }

        /* ── Section label ── */
        .sidebar-section-label {
          margin: 0 0 0.375rem 0.5rem;
          font-size: 0.6875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-subtle);
        }

        /* ── Nav ── */
        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        /* ── Nav link ── */
        .sidebar-link {
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.625rem 0.75rem;
          border-radius: 0.75rem;
          text-decoration: none;
          color: var(--text-muted);
          font-size: 0.9rem;
          font-weight: 500;
          transition: color 0.18s var(--ease-default),
                      background 0.18s var(--ease-default);
          overflow: hidden;
        }
        .sidebar-link:hover {
          color: var(--text-primary);
          background: rgba(15, 23, 42, 0.04);
        }
        .sidebar-link--active {
          color: var(--accent-from);
          background: rgba(99, 102, 241, 0.1);
          font-weight: 600;
        }
        .sidebar-link--active::before {
          content: "";
          position: absolute;
          left: 0;
          top: 20%;
          bottom: 20%;
          width: 3px;
          border-radius: 0 2px 2px 0;
          background: linear-gradient(to bottom, var(--accent-from), var(--accent-to));
        }
        .sidebar-link-icon {
          flex-shrink: 0;
          display: flex;
          align-items: center;
        }
        .sidebar-link-label {
          flex: 1;
        }
        .sidebar-active-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent-from);
          flex-shrink: 0;
        }

        /* ── Profile section ── */
        .sidebar-profile {
          border-top: 1px solid var(--glass-border);
          padding-top: 0.875rem;
          margin-top: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
        }
        .sidebar-profile-info {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0 0.25rem;
        }
        .sidebar-profile-text {
          min-width: 0;
        }
        .sidebar-profile-name {
          margin: 0;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sidebar-profile-email {
          margin: 0;
          font-size: 0.75rem;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ── Logout button ── */
        .sidebar-logout-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          border-radius: 0.625rem;
          border: 1px solid var(--glass-border);
          background: transparent;
          color: var(--text-muted);
          font-size: 0.8125rem;
          font-weight: 500;
          cursor: pointer;
          transition: border-color 0.18s var(--ease-default),
                      color 0.18s var(--ease-default),
                      background 0.18s var(--ease-default);
          width: 100%;
        }
        .sidebar-logout-btn:hover {
          border-color: rgba(220, 38, 38, 0.4);
          color: #dc2626;
          background: rgba(220, 38, 38, 0.06);
        }
      `}</style>
    </>
  );
}
