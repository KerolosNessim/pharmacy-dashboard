"use client";

import TransferHistoryCard from "@/components/transfer/transfer-history-card";
import { TransferPaginatedList } from "@/components/transfer/transfer-paginated-list";
import { Button } from "@/components/ui/button";
import { useGoBack } from "@/hooks/use-goback";
import { ArrowLeft, Inbox } from "lucide-react";

export default function UnCompletedPage() {
  const goBack = useGoBack();

  return (
    <section className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <Button variant={"ghost"} className="hover:bg-bg" onClick={goBack}>
          <ArrowLeft />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Un Completed Requests</h2>
          <p className="text-muted-foreground text-sm">
            Un Completed requests from other branches
          </p>
        </div>
      </div>

      <TransferPaginatedList
        listParams={{ type: "all", status: "uncomplete" }}
        renderItem={(transfer, index) => (
          <TransferHistoryCard
            key={transfer.id}
            order={index + 1}
            transfar={transfer}
          />
        )}
        emptyContent={
          <div className="flex flex-col items-center gap-3 bg-bg rounded-lg border p-6">
            <Inbox className="size-14 text-primary" />
            <h3 className="text-lg font-medium">No Uncompleted Requests</h3>
            <p className="text-muted-foreground">
              When other branches request items from you, they&apos;ll appear
              here.
            </p>
          </div>
        }
      />
    </section>
  );
}
