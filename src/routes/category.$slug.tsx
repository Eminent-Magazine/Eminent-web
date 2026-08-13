import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, ArrowRight, X } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { CATEGORIES, getCategory } from "@/content/categories";
import { getWorks, type WorkSample } from "@/content/works";

export const Route = createFileRoute("/category/$slug")({
  loader: ({ params }) => {
    const category = getCategory(params.slug);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Category not found · Eminent Magazine" }, { name: "robots", content: "noindex" }],
      };
    }
    const { label, description } = loaderData.category;
    const title = `${label} Portfolio — Eminent Magazine`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `/category/${params.slug}` },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/category/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: title,
            description,
            url: `/category/${params.slug}`,
          }),
        },
      ],
    };
  },
  notFoundComponent: CategoryNotFound,
  component: CategoryPage,
});

function CategoryNotFound() {
  return (
    <SiteLayout>
      <section className="container-editorial py-40 text-center">
        <p className="eyebrow eyebrow-dot mb-6 justify-center">404</p>
        <h1 className="font-display text-5xl md:text-7xl text-ivory">
          That shelf is <span className="italic text-gold">empty.</span>
        </h1>
        <p className="mt-6 text-muted-foreground">The category you're looking for doesn't exist.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} to="/category/$slug" params={{ slug: c.slug }} className="btn-ghost-ivory">
              {c.label}
            </Link>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const works = getWorks(category.slug);
  const [active, setActive] = useState<WorkSample | null>(null);
  const siblings = CATEGORIES.filter((c) => c.slug !== category.slug);

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden">
        <img src={category.hero} alt="" className="absolute inset-0 w-full h-full object-cover" fetchPriority="high" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/50 to-ink" />
        <div className="relative container-editorial pt-44 pb-16 md:pb-24">
          <p className="eyebrow eyebrow-dot mb-6" data-reveal>{category.kicker}</p>
          <h1 className="font-display text-ivory text-6xl md:text-8xl lg:text-[8.5rem] leading-[0.9]" data-reveal>
            {category.label}
          </h1>
          <p className="mt-8 max-w-2xl text-ivory/75 text-base md:text-lg leading-relaxed font-light" data-reveal>
            {category.description}
          </p>
          <p className="mt-8 text-[11px] uppercase tracking-[0.32em] text-gold font-semibold" data-reveal>
            {works.length} selected works
          </p>
        </div>
      </section>

      {/* WORK SAMPLES */}
      <section className="container-editorial py-20 md:py-28">
        <div className="mb-12" data-reveal>
          <p className="eyebrow eyebrow-dot mb-5">Selected work</p>
          <h2 className="font-display text-4xl md:text-6xl text-ivory leading-[0.95]">
            {category.label}, <span className="italic text-gold">in frames.</span>
          </h2>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 md:gap-8 [column-fill:_balance]">
          {works.map((w, i) => (
            <button
              key={`${w.title}-${i}`}
              type="button"
              onClick={() => setActive(w)}
              className="group mb-6 md:mb-8 block w-full break-inside-avoid text-left"
              // data-reveal
            >
              <div className="rounded-editorial overflow-hidden bg-card">
                <img
                  src={w.img}
                  alt={`${category.label} work sample — ${w.title}`}
                  className="w-full h-auto object-cover transition-transform duration-[900ms] group-hover:scale-[1.04]"
                  loading={i < 3 ? "eager" : "lazy"}
                />
              </div>
              <p className="mt-4 text-[10px] uppercase tracking-[0.28em] text-gold font-semibold">{w.meta}</p>
              <h3 className="mt-2 font-display text-2xl text-ivory leading-tight group-hover:text-gold transition-colors">
                {w.title}
              </h3>
            </button>
          ))}
        </div>
      </section>

      {/* LIGHTBOX */}
      {active && (
        <div
          className="fixed inset-0 z-[100] bg-ink/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
        >
          <button
            type="button"
            onClick={() => setActive(null)}
            className="absolute top-6 right-6 text-ivory/70 hover:text-gold transition-colors"
            aria-label="Close"
          >
            <X className="w-7 h-7" />
          </button>
          <figure className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={active.img} alt={active.title} className="w-full max-h-[78vh] object-contain" />
            <figcaption className="mt-4 text-center">
              <span className="block font-display text-2xl text-ivory">{active.title}</span>
              <span className="block mt-1 text-[10px] uppercase tracking-[0.28em] text-gold">{active.meta}</span>
            </figcaption>
          </figure>
        </div>
      )}

      {/* SIBLING CATEGORIES */}
      <section className="container-editorial py-20 md:py-28 border-t border-border">
        <p className="eyebrow eyebrow-dot mb-8" data-reveal>More portfolios</p>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {siblings.map((c) => (
            <li 
              key={c.slug} 
              // data-reveal
            >
              <Link
                to="/category/$slug"
                params={{ slug: c.slug }}
                className="group flex items-center justify-between gap-3 border border-ivory/12 px-5 py-6 hover:bg-ivory/[0.03] transition-colors"
              >
                <span className="font-display text-2xl text-ivory group-hover:text-gold transition-colors">
                  {c.label}
                </span>
                <ArrowUpRight className="w-4 h-4 text-ivory/50 group-hover:text-gold transition-colors" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-card">
        <div className="container-editorial py-24 text-center">
          <p className="eyebrow eyebrow-dot mb-6 justify-center">Your project next</p>
          <h2 className="font-display text-4xl md:text-6xl text-ivory leading-[1.02] max-w-3xl mx-auto">
            Want work like this in <span className="italic text-gold">{category.label}?</span>
          </h2>
          <div className="mt-10 flex flex-wrap justify-center gap-5">
            <Link to="/contact" className="btn-red">Book a session <ArrowRight className="w-3.5 h-3.5" /></Link>
            <Link to="/services" className="btn-ghost-ivory">See our services</Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}




// import { createFileRoute, Link, notFound } from "@tanstack/react-router";
// import { useEffect, useMemo, useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { ArrowUpRight, ArrowRight } from "lucide-react";
// import { SiteLayout } from "@/components/site/SiteLayout";
// import { Pagination, usePagination } from "@/components/site/Pagination";
// import { CATEGORIES, getCategory } from "@/content/categories";
// import { storiesQueryOptions } from "@/sanity/queries";
// import { fallbackStories, fromSanity, type StoryCard } from "@/lib/stories";


// export const Route = createFileRoute("/category/$slug")({
//   loader: ({ params }) => {
//     const category = getCategory(params.slug);
//     if (!category) throw notFound();
//     return { category };
//   },
//   head: ({ params, loaderData }) => {
//     if (!loaderData) {
//       return {
//         meta: [{ title: "Category not found · Eminent Magazine" }, { name: "robots", content: "noindex" }],
//       };
//     }
//     const { label, description } = loaderData.category;
//     const title = `${label} — Eminent Magazine`;
//     return {
//       meta: [
//         { title },
//         { name: "description", content: description },
//         { property: "og:title", content: title },
//         { property: "og:description", content: description },
//         { property: "og:type", content: "website" },
//         { property: "og:url", content: `/category/${params.slug}` },
//         { name: "twitter:card", content: "summary_large_image" },
//       ],
//       links: [{ rel: "canonical", href: `/category/${params.slug}` }],
//       scripts: [
//         {
//           type: "application/ld+json",
//           children: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "CollectionPage",
//             name: title,
//             description,
//             url: `/category/${params.slug}`,
//           }),
//         },
//       ],
//     };
//   },
//   notFoundComponent: CategoryNotFound,
//   component: CategoryPage,
// });

// function CategoryNotFound() {
//   return (
//     <SiteLayout>
//       <section className="container-editorial py-40 text-center">
//         <p className="eyebrow eyebrow-dot mb-6 justify-center">404</p>
//         <h1 className="font-display text-5xl md:text-7xl text-ivory">
//           That shelf is <span className="italic text-gold">empty.</span>
//         </h1>
//         <p className="mt-6 text-muted-foreground">The category you're looking for doesn't exist.</p>
//         <div className="mt-10 flex flex-wrap justify-center gap-4">
//           {CATEGORIES.map((c) => (
//             <Link key={c.slug} to="/category/$slug" params={{ slug: c.slug }} className="btn-ghost-ivory">
//               {c.label}
//             </Link>
//           ))}
//         </div>
//       </section>
//     </SiteLayout>
//   );
// }

// const PAGE_SIZE = 6;

// function CategoryPage() {
//   const { category } = Route.useLoaderData();
//   const [page, setPage] = useState(1);

//   useEffect(() => { setPage(1); }, [category.slug]);

//   const { data } = useQuery({ ...storiesQueryOptions(category.slug), staleTime: 60_000 });

//   const stories: StoryCard[] = useMemo(() => {
//     const published = (data ?? []).map((p) => fromSanity(p, 900, 1100));
//     return published.length > 0 ? published : fallbackStories(category.slug);
//   }, [data, category.slug]);

//   const [lead, ...rest] = stories;
//   const pg = usePagination<StoryCard>(rest, page, PAGE_SIZE);
//   const siblings = CATEGORIES.filter((c) => c.slug !== category.slug);


//   return (
//     <SiteLayout>
//       {/* HERO */}
//       <section className="relative min-h-[70vh] flex items-end overflow-hidden">
//         <img src={category.hero} alt="" className="absolute inset-0 w-full h-full object-cover" fetchPriority="high" />
//         <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/50 to-ink" />
//         <div className="relative container-editorial pt-44 pb-16 md:pb-24">
//           <p className="eyebrow eyebrow-dot mb-6" data-reveal>{category.kicker}</p>
//           <h1 className="font-display text-ivory text-6xl md:text-8xl lg:text-[8.5rem] leading-[0.9]" data-reveal>
//             {category.label}
//           </h1>
//           <p className="mt-8 max-w-2xl text-ivory/75 text-base md:text-lg leading-relaxed font-light" data-reveal>
//             {category.description}
//           </p>
//           <p className="mt-8 text-[11px] uppercase tracking-[0.32em] text-gold font-semibold" data-reveal>
//             {stories.length} stories filed
//           </p>
//         </div>
//       </section>

//       {/* LEAD STORY */}
//       {lead && (
//         <section className="container-editorial py-20 md:py-28 border-b border-border">
//           <div className="grid md:grid-cols-12 gap-10 items-center">
//             <Link
//               to="/stories/$slug"
//               params={{ slug: lead.slug }}
//               className="md:col-span-7 group block rounded-editorial aspect-[16/10] overflow-hidden bg-card"
//               data-reveal
//             >
//               <img
//                 src={lead.img}
//                 alt={lead.title}
//                 className="w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.04]"
//               />
//             </Link>
//             <div className="md:col-span-5" data-reveal>
//               <p className="eyebrow eyebrow-dot mb-5">Lead story</p>
//               <Link to="/stories/$slug" params={{ slug: lead.slug }} className="group">
//                 <h2 className="font-display text-4xl md:text-5xl text-ivory leading-[1.02] group-hover:text-gold transition-colors">
//                   {lead.title}
//                 </h2>
//               </Link>
//               <p className="mt-5 text-muted-foreground leading-relaxed">{lead.excerpt}</p>
//               <p className="mt-6 text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
//                 {lead.author} · {lead.date}
//               </p>
//               <Link
//                 to="/stories/$slug"
//                 params={{ slug: lead.slug }}
//                 className="btn-ghost-ivory mt-8 inline-flex"
//               >
//                 Read the story <ArrowRight className="w-3.5 h-3.5" />
//               </Link>
//             </div>
//           </div>
//         </section>
//       )}

//       {/* STORY GRID */}
//       {rest.length > 0 && (
//         <section className="container-editorial py-20 md:py-28">
//           <div 
//             className="flex items-end justify-between gap-6 mb-12" 
//             data-reveal
//           >
//             <div>
//               <p className="eyebrow eyebrow-dot mb-5">More in {category.label}</p>
//               <h2 className="font-display text-4xl md:text-6xl text-ivory leading-[0.95]">The archive.</h2>
//             </div>
//           </div>

//           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
//             {pg.pageItems.map((s) => (
//               <Link
//                 key={s.slug}
//                 to="/stories/$slug"
//                 params={{ slug: s.slug }}
//                 className="group block"
//                 data-reveal
//               >
//                 <div className="rounded-editorial aspect-[4/5] overflow-hidden bg-card">
//                   <img
//                     src={s.img}
//                     alt={s.title}
//                     className="w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.04]"
//                     loading="lazy"
//                   />
//                 </div>
//                 <p className="mt-4 text-[10px] uppercase tracking-[0.28em] text-gold font-semibold">
//                   {category.label} · {s.date}
//                 </p>
//                 <h3 className="mt-2 font-display text-2xl text-ivory leading-tight group-hover:text-gold transition-colors">
//                   {s.title}
//                 </h3>
//                 <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">{s.excerpt}</p>
//               </Link>
//             ))}
//           </div>

//           <Pagination
//             page={pg.page}
//             totalPages={pg.totalPages}
//             total={pg.total}
//             start={pg.start}
//             end={pg.end}
//             pageSize={PAGE_SIZE}
//             onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
//           />
//         </section>
//       )}

//       {/* SIBLING CATEGORIES */}
//       <section className="container-editorial py-20 md:py-28 border-t border-border">
//         <p className="eyebrow eyebrow-dot mb-8" data-reveal>Keep reading</p>
//         <ul className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
//           {siblings.map((c) => (
//             <li key={c.slug} data-reveal>
//               <Link
//                 to="/category/$slug"
//                 params={{ slug: c.slug }}
//                 className="group flex items-center justify-between gap-3 border border-ivory/12 px-5 py-6 hover:bg-ivory/[0.03] transition-colors"
//               >
//                 <span className="font-display text-2xl text-ivory group-hover:text-gold transition-colors">
//                   {c.label}
//                 </span>
//                 <ArrowUpRight className="w-4 h-4 text-ivory/50 group-hover:text-gold transition-colors" />
//               </Link>
//             </li>
//           ))}
//         </ul>
//       </section>

//       {/* CTA */}
//       <section className="border-t border-border bg-card">
//         <div className="container-editorial py-24 text-center">
//           <p className="eyebrow eyebrow-dot mb-6 justify-center">Your story next</p>
//           <h2 className="font-display text-4xl md:text-6xl text-ivory leading-[1.02] max-w-3xl mx-auto">
//             Want to be featured in <span className="italic text-gold">{category.label}?</span>
//           </h2>
//           <div className="mt-10 flex flex-wrap justify-center gap-5">
//             <Link to="/contact" className="btn-red">Pitch us <ArrowRight className="w-3.5 h-3.5" /></Link>
//             <Link to="/services" className="btn-ghost-ivory">See our services</Link>
//           </div>
//         </div>
//       </section>
//     </SiteLayout>
//   );
// }



// import { createFileRoute, Link } from "@tanstack/react-router";
// import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
// import { ArrowLeft } from "lucide-react";

// export const Route = createFileRoute("/category/$slug")({
//   head: ({ params }) => {
//     const label = titleize(params.slug);
//     return {
//       meta: [
//         { title: `${label} — Eminent Magazine` },
//         { name: "description", content: `Stories, features and interviews from ${label} on Eminent Magazine.` },
//         { property: "og:title", content: `${label} — Eminent Magazine` },
//         { property: "og:description", content: `Stories, features and interviews from ${label}.` },
//       ],
//     };
//   },
//   component: CategoryPage,
// });

// function titleize(slug: string) {
//   return slug.replace(/-/g, " & ").replace(/\b\w/g, (c) => c.toUpperCase());
// }

// function CategoryPage() {
//   const { slug } = Route.useParams();
//   const label = titleize(slug);
//   return (
//     <SiteLayout>
//       <PageHeader
//         eyebrow="Category"
//         title={label}
//         subtitle="A curated shelf of stories, interviews and photographic features. Fresh dispatches every other Sunday."
//       />
//       <section className="container-editorial py-28 text-center">
//         <p className="eyebrow eyebrow-dot mb-6 justify-center">Coming soon</p>
//         <h2 className="font-display text-4xl md:text-6xl text-ivory">
//           The <span className="italic text-gold">{label}</span> archive is being curated.
//         </h2>
//         <p className="mt-8 max-w-xl mx-auto text-muted-foreground">
//           Subscribe to the newsletter to be first when the archive opens.
//         </p>
//         <Link to="/" className="inline-flex items-center gap-2 mt-10 btn-ghost-ivory">
//           <ArrowLeft className="w-4 h-4" /> Back home
//         </Link>
//       </section>
//     </SiteLayout>
//   );
// }
