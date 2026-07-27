import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Mail, Phone, MapPin, MessageCircle, ArrowRight, Instagram, Loader2, Check } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import { Public, type ContactSubject } from "@/lib/pageantApi";

const SUBJECTS: ContactSubject[] = ["Booking / Quote", "Press / Media", "Modeling Academy", "Pageant enquiry", "Partnerships", "Other"];


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
              { icon: MessageCircle, label: "WhatsApp", value: "+234 706 043 9131", href: "https://wa.me/2347060439131" },
              { icon: Phone, label: "Call us", value: "+234 705 093 1952", href: "tel:+2347050931952." },
              { icon: Mail, label: "Email", value: "info@eminentmagazine.com", href: "mailto:info@eminentmagazine.com" },
              { icon: Instagram, label: "Instagram", value: "@eminentmagazine", href: "https://instagram.com/eminentmagazine" },
              { icon: MapPin, label: "Visit", value: "No 75 Arthur Eze Avenue by unizik junction, Awka, Anambra State Nigeria." },
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
              src="https://www.google.com/maps?q=75%20Arthur%20Eze%20Avenue%20by%20unizik%20junction,%20Awka,%20Anambra%20State,%20Nigeria&output=embed"
              className="w-full h-full"
              loading="lazy"
            />
          </div>
        </div>

        <ContactForm />

      </section>
    </SiteLayout>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "" as ContactSubject | "", message: "" });
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const m = useMutation({
    mutationFn: () => Public.contact({ name: form.name, email: form.email, subject: form.subject as ContactSubject, message: form.message }),
    onSuccess: () => { setDone(true); setErr(null); },
    onError: (e: Error) => setErr(e.message),
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.subject) { setErr("Please choose a subject"); return; }
    if (form.message.trim().length < 10) { setErr("Message must be at least 10 characters"); return; }
    m.mutate();
  }

  if (done) {
    return (
      <div className="bg-card border border-border p-8 text-center">
        <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 text-primary grid place-items-center"><Check className="w-5 h-5" /></div>
        <h2 className="font-display text-3xl mt-4">Message sent</h2>
        <p className="mt-2 text-sm text-muted-foreground">Thanks — we'll get back to you within one business day.</p>
        <button onClick={() => { setDone(false); setForm({ name: "", email: "", subject: "", message: "" }); }} className="btn-primary-ivory mt-6 inline-flex">Send another</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="bg-card border border-border p-8">
      <p className="eyebrow">Send a message</p>
      <h2 className="font-display text-3xl mt-2">Or write to us.</h2>
      <div className="mt-6 grid gap-4">
        <input required placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-12 px-4 bg-background border border-input text-sm rounded-sm" />
        <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-12 px-4 bg-background border border-input text-sm rounded-sm" />
        <select required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value as ContactSubject })} className="h-12 px-4 bg-background border border-input text-sm rounded-sm">
          <option value="">What's this about?</option>
          {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <textarea required rows={6} placeholder="Message (min 10 characters)" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="px-4 py-3 bg-background border border-input text-sm rounded-sm" />
        {err && <p className="text-xs text-destructive">{err}</p>}
        <button disabled={m.isPending} className="btn-primary-ivory self-start">
          {m.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Send message <ArrowRight className="w-4 h-4" /></>}
        </button>
      </div>
    </form>
  );
}

