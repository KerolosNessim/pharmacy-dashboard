import { TRANSFER_PER_PAGE } from "@/lib/api-pagination";

export { TRANSFER_PER_PAGE };

export type TransferListParams = {
  type?: string;
  status?: string;
  search?: string;
  /** URL / form field names */
  from_date?: string;
  to_date?: string;
  page?: number;
  per_page?: number;
};

/** Builds `/transfers?...` query (Laravel page + per_page pagination). */
export function buildTransferQueryString(
  params: TransferListParams = {}
): string {
  const qs = new URLSearchParams();
  qs.set("type", params.type ?? "all");
  qs.set("page", String(params.page ?? 1));
  qs.set("per_page", String(params.per_page ?? TRANSFER_PER_PAGE));

  const search = params.search?.trim();
  if (search) qs.set("search", search);

  if (params.status && params.status !== "all") {
    qs.set("status", params.status);
  }

  if (params.from_date) qs.set("date_from", params.from_date);
  if (params.to_date) qs.set("date_to", params.to_date);

  return `?${qs.toString()}`;
}
