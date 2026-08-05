import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Pencil, Trash2, TrendingUp, X } from "lucide-react";
import { Admin, type Candidate } from "@/lib/pageantApi";
import { Pagination } from "@/components/site/Pagination";
import { TableBodySkeleton, type SkeletonColDef } from "@/components/site/Skeleton";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/contestants")({
  component: ContestantsPage,
});

const SKELETON_COLS: SkeletonColDef[] = [
  { type: "avatar" },
  { type: "text", widths: ["70%"] },
  { type: "text", widths: ["55%"] },
  { type: "text", widths: ["30%"] },
  { type: "text", widths: ["40%"] },
  { type: "square" },
];

function ContestantsPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Candidate | "new" | null>(null);
  const [voteFor, setVoteFor] = useState<Candidate | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const q = useQuery({
    queryKey: ["candidates-admin", page, pageSize],
    queryFn: () => Admin.candidates({ page, limit: pageSize }),
  });
  const del = useMutation({
    mutationFn: (id: string) => Admin.deleteCandidate(id),
    onSuccess: () => { 
      toast.success("Candidate Deleted"); 
      qc.invalidateQueries({ queryKey: ["candidates-admin"] }) },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to delete"),
  });

  const candidates = q.data?.candidates ?? [];
  const pagination = q.data?.pagination;
  const total = pagination?.totalItems ?? 0;
  const totalPages = pagination?.totalPages ?? 1;
  const hasNextPage = pagination?.hasNextPage;
  const hasPrevPage = pagination?.hasPrevPage;
  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, total);

  return (
    <div className="p-4 sm:p-6 md:p-10">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-6 gap-4">
        <div>
          <p className="eyebrow">Contestants</p>
          <h1 className="font-display text-3xl sm:text-4xl mt-2">Active contestants</h1>
        </div>
        <button
          onClick={() => setEditing("new")}
          className="btn-primary inline-flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> New contestant
        </button>
      </div>

      <div className="border border-border overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-secondary/60">
            <tr className="text-left text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              <th className="px-4 py-3">Photo</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Age</th>
              <th className="px-4 py-3">Votes</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {q.isLoading && <TableBodySkeleton cols={SKELETON_COLS} rows={pageSize} />}
            {!q.isLoading && candidates.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-muted-foreground">
                  No contestants yet.
                </td>
              </tr>
            )}
            {candidates.map((c) => (
              <tr key={c._id} className="border-t border-border">
                <td className="px-4 py-2">
                  {c.photo ? (
                    <img src={c.photo} className="w-10 h-10 object-cover rounded-full" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-muted" />
                  )}
                </td>
                <td className="px-4 py-2 font-medium">{c.name}</td>
                <td className="px-4 py-2">{c.category ?? "—"}</td>
                <td className="px-4 py-2">{c.age ?? "—"}</td>
                <td className="px-4 py-2 tabular-nums">{(c.votes ?? 0).toLocaleString()}</td>
                <td className="px-4 py-2 text-right">
                  <div className="inline-flex gap-1">
                    <button
                      type="button"
                      title="Adjust votes"
                      onClick={() => setVoteFor(c)}
                      className="w-8 h-8 grid cursor-pointer place-items-center border border-input hover:border-gold hover:text-gold"
                    >
                      <TrendingUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      title="Edit"
                      onClick={() => setEditing(c)}
                      className="w-8 h-8 grid cursor-pointer place-items-center border border-input hover:border-green-200 hover:text-green-200"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      title="Delete"
                      onClick={() => {
                        if (confirm(`Delete ${c.name}?`)) del.mutate(c._id);
                      }}
                      className="w-8 h-8 grid cursor-pointer place-items-center border border-input hover:border-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
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

      {editing && (
        <EditDialog value={editing === "new" ? null : editing} onClose={() => setEditing(null)} />
      )}
      {voteFor && <AdjustVotesDialog candidate={voteFor} onClose={() => setVoteFor(null)} />}
    </div>
  );
}

function EditDialog({ value, onClose }: { value: Candidate | null; onClose: () => void }) {
  const qc = useQueryClient();
  const [f, setF] = useState<Partial<Candidate>>(
    value ?? { name: "", age: 20, photo: "", bio: "", category: "" },
  );
  const save = useMutation({
    mutationFn: () =>
      value ? Admin.updateCandidate(value._id, f) : Admin.createCandidate(f as any),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["candidates-admin"] });
      onClose();
    },
  });

  return (
    <div
      className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm grid place-items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-background border border-border max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between mb-4">
          <h2 className="font-display text-2xl">{value ? "Edit contestant" : "New contestant"}</h2>
          <button onClick={onClose} className="cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          <input
            placeholder="Name"
            value={f.name ?? ""}
            onChange={(e) => setF({ ...f, name: e.target.value })}
            className="w-full h-10 px-3 bg-card border border-input text-sm"
          />
          <input
            type="number"
            placeholder="Age"
            value={f.age ?? ""}
            onChange={(e) => setF({ ...f, age: Number(e.target.value) })}
            className="w-full h-10 px-3 bg-card border border-input text-sm"
          />
          <input
            placeholder="Category"
            value={f.category ?? ""}
            onChange={(e) => setF({ ...f, category: e.target.value })}
            className="w-full h-10 px-3 bg-card border border-input text-sm"
          />
          <input
            placeholder="Photo URL"
            value={f.photo ?? ""}
            onChange={(e) => setF({ ...f, photo: e.target.value })}
            className="w-full h-10 px-3 bg-card border border-input text-sm"
          />
          <textarea
            placeholder="Bio"
            rows={4}
            value={f.bio ?? ""}
            onChange={(e) => setF({ ...f, bio: e.target.value })}
            className="w-full px-3 py-2 bg-card border border-input text-sm"
          />
        </div>
        {save.error && (
          <p className="text-xs text-destructive mt-3">{(save.error as Error).message}</p>
        )}
        <button
          disabled={save.isPending}
          onClick={() => save.mutate()}
          className="btn-ghost-ivory w-full mt-5"
        >
          {save.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
        </button>
      </div>
    </div>
  );
}

function AdjustVotesDialog({ candidate, onClose }: { candidate: Candidate; onClose: () => void }) {
  const qc = useQueryClient();
  const [votes, setVotes] = useState(0);
  const [reason, setReason] = useState("");
  const m = useMutation({
    mutationFn: () => Admin.addVotes(candidate._id, votes, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["candidates-admin"] });
      onClose();
    },
  });
  return (
    <div
      className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm grid place-items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-background border border-border max-w-sm w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-2xl">Adjust votes</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {candidate.name} — currently {(candidate.votes ?? 0).toLocaleString()}
        </p>
        <div className="space-y-3 mt-4">
          <input
            type="number"
            placeholder="Votes to add (negative to subtract)"
            value={votes}
            onChange={(e) => setVotes(Number(e.target.value))}
            className="w-full h-10 px-3 bg-card border border-input text-sm"
          />
          <input
            placeholder="Reason (audit log)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full h-10 px-3 bg-card border border-input text-sm"
          />
        </div>
        {m.error && <p className="text-xs text-destructive mt-3">{(m.error as Error).message}</p>}
        <button
          disabled={m.isPending || !reason}
          onClick={() => m.mutate()}
          className="btn-primary-ivory w-full mt-5"
        >
          {m.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
        </button>
      </div>
    </div>
  );
}
