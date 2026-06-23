"use client";

import { getTransferByIdApi } from "@/api/transfar";
import type { TransferDetails } from "@/types/transfar";
import { useQuery } from "@tanstack/react-query";

export class TransferDetailsError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "TransferDetailsError";
    this.status = status;
  }
}

export function useTransferDetails(id: number) {
  return useQuery<TransferDetails, TransferDetailsError>({
    queryKey: ["transfers", "detail", id],
    queryFn: async () => {
      const res = await getTransferByIdApi(id);
      if (!res.ok) {
        throw new TransferDetailsError(
          res.error ?? "Failed to load transfer",
          res.status
        );
      }
      return res.data!.data;
    },
    enabled: Number.isFinite(id) && id > 0,
  });
}
