import type { LucideIcon } from "lucide-react";
import {
  Banknote,
  CheckCircle2,
  FilePlus,
  RotateCcw,
  Truck,
} from "lucide-react";
import type { CashActivityLogItem } from "@/types/cash";
import { getCashStatusLabel } from "@/lib/cash-status";

export type CashActivityConfig = {
  label: string;
  icon: LucideIcon;
  dotClass: string;
  iconClass: string;
};

const ACTIVITY_CONFIG: Record<string, CashActivityConfig> = {
  created: {
    label: "Created",
    icon: FilePlus,
    dotClass: "bg-blue-500/15 border-blue-500/40",
    iconClass: "text-blue-600 dark:text-blue-400",
  },
  mark_received_from_driver: {
    label: "Received from Driver",
    icon: Truck,
    dotClass: "bg-green-500/15 border-green-500/40",
    iconClass: "text-green-600 dark:text-green-400",
  },
  received_from_driver: {
    label: "Received from Driver",
    icon: Truck,
    dotClass: "bg-green-500/15 border-green-500/40",
    iconClass: "text-green-600 dark:text-green-400",
  },
  mark_refund: {
    label: "Marked as Refund",
    icon: RotateCcw,
    dotClass: "bg-red-500/15 border-red-500/40",
    iconClass: "text-red-600 dark:text-red-400",
  },
  refunded: {
    label: "Refunded",
    icon: RotateCcw,
    dotClass: "bg-red-500/15 border-red-500/40",
    iconClass: "text-red-600 dark:text-red-400",
  },
  mark_submitted_to_finance: {
    label: "Submitted to Finance",
    icon: Banknote,
    dotClass: "bg-emerald-600/15 border-emerald-600/40",
    iconClass: "text-emerald-700 dark:text-emerald-400",
  },
  delivered_to_finance: {
    label: "Delivered to Finance",
    icon: CheckCircle2,
    dotClass: "bg-emerald-600/15 border-emerald-600/40",
    iconClass: "text-emerald-700 dark:text-emerald-400",
  },
};

const FALLBACK_CONFIG: CashActivityConfig = {
  label: "Action",
  icon: FilePlus,
  dotClass: "bg-muted border-border",
  iconClass: "text-muted-foreground",
};

export function getCashActivityConfig(action: string): CashActivityConfig {
  const key = action.trim().toLowerCase();
  return (
    ACTIVITY_CONFIG[key] ?? {
      ...FALLBACK_CONFIG,
      label: action.replaceAll("_", " "),
    }
  );
}

export function getCashActivityStatusLabel(status: string | null): string {
  if (!status) return "";
  return getCashStatusLabel(status);
}

export function getActivityMetadataEntries(
  metadata: CashActivityLogItem["metadata"],
): { key: string; label: string; value: string }[] {
  if (!metadata || typeof metadata !== "object") return [];

  return Object.entries(metadata)
    .filter(([, value]) => value != null && value !== "")
    .map(([key, value]) => ({
      key,
      label: key.replace(/_/g, " "),
      value: String(value),
    }));
}
