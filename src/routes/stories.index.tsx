import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import { Pagination, usePagination } from "@/components/site/Pagination";
import { CATEGORIES } from "@/content/categories";
import { storiesQueryOptions } from "@/sanity/queries";
import { fallbackStories, fromSanity, type StoryCard } from "@/lib/stories";

export const Route = createFileRoute("/stories/")({
  head: () => ({
    meta: [
      { title: "Stories — Eminent Magazine" },
      {
        name: "description",
        content:
          "Cover stories, style dispatches, interviews and culture reporting from Eminent Magazine — Awka's full-service media house.",
      },
      { property: "og:title", content: "Stories — Eminent Magazine" },
      { property: "og:description", content: "Editorial features, interviews and culture from Eminent Magazine." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/stories" }],
  }),
  component: StoriesPage,
});

const PAGE_SIZE = 9;

function StoriesPage() {
  const [filter, setFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  const { data } = useQuery({ ...storiesQueryOptions(), staleTime: 60_000 });

  const all: StoryCard[] = useMemo(() => {
    const published = (data ?? []).map((p) => fromSanity(p, 900, 1100));
    return published.length > 0 ? published : fallbackStories();
  }, [data]);

  const filtered = useMemo(
    () => (filter === "all" ? all : all.filter((s) => s.categorySlug === filter)),
    [all, filter],
  );

  const [lead, ...rest] = filtered;
  const pg = usePagination<StoryCard>(rest, page, PAGE_SIZE);

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="The archive"
        title="Stories that inspire."
        subtitle="Editorial features, style dispatches and interviews from across the continent — published straight from our newsroom."
      />

      <section className="container-editorial py-16">
        <div 
          className="flex flex-wrap gap-2 mb-12" 
          // data-reveal
        >
          {[{ slug: "all", label: "All" }, ...CATEGORIES.map((c) => ({ slug: c.slug, label: c.label }))].map((t) => (
            <button
              key={t.slug}
              onClick={() => { setFilter(t.slug); setPage(1); }}
              className={`px-4 py-2 text-xs uppercase tracking-[0.18em] border transition-colors cursor-pointer ${
                filter === t.slug
                  ? "bg-gold text-gold-foreground border-gold"
                  : "border-border hover:border-primary hover:text-primary"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-muted-foreground">No stories filed here yet. Check back soon.</p>
        )}

        {lead && (
          <Link
            to="/stories/$slug"
            params={{ slug: lead.slug }}
            className="group grid md:grid-cols-2 gap-8 items-center border-b border-border pb-16"
            // data-reveal
          >
            <div className="aspect-[4/3] overflow-hidden rounded-editorial bg-card">
              {lead.img && (
                <img
                  src={lead.img}
                  alt={lead.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
            </div>
            <div>
              <p className="eyebrow eyebrow-dot">{lead.categoryLabel}</p>
              <h2 className="font-display text-4xl md:text-5xl leading-tight mt-3 text-ivory group-hover:text-gold transition-colors">
                {lead.title}
              </h2>
              <p className="mt-5 text-muted-foreground leading-relaxed">{lead.excerpt}</p>
              <p className="mt-6 text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                {lead.author}{lead.date ? ` · ${lead.date}` : ""}
              </p>
              <span className="btn-ghost-ivory mt-8 inline-flex">
                Read the story <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        )}

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 mt-16">
          {pg.pageItems.map((s) => (
            <Link 
              key={s.slug} to="/stories/$slug" 
              params={{ slug: s.slug }} 
              className="group block" 
              // data-reveal
            >
              <div className="aspect-[4/5] overflow-hidden rounded-editorial bg-card">
                {s.img && (
                  <img
                    src={s.img}
                    alt={s.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                )}
              </div>
              <p className="mt-4 text-[10px] uppercase tracking-[0.28em] text-gold font-semibold">
                {s.categoryLabel}{s.date ? ` · ${s.date}` : ""}
              </p>
              <h3 className="font-display text-2xl leading-snug mt-2 text-ivory group-hover:text-gold transition-colors">
                {s.title}
              </h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">{s.excerpt}</p>
            </Link>
          ))}
        </div>

        <Pagination
          page={pg.page}
          totalPages={pg.totalPages}
          total={pg.total}
          start={pg.start}
          end={pg.end}
          pageSize={PAGE_SIZE}
          onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        />
      </section>

      <section className="bg-card border-t border-border">
        <div className="container-editorial py-20 text-center">
          <h2 className="font-display text-4xl md:text-5xl text-ivory">Want it in print?</h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
            Order this issue, past covers, or a full-year subscription from our store.
          </p>
          <Link to="/store" className="btn-red mt-8 inline-flex">
            Shop the magazine <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
