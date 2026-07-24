import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/stories/$slug")({
  head: ({ params }) => {
    const label = titleize(params.slug);
    return {
      meta: [
        { title: `${label} — Eminent Magazine` },
        { name: "description", content: `${label} — a feature story from Eminent Magazine.` },
        { property: "og:title", content: `${label} — Eminent Magazine` },
        { property: "og:description", content: `${label} — a feature story from Eminent Magazine.` },
      ],
    };
  },
  component: StoryPage,
});

function titleize(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function StoryPage() {
  const { slug } = Route.useParams();
  const label = titleize(slug);
  return (
    <SiteLayout>
      <PageHeader eyebrow="Feature" title={label} />
      <section className="container-editorial py-24 max-w-3xl">
        <p className="text-muted-foreground text-lg leading-relaxed">
          This story is being prepared for the next issue. Follow us on the
          newsletter to be first to read it when it publishes.
        </p>
        <Link to="/" className="inline-flex items-center gap-2 mt-10 btn-ghost-ivory">
          <ArrowLeft className="w-4 h-4" /> Back home
        </Link>
      </section>
    </SiteLayout>
  );
}
