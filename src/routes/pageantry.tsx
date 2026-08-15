import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import pageant from "@/assets/EminentImages/winnerLastPastQueen.jpg";
import c1 from "@/assets/EminentImages/immediatePastQueen.jpg";
import c2 from "@/assets/EminentImages/pastQueen0.jpg";
import c3 from "@/assets/EminentImages/pastQueen4.jpg";
import c4 from "@/assets/EminentImages/pastQueen2020.jpg";
import c5 from "@/assets/EminentImages/pastQueen3.jpg";
import c6 from "@/assets/EminentImages/pastQueen2.jpg";
import c7 from "@/assets/EminentImages/pastQUEEN.jpg";
// import pageant from "@/assets/pageant.jpg";
// import c1 from "@/assets/contestant-1.jpg";
// import c3 from "@/assets/contestant-3.jpg";
// import c4 from "@/assets/contestant-4.jpg";

export const Route = createFileRoute("/pageantry")({
  head: () => ({
    meta: [
      { title: "Pageantry · Face of Eminent Magazine" },
      { name: "description", content: "Face of Eminent Magazine — Nigeria's premier pageant and beauty platform. Past winners, upcoming shows, and how to enter." },
      { property: "og:title", content: "Pageantry · Face of Eminent Magazine" },
      { property: "og:description", content: "The crown, the stage, the story." },
      { property: "og:image", content: "https://id-preview--5608cb5b-1989-4441-9bfa-ebef3027881e.lovable.app/assets/pageant.jpg" },
      { name: "twitter:image", content: "https://id-preview--5608cb5b-1989-4441-9bfa-ebef3027881e.lovable.app/assets/pageant.jpg" },
    ],
  }),
  component: PageantryPage,
});

function PageantryPage() {
  return (
    <SiteLayout>
      <section className="relative bg-ink text-ivory overflow-hidden">
        <div className="absolute inset-0">
          <img src={c1} alt="Eminent pageant stage" className="w-full h-full object-cover opacity-45" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/30" />
        </div>
        <div className="container-editorial relative py-28 md:py-40 text-center">
          <p className="eyebrow !text-gold">Nigeria's premier pageant platform</p>
          <h1 className="mt-4 font-display text-5xl md:text-7xl lg:text-8xl leading-[1.02]">The crown. The stage. <em className="text-gold">The story.</em></h1>
          <p className="mt-6 max-w-xl mx-auto text-ivory/80">Six seasons. 140+ contestants. One growing legacy of grace, service and enterprise.</p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link to="/vote" className="btn-primary-ivory">Vote 2026</Link>
            <Link to="/modeling" className="btn-primary-white  !flex items-center !text-black !border-ivory/40 hover:!text-ink">Apply for Season 7</Link>
          </div>
        </div>
      </section>

      {/* Past winners */}
      <section className="container-editorial py-24">
        <div className="max-w-2xl mb-12">
          <p className="eyebrow">Past queens</p>
          <h2 className="font-display text-4xl md:text-5xl mt-3">Six seasons. <em>Six queens.</em></h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { img: c1, name: "Adaeze Okoye", year: "Season 13 · 2025" },
            { img: c7, name: "Rukayat Bello", year: "Season 11 · 2023" },
            { img: c6, name: "Ifunanya Eze", year: "Season 10 · 2022" },
            { img: c3, name: "Nkechi Obi", year: "Season 8 · 2019" },
            { img: c5, name: "Zara Musa", year: "Season 3 · 2014" },
            { img: c7, name: "Chia Uzo", year: "Season 2 · 2013" },
            { img: c2, name: "Chi Uzo", year: "Season 1 · 2012" },
          ].map((w) => (
            <figure key={w.name} className="group hover-lift">
              <div className="aspect-[4/5] overflow-hidden bg-muted">
                <img src={w.img} alt={w.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
              </div>
              <figcaption className="mt-4">
                <p className="text-[10px] tracking-[0.24em] uppercase text-primary">{w.year}</p>
                <p className="font-display text-2xl mt-1">{w.name}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Ambassador program */}
      <section className="bg-secondary/50 border-y border-border">
        <div className="container-editorial py-20 text-center">
          <h2 className="font-display text-4xl md:text-5xl">More than a crown.</h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            Every queen joins the Eminent Ambassador Program — a year of paid
            campaigns, magazine features, and mentorship on turning visibility into
            a career.
          </p>
          <Link to="/vote" className="btn-primary-ivory mt-8">Support this season</Link>
        </div>
      </section>
    </SiteLayout>
  );
}
