"use client"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { CircleCheck, Clock, Loader2, Printer } from "lucide-react";
import { Button } from "../ui/button";
import { RequestItem } from "@/types/transfar";
import { useState } from "react";
import { completeRequestApi } from "@/api/transfar";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/stores/user-store";
const OutCard = ({ order,request }: { order: number,request:RequestItem }) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const {user} = useUserStore();
  const handleComplete = async() => {
    setLoading(true);
    const res = await completeRequestApi(request?.id);
    if (res?.ok) {
      toast.success(res?.data?.message);
      queryClient.invalidateQueries({
        queryKey: ["transfer-out"],
      });
    } else {
      toast.error(res?.error);
    }
    setLoading(false);
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
            {request.created_at}
          </p>
        </CardDescription>
        <CardAction className="flex items-center gap-1">
          <Badge variant={"outline"} className="rounded border-2">
            {request.creator_name}
          </Badge>
          {/* <Button variant={"ghost"}>
            <Printer className="size-5" />
          </Button> */}
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="font-semibold text-lg">
          <span className="text-base text-muted-foreground">From:</span>{" "}
          {request.to_pharmacy}
        </p>
        <p className="font-semibold text-lg">
          <span className="text-base text-muted-foreground">To:</span>
          {request.from_pharmacy}
        </p>
        <div className="flex flex-col gap-2">
          <p className="text-base text-muted-foreground font-semibold">
            Medications ({request.medications.length}):
          </p>
          {request.medications.map((medication, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-background/50 rounded"
            >
              <div className="flex flex-col gap-2">
                <p>{medication?.name}</p>
                <p className="text-sm text-muted-foreground">{medication?.product_code}</p>
              </div>
              <Badge variant={"outline"} className="rounded border-2">
                x{medication?.quantity}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-base text-muted-foreground">Status:</p>
          <Badge
            variant={
              request?.status === "Pending"
                ? "pending"
                : request?.status === "Completed"
                  ? "success"
                  : request?.status === "Approved" || request?.status === "Active"
                    ? "approved"
                    : request?.status === "Rejected" ||
                      request?.status === "Cancelled"
                      ? "destructive"
                      : "default"
            }
          >
            {request.status}
          </Badge>
        </div>
        {request.can_complete && user?.role !== "super_admin" && (
          <Button onClick={handleComplete} disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CircleCheck className="size-5" />
            )}
            Mark as completed
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default OutCard;
