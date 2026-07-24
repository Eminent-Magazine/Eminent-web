import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import magStack from "@/assets/magazine-stack.jpg";
import services from "@/assets/services-videography.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About · Eminent Magazine" },
      { name: "description", content: "The story behind Eminent — a full-service media house based in Awka, Anambra State, telling African stories that inspire." },
      { property: "og:title", content: "About Eminent Magazine" },
      { property: "og:description", content: "A media house built to tell African stories that inspire." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <PageHeader eyebrow="Since 2017" title="A house built on stories." subtitle="Eminent International Media World Limited was founded in Awka with one instinct: African stories deserve editorial rigour and cinematic craft." />

      <section className="container-editorial py-20 grid md:grid-cols-2 gap-12 items-center">
        <div className="aspect-[4/5] overflow-hidden">
          <img src={magStack} alt="Eminent Magazine issues" className="w-full h-full object-cover" loading="lazy" />
        </div>
        <div>
          <p className="eyebrow">Our story</p>
          <h2 className="font-display text-4xl md:text-5xl mt-3 leading-tight">From a single issue to a full media house.</h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            We began as a print magazine spotlighting the entrepreneurs and creatives
            reshaping the South-East. Nine years later we run a studio, a training
            academy, a pageant platform, an in-house press, and a growing PR arm —
            all under one roof.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Every story we tell — in ink, on film, or on stage — is built on the same
            promise: rigour, craft and a deep love for African excellence.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-secondary/50 border-y border-border">
        <div className="container-editorial py-20">
          <div className="max-w-xl mb-12">
            <p className="eyebrow">What we stand for</p>
            <h2 className="font-display text-4xl md:text-5xl mt-3">The house rules.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              ["Rigour", "Fact-checked reporting, contract-clear productions, and no shortcuts. If it wears our name, it's earned it."],
              ["Craft", "Every cover, every cut, every crown is designed. Nothing is left to defaults."],
              ["Community", "We invest in the people we feature, train and cast. Success is shared or it isn't ours."],
            ].map(([t, d]) => (
              <div key={t}>
                <h3 className="font-display text-3xl">{t}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="container-editorial py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="eyebrow">Leadership</p>
          <h2 className="font-display text-4xl md:text-5xl mt-3 leading-tight">Led by builders, editors and directors.</h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            A small executive team runs the day-to-day — editor-in-chief,
            executive producer, head of academy, and creative director — supported by
            a network of contributing writers, photographers and stylists across
            Lagos, Abuja and Enugu.
          </p>
        </div>
        <div className="aspect-[4/3] overflow-hidden">
          <img src={services} alt="Eminent team at work" className="w-full h-full object-cover" loading="lazy" />
        </div>
      </section>
    </SiteLayout>
  );
}
