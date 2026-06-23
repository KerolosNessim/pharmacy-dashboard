import type { LucideIcon } from "lucide-react";
import {
  ArrowRightLeft,
  Check,
  CheckCircle2,
  FilePlus,
  Play,
  X,
} from "lucide-react";
import type {
  TransferAction,
  TransferActivityLogItem,
  TransferPharmacyContext,
} from "@/types/transfar";
import { normalizeTransferStatus } from "@/lib/transfer-status";

export type TransferActivityConfig = {
  label: string;
  icon: LucideIcon;
  dotClass: string;
  iconClass: string;
};

const ACTIVITY_CONFIG: Record<TransferAction, TransferActivityConfig> = {
  created: {
    label: "Created",
    icon: FilePlus,
    dotClass: "bg-blue-500/15 border-blue-500/40",
    iconClass: "text-blue-600 dark:text-blue-400",
  },
  approved: {
    label: "Approved",
    icon: Check,
    dotClass: "bg-green-500/15 border-green-500/40",
    iconClass: "text-green-600 dark:text-green-400",
  },
  rejected: {
    label: "Rejected",
    icon: X,
    dotClass: "bg-red-500/15 border-red-500/40",
    iconClass: "text-red-600 dark:text-red-400",
  },
  transferred: {
    label: "Transferred",
    icon: ArrowRightLeft,
    dotClass: "bg-purple-500/15 border-purple-500/40",
    iconClass: "text-purple-600 dark:text-purple-400",
  },
  active: {
    label: "Activated",
    icon: Play,
    dotClass: "bg-orange-500/15 border-orange-500/40",
    iconClass: "text-orange-600 dark:text-orange-400",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    dotClass: "bg-emerald-600/15 border-emerald-600/40",
    iconClass: "text-emerald-700 dark:text-emerald-400",
  },
};

const FALLBACK_CONFIG: TransferActivityConfig = {
  label: "Action on transfer",
  icon: FilePlus,
  dotClass: "bg-muted border-border",
  iconClass: "text-muted-foreground",
};

export function getTransferActivityConfig(
  action: string
): TransferActivityConfig {
  const key = action.toLowerCase() as TransferAction;
  return ACTIVITY_CONFIG[key] ?? { ...FALLBACK_CONFIG, label: action };
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  transferred: "Transferred",
  active: "Active",
  completed: "Completed",
};

export function getTransferStatusLabel(status: string | null): string {
  if (!status) return "";
  const normalized = normalizeTransferStatus(status);
  return STATUS_LABELS[normalized] ?? status;
}

export function getTransferStatusBadgeClass(status: string): string {
  switch (normalizeTransferStatus(status)) {
    case "pending":
      return "bg-yellow-500/10 text-yellow-600 border-yellow-500/30 dark:bg-yellow-500/20 dark:text-yellow-400";
    case "approved":
      return "bg-green-500/10 text-green-600 border-green-500/30 dark:bg-green-500/20 dark:text-green-400";
    case "rejected":
      return "bg-red-500/10 text-red-600 border-red-500/30 dark:bg-red-500/20 dark:text-red-400";
    case "transferred":
      return "bg-purple-500/10 text-purple-600 border-purple-500/30 dark:bg-purple-500/20 dark:text-purple-400";
    case "active":
      return "bg-orange-500/10 text-orange-600 border-orange-500/30 dark:bg-orange-500/20 dark:text-orange-400";
    case "completed":
      return "bg-emerald-600/10 text-emerald-700 border-emerald-600/30 dark:bg-emerald-600/20 dark:text-emerald-400";
    default:
      return "bg-muted/50 text-muted-foreground border-border";
  }
}

const SOURCE_ACTIONS = new Set(["created", "transferred"]);
const DEST_ACTIONS = new Set(["approved", "rejected", "active", "completed"]);

function pickNamedValue(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (value && typeof value === "object") {
    const name = (value as { name?: unknown }).name;
    if (typeof name === "string" && name.trim()) return name.trim();
  }
  return null;
}

function inferPharmacyFromAction(
  action: string,
  transfer?: TransferPharmacyContext
): string | null {
  if (!transfer) return null;
  const normalized = action.trim().toLowerCase();
  if (SOURCE_ACTIONS.has(normalized)) {
    return transfer.from_pharmacy?.trim() || null;
  }
  if (DEST_ACTIONS.has(normalized)) {
    return transfer.to_pharmacy?.trim() || null;
  }
  return null;
}

export function getPerformerPharmacyName(
  item: TransferActivityLogItem,
  transfer?: TransferPharmacyContext
): string | null {
  const directCandidates: unknown[] = [
    item.performer_pharmacy_name,
    item.performer_pharmacy,
    item.pharmacy_name,
    item.pharmacy,
  ];

  for (const candidate of directCandidates) {
    const picked = pickNamedValue(candidate);
    if (picked) return picked;
  }

  const nestedObjects = [
    item.performer,
    item.user,
    item.performed_by,
  ];

  for (const obj of nestedObjects) {
    if (!obj || typeof obj !== "object") continue;
    const nestedCandidates: unknown[] = [
      obj.pharmacy_name,
      obj.pharmacy,
    ];
    for (const candidate of nestedCandidates) {
      const picked = pickNamedValue(candidate);
      if (picked) return picked;
    }
  }

  if (item.metadata && typeof item.metadata === "object") {
    const metadata = item.metadata as Record<string, unknown>;
    const metadataPharmacy =
      pickNamedValue(metadata.pharmacy_name) ??
      pickNamedValue(metadata.pharmacy);
    if (metadataPharmacy) return metadataPharmacy;
  }

  return inferPharmacyFromAction(item.action, transfer);
}

export function getPerformerName(item: TransferActivityLogItem): string | null {
  const directCandidates: unknown[] = [item.performer_name];

  for (const candidate of directCandidates) {
    const picked = pickNamedValue(candidate);
    if (picked) return picked;
  }

  const nestedObjects = [item.performer, item.user, item.performed_by];
  for (const obj of nestedObjects) {
    if (!obj || typeof obj !== "object") continue;
    const picked = pickNamedValue(obj.name);
    if (picked) return picked;
  }

  return null;
}

const METADATA_LABELS: Record<string, string> = {
  rejection_reason: "Rejection Reason",
};

export function getActivityMetadataEntries(
  metadata: TransferActivityLogItem["metadata"],
  options?: { excludeRejectionReason?: boolean }
): { key: string; label: string; value: string }[] {
  if (!metadata || typeof metadata !== "object") return [];

  return Object.entries(metadata)
    .filter(([key, value]) => {
      if (value == null || value === "") return false;
      if (options?.excludeRejectionReason && key === "rejection_reason") {
        return false;
      }
      return typeof value === "string" || typeof value === "number";
    })
    .map(([key, value]) => ({
      key,
      label: METADATA_LABELS[key] ?? key.replace(/_/g, " "),
      value: String(value),
    }));
}
