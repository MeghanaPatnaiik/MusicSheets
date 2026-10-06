"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { usePathname } from "next/navigation";

// ---------------------------------------------------------------------------
// Page title map
// ---------------------------------------------------------------------------
const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/my-sheets": "My Sheet Music",
  "/upload": "Upload Audio",
  "/settings": "Settings",
};

// ---------------------------------------------------------------------------
// Dashboard layout
// ---------------------------------------------------------------------------

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auth guard
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const pageTitle = PAGE_TITLES[pathname] ?? "Dashboard";

  // Show nothing while checking auth
  if (loading || (!loading && !user)) return null;

  return (
    <>
      <div className="app-shell">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main column */}
        <div className="app-main">
          <TopBar
            pageTitle={pageTitle}
            onMenuToggle={() => setSidebarOpen((prev) => !prev)}
            isSidebarOpen={sidebarOpen}
          />
          <main className="app-content" id="main-content" tabIndex={-1}>
            {children}
          </main>
        </div>
      </div>

      <style>{`
        /* ── App shell ── */
        .app-shell {
          display: flex;
          min-height: 100vh;
          background:
            radial-gradient(ellipse 70% 60% at 95% 5%, rgba(99,102,241,0.06) 0%, transparent 55%),
            radial-gradient(ellipse 50% 40% at 5% 90%, rgba(139,92,246,0.05) 0%, transparent 50%),
            var(--bg-base);
        }

        /* ── Main column (to the right of sidebar on desktop) ── */
        .app-main {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-width: 0;
          margin-left: var(--sidebar-width);
          transition: margin-left 0.28s var(--ease-default);
        }

        @media (max-width: 767px) {
          .app-main {
            margin-left: 0;
          }
        }

        /* ── Page content area ── */
        .app-content {
          flex: 1;
          padding: 2.5rem 2rem 3.5rem;
          max-width: 1100px;
          width: 100%;
        }

        @media (max-width: 640px) {
          .app-content {
            padding: 1.5rem 1rem 2.5rem;
          }
        }
      `}</style>
    </>
  );
}
