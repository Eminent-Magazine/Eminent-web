import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, X, Trash2, Search } from "lucide-react";
import { Admin, type ContactMessage, type MessageStatus } from "@/lib/pageantApi";
import { Pagination, usePagination } from "@/components/site/Pagination";


export const Route = createFileRoute("/admin/messages")({
  component: MessagesPage,
});

const STATUSES: MessageStatus[] = ["new", "read", "replied", "archived"];

function unwrapMessages(d: any): ContactMessage[] {
  if (!d) return [];
  if (Array.isArray(d)) return d;
  if (Array.isArray(d.messages)) return d.messages;
  if (Array.isArray(d.data)) return d.data;
  if (Array.isArray(d.data?.messages)) return d.data.messages;
  return [];
}

function MessagesPage() {
  const [status, setStatus] = useState<MessageStatus | "">("");
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const q = useQuery({
    queryKey: ["admin-messages", status, search],
    queryFn: () => Admin.messages({ status: status || undefined, search: search || undefined }),
    refetchInterval: 30_000,
  });
  const msgs = unwrapMessages(q.data);
  const pg = usePagination(msgs, page, pageSize);

  return (
    <div className="p-4 sm:p-6 md:p-10">
      <p className="eyebrow">Inbox</p>
      <h1 className="font-display text-3xl sm:text-4xl mt-2">Contact messages</h1>

      <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-6">
        <div className="relative flex-1 min-w-0 sm:min-w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search name, email, message…"
            className="w-full h-10 pl-9 pr-3 bg-card border border-input text-sm"
          />
        </div>
        <select value={status} onChange={(e) => { setStatus(e.target.value as any); setPage(1); }} className="h-10 px-3 bg-card border border-input text-sm">
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="border border-border overflow-x-auto mt-6">
        <table className="w-full text-sm min-w-[720px]">
          <thead className="bg-secondary/60">
            <tr className="text-left text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              <th className="px-4 py-3">From</th>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">Preview</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {q.isLoading && <tr><td colSpan={5} className="p-6 text-center"><Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" /></td></tr>}
            {!q.isLoading && msgs.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No messages.</td></tr>}
            {pg.pageItems.map((m) => (
              <tr key={m._id} className="border-t border-border hover:bg-secondary/40 cursor-pointer" onClick={() => setOpenId(m._id)}>
                <td className="px-4 py-3">
                  <div className="font-medium">{m.name}</div>
                  <div className="text-xs text-muted-foreground">{m.email}</div>
                </td>
                <td className="px-4 py-3 text-xs uppercase tracking-widest">{m.subject}</td>
                <td className="px-4 py-3 text-muted-foreground max-w-md truncate">{m.message}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={m.status} />
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{m.createdAt ? new Date(m.createdAt).toLocaleString() : ""}</td>
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

      {openId && <MessageDialog id={openId} onClose={() => setOpenId(null)} />}
    </div>
  );
}

function StatusBadge({ status }: { status: MessageStatus }) {
  const cls: Record<MessageStatus, string> = {
    new: "bg-primary/15 text-primary",
    read: "bg-muted text-muted-foreground",
    replied: "bg-emerald-500/15 text-emerald-500",
    archived: "bg-secondary text-muted-foreground",
  };
  return <span className={`text-[10px] uppercase tracking-widest px-2 py-1 ${cls[status]}`}>{status}</span>;
}

function MessageDialog({ id, onClose }: { id: string; onClose: () => void }) {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin-message", id], queryFn: () => Admin.message(id) });
  const m: ContactMessage | undefined = (q.data as any)
  // ?.message ?? (q.data as any);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<MessageStatus>("new");

  useEffect(() => {
    if (m) { setNotes(m.adminNotes ?? ""); setStatus(m.status); }
  }, [m?._id]);


  const save = useMutation({
    mutationFn: () => Admin.updateMessage(id, { status, adminNotes: notes }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-messages"] });
      qc.invalidateQueries({ queryKey: ["admin-message", id] });
    },
  });
  const del = useMutation({
    mutationFn: () => Admin.deleteMessage(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-messages"] }); onClose(); },
  });

  return (
    <div className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm grid place-items-center p-4" onClick={onClose}>
      <div className="bg-background border border-border max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between mb-4">
          <h2 className="font-display text-2xl">Message</h2>
          <button onClick={onClose}><X className="cursor-pointer w-4 h-4" /></button>
        </div>
        {q.isLoading || !m ? <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /> : (
          <div className="space-y-4 text-sm">
            <div>
              <p className="eyebrow">From</p>
              <p className="mt-1 font-medium">{m.name} <span className="text-muted-foreground">· {m.email}</span></p>
            </div>
            <div>
              <p className="eyebrow">Subject</p>
              <p className="mt-1">{m.subject}</p>
            </div>
            <div>
              <p className="eyebrow">Message</p>
              <p className="mt-1 whitespace-pre-wrap leading-relaxed bg-secondary/40 border border-border p-3">{m.message}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="eyebrow mb-1">Status</p>
                <select value={status} onChange={(e) => setStatus(e.target.value as MessageStatus)} className="w-full h-10 px-3 bg-card border border-input text-sm">
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
