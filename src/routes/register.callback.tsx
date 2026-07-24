import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Public } from "@/lib/pageantApi";
import { ProfileForm } from "./register";

type Search = { reference?: string; trxref?: string };

export const Route = createFileRoute("/register/callback")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    reference: typeof s.reference === "string" ? s.reference : undefined,
    trxref: typeof s.trxref === "string" ? s.trxref : undefined,
  }),
  head: () => ({ meta: [{ title: "Verifying · Eminent" }, { name: "robots", content: "noindex" }] }),
  component: Callback,
});

function Callback() {
  const { reference, trxref } = useSearch({ from: "/register/callback" });
  const ref = reference ?? trxref;
  const [state, setState] = useState<"loading" | "ok" | "err">("loading");
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    if (!ref) { setState("err"); setErr("Missing reference."); return; }
    Public.verifyRegistration(ref)
      .then(() => setState("ok"))
      .catch((e) => { setState("err"); setErr(e.message ?? "Verification failed"); });
  }, [ref]);

  return (
    <SiteLayout>
      <section className="container-editorial py-16 max-w-2xl">
        {state === "loading" && <div className="py-24 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" /></div>}
        {state === "err" && (
          <div className="text-center py-24">
            <div className="w-14 h-14 mx-auto rounded-full bg-destructive/10 text-destructive grid place-items-center"><X className="w-6 h-6" /></div>
            <h1 className="mt-6 font-display text-4xl">Payment not verified</h1>
            <p className="mt-3 text-muted-foreground text-sm">{err}</p>
            <Link to="/register" className="btn-primary mt-6 inline-flex">Try again</Link>
          </div>
        )}
        {state === "ok" && (
          <>
            <div className="text-center mb-8">
              <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 text-primary grid place-items-center"><Check className="w-5 h-5" /></div>
              <h1 className="mt-4 font-display text-3xl">Payment confirmed</h1>
              <p className="mt-2 text-sm text-muted-foreground">Now complete your contestant profile.</p>
            </div>
            <ProfileForm transactionReference={ref} />
          </>
        )}
      </section>
    </SiteLayout>
  );
}
