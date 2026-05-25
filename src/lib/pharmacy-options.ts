import { getPharmaciesApi } from "@/api/pharmacies";
import { PRODUCTS_PER_PAGE } from "@/lib/api-pagination";
import { parseFlatListResponse } from "@/lib/list-parse";
import type { Pharmacy } from "@/types/pharmacies";

/** Dropdown / filter selects — must not share `["pharmacies"]` with list prefetch. */
export const PHARMACY_OPTIONS_QUERY_KEY = ["pharmacies", "options"] as const;

/** Loads pharmacies for select dropdowns (up to 200). */
export async function fetchPharmacyOptions(): Promise<Pharmacy[]> {
  const res = await getPharmaciesApi({ page: 1, per_page: PRODUCTS_PER_PAGE });
  if (!res.ok) return [];
  return parseFlatListResponse<Pharmacy>(res.data).items;
}
