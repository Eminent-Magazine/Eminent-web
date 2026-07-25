import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Upload, Check, X } from "lucide-react";
import { Admin, type AdminUser } from "@/lib/pageantApi";

export const Route = createFileRoute("/admin/users")({
  component: UsersPage,
});

function UsersPage() {
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<AdminUser | null>(null);
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const usersQ = useQuery({ queryKey: ["admin-users", status, search], queryFn: () => Admin.users({ status, search }), });
  const approve = useMutation({ mutationFn: (id: string) => Admin.approveUser(id), onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }) });
  const reject = useMutation({ mutationFn: ({ id, notes }: { id: string; notes: string }) => Admin.rejectUser(id, notes), onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }) });
  const del = useMutation({ mutationFn: (id: string) => Admin.deleteUser(id), onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }) });
  const upload = useMutation({
    mutationFn: (f: File) => Admin.bulkUpload(f),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });

  const users = usersQ.data ?? [];

  return (
    <div className="p-10">
      <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
        <div>
          <p className="eyebrow">Applications</p>
          <h1 className="font-display text-4xl mt-2">Contestant applications</h1>
        </div>
        <div className="flex gap-2 items-center">
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 px-3 cursor-pointer border border-input bg-card text-sm">
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name/email…" className="h-10 px-3 border border-input bg-card text-sm w-56" />
          <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" hidden onChange={(e) => e.target.files?.[0] && upload.mutate(e.target.files[0])} />
          <button onClick={() => fileRef.current?.click()} className="btn-outline-gold cursor-pointer !h-10 !px-4 !text-xs inline-flex items-center gap-2">
            {upload.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} Bulk upload
          </button>
        </div>
      </div>

      {upload.data && (
        <p className="text-xs text-muted-foreground mb-4">
          Uploaded · {upload.data.imported ?? 0} imported{upload.data.errors?.length ? `, ${upload.data.errors.length} errors` : ""}
        </p>
      )}

      <div className="border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60">
            <tr className="text-left text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              <th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Payment</th><th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {usersQ.isLoading && <tr><td colSpan={6} className="p-6 text-center"><Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" /></td></tr>}
            {!usersQ.isLoading && users.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No applications yet.</td></tr>}
            {users.map((u) => {
              const isApproving = approve.isPending && approve.variables === u._id;
              const isRejecting = reject.isPending && reject.variables?.id === u._id;
              return (
                <tr key={u._id} className="border-t border-border hover:bg-secondary/40 cursor-pointer" onClick={() => setSelected(u)}>
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-3">{u.category ?? "—"}</td>
                  <td className="px-4 py-3"><StatusChip s={u.contestantStatus} /></td>
                  <td className="px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">{u.paymentStatus ?? "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1" onClick={(e) => e.stopPropagation()}>
                      {u.contestantStatus !== "approved" && (
                        <button
                          title="Approve"
                          onClick={() => approve.mutate(u._id)}
                          disabled={isApproving}
                          className="w-8 h-8 grid cursor-pointer place-items-center border border-input hover:border-green-200 hover:text-green-200"
                        >
                          {isApproving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        </button>
                      )}
                      {u.contestantStatus !== "rejected" && (
                        <button
                          title="Reject"
                          onClick={() => { const n = prompt("Rejection notes:") ?? ""; if (n) reject.mutate({ id: u._id, notes: n }); }}
                          disabled={isRejecting}
                          className="w-8 h-8 grid cursor-pointer place-items-center border border-input hover:border-destructive hover:text-destructive"
                        >
                          {isRejecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {selected && <UserDrawer user={selected} onClose={() => setSelected(null)} onDelete={(id) => { del.mutate(id); setSelected(null); }} />}
    </div>
  );
}

function StatusChip({ s }: { s?: string }) {
  const cls = s === "approved" ? "bg-green-200/15 text-green-200" : s === "rejected" ? "bg-destructive/15 text-destructive" : "bg-muted text-muted-foreground";
  return <span className={`inline-block text-[10px] uppercase tracking-widest px-2 py-1 ${cls}`}>{s ?? "pending"}</span>;
}

function UserDrawer({ user, onClose, onDelete }: { user: AdminUser; onClose: () => void; onDelete: (id: string) => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState<AdminUser>(user);
  const save = useMutation({
    mutationFn: () => Admin.updateUser(user._id, form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-users"] }); onClose(); },
  });

  return (
    <div className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm flex justify-end" onClick={onClose}>
      <div className="w-full max-w-md bg-background border-l border-border p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="eyebrow">Application</p>
            <h2 className="font-display text-2xl mt-1">{user.name}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 grid place-items-center border border-input"><X className="w-4 h-4" /></button>
        </div>
        <div className="space-y-3 text-sm">
          {(["name", "email", "phone", "category", "bio"] as const).map((f) => (
            <label key={f} className="block">
              <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{f}</span>
              {f === "bio" ? (
                <textarea rows={4} value={(form as any)[f] ?? ""} onChange={(e) => setForm({ ...form, [f]: e.target.value })} className="w-full mt-1 px-3 py-2 bg-card border border-input text-sm" />
              ) : (
                <input value={(form as any)[f] ?? ""} onChange={(e) => setForm({ ...form, [f]: e.target.value })} className="w-full mt-1 h-10 px-3 bg-card border border-input text-sm" />
              )}
            </label>
          ))}
        </div>
        <div className="mt-6 flex gap-2">
          <button onClick={() => save.mutate()} disabled={save.isPending} className="btn-primary-ivory flex-1">{save.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}</button>
          <button onClick={() => { if (confirm("Delete this application?")) onDelete(user._id); }} className="px-4 h-10 border border-destructive text-destructive text-xs uppercase tracking-widest">Delete</button>
        </div>
      </div>
    </div>
  );
}
