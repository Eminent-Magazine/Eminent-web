import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Admin } from "@/lib/pageantApi";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const q = useQuery({ queryKey: ["admin-stats"], queryFn: Admin.stats, refetchInterval: 15_000 });
  const s: any = q.data?.stats ?? {};

  return (
    <div className="p-10">
      <p className="eyebrow">Overview</p>
      <h1 className="font-display text-4xl mt-2">Dashboard</h1>
      {q.isLoading ? (
        <Loader2 className="w-6 h-6 animate-spin mt-8 text-muted-foreground" />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          {[
            ["Total votes", s.totalVotes],
            ["Contestants", s.totalCandidates],
            ["Applications", s.totalUsers ?? s.totalApplications],
            ["Transactions", s.totalTransactions],
            ["Revenue (₦)", s.totalRevenue],
            ["Approved", s.approvedUsers],
            ["Pending", s.pendingUsers],
            ["Rejected", s.rejectedUsers],
          ].map(([label, val]) => (
            <div key={label as string} className="border border-border p-5 bg-card">
              <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{label}</p>
              <p className="font-display text-3xl mt-2">{Number(val ?? 0).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
      {s.categoryStats?.length ? (
        <div className="mt-10">
          <p className="eyebrow mb-3">By category</p>
          <div className="border border-border">
            {s.categoryStats.map((c: any) => (
              <div key={c._id ?? c.category} className="flex justify-between px-5 py-3 border-b border-border last:border-0 text-sm">
                <span>{c._id ?? c.category}</span>
                <span className="text-muted-foreground">{c.count ?? c.total} · {(c.votes ?? 0).toLocaleString()} votes</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
