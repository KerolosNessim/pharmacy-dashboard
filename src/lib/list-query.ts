import { LIST_PER_PAGE, PRODUCTS_PER_PAGE } from "@/lib/api-pagination";

export type BaseListParams = {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  [key: string]: string | number | undefined;
};

export function buildListQueryString(
  params: BaseListParams = {},
  options?: { defaultPerPage?: number }
): string {
  const qs = new URLSearchParams();
  const perPage = params.per_page ?? options?.defaultPerPage ?? LIST_PER_PAGE;

  qs.set("page", String(params.page ?? 1));
  qs.set("per_page", String(perPage));

  Object.entries(params).forEach(([key, value]) => {
    if (key === "page" || key === "per_page") return;
    if (value == null || value === "") return;
    qs.set(key, String(value));
  });

  return qs.toString() ? `?${qs.toString()}` : "";
}

export { LIST_PER_PAGE, PRODUCTS_PER_PAGE };
