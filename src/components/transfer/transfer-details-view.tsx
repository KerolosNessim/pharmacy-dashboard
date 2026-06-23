"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TransferActions } from "@/components/transfer/transfer-actions";
import { TransferActivityLog } from "@/components/transfer/transfer-activity-log";
import { TransferNotes } from "@/components/transfer/transfer-notes";
import { TransferShareButton } from "@/components/transfer/transfer-share-button";
import { getTransferStatusBadgeVariant } from "@/lib/transfer-status";
import type { TransferDetails } from "@/types/transfar";
import { Clock, History } from "lucide-react";

type TransferDetailsViewProps = {
  transfer: TransferDetails;
  showActions?: boolean;
};

export function TransferDetailsView({
  transfer,
  showActions = true,
}: TransferDetailsViewProps) {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="items-center!">
          <CardDescription className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
            <Badge variant="outline" className="rounded border-2">
              #{transfer.id}
            </Badge>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="size-4" />
              {transfer.created_at}
            </p>
            </div>
          <div className="flex items-center gap-1 ms-auto">
            <Badge variant="outline" className="rounded border-2">
              {transfer.creator_name}
            </Badge>
            <TransferShareButton transfar={transfer} />
          </div>
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-3">
          <p className="font-semibold text-lg">
            <span className="text-base text-muted-foreground">From:</span>{" "}
            {transfer.from_pharmacy}
          </p>
          <p className="font-semibold text-lg">
            <span className="text-base text-muted-foreground">To:</span>{" "}
            {transfer.to_pharmacy}
          </p>

          <div className="flex flex-col gap-2">
            <p className="text-base text-muted-foreground font-semibold">
              Medications ({transfer.medications?.length ?? 0}):
            </p>
            {transfer.medications?.map((medication, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-background/50 rounded"
              >
                <div className="flex flex-col gap-2">
                  <p>{medication.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {medication.product_code}
                  </p>
                </div>
                <Badge variant="outline" className="rounded border-2">
                  x{medication.quantity}
                </Badge>
              </div>
            ))}
            <TransferNotes notes={transfer.notes} />
          </div>

          {transfer.rejection_reason && (
            <div className="rounded-md border border-red-500/20 bg-red-500/5 p-3 text-sm">
              <p className="font-medium text-red-600 dark:text-red-400">
                Rejection Reason
              </p>
              <p className="mt-1">{transfer.rejection_reason}</p>
            </div>
          )}
        </CardContent>

        {showActions ? (
          <CardFooter className="border-t flex flex-col gap-2 w-full">
            <TransferActions transfar={transfer} className="w-full" />
          </CardFooter>
        ) : (
          <CardFooter className="border-t">
            <div className="flex items-center gap-2">
              <p className="text-base text-muted-foreground">Status:</p>
              <Badge variant={getTransferStatusBadgeVariant(transfer.status)}>
                {transfer.status}
              </Badge>
            </div>
          </CardFooter>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="size-5" />
            Activity Log
          </CardTitle>
          <CardDescription>
            Timeline of all actions performed on this transfer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TransferActivityLog
            items={transfer.activity_log}
            transferPharmacies={{
              from_pharmacy: transfer.from_pharmacy,
              to_pharmacy: transfer.to_pharmacy,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
