"use client";

import {
  PHARMACY_OPTIONS_QUERY_KEY,
  fetchPharmacyOptions,
} from "@/lib/pharmacy-options";
import {
  isUserDestinationPharmacy,
  isUserSourcePharmacy,
} from "@/lib/transfer-permissions";
import { useUserStore } from "@/stores/user-store";
import type { RequestItem } from "@/types/transfar";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export function useTransferPharmacyRole(transfer: RequestItem) {
  const { user } = useUserStore();
  const { data: pharmacies = [] } = useQuery({
    queryKey: PHARMACY_OPTIONS_QUERY_KEY,
    queryFn: fetchPharmacyOptions,
    staleTime: 5 * 60 * 1000,
  });

  const userWithPharmacyName = useMemo(() => {
    if (!user) return null;
    if (user.pharmacy_name?.trim()) return user;

    const pharmacyId =
      user.pharmacy_id != null && user.pharmacy_id !== ""
        ? Number(user.pharmacy_id)
        : null;
    if (!pharmacyId) return user;

    const pharmacyName = pharmacies.find((p) => p.id === pharmacyId)?.name;
    if (!pharmacyName) return user;

    return { ...user, pharmacy_name: pharmacyName };
  }, [user, pharmacies]);

  return {
    isSourcePharmacy: isUserSourcePharmacy(userWithPharmacyName, transfer),
    isDestinationPharmacy: isUserDestinationPharmacy(
      userWithPharmacyName,
      transfer
    ),
  };
}
