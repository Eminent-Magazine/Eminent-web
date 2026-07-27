import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Share2, Crown, Check, Clock, Loader2 } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Public, type Candidate, type VotePackage } from "@/lib/pageantApi";
import pageant from "@/assets/pageant.jpg";

export const Route = createFileRoute("/vote/")({
  head: () => ({
    meta: [
      { title: "Vote · Face of Eminent Magazine" },
      { name: "description", content: "Cast your vote for Face of Eminent Magazine. Search contestants, buy vote bundles, and share your favourite in one tap." },
      { property: "og:title", content: "Vote · Face of Eminent Magazine" },
      { property: "og:description", content: "Voting is open. Find your contestant and vote in seconds." },
    ],
  }),
  component: VotePage,
});

function VotePage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [selected, setSelected] = useState<Candidate | null>(null);

  const candidatesQ = useQuery({
    queryKey: ["candidates", category],
    queryFn: () => (category === "all" ? Public.candidates() : Public.candidatesByCategory(category)),
    refetchInterval: 30_000,
  });
  const statsQ = useQuery({ queryKey: ["stats"], queryFn: Public.statistics, refetchInterval: 30_000 });
  const resultsQ = useQuery({ queryKey: ["results"], queryFn: Public.results, refetchInterval: 15_000 });

  const candidates = candidatesQ.data?.candidates ?? [];
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return candidates;
    return candidates.filter(
      (c) => c.name.toLowerCase().includes(q) || (c._id ?? "").toLowerCase().includes(q),
    );
  }, [query, candidates]);

  const categories = useMemo(() => {
    const s = new Set<string>();
    candidates.forEach((c) => c.category && s.add(c.category));
    return Array.from(s);
  }, [candidates]);

  const stats = statsQ.data?.statistics;
  const leaderboard = (resultsQ.data?.results?.[0]?.candidates ?? []).slice(0, 5);

  return (
    <SiteLayout>
      <section className="relative bg-ink text-ivory overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <img src={pageant} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/60 to-ink" />
        </div>
        <div className="container-editorial relative py-20 md:py-28 text-center">
          <p className="eyebrow !text-gold">Live Contest</p>
          <h1 className="mt-3 font-display text-5xl md:text-7xl">Face of Eminent <em className="text-gold">Magazine</em></h1>
          <p className="mt-5 max-w-2xl mx-auto text-ivory/80">
            Every vote is verified server-side and credited only after successful payment.
          </p>
          {stats && (
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
              <StatCard label="Total votes" value={stats.totalVotes} />
              <StatCard label="Contestants" value={stats.totalCandidates} />
              <StatCard label="Voters" value={stats.totalVoters} />
              <StatCard label="Transactions" value={stats.totalTransactions} />
            </div>
          )}
        </div>
      </section>

      {leaderboard.length > 0 && (
        <section className="container-editorial py-16">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="eyebrow">Top 5 · Live</p>
              <h2 className="font-display text-3xl md:text-4xl mt-2">Current standings</h2>
            </div>
          </div>
          <div className="border border-border">
            {leaderboard.map((c: any, i: number) => (
              <div key={c._id ?? i} className="flex items-center gap-4 px-4 md:px-6 py-4 border-b border-border last:border-0 hover:bg-secondary/40 transition-colors">
                <div className="w-8 text-center">
                  {i === 0 ? <Crown className="w-5 h-5 text-gold mx-auto" /> : <span className="font-display text-2xl text-muted-foreground">{i + 1}</span>}
                </div>
                {c.photo && <img src={c.photo} alt={c.name} className="w-12 h-12 object-cover rounded-full" loading="lazy" />}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.category ?? "—"}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-xl">{(c.votes ?? 0).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="container-editorial pb-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <p className="eyebrow">All contestants</p>
            <h2 className="font-display text-3xl md:text-4xl mt-2">Find your favourite</h2>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or ID…"
              className="w-full h-12 pl-10 pr-3 bg-card border border-input text-sm focus:outline-none focus:border-primary rounded-sm"
            />
          </div>
        </div>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <CatChip active={category === "all"} onClick={() => setCategory("all")}>All</CatChip>
            {categories.map((c) => (
              <CatChip key={c} active={category === c} onClick={() => setCategory(c)}>{c}</CatChip>
            ))}
          </div>
        )}

        {candidatesQ.isLoading ? (
          <div className="py-24 text-center text-muted-foreground"><Loader2 className="w-6 h-6 mx-auto animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <p className="text-center py-16 text-muted-foreground">
            {candidates.length === 0 ? "No contestants yet — check back soon." : `No contestants match "${query}"`}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((c) => (
              <article key={c._id} className="group bg-card border border-border hover-lift overflow-hidden">
                <Link to="/vote/$id" params={{ id: c._id }} className="block aspect-[3/4] overflow-hidden bg-muted relative">
                  {c.photo ? (
                    <img src={c.photo} alt={c.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-muted-foreground text-sm">No photo</div>
                  )}
                  {c.category && <div className="absolute top-3 left-3 bg-ink/80 text-ivory text-[10px] tracking-[0.2em] uppercase px-2 py-1">{c.category}</div>}
                </Link>
                <div className="p-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-display text-xl leading-tight truncate">{c.name}</h3>
                    <span className="text-xs text-muted-foreground">{(c.votes ?? 0).toLocaleString()}</span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => setSelected(c)} className="flex-1 btn-primary-ivory !py-2.5 !px-3 !text-[11px]">Vote</button>
                    <button
                      onClick={() => navigator?.share?.({ title: `Vote for ${c.name}`, url: window.location.href }).catch(() => { })}
                      className="w-10 h-10 grid place-items-center border border-input hover:border-primary hover:text-primary transition-colors"
                      aria-label="Share"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {selected && <VoteDialog contestant={selected} onClose={() => setSelected(null)} />}
    </SiteLayout>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-ivory/15 p-4">
      <p className="text-[10px] tracking-[0.28em] uppercase text-ivory/50">{label}</p>
      <p className="font-display text-3xl mt-1 text-gold">{Number(value ?? 0).toLocaleString()}</p>
    </div>
  );
}

function CatChip({ active, onClick, children }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-4 h-9 text-[11px] uppercase tracking-[0.24em] border transition-colors ${active ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary"}`}
    >
      {children}
    </button>
  );
}

export function VoteDialog({ contestant, onClose }: { contestant: Candidate; onClose: () => void }) {
  const packagesQ = useQuery({ queryKey: ["packages"], queryFn: Public.packages });
  const packages = packagesQ.data?.packages ?? [];
  const [bundle, setBundle] = useState<VotePackage | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const active = bundle ?? packages[Math.min(1, packages.length - 1)] ?? null;


  async function pay(method: "paystack" | "flutterwave") {
    if (!active || !name || !email || !phone) {
      setErr("Please fill in your name, email and phone.");
      return;
    }
    setErr(null);
    setLoading(true);
    try {
      const res = await Public.initVote({
        fullName: name,
        email,
        phone,
        candidateId: contestant._id,
        numberOfVotes: active.numberOfVotes,
        paymentMethod: method,
      });
      const url = res?.data?.authorization_url;
      if (!url) throw new Error("No payment URL returned");
      window.location.href = url;
    } catch (e: any) {
      setErr(e.message ?? "Failed to start payment");
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-background max-w-lg w-full border border-border shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-border flex items-center gap-4">
          {contestant.photo && <img src={contestant.photo} alt={contestant.name} className="w-14 h-14 rounded-full object-cover" />}
          <div>
            <p className="text-xs text-muted-foreground">Voting for</p>
            <h3 className="font-display text-2xl leading-tight">{contestant.name}</h3>
          </div>
        </div>
        <div className="p-6">
          <p className="eyebrow mb-3">Choose your bundle</p>
          {packagesQ.isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {packages.map((b) => (
                <button
                  key={b.numberOfVotes}
                  onClick={() => setBundle(b)}
                  className={`text-left border p-4 transition-colors ${active?.numberOfVotes === b.numberOfVotes ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                >
                  <p className="font-display text-2xl">{b.numberOfVotes} <span className="text-sm text-muted-foreground">votes</span></p>
                  <p className="text-sm mt-1">{b.currency === "NGN" ? "₦" : b.currency + " "}{b.price.toLocaleString()}</p>
                </button>
              ))}
            </div>
          )}
          <div className="mt-5 space-y-3">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full h-11 px-3 bg-card border border-input text-sm rounded-sm" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email (for receipt)" className="w-full h-11 px-3 bg-card border border-input text-sm rounded-sm" />
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="w-full h-11 px-3 bg-card border border-input text-sm rounded-sm" />
          </div>
          {err && <p className="text-xs text-destructive mt-3">{err}</p>}
          {active && (
            <div className="mt-5 flex items-center justify-between text-sm border-t border-border pt-4">
              <span className="text-muted-foreground">Total</span>
              <span className="font-display text-2xl">₦{active.price.toLocaleString()}</span>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2 mt-5">
            <button disabled={loading} onClick={() => pay("paystack")} className="btn-primary-white h-10">{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <img src={"/Paystack-Logo.png"} alt="pay with Paystack" className="h-20 object-center rounded-full" loading="lazy" />}</button>
            <button disabled={loading} onClick={() => pay("flutterwave")} className="btn-primary-white h-10">{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <img src={"/Flutterwave-Logo.png"} alt="pay with Flutterwave" className="h-20 object-center rounded-full" loading="lazy" />}</button>
          </div>
          <p className="text-[11px] text-muted-foreground text-center mt-3">Votes credit only after verified payment. No refunds on cast votes.</p>
        </div>
      </div>
    </div>
  );
}
