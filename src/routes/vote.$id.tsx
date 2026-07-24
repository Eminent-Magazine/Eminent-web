import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ArrowLeft } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Public } from "@/lib/pageantApi";

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
  const q = useQuery({ queryKey: ["candidate", id], queryFn: () => Public.candidate(id) });
  const c = q.data?.candidate;

  return (
    <SiteLayout>
      <section className="container-editorial py-16">
        <Link to="/vote" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground hover:text-primary">
          <ArrowLeft className="w-4 h-4" /> Back to contestants
        </Link>

        {q.isLoading ? (
          <div className="py-24 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" /></div>
        ) : !c ? (
          <p className="py-24 text-center text-muted-foreground">Contestant not found.</p>
        ) : (
          <div className="mt-8 grid gap-12 md:grid-cols-2">
            <div className="aspect-[3/4] bg-muted overflow-hidden border border-border">
              {c.photo && <img src={c.photo} alt={c.name} className="w-full h-full object-cover" />}
            </div>
            <div>
              {c.category && <p className="eyebrow">{c.category}</p>}
              <h1 className="font-display text-5xl md:text-6xl mt-3">{c.name}</h1>
              <p className="mt-4 text-sm text-muted-foreground">Age {c.age ?? "—"} · <strong className="text-foreground">{(c.votes ?? 0).toLocaleString()} votes</strong></p>
              {c.bio && <p className="mt-6 leading-relaxed text-foreground/90">{c.bio}</p>}
              <Link to="/vote" className="btn-primary mt-8 inline-flex">Vote for {c.name.split(" ")[0]}</Link>
            </div>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
