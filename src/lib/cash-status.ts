import type { VariantProps } from "class-variance-authority";
import { badgeVariants } from "@/components/ui/badge";
import type { CashStatus } from "@/types/cash";

export const CASH_STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "delivery", label: "Delivery" },
  { value: "received_from_driver", label: "Received from Driver" },
  { value: "delivered_to_finance", label: "Delivered to Finance" },
  { value: "refunded", label: "Refund" },
] as const;

const STATUS_LABELS: Record<CashStatus, string> = {
  delivery: "Delivery",
  received_from_driver: "Received from Driver",
  delivered_to_finance: "Delivered to Finance",
  refunded: "Refund",
};

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

export function normalizeCashStatus(status: string): CashStatus | string {
  return status.trim().toLowerCase();
}

export function getCashStatusLabel(
  status: string,
  statusLabel?: string | null,
): string {
  if (statusLabel?.trim()) return statusLabel;
  const normalized = normalizeCashStatus(status) as CashStatus;
  return STATUS_LABELS[normalized] ?? status.replaceAll("_", " ");
}

export function getCashStatusBadgeVariant(status: string): BadgeVariant {
  switch (normalizeCashStatus(status)) {
    case "delivery":
      return "pending";
    case "received_from_driver":
      return "approved";
    case "delivered_to_finance":
      return "success";
    case "refunded":
      return "destructive";
    default:
      return "default";
  }
}

export const CASH_PAYMENT_METHOD_OPTIONS = [
  { value: "cash", label: "Cash" },
  { value: "span", label: "Span" },
  { value: "visa", label: "Visa" },
] as const;
