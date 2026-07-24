import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import hero from "@/assets/em-hero.jpg";
import storyFashion from "@/assets/em-story-fashion.jpg";
import storyPhoto from "@/assets/em-story-photo.jpg";
import storyModel from "@/assets/em-story-model.jpg";
import storyCulture from "@/assets/em-story-culture.jpg";
import storyLifestyle from "@/assets/em-story-lifestyle.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Eminent Magazine — Stories Worth Telling" },
      {
        name: "description",
        content:
          "A multi-category publication covering fashion, lifestyle, entertainment, photography, modelling, media and PR. Bold visuals. Sharp storytelling.",
      },
      { property: "og:title", content: "Eminent Magazine — Stories Worth Telling" },
      {
        property: "og:description",
        content: "Fashion, culture and everything in between — filed by Eminent Magazine.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const FEATURED = [
  { img: storyFashion, cat: "Fashion", title: "The New Faces of Fashion Week", slug: "new-faces-fashion-week" },
  { img: storyPhoto, cat: "Photography", title: "Behind the Lens: Studio Sessions", slug: "behind-the-lens" },
  { img: storyModel, cat: "Modelling", title: "On the Rise: Model Spotlight", slug: "on-the-rise" },
  { img: storyCulture, cat: "Entertainment", title: "Culture Now: What's Trending", slug: "culture-now" },
];

const CATEGORIES = [
  { n: "01", label: "Fashion", img: storyFashion, slug: "fashion" },
  { n: "02", label: "Lifestyle", img: storyLifestyle, slug: "lifestyle" },
  { n: "03", label: "Entertainment", img: storyCulture, slug: "entertainment" },
  { n: "04", label: "Photography", img: storyPhoto, slug: "photography" },
  { n: "05", label: "Modelling", img: storyModel, slug: "modelling" },
  { n: "06", label: "Media & PR", img: hero, slug: "media-pr" },
];

const QUOTES = [
  {
    text: "Working with Eminent was an incredible experience. Their creative direction and storytelling brought our brand to life in ways we couldn't have imagined — the final feature exceeded every expectation.",
    name: "Adaeze Okoye",
    role: "Creative Director, Maison Ada",
    avatar: storyModel,
  },
  {
    text: "Eminent doesn't just document culture — they define the standard of what African luxury is to the world. A team that treats every shoot like a cover.",
    name: "Ifeoma Abara",
    role: "Senior Editor, Vogue Africa",
    avatar: storyCulture,
  },
  {
    text: "From concept to publication, they made our launch feel like an event. Sharp eye, sharper writing. We've never had press this good.",
    name: "Kofi Mensah",
    role: "Founder, Ori Studio",
    avatar: storyPhoto,
  },
];

const RECOGNITION = [
  ["Best Digital Fashion Publication", "Fashion Week Diaries — Fashion — 2024"],
  ["International Photography Awards (IPA)", "Behind the Lens — Photography — 2024"],
  ["PR Week Media Award", "Culture Now — Media & PR — 2024"],
  ["African Entertainment Awards", "Rising Stars — Entertainment — 2024"],
  ["Model Industry Recognition", "On the Rise — Modelling — 2024"],
];

const LATEST = [
  { img: storyPhoto, title: "Studio Lighting Secrets from Top Photographers", date: "Nov 12, 2026" },
  { img: storyFashion, title: "Front Row: This Season's Must-See Looks", date: "Nov 08, 2026" },
  { img: storyModel, title: "Rising Model to Watch This Year", date: "Nov 02, 2026" },
  { img: storyLifestyle, title: "Inside the Quiet Luxury Movement", date: "Oct 28, 2026" },
  { img: storyCulture, title: "Red Carpet: Awards Season Recap", date: "Oct 20, 2026" },
];

function HomePage() {
  const [quoteIdx, setQuoteIdx] = useState(0);
  const q = QUOTES[quoteIdx];

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative min-h-screen w-full overflow-hidden">
        <img
          src={hero}
          alt="Eminent Magazine cover story"
          className="absolute inset-0 w-full h-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/30 to-ink" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 70% 40%, rgba(200,30,46,0.35), transparent 60%)",
          }}
        />

        <div className="relative container-editorial min-h-screen flex flex-col justify-end pb-20 md:pb-28 pt-40">
          <div className="max-w-5xl">
            <p className="eyebrow eyebrow-dot mb-8" data-reveal>
              Issue 048 · Latest
            </p>
            <h1
              className="font-display text-ivory text-6xl sm:text-7xl md:text-8xl lg:text-[9.5rem] leading-[0.9] tracking-tight"
              data-reveal
            >
              Stories worth
              <br />
              <span className="italic text-gold">telling.</span>
            </h1>
            <p
              className="mt-10 text-ivory/75 max-w-xl text-base md:text-lg leading-relaxed font-light"
              data-reveal
            >
              Capturing <span className="text-gold">fashion</span>,{" "}
              <span className="text-gold">culture</span> and{" "}
              <span className="text-gold">entertainment</span> — filed by Eminent Magazine, a multi-category publication for the people shaping culture today.
            </p>
            <div className="mt-12 flex flex-wrap items-center gap-6" data-reveal>
              <a href="#subscribe" className="btn-red">
                Subscribe <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <a href="#featured" className="btn-ghost-ivory">
                Read the issue
              </a>
            </div>
          </div>
        </div>

        {/* scroll ticker at bottom */}
        <div className="absolute bottom-0 inset-x-0 border-t border-ivory/10 py-4 overflow-hidden">
          <div className="marquee-track text-ivory/40 text-[11px] uppercase tracking-[0.4em]">
            {Array.from({ length: 2 }).map((_, i) => (
              <span key={i} className="flex items-center gap-8 pr-8">
                <span>Fashion</span><span className="text-gold">·</span>
                <span>Lifestyle</span><span className="text-gold">·</span>
                <span>Entertainment</span><span className="text-gold">·</span>
                <span>Photography</span><span className="text-gold">·</span>
                <span>Modelling</span><span className="text-gold">·</span>
                <span>Media & PR</span><span className="text-gold">·</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="container-editorial py-28 md:py-40">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-4" data-reveal>
            <p className="eyebrow eyebrow-dot">About</p>
            <h2 className="mt-6 font-display text-5xl md:text-6xl text-ivory leading-[0.95]">
              A house for the people shaping culture.
            </h2>
          </div>
          <div className="md:col-span-7 md:col-start-6 space-y-6 text-muted-foreground text-base md:text-lg leading-relaxed" data-reveal>
            <p>
              Eminent Magazine is a multi-category publication covering fashion,
              lifestyle, entertainment, photography, modelling, media and PR. We
              spotlight the people, brands, and moments shaping culture today —
              told through bold visuals and sharp storytelling. From runway to
              red carpet, studio to street, every issue is a curated look at
              what matters now.
            </p>
            <p>
              We believe every story deserves to be seen with the same craft as
              the moment it captures. Our editorial team works closely with
              photographers, stylists, models and brands to produce features
              that are as visually striking as they are substantive. Your story
              deserves the spotlight — let us tell it.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED STORIES */}
      <section id="featured" className="py-28 md:py-36 border-t border-border">
        <div className="container-editorial flex items-end justify-between gap-6 mb-14" data-reveal>
          <div>
            <p className="eyebrow eyebrow-dot mb-5">Featured Stories</p>
            <h2 className="font-display text-5xl md:text-7xl text-ivory leading-[0.95]">
              This issue.
            </h2>
          </div>
          <Link
            to="/magazine"
            className="hidden sm:inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-ivory hover:text-gold transition-colors font-semibold"
          >
            View all <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto no-scrollbar" data-reveal>
          <div className="flex gap-6 md:gap-8 px-6 md:px-12 pb-4 snap-x snap-mandatory">
            {FEATURED.map((s) => (
              <Link
                key={s.slug}
                to="/stories/$slug"
                params={{ slug: s.slug }}
                className="group snap-start shrink-0 w-[80vw] sm:w-[55vw] md:w-[42vw] lg:w-[32vw]"
              >
                <div className="rounded-editorial aspect-[4/5] bg-card">
                  <img
                    src={s.img}
                    alt={s.title}
                    className="w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                </div>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.32em] text-gold font-semibold">
                      {s.cat}
                    </span>
                    <h3 className="mt-2 font-display text-2xl md:text-3xl text-ivory leading-tight group-hover:text-gold transition-colors">
                      {s.title}
                    </h3>
                  </div>
                  <span className="w-10 h-10 shrink-0 grid place-items-center border border-ivory/25 rounded-full text-ivory group-hover:border-gold group-hover:text-gold transition-colors mt-1">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container-editorial py-28 md:py-40 border-t border-border">
        <div className="mb-16" data-reveal>
          <p className="eyebrow eyebrow-dot mb-5">Categories</p>
          <h2 className="font-display text-5xl md:text-7xl text-ivory leading-[0.95] max-w-3xl">
            Six worlds, <span className="italic text-gold">one house.</span>
          </h2>
        </div>
        <ul>
          {CATEGORIES.map((c) => (
            <li key={c.slug} data-reveal>
              <Link
                to="/category/$slug"
                params={{ slug: c.slug }}
                className="group grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_1fr_1fr_auto] items-center gap-6 md:gap-10 py-8 md:py-10 border-t border-ivory/12 hover:bg-ivory/[0.03] transition-colors px-2"
              >
                <span className="text-[10px] tabular-nums text-gold/70 tracking-[0.24em]">
                  {c.n}
                </span>
                <span className="font-display text-4xl md:text-6xl text-ivory group-hover:text-gold transition-colors leading-none">
                  {c.label}
                </span>
                <div className="hidden md:block relative h-16 overflow-hidden rounded-editorial opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <img src={c.img} alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>
                <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-ivory/60 group-hover:text-gold transition-colors font-semibold">
                  View <ArrowUpRight className="w-4 h-4" />
                </span>
              </Link>
            </li>
          ))}
          <li className="border-t border-ivory/12" />
        </ul>
      </section>

      {/* IN THE PRESS */}
      <section className="py-28 md:py-40 border-t border-border bg-card">
        <div className="container-editorial">
          <p className="eyebrow eyebrow-dot mb-10" data-reveal>What people are saying</p>
          <blockquote
            key={quoteIdx}
            className="font-display italic text-3xl sm:text-4xl md:text-6xl text-ivory leading-[1.08] max-w-5xl animate-in fade-in duration-500"
          >
            <span className="text-gold">"</span>
            {q.text}
            <span className="text-gold">"</span>
          </blockquote>

          <div className="mt-16 flex flex-wrap items-center gap-10">
            <div>
              <p className="font-display text-2xl text-ivory">{q.name}</p>
              <p className="text-[11px] uppercase tracking-[0.28em] text-gold mt-1 font-semibold">
                {q.role}
              </p>
            </div>
            <div className="flex-1 hairline hidden md:block" />
            <div className="flex gap-3">
              {QUOTES.map((qq, i) => (
                <button
                  key={i}
                  onClick={() => setQuoteIdx(i)}
                  className={`w-14 h-14 rounded-full overflow-hidden border-2 transition-all ${
                    i === quoteIdx
                      ? "border-gold scale-110"
                      : "border-ivory/20 opacity-60 hover:opacity-100"
                  }`}
                  aria-label={`Quote from ${qq.name}`}
                >
                  <img src={qq.avatar} alt="" className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* RECOGNITION */}
      <section className="container-editorial py-28 md:py-40 border-t border-border">
        <div className="grid md:grid-cols-12 gap-12 mb-14">
          <div className="md:col-span-5" data-reveal>
            <p className="eyebrow eyebrow-dot mb-5">Recognition</p>
            <h2 className="font-display text-5xl md:text-7xl text-ivory leading-[0.95]">
              Our achievements.
            </h2>
          </div>
          <p className="md:col-span-6 md:col-start-7 text-muted-foreground text-base md:text-lg self-end leading-relaxed" data-reveal>
            Recognized across fashion, photography, entertainment and PR for
            work that pairs cultural clarity with editorial craft.
          </p>
        </div>
        <ul>
          {RECOGNITION.map(([award, story], i) => (
            <li
              key={award}
              className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-baseline gap-2 md:gap-10 py-6 border-t border-ivory/12 last:border-b"
              data-reveal
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <span className="font-display text-2xl md:text-3xl text-ivory">{award}</span>
              <span className="text-[11px] md:text-xs uppercase tracking-[0.24em] text-muted-foreground">
                {story}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* LATEST ISSUE */}
      <section className="py-28 md:py-36 border-t border-border">
        <div className="container-editorial flex items-end justify-between gap-6 mb-14" data-reveal>
          <div>
            <p className="eyebrow eyebrow-dot mb-5">Latest Issue</p>
            <h2 className="font-display text-5xl md:text-7xl text-ivory leading-[0.95]">
              Just filed.
            </h2>
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar" data-reveal>
          <div className="flex gap-6 md:gap-8 px-6 md:px-12 pb-4 snap-x snap-mandatory">
            {LATEST.map((s) => (
              <Link
                key={s.title}
                to="/stories/$slug"
                params={{ slug: s.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") }}
                className="group snap-start shrink-0 w-[70vw] sm:w-[45vw] md:w-[32vw] lg:w-[24vw]"
              >
                <div className="rounded-editorial aspect-[4/5] bg-card">
                  <img
                    src={s.img}
                    alt={s.title}
                    className="w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                </div>
                <p className="mt-4 text-[10px] uppercase tracking-[0.28em] text-gold font-semibold">
                  {s.date}
                </p>
                <h3 className="mt-2 font-display text-xl md:text-2xl text-ivory leading-tight group-hover:text-gold transition-colors">
                  {s.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>

        <div className="container-editorial mt-14 flex justify-center">
          <Link to="/magazine" className="btn-ghost-ivory">
            More Stories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* SUBSCRIBE CTA */}
      <section id="subscribe" className="relative overflow-hidden border-t border-border">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(200,30,46,0.35), transparent 60%)",
          }}
        />
        <div className="relative container-editorial py-32 md:py-44 text-center">
          <p className="eyebrow eyebrow-dot mb-8 justify-center" data-reveal>
            Join the circle
          </p>
          <h2
            className="font-display text-ivory text-5xl sm:text-6xl md:text-8xl leading-[0.95] max-w-4xl mx-auto"
            data-reveal
          >
            Ready to be part of the <span className="italic text-gold">story?</span>
          </h2>
          <p
            className="mt-8 text-ivory/70 max-w-xl mx-auto text-base md:text-lg leading-relaxed"
            data-reveal
          >
            Subscribe for the latest in fashion, culture and everything in between — delivered every other Sunday.
          </p>

          <form
            className="mt-14 max-w-xl mx-auto flex flex-col sm:flex-row gap-3 items-stretch"
            onSubmit={(e) => e.preventDefault()}
            data-reveal
          >
            <input
              type="email"
              required
              placeholder="Email address"
              className="flex-1 bg-transparent border border-ivory/25 rounded-full px-6 py-4 text-ivory placeholder:text-ivory/40 focus:outline-none focus:border-gold transition-colors text-sm"
            />
            <button type="submit" className="btn-red">
              Subscribe
            </button>
          </form>

          <Link
            to="/contact"
            className="inline-flex items-center gap-2 mt-10 text-[11px] uppercase tracking-[0.32em] text-ivory/60 hover:text-gold border-b border-ivory/20 hover:border-gold pb-1 transition-colors font-semibold"
          >
            Pitch a story — work with us <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* marquee */}
        <div className="relative border-t border-ivory/10 py-5 overflow-hidden">
          <div className="marquee-track text-ivory/50 text-2xl md:text-4xl font-display italic">
            {Array.from({ length: 2 }).map((_, i) => (
              <span key={i} className="flex items-center gap-8 pr-8">
                {Array.from({ length: 6 }).map((__, j) => (
                  <span key={j} className="flex items-center gap-8">
                    Subscribe now.<span className="text-gold not-italic">✦</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
