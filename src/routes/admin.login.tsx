import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Admin, setAdminToken } from "@/lib/pageantApi";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin sign in · Eminent" }, { name: "robots", content: "noindex" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr(null);
    try {
      const r = await Admin.login(email, pw);
      if (!r.token) throw new Error("No token returned");
      toast.success("Signed in");
      setAdminToken(r.token);
      nav({ to: "/admin" });
    } catch (e: any) {
      setErr(e.message ?? "Login failed");
      toast.error(e.message ?? "Save failed")
    }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-ink text-ivory grid place-items-center p-6">
      <form onSubmit={submit} className="w-full max-w-sm border border-ivory/15 p-8 bg-ink/60 backdrop-blur">
        <div className="flex flex-col items-center gap-2">
          <img src={"/favicon-32.png"} alt="Eminent Logo" className="w-12 h-12 object-cover rounded-full" loading="lazy" />
          <p className="eyebrow !text-gold">
            Eminent Magazine
          </p>
        </div>
        <h1 className="font-display text-3xl mt-2">Admin sign in</h1>
        <div className="mt-6 space-y-3">
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full h-11 px-3 bg-ink border border-ivory/20 text-sm rounded-sm text-ivory" />
          <div className="relative">
            <input required type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Password" className="w-full h-11 px-3 bg-ink border border-ivory/20 text-sm rounded-sm text-ivory" />
            <button
              type="button"
              tabIndex={-1}
              aria-label={showPw ? "Hide password" : "Show password"}
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>
        {err && <p className="text-xs text-destructive mt-3">{err}</p>}
        <button disabled={loading} className="btn-primary-ivory w-full mt-6">{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign in"}</button>
      </form>
    </div>
  );
}
