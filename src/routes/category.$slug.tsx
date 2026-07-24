import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/category/$slug")({
  head: ({ params }) => {
    const label = titleize(params.slug);
    return {
      meta: [
        { title: `${label} — Eminent Magazine` },
        { name: "description", content: `Stories, features and interviews from ${label} on Eminent Magazine.` },
        { property: "og:title", content: `${label} — Eminent Magazine` },
        { property: "og:description", content: `Stories, features and interviews from ${label}.` },
      ],
    };
  },
  component: CategoryPage,
});

function titleize(slug: string) {
  return slug.replace(/-/g, " & ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function CategoryPage() {
  const { slug } = Route.useParams();
  const label = titleize(slug);
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Category"
        title={label}
        subtitle="A curated shelf of stories, interviews and photographic features. Fresh dispatches every other Sunday."
      />
      <section className="container-editorial py-28 text-center">
        <p className="eyebrow eyebrow-dot mb-6 justify-center">Coming soon</p>
        <h2 className="font-display text-4xl md:text-6xl text-ivory">
          The <span className="italic text-gold">{label}</span> archive is being curated.
        </h2>
        <p className="mt-8 max-w-xl mx-auto text-muted-foreground">
          Subscribe to the newsletter to be first when the archive opens.
        </p>
        <Link to="/" className="inline-flex items-center gap-2 mt-10 btn-ghost-ivory">
          <ArrowLeft className="w-4 h-4" /> Back home
        </Link>
      </section>
    </SiteLayout>
  );
}
