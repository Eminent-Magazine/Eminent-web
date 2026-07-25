import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, ArrowLeft, Share2, Crown, Users, TrendingUp, AlertTriangle } from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { Public } from "@/lib/pageantApi";
import { VoteDialog } from "./vote";

export const Route = createFileRoute("/vote/$id")({
  head: () => ({
    meta: [
      { title: "Contestant · Face of Eminent Magazine" },
      { name: "description", content: "Meet the contestant and cast your vote." },
      { property: "og:title", content: "Contestant · Face of Eminent Magazine" },
      { property: "og:description", content: "Meet the contestant and cast your vote." },
    ],
  }),
  component: ContestantPage,
});

function ContestantPage() {
  const { id } = Route.useParams();
  const q = useQuery({ queryKey: ["candidate", id], queryFn: () => Public.candidate(id), refetchInterval: 30_000 });
  const resultsQ = useQuery({ queryKey: ["results"], queryFn: Public.results, refetchInterval: 30_000 });
  const [voting, setVoting] = useState(false);

  const c = q.data?.candidate;
  const results = resultsQ.data?.results ?? [];
  const rank = c ? results.findIndex((r: any) => r._id === c._id) + 1 : 0;
  const totalVotes = results.reduce((sum: number, r: any) => sum + (r.votes ?? 0), 0);
  const share = c
    ? Number(((c.votes ?? 0) / Math.max(totalVotes, 1)) * 100).toFixed(1)
    : "0";

  return (
    <SiteLayout>
      <section className="container-editorial py-12 md:py-16">
        <Link
          to="/vote"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="w-4 h-4" /> Back to contestants
        </Link>

        {q.isLoading ? (
          <div className="py-32 text-center">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
          </div>
        ) : !c ? (
          <div className="py-32 text-center">
            <p className="text-muted-foreground">Contestant not found.</p>
            <Link to="/vote" className="btn-primary mt-6 inline-flex">Back to voting</Link>
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-10 md:gap-14 md:grid-cols-2">
              <div className="relative aspect-[3/4] bg-muted overflow-hidden border border-border">
                {c.photo ? (
                  <img src={c.photo} alt={c.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full grid place-items-center text-muted-foreground text-sm">No photo</div>
                )}
                {rank > 0 && rank <= 3 && (
                  <div className="absolute top-4 left-4 bg-ink text-ivory px-3 py-2 flex items-center gap-2">
                    <Crown className="w-4 h-4 text-gold" />
                    <span className="text-[10px] uppercase tracking-[0.28em]">Rank #{rank}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                {c.category && <p className="eyebrow eyebrow-dot">{c.category}</p>}
                <h1 className="font-display text-5xl md:text-7xl mt-4 leading-[0.95]">{c.name}</h1>
                {c.age && (
                  <p className="mt-3 text-sm text-muted-foreground">Age {c.age}</p>
                )}

                <div className="mt-8 grid grid-cols-3 gap-3">
                  <Stat icon={<TrendingUp className="w-4 h-4" />} label="Votes" value={(c.votes ?? 0).toLocaleString()} />
                  <Stat icon={<Users className="w-4 h-4" />} label="Vote share" value={`${share}%`} />
                  <Stat icon={<Crown className="w-4 h-4" />} label="Rank" value={rank > 0 ? `#${rank}` : "—"} />
                </div>

                {c.bio && (
                  <div className="mt-8">
                    <p className="eyebrow mb-3">Biography</p>
                    <p className="leading-relaxed text-foreground/90 whitespace-pre-line">{c.bio}</p>
                  </div>
                )}

                <div className="mt-8 border border-gold/40 bg-gold/5 p-4 flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed text-foreground/85 space-y-1.5">
                    <p><strong className="text-foreground">Do ensure this is who you want to vote for.</strong> No refund or reversal of vote if you choose a wrong contestant.</p>
                    <p>You can vote as many times as you want — every verified vote is credited to <strong className="text-foreground">{c.name}</strong>.</p>
                    <p>
                      By continuing you agree to our{" "}
                      <Link to="/terms" className="underline text-gold hover:opacity-80">Terms & Conditions</Link>.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button onClick={() => setVoting(true)} className="btn-primary flex-1">
                    Vote for {c.name.split(" ")[0]}
                  </button>
                  <button
                    onClick={() =>
                      navigator?.share?.({
                        title: `Vote for ${c.name} · Face of Eminent`,
                        url: typeof window !== "undefined" ? window.location.href : "",
                      }).catch(() => {
                        if (typeof navigator !== "undefined" && navigator.clipboard) {
                          navigator.clipboard.writeText(window.location.href);
                        }
                      })
                    }
                    className="btn-outline-gold inline-flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                </div>
                <p className="text-[11px] text-muted-foreground mt-4">
                  Votes credit only after verified payment. Standings refresh every 30 seconds.
                </p>

              </div>
            </div>
          </>
        )}
      </section>

      {c && voting && <VoteDialog contestant={c} onClose={() => setVoting(false)} />}
    </SiteLayout>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="border border-border p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-[10px] uppercase tracking-[0.24em]">{label}</span>
      </div>
      <p className="font-display text-2xl mt-2 tabular-nums">{value}</p>
    </div>
  );
}


// import { createFileRoute, Link } from "@tanstack/react-router";
// import { useQuery } from "@tanstack/react-query";
// import { Loader2, ArrowLeft } from "lucide-react";
// import { SiteLayout } from "@/components/site/SiteLayout";
// import { Public } from "@/lib/pageantApi";

// export const Route = createFileRoute("/vote/$id")({
//   head: () => ({
//     meta: [
//       { title: "Contestant · Face of Eminent Magazine" },
//       { name: "description", content: "Meet the contestant and cast your vote." },
//       { property: "og:title", content: "Contestant · Face of Eminent Magazine" },
//       { property: "og:description", content: "Meet the contestant and cast your vote." },
//     ],
//   }),
//   component: ContestantPage,
// });

// function ContestantPage() {
//   const { id } = Route.useParams();
//   const q = useQuery({ queryKey: ["candidate", id], queryFn: () => Public.candidate(id) });
//   const c = q.data?.candidate;

//   return (
//     <SiteLayout>
//       <section className="container-editorial py-16">
//         <Link to="/vote" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground hover:text-primary">
//           <ArrowLeft className="w-4 h-4" /> Back to contestants
//         </Link>

//         {q.isLoading ? (
//           <div className="py-24 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" /></div>
//         ) : !c ? (
//           <p className="py-24 text-center text-muted-foreground">Contestant not found.</p>
//         ) : (
//           <div className="mt-8 grid gap-12 md:grid-cols-2">
//             <div className="aspect-[3/4] bg-muted overflow-hidden border border-border">
//               {c.photo && <img src={c.photo} alt={c.name} className="w-full h-full object-cover" />}
//             </div>
//             <div>
//               {c.category && <p className="eyebrow">{c.category}</p>}
//               <h1 className="font-display text-5xl md:text-6xl mt-3">{c.name}</h1>
//               <p className="mt-4 text-sm text-muted-foreground">Age {c.age ?? "—"} · <strong className="text-foreground">{(c.votes ?? 0).toLocaleString()} votes</strong></p>
//               {c.bio && <p className="mt-6 leading-relaxed text-foreground/90">{c.bio}</p>}
//               <Link to="/vote" className="btn-primary-ivory mt-8 inline-flex">Vote for {c.name.split(" ")[0]}</Link>
//             </div>
//           </div>
//         )}
//       </section>
//     </SiteLayout>
//   );
// }
