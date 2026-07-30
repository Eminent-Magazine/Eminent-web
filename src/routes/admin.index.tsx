import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Admin } from "@/lib/pageantApi";
import { AnimatedGradient } from "@/components/ui/animated-gradient-with-svg";
import { motion } from "framer-motion";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

interface StatCardProps {
  title: string;
  value: string | number;
  colors: string[];
  delay: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, colors, delay }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: delay + 0.2 },
    },
  };
  const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      className="relative overflow-hidden bg-card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay }}
    >
      <AnimatedGradient colors={colors} speed={0.05} blur="medium" />
      <motion.div
        className="relative z-10 p-5 backdrop-blur-sm"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.p
          variants={item}
          className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground"
        >
          {title}
        </motion.p>
        <motion.p variants={item} className="font-display text-3xl mt-2">
          {Number(value ?? 0).toLocaleString()}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

function Dashboard() {
  const q = useQuery({ queryKey: ["admin-stats"], queryFn: Admin.stats, refetchInterval: 15_000 });
  const s: any = q.data ?? {};

  const stats: { label: string; value: any; colors: string[] }[] = [
    { label: "Total votes", value: s.votes?.total, colors: ["#3B82F6", "#60A5FA", "#93C5FD"] },
    { label: "Applications", value: s.users?.total, colors: ["#A78BFA", "#C4B5FD", "#818CF8"] },
    { label: "Revenue (₦)", value: s.revenue?.total, colors: ["#F59E0B", "#FCD34D", "#FBBF24"] },
    { label: "Approved", value: s.users?.approved, colors: ["#34D399", "#6EE7B7", "#10B981"] },
    { label: "Pending", value: s.users?.pending, colors: ["#FBBF24", "#FDE68A", "#F59E0B"] },
    { label: "Rejected", value: s.users?.rejected, colors: ["#F87171", "#FCA5A5", "#EF4444"] },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-10">
      <p className="eyebrow">Overview</p>
      <h1 className="font-display text-3xl sm:text-4xl mt-2">Dashboard</h1>
      {q.isLoading ? (
        <Loader2 className="w-6 h-6 animate-spin mt-8 text-muted-foreground" />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[120px] sm:auto-rows-[140px] gap-2 sm:gap-3 mt-8 sm:mt-10">
          {/* {stats.map((stat, i) => (
            <StatCard
              key={stat.label}
              title={stat.label}
              value={stat.value}
              colors={stat.colors}
              delay={i * 0.08}
            />
          ))} */}
          {/* Hero: Total votes — spans 2 cols, 2 rows */}
          <div className="col-span-2 row-span-1">
            <StatCard
              title="Total votes"
              value={s.votes?.total}
              colors={["#3B82F6", "#60A5FA", "#93C5FD"]}
              delay={0}
            />
          </div>

          {/* Revenue — spans 2 cols, 1 row */}
          <div className="col-span-2">
            <StatCard
              title="Revenue (₦)"
              value={s.revenue?.total}
              colors={["#F59E0B", "#FCD34D", "#FBBF24"]}
              delay={0.08}
            />
          </div>

          {/* Applications — standard */}
          <div>
            <StatCard
              title="Applications"
              value={s.users?.total}
              colors={["#A78BFA", "#C4B5FD", "#818CF8"]}
              delay={0.16}
            />
          </div>

          {/* Approved — standard */}
          <div>
            <StatCard
              title="Approved"
              value={s.users?.approved}
              colors={["#34D399", "#6EE7B7", "#10B981"]}
              delay={0.24}
            />
          </div>

          {/* Pending — standard */}
          <div>
            <StatCard
              title="Pending"
              value={s.users?.pending}
              colors={["#FBBF24", "#FDE68A", "#F59E0B"]}
              delay={0.32}
            />
          </div>

          {/* Rejected — standard */}
          <div>
            <StatCard
              title="Rejected"
              value={s.users?.rejected}
              colors={["#F87171", "#FCA5A5", "#EF4444"]}
              delay={0.4}
            />
          </div>
        </div>
      )}
      {s.categoryStats?.length ? (
        <div className="mt-10">
          <p className="eyebrow mb-3">By category</p>
          <div className="border border-border">
            {s.categoryStats.map((c: any) => (
              <div
                key={c._id ?? c.category}
                className="flex justify-between px-5 py-3 border-b border-border last:border-0 text-sm"
              >
                <span>{c._id ?? c.category}</span>
                <span className="text-muted-foreground">
                  {c.count ?? c.total} · {(c.votes ?? 0).toLocaleString()} votes
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}



// function Dashboard() {
//   const q = useQuery({ queryKey: ["admin-stats"], queryFn: Admin.stats, refetchInterval: 15_000 });
//   const s: any = q.data ?? {};

//   return (
//     <div className="p-10">
//       <p className="eyebrow">Overview</p>
//       <h1 className="font-display text-4xl mt-2">Dashboard</h1>
//       {q.isLoading ? (
//         <Loader2 className="w-6 h-6 animate-spin mt-8 text-muted-foreground" />
//       ) : (
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
//           {[
//             // ["Total votes", s.totalVotes],
//             // ["Contestants", s.totalCandidates],
//             // ["Applications", s.totalUsers ?? s.totalApplications],
//             // ["Transactions", s.totalTransactions],
//             // ["Revenue (₦)", s.totalRevenue],
//             // ["Approved", s.approvedUsers],
//             // ["Pending", s.pendingUsers],
//             // ["Rejected", s.rejectedUsers],
//             ["Total votes", s.votes?.total],
//             ["Applications", s.users?.total],
//             ["Revenue (₦)", s.revenue?.total],
//             ["Approved", s.users?.approved],
//             ["Pending", s.users?.pending],
//             ["Rejected", s.users?.rejected],
//           ].map(([label, val]) => (
//             <div key={label as string} className="border border-border p-5 bg-card">
//               <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{label}</p>
//               <p className="font-display text-3xl mt-2">{Number(val ?? 0).toLocaleString()}</p>
//             </div>
//           ))}
//         </div>
//       )}
//       {s.categoryStats?.length ? (
//         <div className="mt-10">
//           <p className="eyebrow mb-3">By category</p>
//           <div className="border border-border">
//             {s.categoryStats.map((c: any) => (
//               <div key={c._id ?? c.category} className="flex justify-between px-5 py-3 border-b border-border last:border-0 text-sm">
//                 <span>{c._id ?? c.category}</span>
//                 <span className="text-muted-foreground">{c.count ?? c.total} · {(c.votes ?? 0).toLocaleString()} votes</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       ) : null}
//     </div>
//   );
// }