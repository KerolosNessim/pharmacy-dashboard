"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { Clock, Printer } from "lucide-react";
import { TransferShareButton } from "./transfer-share-button";
import { Button } from "../ui/button";
import { RequestItem } from "@/types/transfar";
import { useRef } from "react";
import PrintCard from "./print-card";
import { useAppPrint } from "@/hooks/use-app-print";
import { PrintHidden } from "@/components/shared/print-hidden";
import { getTransferStatusBadgeVariant } from "@/lib/transfer-status";
import { TransferNotes } from "./transfer-notes";

const TransferHistoryCard = ({order,transfar}:{order:number,transfar:RequestItem}) => {
  const printRef = useRef<HTMLDivElement>(null);

const handlePrint = useAppPrint({
  contentRef: printRef,
  documentTitle: `Transfer-${order}`,
});
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
          <TransferShareButton transfar={transfar} order={order} />
          <Button variant="ghost" size="icon" onClick={handlePrint} title="Print">
            <Printer className="size-5" />
          </Button>
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
          <TransferNotes notes={transfar?.notes} />
        </div>
        <PrintHidden>
          <PrintCard ref={printRef} transfar={transfar} />
        </PrintHidden>
      </CardContent>
      <CardFooter className="border-t">
        <div className="flex items-center gap-2">
          <p className="text-base text-muted-foreground">Status:</p>
          <Badge variant={getTransferStatusBadgeVariant(transfar?.status)}>
            {transfar?.status}
          </Badge>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TransferHistoryCard;
