import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, X } from "lucide-react";
import { Admin } from "@/lib/pageantApi";
import { Pagination } from "@/components/site/Pagination";
import { TableBodySkeleton, type SkeletonColDef } from "@/components/site/Skeleton";

export const Route = createFileRoute("/admin/transactions")({
  component: TxPage,
});

const SKELETON_COLS: SkeletonColDef[] = [
  { type: "text", widths: ["90%"] }, // reference (mono)
  { type: "text", widths: ["60%", "75%"] }, // payer name + email
  { type: "text", widths: ["45%"] }, // type
  { type: "text", widths: ["40%"] }, // amount
  { type: "text", widths: ["30%"] }, // votes
  { type: "badge" }, // status
  { type: "text", widths: ["70%"] }, // date
];

function TxPage() {
  const [ref, setRef] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const q = useQuery({
    queryKey: ["admin-tx", page, pageSize],
    queryFn: () => Admin.transactions({ page, limit: pageSize }),
    refetchInterval: 20_000,
  });

  const txs = q.data?.transactions ?? [];
  const pagination = q.data?.pagination;
  const total = pagination?.totalItems ?? 0;
  const totalPages = pagination?.totalPages ?? 1;
  const hasNextPage = pagination?.hasNextPage;
  const hasPrevPage = pagination?.hasPrevPage;
  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, total);

  return (
    <div className="p-4 sm:p-6 md:p-10">
      <p className="eyebrow">Payments</p>
      <h1 className="font-display text-3xl sm:text-4xl mt-2">Transactions</h1>

      <div className="border border-border overflow-x-auto mt-8">
        <table className="w-full text-sm min-w-[760px]">
          <thead className="bg-secondary/60">
            <tr className="text-left text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Payer</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Votes</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {q.isLoading && <TableBodySkeleton cols={SKELETON_COLS} rows={pageSize} />}
            {!q.isLoading && txs.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-muted-foreground">
                  No transactions yet.
                </td>
              </tr>
            )}
            {txs.map((t) => (
              <tr
                key={t.reference}
                className="border-t border-border hover:bg-secondary/40 cursor-pointer"
                onClick={() => setRef(t.reference)}
              >
                <td className="px-4 py-2 font-mono text-xs">{t.reference}</td>
                <td className="px-4 py-2">
                  {t.fullName ?? "—"}
                  <br />
                  <span className="text-xs text-muted-foreground">{t.email}</span>
                </td>
                <td className="px-4 py-2 text-xs uppercase tracking-widest">{t.type ?? "vote"}</td>
                <td className="px-4 py-2 tabular-nums">₦{(t.amount ?? 0).toLocaleString()}</td>
                <td className="px-4 py-2 tabular-nums">{t.numberOfVotes ?? "—"}</td>
                <td className="px-4 py-2">
                  <span
                    className={`text-[10px] uppercase tracking-widest px-2 py-1 ${t.status === "success" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}
                  >
                    {t.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-xs text-muted-foreground">
                  {t.createdAt ? new Date(t.createdAt).toLocaleString() : ""}
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

      {ref && <TxDialog reference={ref} onClose={() => setRef(null)} />}
    </div>
  );
}

function TxDialog({ reference, onClose }: { reference: string; onClose: () => void }) {
  const q = useQuery({ queryKey: ["tx", reference], queryFn: () => Admin.transaction(reference) });
  return (
    <div
      className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm grid place-items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-background border border-border max-w-lg w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between mb-4">
          <h2 className="font-display text-2xl">Transaction</h2>
          <button onClick={onClose}>
            <X className="w-4 h-4" />
          </button>
        </div>
        {q.isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        ) : (
          <pre className="text-xs bg-secondary/40 border border-border p-4 overflow-auto max-h-96">
            {JSON.stringify(q.data?.transaction ?? q.data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
