"use client";

import { getRequestsApi } from "@/api/transfar";
import {
  TRANSFER_PER_PAGE,
  type TransferListParams,
} from "@/lib/transfer-query";
import { parseTransferListResponse } from "@/lib/transfer-list-parse";
import type { RequestItem, TransferResponse } from "@/types/transfar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export function useTransferList(params: TransferListParams) {
  const listParams: TransferListParams = useMemo(
    () => ({
      type: params.type ?? "all",
      status: params.status,
      search: params.search?.trim() || undefined,
      pharmacist_name: params.pharmacist_name?.trim() || undefined,
      creator_name: params.creator_name?.trim() || undefined,
      from_date: params.from_date,
      to_date: params.to_date,
      per_page: params.per_page ?? TRANSFER_PER_PAGE,
    }),
    [
      params.type,
      params.status,
      params.search,
      params.pharmacist_name,
      params.creator_name,
      params.from_date,
      params.to_date,
      params.per_page,
    ]
  );

  const paramsKey = useMemo(() => JSON.stringify(listParams), [listParams]);
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [items, setItems] = useState<RequestItem[]>([]);
  const [accumulated, setAccumulated] = useState(false);
  const navModeRef = useRef<"append" | "replace">("replace");

  useEffect(() => {
    setPage(1);
    setItems([]);
    setAccumulated(false);
    navModeRef.current = "replace";
  }, [paramsKey]);

  const query = useQuery({
    queryKey: ["transfers", "list", listParams, page],
    queryFn: async () => {
      const res = await getRequestsApi({ ...listParams, page });
      if (!res.ok) {
        throw new Error(res.error ?? "Failed to load transfers");
      }
      return parseTransferListResponse(res.data as TransferResponse);
    },
  });

  useEffect(() => {
    if (!query.data) return;

    if (navModeRef.current === "append" && page > 1) {
      setItems((prev) => [...prev, ...query.data.items]);
    } else {
      setItems(query.data.items);
    }
    navModeRef.current = "replace";
  }, [query.data, page]);

  const pagination = query.data?.pagination;
  const hasMore =
    pagination != null && pagination.current_page < pagination.last_page;

  const loadMore = useCallback(() => {
    if (!hasMore || query.isFetching) return;
    navModeRef.current = "append";
    setAccumulated(true);
    setPage((p) => p + 1);
  }, [hasMore, query.isFetching]);

  const goToPage = useCallback(
    (targetPage: number) => {
      if (
        !pagination ||
        targetPage < 1 ||
        targetPage > pagination.last_page ||
        targetPage === page
      ) {
        return;
      }
      navModeRef.current = "replace";
      setAccumulated(false);
      setPage(targetPage);
    },
    [pagination, page]
  );

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["transfers", "list"] });
  }, [queryClient]);

  return {
    items,
    pagination,
    totals: query.data?.totals,
    isLoading: query.isLoading && items.length === 0,
    isFetching: query.isFetching,
    accumulated,
    hasMore,
    loadMore,
    goToPage,
    page,
    refresh,
    error: query.error,
  };
}

/** Total count for badges (page=1, per_page=1). */
export function useTransferTotal(params: TransferListParams) {
  const listParams: TransferListParams = useMemo(
    () => ({
      ...params,
      page: 1,
      per_page: 1,
    }),
    [params]
  );

  return useQuery({
    queryKey: ["transfers", "total", listParams],
    queryFn: async () => {
      const res = await getRequestsApi(listParams);
      if (!res.ok) return 0;
      return parseTransferListResponse(res.data as TransferResponse).pagination
        .total;
    },
  });
}
