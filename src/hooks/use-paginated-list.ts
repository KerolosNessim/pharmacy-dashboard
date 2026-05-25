"use client";

import type { LaravelPagination, ParsedListResult } from "@/types/pagination";
import { LIST_PER_PAGE } from "@/lib/api-pagination";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type UsePaginatedListOptions<T> = {
  queryKey: unknown[];
  fetchPage: (page: number) => Promise<ParsedListResult<T>>;
  perPage?: number;
  enabled?: boolean;
};

export function usePaginatedList<T>({
  queryKey,
  fetchPage,
  perPage = LIST_PER_PAGE,
  enabled = true,
}: UsePaginatedListOptions<T>) {
  const paramsKey = useMemo(() => JSON.stringify(queryKey), [queryKey]);
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [items, setItems] = useState<T[]>([]);
  const [accumulated, setAccumulated] = useState(false);
  const navModeRef = useRef<"append" | "replace">("replace");

  useEffect(() => {
    setPage(1);
    setItems([]);
    setAccumulated(false);
    navModeRef.current = "replace";
  }, [paramsKey]);

  const query = useQuery({
    queryKey: [...queryKey, page, perPage],
    queryFn: () => fetchPage(page),
    enabled,
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
    queryClient.invalidateQueries({ queryKey });
  }, [queryClient, queryKey]);

  return {
    items,
    pagination: pagination as LaravelPagination | undefined,
    isLoading: query.isLoading && items.length === 0,
    isFetching: query.isFetching,
    accumulated,
    hasMore: !!hasMore,
    loadMore,
    goToPage,
    page,
    refresh,
    error: query.error,
  };
}
