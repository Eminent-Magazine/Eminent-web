import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import { Public } from "@/lib/pageantApi";
import { RegisterPageSkeleton } from "@/components/site/RegisterSkeleton";
import EminentLoader from "@/components/site/EminentLoader";

export const Route = createFileRoute("/register")({
  pendingComponent: () => <RegisterPageSkeleton />,
  pendingMs: 150,
  pendingMinMs: 250,
  head: () => ({
    meta: [
      { title: "Contestant Registration · Eminent Magazine" },
      { name: "description", content: "Apply for the Face of Eminent Magazine season. Complete your registration and profile in minutes." },
      { property: "og:title", content: "Contestant Registration · Eminent Magazine" },
      { property: "og:description", content: "Apply for the next season." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const settingsQ = useQuery({ queryKey: ["reg-settings"], queryFn: Public.registrationSettings });
  const s = settingsQ.data;


  if (settingsQ.isLoading) {
    return   <EminentLoader caption={"Loading Registration Page"} variant="overlay" />
  }

  if (!s?.registrationEnabled) {
    return (
      <SiteLayout>
        <PageHeader eyebrow="Registration" title="Applications are closed." subtitle="Follow us on Instagram to hear when the next season opens." />
      </SiteLayout>
    );
  }
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Face of Eminent"
        title="Apply to compete."
        subtitle={s.requirePaymentBeforeRegistration
          ? `A one-time registration fee of ₦${s.registrationFee.toLocaleString()} secures your slot.`
          : "Complete your profile below to submit your application."}
      />
      <div className="container-editorial pb-24 max-w-2xl">
        {s.requirePaymentBeforeRegistration ? <PayFirstForm fee={s.registrationFee} /> : <ProfileForm />}
      </div>
    </SiteLayout>
  );
}

function PayFirstForm({ fee }: { fee: number }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr(null);
    try {
      const r = await Public.initRegistration({ fullName: name, email, phone, paymentMethod: "paystack" });
      const url = r?.data?.authorization_url;
      if (!url) throw new Error("No payment URL returned");
      window.location.href = url;
    } catch (e: any) { setErr(e.message ?? "Failed"); setLoading(false); }
  }

  return (
    <form onSubmit={submit} className="bg-card border border-border p-8 space-y-4">
      <p className="eyebrow">Step 1 · Pay registration fee</p>
      <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full h-12 px-4 bg-background border border-input text-sm rounded-sm" />
      <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full h-12 px-4 bg-background border border-input text-sm rounded-sm" />
      <input required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="w-full h-12 px-4 bg-background border border-input text-sm rounded-sm" />
      <div className="flex items-center justify-between border-t border-border pt-4 text-sm">
        <span className="text-muted-foreground">Registration fee</span>
        <span className="font-display text-2xl">₦{fee.toLocaleString()}</span>
      </div>
      {err && <p className="text-xs text-destructive">{err}</p>}
      <button disabled={loading} className="btn-primary-ivory w-full">{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Pay with Paystack"}</button>
      <p className="text-[11px] text-muted-foreground text-center">You'll return here to complete your contestant profile after payment.</p>
    </form>
  );
}

function ProfileForm({ transactionReference }: { transactionReference?: string } = {}) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", age: "", category: "Face of Eminent", bio: "", instagram: "", tiktok: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  function set<K extends keyof typeof form>(k: K, v: string) { setForm((f) => ({ ...f, [k]: v })); }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr(null);
    try {
      const r = await Public.register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        age: Number(form.age),
        category: form.category,
        bio: form.bio,
        socialMedia: { instagram: form.instagram, tiktok: form.tiktok },
        transactionReference,
      });
      setDone(r.user?._id ?? "submitted");
    } catch (e: any) { setErr(e.message ?? "Registration failed"); }
    finally { setLoading(false); }
  }

  if (done) {
    return (
      <div className="bg-card border border-border p-10 text-center">
        <h2 className="font-display text-3xl">Application submitted</h2>
        <p className="mt-3 text-sm text-muted-foreground">We'll review and get back to you within 3 business days.</p>
        <Link to="/" className="btn-primary-ivory mt-6 inline-flex">Back to home</Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="bg-card border border-border p-3 sm:p-4 md:p-8 space-y-4 mt-10">
      <p className="eyebrow">Contestant profile</p>
      <div className="grid grid-cols-2 gap-1 md:gap-3">
        <input required placeholder="Full name" className="h-12 px-4 bg-background border border-input text-sm rounded-sm" value={form.name} onChange={(e) => set("name", e.target.value)} />
        <input required type="email" placeholder="Email" className="h-12 px-4 bg-background border border-input text-sm rounded-sm" value={form.email} onChange={(e) => set("email", e.target.value)} />
        <input required placeholder="Phone" className="h-12 px-4 bg-background border border-input text-sm rounded-sm" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        <input required type="number" min={16} max={45} placeholder="Age" className="h-12 px-4 bg-background border border-input text-sm rounded-sm" value={form.age} onChange={(e) => set("age", e.target.value)} />
      </div>
      <input required placeholder="Category (e.g. Face of Eminent, Miss, Mister, Teen)" className="w-full h-12 px-4 bg-background border border-input text-sm rounded-sm" value={form.category} onChange={(e) => set("category", e.target.value)} />
      <textarea required rows={5} placeholder="Bio — tell us your story" className="w-full px-4 py-3 bg-background border border-input text-sm rounded-sm" value={form.bio} onChange={(e) => set("bio", e.target.value)} />
      <div className="grid grid-cols-2 gap-1 md:gap-3">
        <input placeholder="Instagram handle" className="h-12 px-4 bg-background border border-input text-sm rounded-sm" value={form.instagram} onChange={(e) => set("instagram", e.target.value)} />
        <input placeholder="TikTok handle" className="h-12 px-4 bg-background border border-input text-sm rounded-sm" value={form.tiktok} onChange={(e) => set("tiktok", e.target.value)} />
      </div>
      {err && <p className="text-xs text-destructive">{err}</p>}
      <button disabled={loading} className="btn-primary-ivory w-full">{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit application"}</button>
    </form>
  );
}

export { ProfileForm };
