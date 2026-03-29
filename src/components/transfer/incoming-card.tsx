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
import { acceptRequestApi, rejectRequestApi } from "@/api/transfar";
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
  const [isRejected, setIsRejected] = useState(false);
  const [reason, setReason] = useState("");
  const queryClient = useQueryClient();
  const {user} = useUserStore();
  const handleAccept = async () => {
    setAcceptLoading(true);
    const res = await acceptRequestApi(transfar?.id);
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
              <p>{medication.name}</p>
              <Badge variant={"outline"} className="rounded border-2">
                x{medication.quantity}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t  flex flex-col gap-2">
        <div className="flex items-center justify-between w-full">
          {
            user?.role !== "super_admin" && (
              
          <div className="flex items-center gap-2">
            {transfar?.status === "Approved" ||
            transfar?.status === "Rejected" || transfar?.status === "Completed"? null : (
              <>
                <Button onClick={handleAccept} disabled={acceptLoading}>
                  {acceptLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="size-5" />
                  )}
                  Accept
                </Button>

                <Button
                  variant={"destructive"}
                  onClick={() => setIsRejected(!isRejected)}
                >
                  Reject
                </Button>
              </>
            )}
          </div>
            )
          }
          
          <Badge
            variant={
              transfar?.status == "pending"
                ? "pending"
                : transfar?.status == "completed" ||
                    transfar?.status == "approved"
                  ? "success"
                  : transfar?.status == "rejected" ||
                      transfar?.status == "cancelled"
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
            <Button variant={"destructive"} onClick={handleReject} disabled={rejectLoading} className=" ms-auto  ">
              {rejectLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <X className="size-5" />
              )}
              Reject
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default TransferIncomingCard;
