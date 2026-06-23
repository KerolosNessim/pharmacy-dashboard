"use client";

import { TransferDetailsView } from "@/components/transfer/transfer-details-view";
import { Button } from "@/components/ui/button";
import { useGoBack } from "@/hooks/use-goback";
import {
  TransferDetailsError,
  useTransferDetails,
} from "@/hooks/use-transfer-details";
import { ArrowLeft, Loader2, ShieldAlert } from "lucide-react";
import { useParams } from "next/navigation";

const TransferDetailsPage = () => {
  const goBack = useGoBack();
  const { id } = useParams();
  const transferId = Number(id);

  const { data, isLoading, isError, error, refetch, isFetching } =
    useTransferDetails(transferId);
console.log({data});
  const isForbidden =
    isError && error instanceof TransferDetailsError && error.status === 403;

  return (
    <section className="flex flex-col gap-6 p-4 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-2">
        <Button variant="ghost" className="hover:bg-bg" onClick={goBack}>
          <ArrowLeft />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Transfer Details</h2>
          <p className="text-muted-foreground text-sm">
            View transfer information and activity history.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : isForbidden ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <div className="size-14 rounded-full bg-red-500/10 flex items-center justify-center">
            <ShieldAlert className="size-7 text-red-500" />
          </div>
          <div>
            <p className="font-medium text-foreground">Access Denied</p>
            <p className="text-sm text-muted-foreground mt-1">
              You do not have permission to view this transfer.
            </p>
          </div>
          <Button variant="outline" onClick={goBack}>
            Go Back
          </Button>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <p className="text-red-500 font-medium">
            {error?.message ?? "Failed to load transfer"}
          </p>
          <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
            {isFetching ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : null}
            Retry
          </Button>
        </div>
      ) : data ? (
        <TransferDetailsView transfer={data} />
      ) : null}
    </section>
  );
};

export default TransferDetailsPage;
