import { createFileRoute } from "@tanstack/react-router";
import { Camera, Newspaper, Sparkles, Users, Crown, Radio, ArrowRight } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import services from "@/assets/services-videography.jpg";
import magStack from "@/assets/magazine-stack.jpg";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services · Eminent Media House" },
      { name: "description", content: "Videography, media coverage, branding, printing, PR and ushering — Eminent's full-service creative house for brands and events." },
      { property: "og:title", content: "Services · Eminent Media House" },
      { property: "og:description", content: "Book the studio. Book the brand." },
    ],
  }),
  component: ServicesPage,
});

const SERVICES = [
  { icon: Camera, title: "Videography & Film", body: "Cinematic wedding films, brand launches, editorial motion pieces and multi-cam pageant broadcasts. Same-week teaser, four-week final cut." },
  { icon: Newspaper, title: "Editorial & Cover Features", body: "Native ad and feature placements in Eminent Magazine — reach a curated readership of tastemakers and buyers." },
  { icon: Sparkles, title: "Branding & Printing", body: "Identity, packaging, lookbooks and press-quality print production out of our in-house press." },
  { icon: Radio, title: "PR & Advertising", body: "Full-funnel PR: press releases, editorial features, social amplification and paid distribution across our channels." },
  { icon: Crown, title: "Pageant Production", body: "End-to-end pageant production — casting, training, stage design, broadcast and voting infrastructure." },
  { icon: Users, title: "Ushering & Talent", body: "Corporate, wedding and event ushering with trained talent from our academy roster." },
];

function ServicesPage() {
  return (
    <SiteLayout>
      <PageHeader eyebrow="What we do" title="Every stage. One team." subtitle="Six lines of business, one creative house. Written in our own voice — no template copy." />

      <section className="container-editorial py-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-card border border-border p-8 hover-lift">
              <Icon className="w-9 h-9 text-primary" />
              <h3 className="font-display text-2xl mt-5">{title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Portfolio strip */}
      <section className="bg-ink text-ivory">
        <div className="container-editorial py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="eyebrow !text-gold">Selected work</p>
            <h2 className="font-display text-4xl md:text-5xl mt-3">300+ events. <em>Countless stories.</em></h2>
            <p className="mt-5 text-ivory/70 leading-relaxed">
              From two-day weddings in Enugu to televised pageants and multi-brand
              activations across Lagos and Abuja — we've built a reputation for
              turning up on time, over-delivering, and treating every shoot like a
              cover.
            </p>
            <ul className="mt-6 grid grid-cols-2 gap-3 text-sm">
              {["Lumen Skincare Launch", "Face of Eminent 2025", "AB Weddings, Enugu", "Anambra Fashion Week"].map((c) => (
                <li key={c} className="flex gap-2"><span className="text-gold">✦</span> {c}</li>
              ))}
            </ul>
          </div>
          <div className="aspect-[4/3] overflow-hidden">
            <img src={services} alt="Behind the scenes at an Eminent shoot" className="w-full h-full object-cover" loading="lazy" />
          </div>
        </div>
      </section>

      {/* Quote form */}
      <section className="container-editorial py-24">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <p className="eyebrow">Request a quote</p>
          <h2 className="font-display text-4xl md:text-5xl mt-3">Tell us about your project.</h2>
          <p className="mt-3 text-muted-foreground">We reply within one business day with a scoped proposal and calendar.</p>
        </div>
        <form onSubmit={(e) => e.preventDefault()} className="max-w-2xl mx-auto grid gap-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input placeholder="Your name" className="h-12 px-4 bg-card border border-input text-sm rounded-sm" />
            <input placeholder="Email" type="email" className="h-12 px-4 bg-card border border-input text-sm rounded-sm" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <input placeholder="Phone / WhatsApp" className="h-12 px-4 bg-card border border-input text-sm rounded-sm" />
            <select className="h-12 px-4 bg-card border border-input text-sm rounded-sm">
              <option>Service needed…</option>
              {SERVICES.map((s) => <option key={s.title}>{s.title}</option>)}
            </select>
          </div>
          <textarea placeholder="Tell us about the event or project" rows={5} className="px-4 py-3 bg-card border border-input text-sm rounded-sm" />
          <button className="btn-primary self-start">
            Send Request <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </section>
    </SiteLayout>
  );
}
