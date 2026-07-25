import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import c3 from "@/assets/contestant-3.jpg";

export const Route = createFileRoute("/modeling")({
  head: () => ({
    meta: [
      { title: "Modeling & Academy · Eminent" },
      { name: "description", content: "Apply to the Eminent Modeling Academy — training, mentorship and placement for the next generation of African talent." },
      { property: "og:title", content: "Modeling & Academy · Eminent" },
      { property: "og:description", content: "Apply now to our modeling academy — no more Google Forms." },
    ],
  }),
  component: ModelingPage,
});

function ModelingPage() {
  return (
    <SiteLayout>
      <PageHeader eyebrow="Modeling · Academy · Placement" title="Where careers are cast." subtitle="Six-week cohorts, personal mentorship, and a placement roster brands actually book from." />

      <section className="container-editorial py-20 grid md:grid-cols-2 gap-14 items-center">
        <div className="aspect-[3/4] overflow-hidden">
          <img src={c3} alt="Academy alumna" className="w-full h-full object-cover" loading="lazy" />
        </div>
        <div>
          <p className="eyebrow">The academy</p>
          <h2 className="font-display text-4xl md:text-5xl mt-3 leading-tight">Trained by working professionals.</h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            Runway, editorial, commercial and pageant tracks — taught by the
            photographers, choreographers and directors who work with us every week.
          </p>
          <ul className="mt-6 space-y-2 text-sm">
            {[
              "Six-week intensive cohorts (in-person, Awka)",
              "Portfolio shoot with our studio included",
              "Booking preference on Eminent client roster",
              "Certificate + published feature in the magazine",
            ].map((i) => (
              <li key={i} className="flex gap-2"><Check className="w-4 h-4 text-primary mt-0.5 shrink-0" /> {i}</li>
            ))}
          </ul>
        </div>
      </section>

      <ApplicationForm />

      <section className="bg-secondary/50 border-t border-border">
        <div className="container-editorial py-16">
          <h2 className="font-display text-3xl md:text-4xl mb-8">Frequently asked</h2>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
            {[
              ["Do I need experience?", "No. We accept beginners with the right presence and coachability."],
              ["Is there a fee?", "Yes — cohorts run on a subsidised fee. We publish tiers after the application review."],
              ["Do you place internationally?", "Yes, through our partner agencies in Lagos, Johannesburg and Paris."],
              ["What's the age range?", "16–28 for the runway track; open for editorial and commercial."],
            ].map(([q, a]) => (
              <div key={q}>
                <h4 className="font-semibold text-sm">{q}</h4>
                <p className="text-sm text-muted-foreground mt-1">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function ApplicationForm() {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const steps = ["About you", "Experience", "Portfolio", "Review"];

  if (done) {
    return (
      <section className="container-editorial py-24 text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 text-primary grid place-items-center">
          <Check className="w-6 h-6" />
        </div>
        <h2 className="font-display text-4xl mt-6">Application received.</h2>
        <p className="text-muted-foreground mt-3">Our team reviews every application within seven days. Watch your inbox.</p>
      </section>
    );
  }

  return (
    <section className="bg-ink text-ivory">
      <div className="container-editorial py-24">
        <div className="max-w-2xl mx-auto">
          <p className="eyebrow !text-gold text-center">Apply</p>
          <h2 className="font-display text-4xl md:text-5xl mt-3 text-center">Start your application.</h2>

          {/* Progress */}
          <div className="mt-10 flex items-center gap-2">
            {steps.map((s, i) => (
              <div key={s} className="flex-1">
                <div className={`h-1 ${i < step ? "bg-gold" : "bg-ivory/15"}`} />
                <p className={`text-[10px] tracking-widest uppercase mt-2 ${i < step ? "text-gold" : "text-ivory/40"}`}>{s}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-ivory/[0.03] border border-ivory/15 p-6 md:p-8 space-y-4">
            {step === 1 && (
              <>
                <input placeholder="Full name" className="w-full h-12 px-4 bg-ink border border-ivory/20 text-ivory rounded-sm" />
                <input placeholder="Email" type="email" className="w-full h-12 px-4 bg-ink border border-ivory/20 text-ivory rounded-sm" />
                <input placeholder="Phone / WhatsApp" className="w-full h-12 px-4 bg-ink border border-ivory/20 text-ivory rounded-sm" />
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="Age" type="number" className="h-12 px-4 bg-ink border border-ivory/20 text-ivory rounded-sm" />
                  <input placeholder="City" className="h-12 px-4 bg-ink border border-ivory/20 text-ivory rounded-sm" />
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <select className="w-full h-12 px-4 bg-ink border border-ivory/20 text-ivory rounded-sm">
                  <option>Preferred track…</option>
                  <option>Runway</option><option>Editorial</option><option>Commercial</option><option>Pageant</option>
                </select>
                <textarea placeholder="Prior experience (leave blank if none)" rows={5} className="w-full px-4 py-3 bg-ink border border-ivory/20 text-ivory rounded-sm" />
                <input placeholder="Height (cm)" className="w-full h-12 px-4 bg-ink border border-ivory/20 text-ivory rounded-sm" />
              </>
            )}
            {step === 3 && (
              <>
                <label className="block border border-dashed border-ivory/30 p-8 text-center cursor-pointer hover:border-gold transition-colors">
                  <Sparkles className="w-6 h-6 text-gold mx-auto" />
                  <p className="mt-2 text-sm">Upload 3–5 recent photos</p>
                  <p className="text-xs text-ivory/50 mt-1">JPG or PNG · up to 10MB each</p>
                  <input type="file" multiple accept="image/*" className="hidden" />
                </label>
                <input placeholder="Instagram handle (optional)" className="w-full h-12 px-4 bg-ink border border-ivory/20 text-ivory rounded-sm" />
              </>
            )}
            {step === 4 && (
              <div className="text-sm text-ivory/80 space-y-3">
                <p>You're about to submit your application to the Eminent Modeling Academy.</p>
                <p>Our team reviews within seven days and responds with next steps — no ghosting.</p>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <button disabled={step === 1} onClick={() => setStep((s) => s - 1)} className="inline-flex items-center gap-2 text-sm text-ivory/70 hover:text-ivory disabled:opacity-30">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              {step < 4 ? (
                <button onClick={() => setStep((s) => s + 1)} className="btn-primary-ivory !py-2.5">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={() => setDone(true)} className="btn-primary-ivory !py-2.5">Submit application</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
