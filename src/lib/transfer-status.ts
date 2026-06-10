import type { VariantProps } from "class-variance-authority";
import { badgeVariants } from "@/components/ui/badge";

export const TRANSFER_STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All Status" },
  // { value: "incomplete", label: "Incomplete" },
  { value: "uncomplete", label: "Uncomplete" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "transferred", label: "Transferred" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
] as const;

export const REQUEST_OUT_STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All Status" },
  // { value: "incomplete", label: "Incomplete" },
  { value: "uncomplete", label: "Uncomplete" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "transferred", label: "Transferred" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
] as const;

export type TransferStatusFilterValue =
  (typeof TRANSFER_STATUS_FILTER_OPTIONS)[number]["value"];

type BadgeVariant = NonNullable<
  VariantProps<typeof badgeVariants>["variant"]
>;

export function normalizeTransferStatus(status: string): string {
  return status.trim().toLowerCase();
}

export function getTransferStatusBadgeVariant(
  status: string
): BadgeVariant {
  switch (normalizeTransferStatus(status)) {
    case "pending":
      return "pending";
    case "approved":
    case "active":
    case "transferred":
      return "approved";
    case "completed":
      return "success";
    case "rejected":
    case "cancelled":
      return "destructive";
    default:
      return "default";
  }
}
