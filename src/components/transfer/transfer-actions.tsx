"use client";

import {
  acceptRequestApi,
  activateRequestApi,
  completeRequestApi,
  markTransferredApi,
  rejectRequestApi,
} from "@/api/transfar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { invalidateTransferQueries } from "@/lib/invalidate-transfer-queries";
import { getTransferStatusBadgeVariant, normalizeTransferStatus } from "@/lib/transfer-status";
import { useTransferPharmacyRole } from "@/hooks/use-transfer-pharmacy-role";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/stores/user-store";
import type { RequestItem } from "@/types/transfar";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Clock, Loader2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type TransferActionsProps = {
  transfar: RequestItem;
  className?: string;
};

export function TransferActions({ transfar, className }: TransferActionsProps) {
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [activateLoading, setActivateLoading] = useState(false);
  const [completeLoading, setCompleteLoading] = useState(false);
  const [markTransferLoading, setMarkTransferLoading] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [reason, setReason] = useState("");
  const [acceptNotes, setAcceptNotes] = useState("");
  const queryClient = useQueryClient();
  const { user } = useUserStore();
  const { isSourcePharmacy, isDestinationPharmacy } =
    useTransferPharmacyRole(transfar);
  const status = normalizeTransferStatus(transfar.status);

  const onSuccess = (message?: string) => {
    if (message) toast.success(message);
    invalidateTransferQueries(queryClient, transfar.id);
  };

  const handleAccept = async () => {
    setAcceptLoading(true);
    const res = await acceptRequestApi(transfar.id, acceptNotes);
    if (res?.ok) {
      onSuccess(res.data?.message);
      setIsAccepted(false);
      setAcceptNotes("");
    } else {
      toast.error(res?.error);
    }
    setAcceptLoading(false);
  };

  const handleReject = async () => {
    setRejectLoading(true);
    const res = await rejectRequestApi(transfar.id, reason);
    if (res?.ok) {
      onSuccess(res.data?.message);
    } else {
      toast.error(res?.error);
    }
    setRejectLoading(false);
    setIsRejected(false);
    setReason("");
  };

  const handleActivate = async () => {
    setActivateLoading(true);
    const res = await activateRequestApi(transfar.id);
    if (res?.ok) {
      onSuccess(res.data?.message);
    } else {
      toast.error(res?.error);
    }
    setActivateLoading(false);
  };

  const handleComplete = async () => {
    setCompleteLoading(true);
    const res = await completeRequestApi(transfar.id);
    if (res?.ok) {
      onSuccess(res.data?.message);
    } else {
      toast.error(res?.error);
    }
    setCompleteLoading(false);
  };

  const handleMarkTransfer = async () => {
    setMarkTransferLoading(true);
    const res = await markTransferredApi(transfar.id);
    if (res?.ok) {
      onSuccess(res.data?.message);
    } else {
      toast.error(res?.error);
    }
    setMarkTransferLoading(false);
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="flex w-full flex-wrap items-center justify-between gap-2">
        {user?.role !== "super_admin" && (
          <div className="flex flex-wrap items-center gap-2">
            {isSourcePharmacy &&
              !transfar.can_activate &&
              !transfar.can_complete &&
              status === "pending" && (
                <>
                  <Button
                    onClick={() => {
                      setIsAccepted(!isAccepted);
                      setIsRejected(false);
                    }}
                    disabled={acceptLoading}
                  >
                    <Check className="size-5" />
                    Accept
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setIsRejected(!isRejected);
                      setIsAccepted(false);
                    }}
                  >
                    Reject
                  </Button>
                </>
              )}

            {user?.role === "supervisor" &&
              isSourcePharmacy &&
              !transfar.can_activate &&
              !transfar.can_complete &&
              status === "approved" && (
                <Button
                  onClick={handleMarkTransfer}
                  disabled={markTransferLoading}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  {markTransferLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="mr-2 size-5" />
                  )}
                  Mark as Transfer
                </Button>
              )}

            {isDestinationPharmacy && transfar.can_activate && (
              <Button
                onClick={handleActivate}
                disabled={activateLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {activateLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Clock className="mr-2 size-5" />
                )}
                Mark as Active
              </Button>
            )}

            {isDestinationPharmacy && transfar.can_complete && (
              <Button
                onClick={handleComplete}
                disabled={completeLoading}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {completeLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Check className="mr-2 size-5" />
                )}
                Mark as Complete
              </Button>
            )}
          </div>
        )}

        <Badge
          variant={getTransferStatusBadgeVariant(transfar.status)}
          className="shrink-0 ms-auto"
        >
          {transfar.status}
        </Badge>
      </div>

      {isRejected && (
        <div className="space-y-4 w-full mt-4">
          <p className="text-base text-muted-foreground font-semibold">
            Rejection Reason:
          </p>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter rejection reason"
            className="min-h-[80px] focus-visible:ring-primary"
          />
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={rejectLoading}
            className="ms-auto"
          >
            {rejectLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <X className="size-5" />
            )}
            Confirm Reject
          </Button>
        </div>
      )}

      {isAccepted && (
        <div className="space-y-4 w-full mt-4">
          <p className="text-base text-muted-foreground font-semibold">
            Acceptance Notes (Optional):
          </p>
          <Textarea
            value={acceptNotes}
            onChange={(e) => setAcceptNotes(e.target.value)}
            placeholder="Enter any notes for this approval"
            className="min-h-[80px] focus-visible:ring-primary"
          />
          <Button
            onClick={handleAccept}
            disabled={acceptLoading}
            className="ms-auto"
          >
            {acceptLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Check className="size-5" />
            )}
            Confirm Accept
          </Button>
        </div>
      )}
    </div>
  );
}
