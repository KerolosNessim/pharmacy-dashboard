"use client";

import { Suspense, useMemo } from "react";
import TransferSearch from "@/components/transfer/transfar-search";
import TransferHistoryCard from "@/components/transfer/transfer-history-card";
import { TransferPaginatedList } from "@/components/transfer/transfer-paginated-list";
import { Button } from "@/components/ui/button";
import { useGoBack } from "@/hooks/use-goback";
import { ChevronLeft, Inbox } from "lucide-react";
import { useSearchParams } from "next/navigation";

const TransferHistoryContent = () => {
  const goBack = useGoBack();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "";
  const from_date = searchParams.get("from_date") ?? "";
  const to_date = searchParams.get("to_date") ?? "";

  const listParams = useMemo(
    () => ({
      type: "all" as const,
      search,
      status,
      from_date,
      to_date,
    }),
    [search, status, from_date, to_date]
  );

  return (
    <section className="p-4 flex flex-col gap-4 mx-auto">
      <div className="flex items-start gap-1">
        <Button
          variant={"ghost"}
          onClick={goBack}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="size-4" />
          Back
        </Button>
        <h2 className="text-2xl text-primary font-bold">Transfers History</h2>
      </div>

      <div className="lg:w-2/3 mx-auto space-y-4">
        <TransferSearch />

        <TransferPaginatedList
          listParams={listParams}
          listClassName="space-y-4"
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
              <h3 className="text-lg font-medium">
                {search.trim()
                  ? "No transfers match your search"
                  : "No Transfer Requests"}
              </h3>
              <p className="text-muted-foreground text-center">
                {search.trim()
                  ? `No results for "${search.trim()}". Try pharmacy name, product name, SKU, code, or transfer ID.`
                  : "When you request items from other branches, they'll appear here."}
              </p>
            </div>
          }
        />
      </div>
    </section>
  );
};

const TransferHistoryPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TransferHistoryContent />
    </Suspense>
  );
};

export default TransferHistoryPage;
