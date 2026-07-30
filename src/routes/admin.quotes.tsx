import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, X, Trash2 } from "lucide-react";
import { Admin, type QuoteRequest, type QuoteStatus, type QuoteService } from "@/lib/pageantApi";
import { Pagination, usePagination } from "@/components/site/Pagination";


export const Route = createFileRoute("/admin/quotes")({
  component: QuotesPage,
});

const STATUSES: QuoteStatus[] = ["new", "read", "quoted", "archived"];
const SERVICES: QuoteService[] = [
  "Videography & Film",
  "Editorial & Cover Features",
  "Branding & Printing",
  "PR & Advertising",
  "Pageant Production",
  "Ushering & Talent",
];

function unwrap(d: any): QuoteRequest[] {
  if (!d) return [];
  if (Array.isArray(d)) return d;
  if (Array.isArray(d.quotes)) return d.quotes;
  if (Array.isArray(d.data)) return d.data;
  if (Array.isArray(d.data?.quotes)) return d.data.quotes;
  return [];
}

function QuotesPage() {
  const [status, setStatus] = useState<QuoteStatus | "">("");
  const [service, setService] = useState<string>("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const q = useQuery({
    queryKey: ["admin-quotes", status, service],
    queryFn: () => Admin.quotes({ status: status || undefined, service: service || undefined }),
    refetchInterval: 30_000,
  });
  const rows = unwrap(q.data);
  const pg = usePagination(rows, page, pageSize);

  return (
    <div className="p-4 sm:p-6 md:p-10">
      <p className="eyebrow">Sales</p>
      <h1 className="font-display text-3xl sm:text-4xl mt-2">Quote requests</h1>

      <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-3 mt-6">
        <select value={status} onChange={(e) => { setStatus(e.target.value as any); setPage(1); }} className="h-10 px-3 bg-card border border-input text-sm">
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={service} onChange={(e) => { setService(e.target.value); setPage(1); }} className="h-10 px-3 bg-card border border-input text-sm">
          <option value="">All services</option>
          {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="border border-border overflow-x-auto mt-6">
        <table className="w-full text-sm min-w-[760px]">
          <thead className="bg-secondary/60">
            <tr className="text-left text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              <th className="px-4 py-3">From</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Preview</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {q.isLoading && <tr><td colSpan={6} className="p-6 text-center"><Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" /></td></tr>}
            {!q.isLoading && rows.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No quote requests.</td></tr>}
            {pg.pageItems.map((r) => (
              <tr key={r._id} className="border-t border-border hover:bg-secondary/40 cursor-pointer" onClick={() => setOpenId(r._id)}>
                <td className="px-4 py-3">
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.email}</div>
                </td>
                <td className="px-4 py-3 text-xs uppercase tracking-widest">{r.service}</td>
                <td className="px-4 py-3 text-xs">{r.phone}</td>
                <td className="px-4 py-3 text-muted-foreground max-w-sm truncate">{r.message}</td>
                <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{r.createdAt ? new Date(r.createdAt).toLocaleString() : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        page={pg.page}
        totalPages={pg.totalPages}
        total={pg.total}
        start={pg.start}
        end={pg.end}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(n) => { setPageSize(n); setPage(1); }}
      />

      {openId && <QuoteDialog id={openId} onClose={() => setOpenId(null)} />}
    </div>
  );
}

function StatusBadge({ status }: { status: QuoteStatus }) {
  const cls: Record<QuoteStatus, string> = {
    new: "bg-primary/15 text-primary",
    read: "bg-muted text-muted-foreground",
    quoted: "bg-emerald-500/15 text-emerald-500",
    archived: "bg-secondary text-muted-foreground",
  };
  return <span className={`text-[10px] uppercase tracking-widest px-2 py-1 ${cls[status]}`}>{status}</span>;
}

function QuoteDialog({ id, onClose }: { id: string; onClose: () => void }) {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin-quote", id], queryFn: () => Admin.quote(id) });
  const r: QuoteRequest | undefined = (q.data as any)?.quote ?? (q.data as any);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<QuoteStatus>("new");

  useEffect(() => {
    if (r) { setNotes(r.adminNotes ?? ""); setStatus(r.status); }
  }, [r?._id]);


  const save = useMutation({
    mutationFn: () => Admin.updateQuote(id, { status, adminNotes: notes }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-quotes"] });
      qc.invalidateQueries({ queryKey: ["admin-quote", id] });
    },
  });
  const del = useMutation({
    mutationFn: () => Admin.deleteQuote(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-quotes"] }); onClose(); },
  });

  return (
    <div className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm grid place-items-center p-4" onClick={onClose}>
      <div className="bg-background border border-border max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between mb-4">
          <h2 className="font-display text-2xl">Quote request</h2>
          <button onClick={onClose}><X className="w-4 h-4" /></button>
        </div>
        {q.isLoading || !r ? <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /> : (
          <div className="space-y-4 text-sm">
            <div>
              <p className="eyebrow">From</p>
              <p className="mt-1 font-medium">{r.name} <span className="text-muted-foreground">· {r.email} · {r.phone}</span></p>
            </div>
            <div>
              <p className="eyebrow">Service</p>
              <p className="mt-1">{r.service}</p>
            </div>
            <div>
              <p className="eyebrow">Message</p>
              <p className="mt-1 whitespace-pre-wrap leading-relaxed bg-secondary/40 border border-border p-3">{r.message}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="eyebrow mb-1">Status</p>
                <select value={status} onChange={(e) => setStatus(e.target.value as QuoteStatus)} className="w-full h-10 px-3 bg-card border border-input text-sm">
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex items-end justify-end gap-2">
                <button onClick={() => del.mutate()} className="h-10 px-3 border border-destructive/40 text-destructive text-xs uppercase tracking-widest inline-flex items-center gap-2 hover:bg-destructive/10">
                  {del.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Trash2 className="w-4 h-4" /> Delete</>}
                </button>
              </div>
            </div>
            <div>
              <p className="eyebrow mb-1">Admin notes</p>
              <textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-3 py-2 bg-card border border-input text-sm" />
            </div>
            <div className="flex justify-end">
              <button onClick={() => save.mutate()} disabled={save.isPending} className="btn-primary-ivory">
                {save.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save changes"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
