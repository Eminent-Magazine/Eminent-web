import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PortableText } from "@portabletext/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { imageSrc } from "@/sanity/client";
import { fetchPost, fetchRelated } from "@/sanity/queries";
import { findFallbackStory, formatDate, fromSanity } from "@/lib/stories";

export const Route = createFileRoute("/stories/$slug")({
  loader: async ({ params }) => {
    const post = await fetchPost(params.slug).catch(() => null);
    return { post };
  },
  head: ({ params, loaderData }) => {
    const fallback = findFallbackStory(params.slug);
    const title = loaderData?.post?.title ?? fallback?.story.title ?? titleize(params.slug);
    const description =
      loaderData?.post?.excerpt ?? fallback?.story.excerpt ?? `${title} — a feature story from Eminent Magazine.`;
    const image = loaderData?.post?.coverImage ? imageSrc(loaderData.post.coverImage, 1200, 630) : undefined;
    return {
      meta: [
        { title: `${title} — Eminent Magazine` },
        { name: "description", content: description },
        { property: "og:title", content: `${title} — Eminent Magazine` },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(image
          ? [
              { property: "og:image", content: image },
              { name: "twitter:image", content: image },
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: `/stories/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: title,
            description,
            ...(image ? { image } : {}),
            author: { "@type": "Organization", name: "Eminent Magazine" },
            publisher: { "@type": "Organization", name: "Eminent Magazine" },
            datePublished: loaderData?.post?.publishedAt,
          }),
        },
      ],
    };
  },
  errorComponent: ({ error }) => (
    <SiteLayout>
      <section className="container-editorial py-40 text-center" role="alert">
        <h1 className="font-display text-4xl text-ivory">Something went wrong.</h1>
        <p className="mt-4 text-muted-foreground">{error.message}</p>
      </section>
    </SiteLayout>
  ),
  component: StoryPage,
});

function titleize(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const portableComponents = {
  types: {
    image: ({ value }: any) => {
      const src = imageSrc(value, 1400);
      if (!src) return null;
      return (
        <figure className="my-10">
          <img src={src} alt={value?.alt ?? ""} className="w-full rounded-editorial" loading="lazy" />
          {value?.alt && <figcaption className="mt-3 text-xs text-muted-foreground">{value.alt}</figcaption>}
        </figure>
      );
    },
  },
  block: {
    h2: ({ children }: any) => <h2 className="font-display text-3xl md:text-4xl text-ivory mt-14 mb-5">{children}</h2>,
    h3: ({ children }: any) => <h3 className="font-display text-2xl text-ivory mt-10 mb-4">{children}</h3>,
    blockquote: ({ children }: any) => (
      <blockquote className="my-10 border-l-2 border-gold pl-6 font-display text-2xl md:text-3xl text-ivory italic leading-snug">
        {children}
      </blockquote>
    ),
    normal: ({ children }: any) => <p className="mb-6 text-muted-foreground leading-[1.9]">{children}</p>,
  },
  marks: {
    link: ({ children, value }: any) => (
      <a href={value?.href} className="text-gold underline underline-offset-4" rel="noopener noreferrer">
        {children}
      </a>
    ),
  },
};

function StoryPage() {
  const { slug } = Route.useParams();
  const { post } = Route.useLoaderData();
  const fallback = findFallbackStory(slug);

  const { data: related } = useQuery({
    queryKey: ["sanity", "related", slug],
    queryFn: () => fetchRelated(post?.categorySlug, slug),
    staleTime: 60_000,
    enabled: Boolean(post),
  });

  const title = post?.title ?? fallback?.story.title ?? titleize(slug);
  const categoryLabel = post?.categoryTitle ?? fallback?.category.label ?? "Feature";
  const categorySlug = post?.categorySlug ?? fallback?.category.slug;
  const author = post?.author ?? fallback?.story.author ?? "Eminent Editorial";
  const date = post?.publishedAt ? formatDate(post.publishedAt) : fallback?.story.date ?? "";
  const cover = post?.coverImage ? imageSrc(post.coverImage, 1600, 900) : fallback?.story.img;

  return (
    <SiteLayout>
      <article>
        <header className="relative min-h-[60vh] flex items-end overflow-hidden">
          {cover && (
            <img src={cover} alt="" className="absolute inset-0 w-full h-full object-cover" fetchPriority="high" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/60 to-ink" />
          <div className="relative container-editorial pt-44 pb-16 max-w-4xl">
            {categorySlug ? (
              <Link to="/category/$slug" params={{ slug: categorySlug }} className="eyebrow eyebrow-dot mb-6 inline-flex">
                {categoryLabel}
              </Link>
            ) : (
              <p className="eyebrow eyebrow-dot mb-6">{categoryLabel}</p>
            )}
            <h1 className="font-display text-ivory text-4xl md:text-6xl lg:text-7xl leading-[1.02]">{title}</h1>
            <p className="mt-8 text-[11px] uppercase tracking-[0.28em] text-ivory/70">
              {author}{date ? ` · ${date}` : ""}{post?.readTime ? ` · ${post.readTime} read` : ""}
            </p>
          </div>
        </header>

        <section className="container-editorial py-16 md:py-24 max-w-3xl">
          {post?.excerpt && (
            <p className="font-display text-2xl md:text-3xl text-ivory leading-snug mb-12">{post.excerpt}</p>
          )}

          {post?.body?.length ? (
            <PortableText value={post.body} components={portableComponents as any} />
          ) : (
            <p className="text-muted-foreground text-lg leading-relaxed">
              {fallback?.story.excerpt ??
                "This story is being prepared for the next issue. Join the newsletter to be first to read it when it publishes."}
            </p>
          )}

          <div className="mt-16 flex flex-wrap gap-4">
            <Link to="/stories" className="btn-ghost-ivory inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> All stories
            </Link>
            {categorySlug && (
              <Link to="/category/$slug" params={{ slug: categorySlug }} className="btn-red inline-flex items-center gap-2">
                More {categoryLabel} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </section>

        {related && related.length > 0 && (
          <section className="container-editorial py-20 border-t border-border">
            <p className="eyebrow eyebrow-dot mb-10">Keep reading</p>
            <div className="grid sm:grid-cols-3 gap-8">
              {related.map((r) => {
                const card = fromSanity(r, 700, 850);
                return (
                  <Link key={card.slug} to="/stories/$slug" params={{ slug: card.slug }} className="group block">
                    <div className="aspect-[4/5] overflow-hidden rounded-editorial bg-card">
                      {card.img && (
                        <img
                          src={card.img}
                          alt={card.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                      )}
                    </div>
                    <h3 className="mt-4 font-display text-xl text-ivory group-hover:text-gold transition-colors">
                      {card.title}
                    </h3>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </article>
    </SiteLayout>
  );
}


// import { createFileRoute, Link } from "@tanstack/react-router";
// import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
// import { ArrowLeft } from "lucide-react";

// export const Route = createFileRoute("/stories/$slug")({
//   head: ({ params }) => {
//     const label = titleize(params.slug);
//     return {
//       meta: [
//         { title: `${label} — Eminent Magazine` },
//         { name: "description", content: `${label} — a feature story from Eminent Magazine.` },
//         { property: "og:title", content: `${label} — Eminent Magazine` },
//         { property: "og:description", content: `${label} — a feature story from Eminent Magazine.` },
//       ],
//     };
//   },
//   component: StoryPage,
// });

// function titleize(slug: string) {
//   return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
// }

// function StoryPage() {
//   const { slug } = Route.useParams();
//   const label = titleize(slug);
//   return (
//     <SiteLayout>
//       <PageHeader eyebrow="Feature" title={label} />
//       <section className="container-editorial py-24 max-w-3xl">
//         <p className="text-muted-foreground text-lg leading-relaxed">
//           This story is being prepared for the next issue. Follow us on the
//           newsletter to be first to read it when it publishes.
//         </p>
//         <Link to="/" className="inline-flex items-center gap-2 mt-10 btn-ghost-ivory">
//           <ArrowLeft className="w-4 h-4" /> Back home
//         </Link>
//       </section>
//     </SiteLayout>
//   );
// }
