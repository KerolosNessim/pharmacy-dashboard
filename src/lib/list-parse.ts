import { LIST_PER_PAGE } from "@/lib/api-pagination";
import type { LaravelPagination, ParsedListResult } from "@/types/pagination";

type ListPayload = {
  data?: unknown[];
  pagination?: Partial<LaravelPagination>;
  current_page?: number;
  last_page?: number;
  total?: number;
  per_page?: number;
};

function toPageNumber(value: unknown, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function resolvePagination(
  payload: ListPayload | undefined,
  fallbackPerPage = LIST_PER_PAGE
): LaravelPagination {
  const nested = payload?.pagination;
  const total = toPageNumber(nested?.total ?? payload?.total, 0);
  const per_page = toPageNumber(
    nested?.per_page ?? payload?.per_page,
    fallbackPerPage
  );
  const current_page = toPageNumber(
    nested?.current_page ?? payload?.current_page,
    1
  );
  const last_page = toPageNumber(
    nested?.last_page ?? payload?.last_page,
    total > 0 ? Math.max(1, Math.ceil(total / per_page)) : 1
  );

  return {
    current_page,
    last_page,
    per_page,
    total,
  };
}

/** `{ data: { data: T[], pagination? } }` or flat page fields on `data` — tasks, cash, … */
export function parseNestedListResponse<T>(
  body: { data?: ListPayload } | undefined,
  fallbackPerPage = LIST_PER_PAGE
): ParsedListResult<T> {
  const payload = body?.data;
  return {
    items: (payload?.data as T[] | undefined) ?? [],
    pagination: resolvePagination(payload, fallbackPerPage),
  };
}

/** `{ data: { data: T[], current_page, last_page, total, per_page? } }` — pharmacies, products, … */
export function parseFlatListResponse<T>(
  body: { data?: ListPayload } | undefined,
  fallbackPerPage = LIST_PER_PAGE
): ParsedListResult<T> {
  return parseNestedListResponse<T>(body, fallbackPerPage);
}

export function getShownRange(
  pagination: LaravelPagination,
  loadedCount: number,
  accumulated: boolean
) {
  if (pagination.total === 0 || loadedCount === 0) {
    return { from: 0, to: 0 };
  }

  if (accumulated) {
    return { from: 1, to: Math.min(loadedCount, pagination.total) };
  }

  const currentPage = pagination.current_page || 1;
  const perPage = pagination.per_page || LIST_PER_PAGE;
  const from = (currentPage - 1) * perPage + 1;
  const to = Math.min(from + loadedCount - 1, pagination.total);
  return { from, to };
}
