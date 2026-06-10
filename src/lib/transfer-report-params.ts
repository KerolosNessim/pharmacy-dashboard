import type { TransferReportParams } from "@/lib/transfer-query";
import type { user } from "@/types/auth";

type ReportFilterInput = Omit<TransferReportParams, "from_date" | "to_date">;

/** Form value meaning "do not send pharmacy_id" (all pharmacies). */
export const REPORT_ALL_PHARMACIES = "all";

export function isSuperAdmin(user: user | null | undefined) {
  return user?.role === "super_admin";
}

export function showReportPharmacyField(user: user | null | undefined) {
  return isSuperAdmin(user);
}

/** @deprecated Supervisors/pharmacists use token; only admin may filter optionally. */
export function requiresReportPharmacy(_user: user | null | undefined) {
  return false;
}

export function buildResolvedReportFilters(
  reportFilters: ReportFilterInput | undefined,
  user: user | null,
  selectedPharmacyId?: string,
): ReportFilterInput {
  const admin = isSuperAdmin(user);
  const { pharmacy_id: _ignored, ...restFilters } = reportFilters ?? {};

  let pharmacy_id: string | undefined;

  if (admin) {
    const picked =
      selectedPharmacyId && selectedPharmacyId !== REPORT_ALL_PHARMACIES
        ? selectedPharmacyId
        : undefined;
    pharmacy_id = picked;
  }

  return {
    ...restFilters,
    pharmacy_id,
  };
}

export function buildAllPharmaciesReportFilename(
  from_date: string,
  to_date: string,
) {
  return `transfer_report_all_pharmacies_${from_date}to${to_date}.xlsx`;
}
