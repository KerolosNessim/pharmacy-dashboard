import { getPharmacistsApi } from "@/api/pharmacists";
import { PRODUCTS_PER_PAGE } from "@/lib/api-pagination";
import { parseFlatListResponse } from "@/lib/list-parse";
import type { Pharmacist } from "@/types/pharmacists";

export const PHARMACIST_OPTIONS_QUERY_KEY = ["pharmacists", "options"] as const;

export async function fetchPharmacistOptions(): Promise<Pharmacist[]> {
  const res = await getPharmacistsApi({ page: 1, per_page: PRODUCTS_PER_PAGE });
  if (!res.ok) return [];
  return parseFlatListResponse<Pharmacist>(res.data).items;
}
