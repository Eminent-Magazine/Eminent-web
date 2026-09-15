import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Loader2,
  ArrowLeft,
  Share2,
  Crown,
  Users,
  TrendingUp,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { Public, ResultCandidate, type Candidate } from "@/lib/pageantApi";
import { VoteDialog } from "./vote.index";

// Fetch a candidate directly from the upstream API — safe to call server-side
// because there is no CORS restriction on a server-to-server request.
const UPSTREAM = import.meta.env.VITE_API_URL || "";
async function fetchCandidateSSR(id: string): Promise<Candidate | null> {
  if (!UPSTREAM) return null;
  try {
    const res = await fetch(`${UPSTREAM}/api/candidates/${encodeURIComponent(id)}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const json = await res.json();
    // Upstream returns { success, candidate: {...} } — no data wrapper
    return (json?.candidate ?? null) as Candidate | null;
  } catch {
    return null;
  }
}

export const Route = createFileRoute("/vote/$id")({
  loader: async ({ params }) => {
    const candidate = await fetchCandidateSSR(params.id);
    return { candidate };
  },
  head: ({ params, loaderData }) => {
    const c = loaderData?.candidate;
    const name = c?.name ?? "Contestant";
    const title = `Vote for ${name} · Face of Eminent Magazine`;
    const description = c?.bio
      ? c.bio.slice(0, 155).replace(/\s+/g, " ").trim() + "…"
      : `Cast your vote for ${name} in the Face of Eminent Magazine pageant.`;
    const image = c?.photo ?? undefined;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:type", content: "profile" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { name: "twitter:card", content: image ? "summary_large_image" : "summary" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        ...(image
          ? [
              { property: "og:image", content: image },
              { name: "twitter:image", content: image },
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: `/vote/${params.id}` }],
    };
  },
  component: ContestantPage,
});

function ContestantPage() {
  const { id } = Route.useParams();
  const q = useQuery({
    queryKey: ["candidate", id],
    queryFn: () => Public.candidate(id),
    refetchInterval: 30_000,
  });
  const resultsQ = useQuery({
    queryKey: ["results"],
    queryFn: Public.results,
    refetchInterval: 30_000,
  });
  const [voting, setVoting] = useState(false);

  const c = q.data?.candidate;
  const results = resultsQ.data?.results ?? [];
  const rank = c
    ? results?.[0]?.candidates.find((r: ResultCandidate) => r.candidateId === c._id)
    : 0;
  const totalVotes = results.reduce((sum: number, r: any) => sum + (r.votes ?? 0), 0);
  const share = c ? Number(((c.votes ?? 0) / Math.max(totalVotes, 1)) * 100).toFixed(1) : "0";

  return (
    <SiteLayout>
      <section className="container-editorial mt-4 sm:mt-6 md:mt-10 py-12 md:py-16">
        <Link
          to="/vote"
          className="cursor-pointer inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground hover:text-primary"
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
            <Link to="/vote" className="btn-primary mt-6 inline-flex">
              Back to voting
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-10 md:gap-14 md:grid-cols-2 md:items-stretch">
              {/* Photo — fills the full column height */}
              <div className="relative min-h-[420px] md:min-h-0 bg-muted overflow-hidden border border-border">
                {c.photo ? (
                  <img
                    src={c.photo}
                    alt={c.name}
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full grid place-items-center text-muted-foreground text-sm">
                    No photo
                  </div>
                )}
                {rank && rank.rank > 0 && rank?.rank <= 3 && (
                  <div className="absolute top-4 left-4 bg-ink text-ivory px-3 py-2 flex items-center gap-2">
                    <Crown className="w-4 h-4 text-gold" />
                    <span className="text-[10px] uppercase tracking-[0.28em]">
                      Rank #{rank?.rank}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                {c.category && <p className="eyebrow eyebrow-dot">{c.category}</p>}
                <h1 className="font-display text-5xl md:text-7xl mt-4 leading-[0.95]">{c.name}</h1>
                {c.age && <p className="mt-3 text-sm text-muted-foreground">Age {c.age}</p>}

                <div className="mt-8 grid grid-cols-3 gap-3">
                  <Stat
                    icon={<TrendingUp className="w-4 h-4" />}
                    label="Votes"
                    value={(c.votes ?? 0).toLocaleString()}
                  />
                  <Stat
                    icon={<Users className="w-4 h-4" />}
                    label="Vote share"
                    value={`${share}%`}
                  />
                  <Stat
                    icon={<Crown className="w-4 h-4" />}
                    label="Rank"
                    value={rank && rank.rank > 0 ? `#${rank.rank}` : "—"}
                  />
                </div>

                {c.bio && <BioAccordion bio={c.bio} />}

                <div className="mt-8 border border-gold/40 bg-gold/5 p-4 flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed text-foreground/85 space-y-1.5">
                    <p>
                      <strong className="text-foreground">
                        Do ensure this is who you want to vote for.
                      </strong>{" "}
                      No refund or reversal of vote if you choose a wrong contestant.
                    </p>
                    <p>
                      You can vote as many times as you want — every verified vote is credited to{" "}
                      <strong className="text-foreground">{c.name}</strong>.
                    </p>
                    <p>
                      By continuing you agree to our{" "}
                      <Link to="/terms" className="underline text-gold hover:opacity-80">
                        Terms & Conditions
                      </Link>
                      .
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setVoting(true)}
                    className="btn-ghost-ivory !rounded-none flex-1"
                  >
                    Vote for {c.name.split(" ")[0]}
                  </button>
                  <button
                    onClick={() =>
                      navigator
                        ?.share?.({
                          title: `Vote for ${c.name} · Face of Eminent`,
                          url: typeof window !== "undefined" ? window.location.href : "",
                        })
                        .catch(() => {
                          if (typeof navigator !== "undefined" && navigator.clipboard) {
                            navigator.clipboard.writeText(window.location.href);
                          }
                        })
                    }
                    className="btn-primary-ivory inline-flex items-center justify-center gap-2"
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

function BioAccordion({ bio }: { bio: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-8 border border-border">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-secondary/40 transition-colors"
      >
        <span className="eyebrow">Biography</span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? "max-h-[600px]" : "max-h-0"}`}
      >
        <p className="px-4 pb-4 pt-1 leading-relaxed text-foreground/90 whitespace-pre-line text-sm">
          {bio}
        </p>
      </div>
    </div>
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
