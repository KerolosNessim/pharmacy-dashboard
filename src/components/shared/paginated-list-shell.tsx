"use client";

import { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { ListPagination } from "@/components/shared/list-pagination";
import { usePaginatedList } from "@/hooks/use-paginated-list";
import type { ParsedListResult } from "@/types/pagination";

type PaginatedListShellProps<T> = {
  queryKey: unknown[];
  fetchPage: (page: number) => Promise<ParsedListResult<T>>;
  perPage?: number;
  enabled?: boolean;
  renderItem: (item: T, index: number) => ReactNode;
  emptyContent: ReactNode;
  listClassName?: string;
};

export function PaginatedListShell<T>({
  queryKey,
  fetchPage,
  perPage,
  enabled,
  renderItem,
  emptyContent,
  listClassName,
}: PaginatedListShellProps<T>) {
  const {
    items,
    pagination,
    isLoading,
    isFetching,
    accumulated,
    hasMore,
    loadMore,
    goToPage,
  } = usePaginatedList({ queryKey, fetchPage, perPage, enabled });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (items.length === 0) {
    return <>{emptyContent}</>;
  }

  return (
    <>
      <div className={listClassName}>{items.map(renderItem)}</div>
      {pagination && pagination.total > 0 && (
        <ListPagination
          pagination={pagination}
          loadedCount={items.length}
          accumulated={accumulated}
          hasMore={hasMore}
          onLoadMore={loadMore}
          isLoadingMore={isFetching}
          onPageChange={goToPage}
        />
      )}
    </>
  );
}
