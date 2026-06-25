import type { user } from "@/types/auth";
import type { RequestItem } from "@/types/transfar";

type TransferPharmacyRef = Pick<
  RequestItem,
  "from_pharmacy_id" | "to_pharmacy_id" | "from_pharmacy" | "to_pharmacy"
>;

function getUserPharmacyId(user: user | null | undefined): number | null {
  if (user?.pharmacy_id == null || user.pharmacy_id === "") return null;
  const id = Number(user.pharmacy_id);
  return Number.isFinite(id) ? id : null;
}

function matchesPharmacyByName(
  userPharmacyName: string | null | undefined,
  transferPharmacyName: string | undefined
): boolean {
  if (!userPharmacyName?.trim() || !transferPharmacyName?.trim()) return false;
  return userPharmacyName.trim() === transferPharmacyName.trim();
}

/** User belongs to the source pharmacy (from_pharmacy) — receives incoming requests. */
export function isUserSourcePharmacy(
  user: user | null | undefined,
  transfer: TransferPharmacyRef
): boolean {
  const userPharmacyId = getUserPharmacyId(user);
  if (userPharmacyId != null && transfer.from_pharmacy_id != null) {
    return userPharmacyId === transfer.from_pharmacy_id;
  }
  return matchesPharmacyByName(user?.pharmacy_name, transfer.from_pharmacy);
}

/** User belongs to the requesting pharmacy (to_pharmacy) — created the request. */
export function isUserDestinationPharmacy(
  user: user | null | undefined,
  transfer: TransferPharmacyRef
): boolean {
  const userPharmacyId = getUserPharmacyId(user);
  if (userPharmacyId != null && transfer.to_pharmacy_id != null) {
    return userPharmacyId === transfer.to_pharmacy_id;
  }
  return matchesPharmacyByName(user?.pharmacy_name, transfer.to_pharmacy);
}
