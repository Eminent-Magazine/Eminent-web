import { createFileRoute } from "@tanstack/react-router";
import { ShoppingBag, Check } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import magStack from "@/assets/magazine-stack.jpg";
import c1 from "@/assets/contestant-1.jpg";
import c2 from "@/assets/contestant-2.jpg";
import c3 from "@/assets/contestant-3.jpg";
import c4 from "@/assets/contestant-4.jpg";
import pageant from "@/assets/pageant.jpg";

export const Route = createFileRoute("/store")({
  head: () => ({
    meta: [
      { title: "Store · Eminent Magazine" },
      { name: "description", content: "Buy print and digital issues of Eminent Magazine, merchandise and gift subscriptions. Nigerian payment options supported." },
      { property: "og:title", content: "Shop Eminent Magazine — print, digital, merch" },
      { property: "og:description", content: "Own the cover. Wear the brand." },
    ],
  }),
  component: StorePage,
});

const PRODUCTS = [
  { img: magStack, name: "Issue 048 — The Grace Issue", type: "Print", price: 6500 },
  { img: c1, name: "Issue 047 — The Icons Issue", type: "Print", price: 6500 },
  { img: c3, name: "Issue 046 — Digital Only", type: "Digital", price: 3500 },
  { img: pageant, name: "Face of Eminent Anthology", type: "Print", price: 12000, badge: "Limited" },
  { img: c2, name: "Eminent Signature Tee", type: "Merch", price: 8500 },
  { img: c4, name: "The House Tote", type: "Merch", price: 5500 },
  { img: magStack, name: "12-Month Subscription", type: "Bundle", price: 65000, badge: "Save 15%" },
  { img: c1, name: "Cover Poster · A2", type: "Print", price: 4500 },
];

function StorePage() {
  return (
    <SiteLayout>
      <PageHeader eyebrow="The store is back" title="Own the cover." subtitle="Print issues, digital editions, and house merchandise — shipped across Nigeria and abroad." />

      <section className="container-editorial py-16">
        <div className="flex flex-wrap gap-2 mb-10">
          {["All", "Print", "Digital", "Merch", "Bundle"].map((t, i) => (
            <button key={t} className={`px-4 py-2 text-xs uppercase tracking-[0.18em] border ${i === 0 ? "bg-ink text-ivory border-ink" : "border-border hover:border-primary hover:text-primary"} transition-colors`}>
              {t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {PRODUCTS.map((p) => (
            <article key={p.name} className="group hover-lift">
              <div className="aspect-[3/4] overflow-hidden bg-muted relative">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                {p.badge && <span className="absolute top-3 left-3 bg-gold text-gold-foreground text-[10px] uppercase tracking-widest px-2 py-1">{p.badge}</span>}
              </div>
              <div className="mt-3">
                <p className="text-[10px] tracking-[0.24em] uppercase text-muted-foreground">{p.type}</p>
                <h3 className="font-display text-lg leading-tight mt-1">{p.name}</h3>
                <div className="mt-2 flex items-center justify-between">
                  <p className="font-semibold text-sm">₦{p.price.toLocaleString()}</p>
                  <button className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-primary hover:underline">
                    <ShoppingBag className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-secondary/50 border-y border-border">
        <div className="container-editorial py-16 grid md:grid-cols-3 gap-8 text-sm">
          {[
            "Nationwide delivery across Nigeria in 3–7 business days",
            "Card, bank transfer & USSD via Paystack and Flutterwave",
            "Digital issues delivered instantly to your inbox",
          ].map((t) => (
            <p key={t} className="flex gap-3">
              <Check className="w-5 h-5 text-primary shrink-0" /> {t}
            </p>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
