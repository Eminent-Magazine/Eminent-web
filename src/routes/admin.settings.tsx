import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Admin } from "@/lib/pageantApi";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin-settings"], queryFn: Admin.getSettings });
  const [json, setJson] = useState("");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (q.data?.settings) setJson(JSON.stringify(q.data.settings, null, 2));
  }, [q.data]);

  const save = useMutation({
    mutationFn: (body: any) => Admin.updateSettings(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-settings"] }),
  });

  const s: any = q.data?.settings ?? {};

  function setField(k: string, v: any) {
    const next = { ...s, [k]: v };
    save.mutate(next);
  }

  return (
    <div className="p-10 max-w-3xl">
      <p className="eyebrow">System</p>
      <h1 className="font-display text-4xl mt-2">Settings</h1>

      {q.isLoading ? (
        <Loader2 className="w-6 h-6 animate-spin mt-8 text-muted-foreground" />
      ) : (
        <>
          <div className="mt-8 space-y-4">
            <Toggle label="Registration open" value={!!s.registrationEnabled} onChange={(v) => setField("registrationEnabled", v)} />
            <Toggle label="Require payment before registration" value={!!s.requirePaymentBeforeRegistration} onChange={(v) => setField("requirePaymentBeforeRegistration", v)} />
            <Toggle label="Voting open" value={!!s.votingEnabled} onChange={(v) => setField("votingEnabled", v)} />
            <NumberField label="Registration fee (₦)" value={s.registrationFee ?? 0} onSave={(v) => setField("registrationFee", v)} />
            <NumberField label="Price per vote (₦)" value={s.pricePerVote ?? 0} onSave={(v) => setField("pricePerVote", v)} />
          </div>

          <div className="mt-10">
            <p className="eyebrow mb-2">Raw settings (advanced)</p>
            <textarea rows={14} value={json} onChange={(e) => setJson(e.target.value)} className="w-full font-mono text-xs px-3 py-3 bg-card border border-input" />
            {err && <p className="text-xs text-destructive mt-2">{err}</p>}
            <button
              onClick={() => {
                setErr(null);
                try { save.mutate(JSON.parse(json)); }
                catch (e: any) { setErr("Invalid JSON: " + e.message); }
              }}
              className="btn-primary mt-3"
            >{save.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save raw JSON"}</button>
            {save.error && <p className="text-xs text-destructive mt-2">{(save.error as Error).message}</p>}
          </div>
        </>
      )}
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between border border-border p-4 cursor-pointer bg-card">
      <span className="text-sm">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors ${value ? "bg-primary" : "bg-muted"}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-background transition-all ${value ? "left-5" : "left-0.5"}`} />
      </button>
    </label>
  );
}

function NumberField({ label, value, onSave }: { label: string; value: number; onSave: (v: number) => void }) {
  const [v, setV] = useState(value);
  useEffect(() => { setV(value); }, [value]);
  return (
    <div className="flex items-center justify-between border border-border p-4 bg-card gap-3">
      <span className="text-sm flex-1">{label}</span>
      <input type="number" value={v} onChange={(e) => setV(Number(e.target.value))} className="w-32 h-9 px-2 bg-background border border-input text-sm text-right" />
      <button onClick={() => onSave(v)} className="text-xs uppercase tracking-widest text-primary hover:underline">Save</button>
    </div>
  );
}
