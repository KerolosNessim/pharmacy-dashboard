"use client";

import { Button } from "@/components/ui/button";
import { getShownRange } from "@/lib/list-parse";
import type { LaravelPagination } from "@/types/pagination";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

type ListPaginationProps = {
  pagination: LaravelPagination;
  loadedCount: number;
  accumulated?: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  isLoadingMore?: boolean;
  onPageChange?: (page: number) => void;
};

export function ListPagination({
  pagination,
  loadedCount,
  accumulated = false,
  hasMore,
  onLoadMore,
  isLoadingMore = false,
  onPageChange,
}: ListPaginationProps) {
  const { current_page, last_page, total } = pagination;
  const { from, to } = getShownRange(pagination, loadedCount, accumulated);

  const goToPage = (page: number) => {
    if (page < 1 || page > last_page || page === current_page) return;
    onPageChange?.(page);
  };

  const pageNumbers = Array.from({ length: last_page }, (_, i) => i + 1).filter(
    (page) =>
      page === 1 ||
      page === last_page ||
      Math.abs(page - current_page) <= 1
  );

  return (
    <div className="flex flex-col items-center gap-3 pt-4">
      <p className="text-sm text-muted-foreground">
        {total === 0
          ? "No results"
          : `Showing ${from}–${to} of ${total}`}
        {last_page > 1 && ` · Page ${current_page} of ${last_page}`}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {onPageChange && last_page > 1 && (
          <>
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={current_page <= 1 || isLoadingMore}
              onClick={() => goToPage(current_page - 1)}
              aria-label="Previous page"
            >
              <ChevronLeft className="size-4" />
            </Button>

            {pageNumbers.map((pageNum, index) => {
              const prev = pageNumbers[index - 1];
              const showEllipsis = prev != null && pageNum - prev > 1;
              return (
                <span key={pageNum} className="flex items-center gap-1">
                  {showEllipsis && (
                    <span className="px-1 text-muted-foreground">…</span>
                  )}
                  <Button
                    type="button"
                    variant={pageNum === current_page ? "default" : "outline"}
                    size="sm"
                    disabled={isLoadingMore}
                    onClick={() => goToPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                </span>
              );
            })}

            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={current_page >= last_page || isLoadingMore}
              onClick={() => goToPage(current_page + 1)}
              aria-label="Next page"
            >
              <ChevronRight className="size-4" />
            </Button>
          </>
        )}

        {hasMore && (
          <Button
            type="button"
            variant="secondary"
            onClick={onLoadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Loading…
              </>
            ) : (
              "Load more"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
