import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import magStack from "@/assets/magazine-stack.jpg";
import c1 from "@/assets/contestant-1.jpg";
import c2 from "@/assets/contestant-2.jpg";
import c3 from "@/assets/contestant-3.jpg";
import c4 from "@/assets/contestant-4.jpg";
import pageant from "@/assets/pageant.jpg";

export const Route = createFileRoute("/magazine")({
  head: () => ({
    meta: [
      { title: "Magazine · Eminent" },
      { name: "description", content: "Read Eminent Magazine — cover stories, culture, style and interviews from Africa's rising creative economy." },
      { property: "og:title", content: "Eminent Magazine — cover stories & culture" },
      { property: "og:description", content: "Read the latest issue and archive of Eminent Magazine." },
    ],
  }),
  component: MagazinePage,
});

const STORIES = [
  { img: c1, category: "Cover Story", title: "Unapologetic grace: Adaeze Okoye is redefining African elegance", read: "12 min" },
  { img: c2, category: "Style", title: "The Lagos suit renaissance is here — and it's tailored to the streets", read: "6 min" },
  { img: c3, category: "Interview", title: "Zainab Musa on building a beauty brand from Kano to the world", read: "9 min" },
  { img: pageant, category: "Pageantry", title: "Inside the making of Face of Eminent 2026", read: "8 min" },
  { img: c4, category: "Culture", title: "Six young Nigerian creatives to watch this season", read: "7 min" },
  { img: magStack, category: "Editor's Letter", title: "Issue 048 — Why we chose grace as our word for the year", read: "4 min" },
];

function MagazinePage() {
  const [featured, ...rest] = STORIES;
  return (
    <SiteLayout>
      <PageHeader eyebrow="Issue 048 · The Grace Issue" title="Stories that inspire." subtitle="Editorial features, style dispatches and interviews from across the continent." />

      <section className="container-editorial py-16">
        <Link to="/magazine" className="group grid md:grid-cols-2 gap-8 items-center border-b border-border pb-16">
          <div className="aspect-[4/3] overflow-hidden order-1">
            <img src={featured.img} alt={featured.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
          </div>
          <div>
            <p className="eyebrow">{featured.category}</p>
            <h2 className="font-display text-4xl md:text-5xl leading-tight mt-3">{featured.title}</h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              A deep-dive interview with our December cover star, photographed in
              her Lagos studio over three afternoons.
            </p>
            <p className="mt-4 text-xs uppercase tracking-widest text-primary">{featured.read} read →</p>
          </div>
        </Link>

        <div className="grid gap-10 md:grid-cols-3 mt-16">
          {rest.map((s) => (
            <Link key={s.title} to="/magazine" className="group block">
              <div className="aspect-[4/5] overflow-hidden bg-muted">
                <img src={s.img} alt={s.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
              </div>
              <p className="eyebrow mt-5">{s.category}</p>
              <h3 className="font-display text-2xl leading-snug mt-2">{s.title}</h3>
              <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">{s.read} read</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-secondary/50 border-t border-border">
        <div className="container-editorial py-20 text-center">
          <h2 className="font-display text-4xl md:text-5xl">Want it in print?</h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">Order this issue, past covers, or a full-year subscription from our store.</p>
          <Link to="/store" className="btn-primary-ivory mt-8">Shop the Magazine</Link>
        </div>
      </section>
    </SiteLayout>
  );
}
