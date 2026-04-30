"use client";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { RequestItem } from "@/types/transfar";
import { Check, Clock, Loader2, Printer, X } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useState } from "react";
import { acceptRequestApi, activateRequestApi, completeRequestApi, rejectRequestApi, markTransferredApi } from "@/api/transfar";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Textarea } from "../ui/textarea";
import { useUserStore } from "@/stores/user-store";
const TransferIncomingCard = ({
  order,
  transfar,
}: {
  order: number;
  transfar: RequestItem;
}) => {
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
  const {user} = useUserStore();
  const handleAccept = async () => {
    setAcceptLoading(true);
    const res = await acceptRequestApi(transfar?.id, acceptNotes);
    if (res?.ok) {
      toast.success(res?.data?.message);
      queryClient.invalidateQueries({
        queryKey: ["transfers-incoming"],
      });
      queryClient.invalidateQueries({
        queryKey: ["transfer-out"],
      });
      setIsAccepted(false);
      setAcceptNotes("");
    } else {
      toast.error(res?.error);
    }
    setAcceptLoading(false);
  };
  const handleReject = async () => {
    setRejectLoading(true);
    const res = await rejectRequestApi(transfar?.id,reason);
    if (res?.ok) {
      toast.success(res?.data?.message);
      queryClient.invalidateQueries({
        queryKey: ["transfers-incoming"],
      });
      queryClient.invalidateQueries({
        queryKey: ["transfer-out"],
      });
    } else {
      toast.error(res?.error);
    }
    setRejectLoading(false);
    setIsRejected(false);
    setReason("");
  };

  const handleActivate = async () => {
    setActivateLoading(true);
    const res = await activateRequestApi(transfar?.id);
    if (res?.ok) {
      toast.success(res?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["transfers-incoming"] });
      queryClient.invalidateQueries({ queryKey: ["transfer-out"] });
    } else {
      toast.error(res?.error);
    }
    setActivateLoading(false);
  };

  const handleComplete = async () => {
    setCompleteLoading(true);
    const res = await completeRequestApi(transfar?.id);
    if (res?.ok) {
      toast.success(res?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["transfers-incoming"] });
      queryClient.invalidateQueries({ queryKey: ["transfer-out"] });
    } else {
      toast.error(res?.error);
    }
    setCompleteLoading(false);
  };

  const handleMarkTransfer = async () => {
    setMarkTransferLoading(true);
    const res = await markTransferredApi(transfar?.id);
    if (res?.ok) {
      toast.success(res?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["transfers-incoming"] });
      queryClient.invalidateQueries({ queryKey: ["transfer-out"] });
    } else {
      toast.error(res?.error);
    }
    setMarkTransferLoading(false);
  };
  return (
    <Card>
      <CardHeader className="items-center!">
        <CardDescription className="flex items-center gap-2">
          <Badge variant={"outline"} className="rounded border-2">
            #{order}
          </Badge>
          {/* date */}
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Clock className="size-4" />
            {transfar?.created_at}
          </p>
        </CardDescription>
        <CardAction className="flex items-center gap-1">
          <Badge variant={"outline"} className="rounded border-2">
            {transfar?.creator_name}
          </Badge>
          {/* <Button variant={"ghost"}>
            <Printer className="size-5" />
          </Button> */}
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="font-semibold text-lg">
          <span className="text-base text-muted-foreground">From:</span>{" "}
          {transfar?.from_pharmacy}
        </p>
        <p className="font-semibold text-lg">
          <span className="text-base text-muted-foreground">To:</span>{" "}
          {transfar?.to_pharmacy}
        </p>
        <div className="flex flex-col gap-2">
          <p className="text-base text-muted-foreground font-semibold">
            Medications ({transfar?.medications?.length}):
          </p>
          {transfar?.medications?.map((medication, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-background/50 rounded"
            >
              <div className="flex flex-col gap-2">
                <p>{medication?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {medication?.product_code}
                </p>
              </div>
              <Badge variant={"outline"} className="rounded border-2">
                x{medication.quantity}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t  flex flex-col gap-2">
        <div className="flex items-center justify-between w-full">
          {user?.role !== "super_admin" && (
            <div className="flex flex-wrap items-center gap-2">
              {/* Accept/Reject logic */}
              {!transfar?.can_activate && !transfar?.can_complete && (
                transfar?.status === "Pending" && (
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
                      variant={"destructive"}
                      onClick={() => {
                        setIsRejected(!isRejected);
                        setIsAccepted(false);
                      }}
                    >
                      Reject
                    </Button>
                  </>
                )
              )}

              {/* Mark as Transfer logic (Source Pharmacy) */}
              {!transfar?.can_activate && !transfar?.can_complete && transfar?.status === "Approved" && (
                <Button onClick={handleMarkTransfer} disabled={markTransferLoading} className="bg-yellow-600 hover:bg-yellow-700 text-white">
                  {markTransferLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="mr-2 size-5" />
                  )}
                  Mark as Transfer
                </Button>
              )}

              {/* Mark as Active logic */}
              {transfar?.can_activate && (
                <Button onClick={handleActivate} disabled={activateLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {activateLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Clock className="mr-2 size-5" />
                  )}
                  Mark as Active
                </Button>
              )}

              {/* Mark as Complete logic */}
              {transfar?.can_complete && (
                <Button onClick={handleComplete} disabled={completeLoading} className="bg-green-600 hover:bg-green-700 text-white">
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
            variant={
              transfar?.status === "Pending"
                ? "pending"
                : transfar?.status === "Completed"
                  ? "success"
                  : transfar?.status === "Approved" || transfar?.status === "Active"
                    ? "approved"
                    : transfar?.status === "Rejected" ||
                      transfar?.status === "Cancelled"
                      ? "destructive"
                      : "default"
            }
          >
            {transfar?.status}
          </Badge>
        </div>
        {isRejected && (
          <div className=" space-y-4 w-full">
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
              variant={"destructive"}
              onClick={handleReject}
              disabled={rejectLoading}
              className=" ms-auto  "
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
          <div className=" space-y-4 w-full">
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
              className=" ms-auto  "
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
      </CardFooter>
    </Card>
  );
};

export default TransferIncomingCard;
