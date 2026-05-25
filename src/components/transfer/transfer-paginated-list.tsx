"use client";

import { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { useTransferList } from "@/hooks/use-transfer-list";
import type { TransferListParams } from "@/lib/transfer-query";
import type { RequestItem } from "@/types/transfar";
import { TransferPagination } from "./transfer-pagination";

type TransferPaginatedListProps = {
  listParams: TransferListParams;
  renderItem: (item: RequestItem, index: number) => ReactNode;
  emptyContent: ReactNode;
  listClassName?: string;
};

export function TransferPaginatedList({
  listParams,
  renderItem,
  emptyContent,
  listClassName = "flex flex-col gap-2",
}: TransferPaginatedListProps) {
  const {
    items,
    pagination,
    isLoading,
    isFetching,
    accumulated,
    hasMore,
    loadMore,
    goToPage,
  } = useTransferList(listParams);

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
      <div className={listClassName}>
        {items.map((item, index) => renderItem(item, index))}
      </div>
      {pagination && pagination.total > 0 && (
        <TransferPagination
          pagination={pagination}
          loadedCount={items.length}
          accumulated={accumulated}
          hasMore={hasMore}
          onLoadMore={loadMore}
          isLoadingMore={isFetching && items.length > 0}
          onPageChange={goToPage}
        />
      )}
    </>
  );
}
