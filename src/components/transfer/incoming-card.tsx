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
import { Clock } from "lucide-react";
import { TransferShareButton } from "./transfer-share-button";
import { Badge } from "../ui/badge";
import { TransferActions } from "./transfer-actions";
import { TransferDetailsLink } from "./transfer-details-link";
import { TransferNotes } from "./transfer-notes";

const TransferIncomingCard = ({
  order,
  transfar,
}: {
  order: number;
  transfar: RequestItem;
}) => {
  return (
    <Card>
      <CardHeader className="items-center!">
        <CardDescription className="flex items-center gap-2">
          <Badge variant={"outline"} className="rounded border-2">
            #{order}
          </Badge>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Clock className="size-4" />
            {transfar?.created_at}
          </p>
        </CardDescription>
        <CardAction className="flex items-center gap-1">
          <Badge variant={"outline"} className="rounded border-2">
            {transfar?.creator_name}
          </Badge>
          <TransferDetailsLink transferId={transfar.id} />
          <TransferShareButton transfar={transfar} order={order} />
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
      </CardContent>
      <CardFooter className="border-t flex flex-col gap-2 w-full">
        <TransferActions transfar={transfar} className="w-full" />
      </CardFooter>
    </Card>
  );
};

export default TransferIncomingCard;
