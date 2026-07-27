import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Camera, Newspaper, Sparkles, Users, Crown, Radio, ArrowRight, Loader2, Check } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import { Public, type QuoteService } from "@/lib/pageantApi";
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
        <QuoteForm />

      </section>
    </SiteLayout>
  );
}

function QuoteForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "" as QuoteService | "", message: "" });
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const m = useMutation({
    mutationFn: () => Public.quote({ ...form, service: form.service as QuoteService }),
    onSuccess: () => { setDone(true); setErr(null); },
    onError: (e: Error) => setErr(e.message),
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.service) { setErr("Please choose a service"); return; }
    m.mutate();
  }

  if (done) {
    return (
      <div className="max-w-2xl mx-auto text-center bg-card border border-border p-10">
        <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 text-primary grid place-items-center"><Check className="w-5 h-5" /></div>
        <h3 className="font-display text-3xl mt-4">Request received</h3>
        <p className="mt-2 text-sm text-muted-foreground">We'll send a scoped proposal within one business day.</p>
        <button onClick={() => { setDone(false); setForm({ name: "", email: "", phone: "", service: "", message: "" }); }} className="btn-primary-ivory mt-6 inline-flex">Send another</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="max-w-2xl mx-auto grid gap-4">
      <div className="grid md:grid-cols-2 gap-4">
        <input required placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-12 px-4 bg-card border border-input text-sm rounded-sm" />
        <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-12 px-4 bg-card border border-input text-sm rounded-sm" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <input required placeholder="Phone / WhatsApp" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="h-12 px-4 bg-card border border-input text-sm rounded-sm" />
        <select required value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value as QuoteService })} className="h-12 px-4 bg-card border border-input text-sm rounded-sm">
          <option value="">Service needed…</option>
          {SERVICES.map((s) => <option key={s.title} value={s.title}>{s.title}</option>)}
        </select>
      </div>
      <textarea required placeholder="Tell us about the event or project" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="px-4 py-3 bg-card border border-input text-sm rounded-sm" />
      {err && <p className="text-xs text-destructive">{err}</p>}
      <button disabled={m.isPending} className="btn-primary-ivory self-start">
        {m.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Send Request <ArrowRight className="w-4 h-4" /></>}
      </button>
    </form>
  );
}

