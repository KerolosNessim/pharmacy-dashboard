"use client";

import { getCashByIdApi, getCashLogsApi } from "@/api/cash";
import { CashActions } from "@/components/cash/cash-actions";
import { CashActivityLog } from "@/components/cash/cash-activity-log";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getCashStatusLabel } from "@/lib/cash-status";
import type { Cash } from "@/types/cash";
import { useQuery } from "@tanstack/react-query";
import { Eye, History, Loader2 } from "lucide-react";
import { useState } from "react";

type CashDetailsDialogProps = {
  invoice: Cash;
  trigger?: React.ReactNode;
};

export default function CashDetailsDialog({
  invoice: initialInvoice,
  trigger,
}: CashDetailsDialogProps) {
  const [open, setOpen] = useState(false);
  const [invoice, setInvoice] = useState(initialInvoice);

  const { data: detailRes, isLoading: detailLoading } = useQuery({
    queryKey: ["cash", initialInvoice.id, "detail"],
    queryFn: () => getCashByIdApi(initialInvoice.id),
    enabled: open,
    select: (res) => (res.ok ? res.data?.data : null),
  });

  const { data: logs, isLoading: logsLoading } = useQuery({
    queryKey: ["cash", initialInvoice.id, "logs"],
    queryFn: async () => {
      const res = await getCashLogsApi(initialInvoice.id);
      if (!res.ok) throw new Error(res.error ?? "Failed to load activity log");
      return res.data?.data ?? [];
    },
    enabled: open && !detailRes?.activity_log?.length,
  });

  const currentInvoice = detailRes ?? invoice;
  const activityItems =
    currentInvoice.activity_log?.length
      ? currentInvoice.activity_log
      : logs ?? [];

  const handleActionSuccess = (updated: Cash) => {
    setInvoice(updated);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setInvoice(initialInvoice);
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="icon" title="View Details">
            <Eye className="size-4" />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-2xl no-scrollbar">
        <DialogHeader>
          <DialogTitle className="flex flex-wrap items-center gap-2 text-lg font-semibold border-b pb-4">
            Invoice {currentInvoice.invoice_number ?? `#${currentInvoice.id}`}
            <Badge variant="approved">
              {getCashStatusLabel(
                currentInvoice.status,
                currentInvoice.status_label,
              )}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {detailLoading && !detailRes ? (
          <div className="flex justify-center py-12">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <DetailRow
                label="Pharmacy Invoice"
                value={currentInvoice.pharmacy_internal_invoice_number}
              />
              <DetailRow label="Amount" value={`${currentInvoice.amount} EGP`} />
              <DetailRow
                label="Customer"
                value={currentInvoice.customer_name}
              />
              <DetailRow label="Mobile" value={currentInvoice.mobile_no} />
              <DetailRow
                label="Delivery Rep"
                value={currentInvoice.delivery_representative?.name}
              />
              <DetailRow
                label="Rep Phone"
                value={currentInvoice.delivery_representative?.phone}
              />
              <DetailRow label="Pharmacy" value={currentInvoice.pharmacy_name} />
              <DetailRow
                label="Payment Method"
                value={currentInvoice.payment_method_label}
              />
              <DetailRow
                label="Neighborhood"
                value={currentInvoice.neighborhood}
              />
              <DetailRow label="Location" value={currentInvoice.location} />
              <DetailRow
                label="Created By"
                value={currentInvoice.created_by?.name}
              />
              <DetailRow
                label="Created At"
                value={new Date(currentInvoice.created_at).toLocaleString()}
              />
            </div>

            {currentInvoice.products_information && (
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  Products Information
                </p>
                <p className="rounded-md bg-muted/50 p-3 text-sm whitespace-pre-wrap">
                  {currentInvoice.products_information}
                </p>
              </div>
            )}

            {currentInvoice.notes && (
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  Notes
                </p>
                <p className="rounded-md bg-muted/50 p-3 text-sm whitespace-pre-wrap">
                  {currentInvoice.notes}
                </p>
              </div>
            )}

            <div className="border-t pt-4">
              <CashActions
                invoice={currentInvoice}
                onSuccess={handleActionSuccess}
              />
            </div>

            <div className="border-t pt-4">
              <div className="mb-4 flex items-center gap-2">
                <History className="size-5" />
                <div>
                  <p className="font-semibold">Activity Log</p>
                  <p className="text-sm text-muted-foreground">
                    Timeline of all status changes on this invoice.
                  </p>
                </div>
              </div>
              <CashActivityLog
                items={activityItems}
                isLoading={logsLoading && !activityItems.length}
              />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value?.trim() ? value : "-"}</p>
    </div>
  );
}
