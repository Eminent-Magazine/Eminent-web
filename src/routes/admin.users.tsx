import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Upload, Check, X, Download } from "lucide-react";
import { Admin, type AdminUser } from "@/lib/pageantApi";
import { Pagination } from "@/components/site/Pagination";
import { TableBodySkeleton, type SkeletonColDef } from "@/components/site/Skeleton";

export const Route = createFileRoute("/admin/users")({
  component: UsersPage,
});

const SKELETON_COLS: SkeletonColDef[] = [
  { type: "text", widths: ["65%"] },
  { type: "text", widths: ["80%"] },
  { type: "text", widths: ["50%"] },
  { type: "badge" },
  { type: "text", widths: ["45%"] },
  { type: "square" },
];

/** Escapes a cell value for CSV — wraps in quotes if it contains commas, quotes, or newlines. */
function csvCell(val: string | null | undefined): string {
  const s = (val ?? "").replace(/\r?\n/g, " ").trim();
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function downloadCSV(rows: AdminUser[], filename: string) {
  const headers = ["Name", "Email", "Phone", "Category", "Bio"];
  const lines = [
    headers.join(","),
    ...rows.map((u) => [u.name, u.email, u.phone, u.category, u.bio].map(csvCell).join(",")),
  ];
  const blob = new Blob([lines.join("\r\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function UsersPage() {
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<AdminUser | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [downloading, setDownloading] = useState(false);
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleDownload() {
    setDownloading(true);
    try {
      // Fetch all records matching current filters in one shot
      const res = await Admin.users({ status, search, page: 1, limit: 5000 });
      const all: AdminUser[] = (res as any)?.data ?? [];
      const label = status ? `_${status}` : "";
      downloadCSV(all, `applications${label}_${new Date().toISOString().slice(0, 10)}.csv`);
    } finally {
      setDownloading(false);
    }
  }

  const usersQ = useQuery({
    queryKey: ["admin-users", status, search, page, pageSize],
    queryFn: () => Admin.users({ status, search, page, limit: pageSize }),
  });
  const approve = useMutation({
    mutationFn: (id: string) => Admin.approveUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });
  const reject = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string }) => Admin.rejectUser(id, notes),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });
  const del = useMutation({
    mutationFn: (id: string) => Admin.deleteUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });
  const upload = useMutation({
    mutationFn: (f: File) => Admin.bulkUpload(f),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });

  const users = usersQ.data?.data ?? [];
  const pagination = usersQ.data?.pagination;
  const total = pagination?.totalItems ?? 0;
  const totalPages = pagination?.totalPages ?? 1;
  const hasNextPage = pagination?.hasNextPage;
  const hasPrevPage = pagination?.hasPrevPage;
  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, total);

  return (
    <div className="p-4 sm:p-6 md:p-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-6 gap-4">
        <div>
          <p className="eyebrow">Applications</p>
          <h1 className="font-display text-3xl sm:text-4xl mt-2">Contestant applications</h1>
        </div>
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 items-center">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="h-10 px-3 cursor-pointer border border-input bg-card text-sm min-w-0"
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search name/email…"
            className="h-10 px-3 border border-input bg-card text-sm min-w-0 sm:w-56"
          />
          <input
            ref={fileRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            hidden
            onChange={(e) => e.target.files?.[0] && upload.mutate(e.target.files[0])}
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="btn-outline-gold cursor-pointer !h-10 !px-4 !text-xs inline-flex items-center justify-center gap-2 col-span-2 sm:col-span-1"
          >
            {upload.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}{" "}
            Bulk upload
          </button>
          <button
            onClick={handleDownload}
            disabled={downloading || total === 0}
            title="Download all matching records as CSV"
            className="btn-outline-gold cursor-pointer !h-10 !px-4 !text-xs inline-flex items-center justify-center gap-2 col-span-2 sm:col-span-1 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {downloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}{" "}
            Export CSV
          </button>
        </div>
      </div>

      {upload.data && (
        <p className="text-xs text-muted-foreground mb-4">
          Uploaded · {upload.data.imported ?? 0} imported
          {upload.data.errors?.length ? `, ${upload.data.errors.length} errors` : ""}
        </p>
      )}

      <div className="border border-border overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-secondary/60">
            <tr className="text-left text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {usersQ.isLoading && <TableBodySkeleton cols={SKELETON_COLS} rows={pageSize} />}
            {!usersQ.isLoading && users.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-muted-foreground">
                  No applications yet.
                </td>
              </tr>
            )}
            {users.map((u) => {
              const isApproving = approve.isPending && approve.variables === u._id;
              const isRejecting = reject.isPending && reject.variables?.id === u._id;
              return (
                <tr
                  key={u._id}
                  className="border-t border-border hover:bg-secondary/40 cursor-pointer"
                  onClick={() => setSelected(u)}
                >
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-3">{u.category ?? "—"}</td>
                  <td className="px-4 py-3">
                    <StatusChip s={u.contestantStatus} />
                  </td>
                  <td className="px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">
                    {u.paymentStatus ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1" onClick={(e) => e.stopPropagation()}>
                      {u.contestantStatus !== "approved" && (
                        <button
                          title="Approve"
                          onClick={() => approve.mutate(u._id)}
                          disabled={isApproving}
                          className="w-8 h-8 grid cursor-pointer place-items-center border border-input hover:border-green-200 hover:text-green-200"
                        >
                          {isApproving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                        </button>
                      )}
                      {u.contestantStatus !== "rejected" && (
                        <button
                          title="Reject"
                          onClick={() => {
                            const n = prompt("Rejection notes:") ?? "";
                            if (n) reject.mutate({ id: u._id, notes: n });
                          }}
                          disabled={isRejecting}
                          className="w-8 h-8 grid cursor-pointer place-items-center border border-input hover:border-destructive hover:text-destructive"
                        >
                          {isRejecting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        start={start}
        end={end}
        pageSize={pageSize}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
        onPageChange={setPage}
        onPageSizeChange={(n) => {
          setPageSize(n);
          setPage(1);
        }}
      />

      {selected && (
        <UserDrawer
          user={selected}
          onClose={() => setSelected(null)}
          onDelete={(id) => {
            del.mutate(id);
            setSelected(null);
          }}
        />
      )}
    </div>
  );
}

function StatusChip({ s }: { s?: string }) {
  const cls =
    s === "approved"
      ? "bg-green-200/15 text-green-200"
      : s === "rejected"
        ? "bg-destructive/15 text-destructive"
        : "bg-muted text-muted-foreground";
  return (
    <span className={`inline-block text-[10px] uppercase tracking-widest px-2 py-1 ${cls}`}>
      {s ?? "pending"}
    </span>
  );
}

function UserDrawer({
  user,
  onClose,
  onDelete,
}: {
  user: AdminUser;
  onClose: () => void;
  onDelete: (id: string) => void;
}) {
  const qc = useQueryClient();
  const [form, setForm] = useState<AdminUser>(user);
  const save = useMutation({
    mutationFn: () => Admin.updateUser(user._id, form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      onClose();
    },
  });

  return (
    <div
      className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm flex justify-end"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-background border-l border-border p-6 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="eyebrow">Application</p>
            <h2 className="font-display text-2xl mt-1">{user.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer w-8 h-8 grid place-items-center border border-input hover:border-red-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3 text-sm">
          {(["name", "email", "phone", "category", "bio"] as const).map((f) => (
            <label key={f} className="block">
              <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                {f}
              </span>
              {f === "bio" ? (
                <textarea
                  rows={4}
                  value={(form as any)[f] ?? ""}
                  onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-card border border-input text-sm"
                />
              ) : (
                <input
                  value={(form as any)[f] ?? ""}
                  onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                  className="w-full mt-1 h-10 px-3 bg-card border border-input text-sm"
                />
              )}
            </label>
          ))}
        </div>
        <div className="mt-6 flex gap-2">
          <button
            onClick={() => save.mutate()}
            disabled={save.isPending}
            className="btn-primary-ivory flex-1"
          >
            {save.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
          </button>
          <button
            onClick={() => {
              if (confirm("Delete this application?")) onDelete(user._id);
            }}
            className="px-4 h-10 border border-destructive text-destructive text-xs uppercase tracking-widest"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
