import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin, MessageCircle, ArrowRight, Instagram } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact · Eminent Magazine" },
      { name: "description", content: "Get in touch with Eminent — Awka, Anambra State. Bookings, press, partnerships and general enquiries. WhatsApp preferred." },
      { property: "og:title", content: "Contact Eminent Magazine" },
      { property: "og:description", content: "WhatsApp us. Call us. Write to us. Or drop in." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <SiteLayout>
      <PageHeader eyebrow="We're listening" title="Get in touch." subtitle="Bookings, press, partnerships or a quick hello — we reply within one business day." />

      <section className="container-editorial py-20 grid gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Reach us directly</p>
          <h2 className="font-display text-3xl mt-2">Fastest ways.</h2>
          <div className="mt-8 space-y-5 text-sm">
            {[
              { icon: MessageCircle, label: "WhatsApp", value: "+234 800 000 0000", href: "https://wa.me/2348000000000" },
              { icon: Phone, label: "Call us", value: "+234 800 000 0000", href: "tel:+2348000000000" },
              { icon: Mail, label: "Email", value: "hello@eminentmagazine.com", href: "mailto:hello@eminentmagazine.com" },
              { icon: Instagram, label: "Instagram", value: "@eminentmagazine", href: "https://instagram.com/eminentmagazine" },
              { icon: MapPin, label: "Visit", value: "Awka, Anambra State, Nigeria" },
            ].map(({ icon: Icon, label, value, href }) => (
              <a key={label} href={href ?? "#"} className="flex gap-4 group border-b border-border pb-4">
                <div className="w-11 h-11 grid place-items-center border border-border group-hover:border-primary group-hover:text-primary transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{label}</p>
                  <p className="font-medium mt-1 group-hover:text-primary transition-colors">{value}</p>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-10 aspect-[4/3] overflow-hidden border border-border">
            <iframe
              title="Eminent Magazine offices"
              src="https://www.google.com/maps?q=Awka,%20Anambra%20State,%20Nigeria&output=embed"
              className="w-full h-full"
              loading="lazy"
            />
          </div>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="bg-card border border-border p-8">
          <p className="eyebrow">Send a message</p>
          <h2 className="font-display text-3xl mt-2">Or write to us.</h2>
          <div className="mt-6 grid gap-4">
            <input placeholder="Your name" className="h-12 px-4 bg-background border border-input text-sm rounded-sm" />
            <input placeholder="Email" type="email" className="h-12 px-4 bg-background border border-input text-sm rounded-sm" />
            <select className="h-12 px-4 bg-background border border-input text-sm rounded-sm">
              <option>What's this about?</option>
              <option>Booking / Quote</option>
              <option>Press / Media</option>
              <option>Modeling Academy</option>
              <option>Pageant enquiry</option>
              <option>Partnerships</option>
              <option>Other</option>
            </select>
            <textarea rows={6} placeholder="Message" className="px-4 py-3 bg-background border border-input text-sm rounded-sm" />
            <button className="btn-primary-ivory self-start">Send message <ArrowRight className="w-4 h-4" /></button>
          </div>
        </form>
      </section>
    </SiteLayout>
  );
}
