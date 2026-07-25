import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Public } from "@/lib/pageantApi";

type Search = { reference?: string; trxref?: string };

export const Route = createFileRoute("/vote/callback")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    reference: typeof s.reference === "string" ? s.reference : undefined,
    trxref: typeof s.trxref === "string" ? s.trxref : undefined,
  }),
  head: () => ({ meta: [{ title: "Verifying payment · Eminent" }, { name: "robots", content: "noindex" }] }),
  component: Callback,
});

function Callback() {
  const { reference, trxref } = useSearch({ from: "/vote/callback" });
  const ref = reference ?? trxref;
  const [state, setState] = useState<"loading" | "ok" | "err">("loading");
  const [msg, setMsg] = useState<string>("");

  useEffect(() => {
    if (!ref) { setState("err"); setMsg("Missing reference."); return; }
    Public.verifyVote(ref)
      .then((r) => { setState("ok"); setMsg(JSON.stringify(r?.data ?? {}, null, 2)); })
      .catch((e) => { setState("err"); setMsg(e.message ?? "Verification failed"); });
  }, [ref]);

  return (
    <SiteLayout>
      <section className="container-editorial py-32 max-w-lg text-center">
        {state === "loading" && <><Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" /><p className="mt-4 text-muted-foreground">Verifying your payment…</p></>}
        {state === "ok" && (
          <>
            <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 text-primary grid place-items-center"><Check className="w-6 h-6" /></div>
            <h1 className="mt-6 font-display text-4xl">Vote confirmed</h1>
            <p className="mt-3 text-muted-foreground text-sm">Thank you — your votes have been credited.</p>
            <Link to="/vote" className="btn-primary-ivory mt-8 inline-flex">Back to voting</Link>
          </>
        )}
        {state === "err" && (
          <>
            <div className="w-14 h-14 mx-auto rounded-full bg-destructive/10 text-destructive grid place-items-center"><X className="w-6 h-6" /></div>
            <h1 className="mt-6 font-display text-4xl">Verification failed</h1>
            <p className="mt-3 text-muted-foreground text-sm">{msg}</p>
            <Link to="/vote" className="btn-primary-ivory mt-8 inline-flex">Try again</Link>
          </>
        )}
      </section>
    </SiteLayout>
  );
}
