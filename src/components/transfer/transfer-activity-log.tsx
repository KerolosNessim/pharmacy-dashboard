"use client";

import { Badge } from "@/components/ui/badge";
import {
  getActivityMetadataEntries,
  getPerformerName,
  getTransferActivityConfig,
  getTransferStatusBadgeClass,
  getTransferStatusLabel,
} from "@/lib/transfer-activity";
import { cn } from "@/lib/utils";
import type { TransferActivityLogItem } from "@/types/transfar";
import { ArrowRight, Clock, History, UserRound } from "lucide-react";

type TransferActivityLogProps = {
  items?: TransferActivityLogItem[];
  isLoading?: boolean;
};

export function TransferActivityLog({
  items,
  isLoading,
}: TransferActivityLogProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex gap-4">
            <div className="size-10 rounded-full bg-muted" />
            <div className="flex-1 space-y-2 pt-1">
              <div className="h-4 w-40 rounded bg-muted" />
              <div className="h-3 w-56 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!items?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
        <div className="size-12 rounded-full bg-muted/50 flex items-center justify-center">
          <History className="size-6 text-muted-foreground" />
        </div>
        <p className="font-medium text-foreground">No activity log</p>
      </div>
    );
  }

  return (
    <ol className="flex flex-col">
      {items.map((item, index) => {
        const config = getTransferActivityConfig(item.action);
        const Icon = config.icon;
        const performerName = getPerformerName(item);
        const rejectionReason =
          item.metadata?.rejection_reason != null
            ? String(item.metadata.rejection_reason)
            : null;
        const metadataEntries = getActivityMetadataEntries(item.metadata, {
          excludeRejectionReason: item.action === "rejected",
        });
        const showStatusTransition =
          item.from_status != null || item.to_status != null;

        return (
          <li key={item.id} className="relative flex gap-4 pb-8 last:pb-0">
            {index < items.length - 1 && (
              <span
                aria-hidden
                className="absolute start-5 top-10 bottom-0 w-px bg-border"
              />
            )}

            <div
              className={cn(
                "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-2",
                config.dotClass
              )}
            >
              <Icon className={cn("size-4", config.iconClass)} />
            </div>

            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="font-semibold text-foreground">{config.label}</p>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="size-3.5 shrink-0" />
                  <span>{item.created_at}</span>
                </p>
              </div>

              {performerName && (
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <UserRound className="size-3.5 shrink-0" />
                  <span>{performerName}</span>
                </p>
              )}

              {showStatusTransition && (
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs">
                  {item.from_status && (
                    <Badge
                      variant="outline"
                      className="rounded-full text-muted-foreground"
                    >
                      {getTransferStatusLabel(item.from_status)}
                    </Badge>
                  )}
                  {item.from_status && item.to_status && (
                    <ArrowRight className="size-3 text-muted-foreground" />
                  )}
                  {item.to_status && (
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-full",
                        getTransferStatusBadgeClass(item.to_status)
                      )}
                    >
                      {getTransferStatusLabel(item.to_status)}
                    </Badge>
                  )}
                </div>
              )}

              {item.notes?.trim() && (
                <p className="mt-2 rounded-md bg-background/60 p-2 text-sm whitespace-pre-wrap">
                  {item.notes}
                </p>
              )}

              {item.action === "rejected" && rejectionReason && (
                <div className="mt-2 rounded-md border border-red-500/20 bg-red-500/5 p-2 text-sm">
                  <p className="font-medium text-red-600 dark:text-red-400">
                    Rejection Reason
                  </p>
                  <p className="mt-1 text-foreground">{rejectionReason}</p>
                </div>
              )}

              {metadataEntries.length > 0 && (
                <div className="mt-2 flex flex-col gap-2">
                  {metadataEntries.map((entry) => (
                    <div
                      key={entry.key}
                      className="rounded-md bg-background/60 p-2 text-sm"
                    >
                      <p className="font-medium text-muted-foreground capitalize">
                        {entry.label}
                      </p>
                      <p className="mt-0.5 text-foreground whitespace-pre-wrap">
                        {entry.value}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
