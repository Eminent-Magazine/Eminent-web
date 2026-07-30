import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo } from "react";

export function usePagination<T>(items: T[], page: number, pageSize: number) {
  return useMemo(() => {
    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const start = (safePage - 1) * pageSize;
    return {
      total,
      totalPages,
      page: safePage,
      pageItems: items.slice(start, start + pageSize),
      start,
      end: Math.min(start + pageSize, total),
    };
  }, [items, page, pageSize]);
}

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  start: number;
  end: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  onPageSizeChange?: (n: number) => void;
  pageSizes?: number[];
}

export function Pagination({
  page,
  totalPages,
  total,
  start,
  end,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizes = [10, 25, 50, 100],
}: PaginationProps) {
  if (total === 0) return null;
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-4 text-xs text-muted-foreground">
      <p className="tabular-nums">
        Showing <span className="text-foreground">{start + 1}–{end}</span> of{" "}
        <span className="text-foreground">{total.toLocaleString()}</span>
      </p>
      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
        {onPageSizeChange && (
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-8 px-2 bg-card border border-input text-xs cursor-pointer"
            aria-label="Rows per page"
          >
            {pageSizes.map((n) => (
              <option key={n} value={n}>{n} / page</option>
            ))}
          </select>
        )}
        <div className="flex items-center gap-1">
          <button
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="w-8 h-8 grid place-items-center border border-input disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary hover:text-primary cursor-pointer"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 tabular-nums text-foreground">
            {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="w-8 h-8 grid place-items-center border border-input disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary hover:text-primary cursor-pointer"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
