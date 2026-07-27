import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogOut, LayoutDashboard, Users, Crown, Receipt, Settings, MessageSquare, FileText } from "lucide-react";
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

  useEffect(() => {
    const token = getAdminToken();
    if (!token && pathname !== "/admin/login") {
      navigate({ to: "/admin/login" });
    } else {
      setReady(true);
    }
  }, [pathname, navigate]);

  if (pathname === "/admin/login") return <Outlet />;
  if (!ready) return null;

  function logout() {
    clearAdminToken();
    navigate({ to: "/admin/login" });
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <aside className="w-60 shrink-0 bg-ink text-ivory border-r border-ivory/10 flex flex-col">
        <div className="p-6 border-b border-ivory/10">
          <p className="font-display text-2xl">Eminent</p>
          <p className="text-[10px] tracking-[0.32em] uppercase text-gold">Admin</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 px-3 h-10 rounded-sm text-sm transition-colors ${active ? "bg-gold/15 text-gold" : "text-ivory/70 hover:text-ivory hover:bg-ivory/5"}`}
              >
                <Icon className="w-4 h-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <button onClick={logout} className="cursor-pointer flex items-center gap-3 px-6 h-14 border-t border-ivory/10 text-sm text-ivory/70 hover:text-gold">
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </aside>
      <main className="flex-1 min-w-0"><Outlet /></main>
    </div>
  );
}
