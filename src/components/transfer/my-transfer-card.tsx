"use client";

import { Badge } from "@/components/ui/badge";
import { RequestItem } from "@/types/transfar";
import { TransferShareButton } from "./transfer-share-button";
import { getTransferStatusBadgeVariant } from "@/lib/transfer-status";

const MyTransferCard = ({ transfar }: { transfar: RequestItem }) => {
  return (
    <div className="w-full p-3 border-b last:border-b-0 bg-bg flex items-center justify-between gap-2">
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            {transfar?.created_at}
          </p>
        </div>
        <p className="font-semibold">From: {transfar?.from_pharmacy}</p>
        <p className="font-semibold">To: {transfar?.to_pharmacy}</p>
        <p className="text-sm text-muted-foreground">
          {transfar?.medications?.reduce((acc, item) => acc + item.quantity, 0)}
          items
        </p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Badge variant={getTransferStatusBadgeVariant(transfar?.status)}>
          {transfar?.status}
        </Badge>
        <TransferShareButton transfar={transfar} />
      </div>
    </div>
  );
};

export default MyTransferCard;
