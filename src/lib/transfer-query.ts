import { TRANSFER_PER_PAGE } from "@/lib/api-pagination";

export { TRANSFER_PER_PAGE };

export type TransferListParams = {
  type?: string;
  status?: string;
  search?: string;
  pharmacist_name?: string;
  creator_name?: string;
  /** URL / form field names */
  from_date?: string;
  to_date?: string;
  page?: number;
  per_page?: number;
};

export type TransferReportParams = {
  from_date: string;
  to_date: string;
  type?: string;
  pharmacist_name?: string;
  creator_name?: string;
  status?: string;
  pharmacy_id?: number | string;
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

  const pharmacistName = params.pharmacist_name?.trim();
  if (pharmacistName) qs.set("pharmacist_name", pharmacistName);

  const creatorName = params.creator_name?.trim();
  if (creatorName) qs.set("creator_name", creatorName);

  if (params.status && params.status !== "all") {
    qs.set("status", params.status);
  }

  if (params.from_date) qs.set("date_from", params.from_date);
  if (params.to_date) qs.set("date_to", params.to_date);

  return `?${qs.toString()}`;
}

/** Builds `/reports/transfer?...` query string. */
export function buildTransferReportQueryString(
  params: TransferReportParams,
): string {
  const qs = new URLSearchParams();
  qs.set("from_date", params.from_date);
  qs.set("to_date", params.to_date);

  if (params.type && params.type !== "all") qs.set("type", params.type);

  const pharmacistName = params.pharmacist_name?.trim();
  if (pharmacistName) qs.set("pharmacist_name", pharmacistName);

  const creatorName = params.creator_name?.trim();
  if (creatorName) qs.set("creator_name", creatorName);

  if (params.status && params.status !== "all") {
    qs.set("status", params.status);
  }

  const pharmacyId = params.pharmacy_id;
  if (
    pharmacyId != null &&
    pharmacyId !== "" &&
    String(pharmacyId) !== "all"
  ) {
    qs.set("pharmacy_id", String(pharmacyId));
  }

  return `?${qs.toString()}`;
}

export function resolveReportPharmacyId(
  ...sources: Array<number | string | null | undefined>
): string | undefined {
  for (const source of sources) {
    if (source != null && String(source).trim() !== "") {
      return String(source).trim();
    }
  }
  return undefined;
}
