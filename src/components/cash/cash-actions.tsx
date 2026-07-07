"use client";

import {
  markCashReceivedFromDriverApi,
  markCashRefundApi,
  markCashSubmittedToFinanceApi,
} from "@/api/cash";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  CASH_PAYMENT_METHOD_OPTIONS,
  getCashStatusBadgeVariant,
  getCashStatusLabel,
} from "@/lib/cash-status";
import { cn } from "@/lib/utils";
import type { Cash, CashPaymentMethod } from "@/types/cash";
import { useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Banknote, Loader2, RotateCcw, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type CashActionsProps = {
  invoice: Cash;
  className?: string;
  onSuccess?: (invoice: Cash) => void;
};

type ActionModal = "received" | "refund" | "finance" | null;

export function CashActions({ invoice, className, onSuccess }: CashActionsProps) {
  const queryClient = useQueryClient();
  const [activeModal, setActiveModal] = useState<ActionModal>(null);
  const [paymentMethod, setPaymentMethod] = useState<CashPaymentMethod>("cash");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const hasDeliveryRep = invoice.delivery_representative_id != null;
  const showNoRepWarning =
    !hasDeliveryRep && invoice.status === "delivery";

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["cash"] });
    queryClient.invalidateQueries({ queryKey: ["cash", invoice.id] });
  };

  const handleSuccess = (data?: Cash, message?: string) => {
    if (message) toast.success(message);
    invalidate();
    if (data) onSuccess?.(data);
    closeModal();
  };

  const closeModal = () => {
    setActiveModal(null);
    setNotes("");
    setPaymentMethod("cash");
    setLoading(false);
  };

  const handleMarkReceived = async () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    setLoading(true);
    const res = await markCashReceivedFromDriverApi(invoice.id, {
      payment_method: paymentMethod,
      notes: notes.trim() || undefined,
    });

    if (res?.ok) {
      handleSuccess(res.data?.data, res.data?.message);
    } else {
      toast.error(res?.error);
      setLoading(false);
    }
  };

  const handleMarkRefund = async () => {
    setLoading(true);
    const res = await markCashRefundApi(invoice.id, {
      notes: notes.trim() || undefined,
    });

    if (res?.ok) {
      handleSuccess(res.data?.data, res.data?.message);
    } else {
      toast.error(res?.error);
      setLoading(false);
    }
  };

  const handleMarkSubmittedToFinance = async () => {
    setLoading(true);
    const res = await markCashSubmittedToFinanceApi(invoice.id, {
      notes: notes.trim() || undefined,
    });

    if (res?.ok) {
      handleSuccess(res.data?.data, res.data?.message);
    } else {
      toast.error(res?.error);
      setLoading(false);
    }
  };

  const hasActions =
    invoice.can_mark_received_from_driver ||
    invoice.can_mark_refund ||
    invoice.can_mark_submitted_to_finance;

  return (
    <div className={cn("w-full", className)}>
      {showNoRepWarning && (
        <div className="mb-3 flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-sm text-amber-800 dark:text-amber-300">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <p>
            A delivery representative must be assigned to perform receive/refund
            actions.
          </p>
        </div>
      )}

      <div className="flex w-full flex-wrap items-center justify-between gap-2">
        {hasActions && (
          <div className="flex flex-wrap items-center gap-2">
            {invoice.can_mark_received_from_driver && (
              <Button
                onClick={() => setActiveModal("received")}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Truck className="size-4" />
                Mark as Received from Driver
              </Button>
            )}

            {invoice.can_mark_refund && (
              <Button
                variant="destructive"
                onClick={() => setActiveModal("refund")}
              >
                <RotateCcw className="size-4" />
                Mark as Refund
              </Button>
            )}

            {invoice.can_mark_submitted_to_finance && (
              <Button
                onClick={() => setActiveModal("finance")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Banknote className="size-4" />
                Mark as Submitted to Finance
              </Button>
            )}
          </div>
        )}

        <Badge
          variant={getCashStatusBadgeVariant(invoice.status)}
          className="shrink-0 ms-auto"
        >
          {getCashStatusLabel(invoice.status, invoice.status_label)}
        </Badge>
      </div>

      <Dialog
        open={activeModal === "received"}
        onOpenChange={(open) => !open && closeModal()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as Received from Driver</DialogTitle>
            <DialogDescription>
              Select the payment method used when receiving this invoice from the
              driver.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) =>
                setPaymentMethod(value as CashPaymentMethod)
              }
              className="flex flex-col gap-3"
            >
              {CASH_PAYMENT_METHOD_OPTIONS.map((option) => (
                <div key={option.value} className="flex items-center gap-3">
                  <RadioGroupItem
                    value={option.value}
                    id={`payment-${option.value}`}
                  />
                  <Label
                    htmlFor={`payment-${option.value}`}
                    className="cursor-pointer font-normal"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="space-y-2">
              <Label htmlFor="received-notes">Notes (optional)</Label>
              <Textarea
                id="received-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes..."
                className="min-h-[80px] resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeModal} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleMarkReceived} disabled={loading}>
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Confirm"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={activeModal === "refund"}
        onOpenChange={(open) => !open && closeModal()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as Refund</DialogTitle>
            <DialogDescription>
              This invoice will be recorded as refunded and cannot be submitted
              to finance. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="refund-notes">Notes (optional)</Label>
            <Textarea
              id="refund-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Reason for refund..."
              className="min-h-[80px] resize-none"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeModal} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleMarkRefund}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Confirm Refund"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={activeModal === "finance"}
        onOpenChange={(open) => !open && closeModal()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as Submitted to Finance</DialogTitle>
            <DialogDescription>
              Confirm that this invoice has been submitted to the finance
              department.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="finance-notes">Notes (optional)</Label>
            <Textarea
              id="finance-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes..."
              className="min-h-[80px] resize-none"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeModal} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleMarkSubmittedToFinance} disabled={loading}>
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Confirm"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
