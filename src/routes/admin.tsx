import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogOut, LayoutDashboard, Users, Crown, Receipt, Settings, MessageSquare, FileText, Menu, X } from "lucide-react";
import { clearAdminToken, getAdminToken } from "@/lib/pageantApi";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin · Eminent" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

const NAV: { to: string; label: string; icon: any; exact?: boolean }[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/users", label: "Applications", icon: Users },
  { to: "/admin/contestants", label: "Contestants", icon: Crown },
  { to: "/admin/transactions", label: "Transactions", icon: Receipt },
  { to: "/admin/messages", label: "Messages", icon: MessageSquare },
  { to: "/admin/quotes", label: "Quotes", icon: FileText },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];


function AdminLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = getAdminToken();
    if (!token && pathname !== "/admin/login") {
      navigate({ to: "/admin/login" });
    } else {
      setReady(true);
    }
  }, [pathname, navigate]);

  // Close mobile drawer on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  if (pathname === "/admin/login") return <Outlet />;
  if (!ready) return null;

  function logout() {
    clearAdminToken();
    navigate({ to: "/admin/login" });
  }

  const SidebarInner = (
    <>
      <div className="p-6 border-b border-ivory/10 flex items-center justify-between">
        <div>
          <p className="font-display text-2xl">Eminent</p>
          <p className="text-[10px] tracking-[0.32em] uppercase text-gold">Admin</p>
        </div>
        <button
          onClick={() => setMenuOpen(false)}
          className="lg:hidden w-9 h-9 grid place-items-center border border-ivory/15 text-ivory/70 hover:text-ivory"
          aria-label="Close menu"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV.map((n) => {
          const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
          const Icon = n.icon;
          return (
            <Link
              key={n.to}
              to={n.to}
              className={`flex items-center gap-3 px-3 h-10 rounded-sm text-sm transition-colors ${active ? "bg-gold/15 text-gold" : "text-ivory/70 hover:text-ivory hover:bg-ivory/5"}`}
            >
              <Icon className="w-4 h-4 shrink-0" /> {n.label}
            </Link>
          );
        })}
      </nav>
      <button onClick={logout} className="flex items-center gap-3 px-6 h-14 border-t border-ivory/10 text-sm text-ivory/70 hover:text-gold">
        <LogOut className="w-4 h-4" /> Sign out
      </button>
    </>
  );

  const currentLabel = NAV.find((n) => (n.exact ? pathname === n.to : pathname.startsWith(n.to)))?.label ?? "Admin";

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 bg-ink text-ivory border-r border-ivory/10 flex-col">
        {SidebarInner}
      </aside>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/70 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <aside className="relative flex flex-col w-64 h-full bg-ink text-ivory border-r border-ivory/10">
            {SidebarInner}
          </aside>
        </div>
      )}

      <main className="flex-1 min-w-0 flex flex-col">
        {/* Mobile topbar */}
        <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between gap-3 px-4 h-14 bg-ink text-ivory border-b border-ivory/10">
          <button
            onClick={() => setMenuOpen(true)}
            className="w-10 h-10 grid place-items-center border border-ivory/15 hover:border-gold hover:text-gold"
            aria-label="Open menu"
          >
            <Menu className="w-4 h-4" />
          </button>
          <p className="text-sm tracking-[0.24em] uppercase text-ivory/80 truncate">{currentLabel}</p>
          <button onClick={logout} className="w-10 h-10 grid place-items-center text-ivory/70 hover:text-gold" aria-label="Sign out">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 min-w-0"><Outlet /></div>
      </main>
    </div>
  );
}
