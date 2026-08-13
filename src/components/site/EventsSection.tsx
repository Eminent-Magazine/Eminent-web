import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { imageSrc } from "@/sanity/client";
import { eventsQueryOptions, type EventDoc } from "@/sanity/queries";
import pageant from "@/assets/pageant.jpg";
import model from "@/assets/em-story-model.jpg";
import culture from "@/assets/em-story-culture.jpg";

interface Card {
  key: string;
  title: string;
  status: string;
  snippet: string;
  img?: string;
  ctaLabel: string;
  ctaHref: string;
}

const FALLBACK: Card[] = [
  {
    key: "face-of-eminent",
    title: "Face of Eminent 2026",
    status: "Registration open",
    snippet: "The continent's most photographed pageant is casting now. Submit your portfolio and join the class of 2026.",
    img: pageant,
    ctaLabel: "Register now",
    ctaHref: "/register",
  },
  {
    key: "voting",
    title: "Voting has started",
    status: "Live now",
    snippet: "Back your favourite contestant. Every vote counts towards the crown — vote as many times as you like.",
    img: culture,
    ctaLabel: "Cast your vote",
    ctaHref: "/vote",
  },
  {
    key: "modeling",
    title: "Modeling Academy intake",
    status: "Now enrolling",
    snippet: "Runway, posing, portfolio and on-camera training with the Eminent production crew.",
    img: model,
    ctaLabel: "Join the academy",
    ctaHref: "/modeling",
  },
];

function toCard(e: EventDoc): Card {
  return {
    key: e._id,
    title: e.title,
    status: e.status ?? "Happening now",
    snippet: e.snippet ?? "",
    img: imageSrc(e.image, 900, 700),
    ctaLabel: e.ctaLabel ?? "Learn more",
    ctaHref: e.ctaHref ?? "/",
  };
}

function Cta({ href, label }: { href: string; label: string }) {
  const external = /^https?:/i.test(href);
  const cls = "btn-red mt-6 inline-flex items-center gap-2 text-[11px] text-nowrap";
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {label} <ArrowUpRight className="w-3.5 h-3.5" />
      </a>
    );
  }
  return (
    <Link to={href as never} className={cls}>
      {label} <ArrowUpRight className="w-3.5 h-3.5" />
    </Link>
  );
}

export function EventsSection() {
  const { data } = useQuery({ ...eventsQueryOptions, staleTime: 60_000 });
  const cards = data && data.length > 0 ? data.map(toCard) : FALLBACK;

  return (
    <section className="border-y border-border bg-card/40">
      <div className="container-editorial py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12" data-reveal>
          <div>
            <p className="eyebrow eyebrow-dot mb-5">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              What&apos;s happening now
            </p>
            <h2 className="font-display text-4xl md:text-6xl text-ivory leading-[0.95]">
              Live at <span className="italic text-gold">Eminent.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground leading-relaxed">
            Open calls, contests and campaigns running right now across the house.
          </p>
        </div>

        <div className="overflow-x-auto no-scrollbar" data-reveal>
          <div className="flex gap-6 md:gap-8 px-6 md:px-12 pb-4 snap-x snap-mandatory">
        {/* <div className="grid gap-8 md:grid-cols-3"> */}
          {cards.map((c) => (
            <article
              key={c.key}
              className="max-w-sm group flex flex-col rounded-sm border border-ivory/12 bg-background/40 hover:border-gold/50 transition-colors"
              // data-reveal
            >
              <div className="rounded-sm aspect-[11/9] overflow-hidden bg-card">
                {c.img && (
                  <img
                    src={c.img}
                    alt={c.title}
                    className="w-full h-full object-contain transition-transform duration-[900ms] group-hover:scale-[1.05]"
                    loading="lazy"
                  />
                )}
              </div>
              <div className="p-7 flex flex-col flex-1">
                <p className="text-[10px] uppercase tracking-[0.28em] text-primary font-semibold">{c.status}</p>
                <h3 className="mt-3 font-display text-2xl md:text-3xl text-ivory leading-tight group-hover:text-gold transition-colors">
                  {c.title}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1">{c.snippet}</p>
                <Cta href={c.ctaHref} label={c.ctaLabel} />
              </div>
            </article>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}
