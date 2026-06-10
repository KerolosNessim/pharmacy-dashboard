"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import OutCard from "@/components/request/out-card";
import RequestOutFilters from "@/components/request/request-out-filters";
import DownloadReportDialog from "@/components/shared/download-report-dialog";
import SendReportDialog from "@/components/shared/send-report-dialog";
import { TransferPaginatedList } from "@/components/transfer/transfer-paginated-list";
import { Button } from "@/components/ui/button";
import { useGoBack } from "@/hooks/use-goback";
import { useUserStore } from "@/stores/user-store";
import { ArrowLeft, Inbox, Plus } from "lucide-react";
import Link from "next/link";

const RequestPageContent = () => {
  const goBack = useGoBack();
  const { user } = useUserStore();
  const searchParams = useSearchParams();

  const pharmacist_name = searchParams.get("pharmacist_name") ?? "";
  const status = searchParams.get("status") ?? "all";

  const listParams = useMemo(
    () => ({
      type: "out" as const,
      status,
      pharmacist_name,
    }),
    [status, pharmacist_name],
  );

  const reportFilters = useMemo(
    () => ({
      type: "out" as const,
      pharmacist_name: pharmacist_name || undefined,
      status: status !== "all" ? status : undefined,
    }),
    [pharmacist_name, status],
  );

  const hasActiveFilters =
    pharmacist_name.trim().length > 0 || (status && status !== "all");

  return (
    <section className="flex flex-col gap-6 p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant={"ghost"} className="hover:bg-bg" onClick={goBack}>
            <ArrowLeft />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Request Items</h2>
            <p className="text-muted-foreground text-sm">
              Request items from another branch
            </p>
          </div>
        </div>
        {/* <div className="flex items-center gap-2">
          {user?.role !== "super_admin" && (
            <SendReportDialog reportFilters={reportFilters} />
          )}
          <DownloadReportDialog reportFilters={reportFilters} />
          {user?.role != "super_admin" && (
            <Link href={"request/create"}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Request Items
              </Button>
            </Link>
          )}
        </div> */}
      </div>

      <div className="lg:w-2/3 mx-auto w-full space-y-4">
        <RequestOutFilters />

        <TransferPaginatedList
          listParams={listParams}
          listClassName="space-y-4"
          renderItem={(request, index) => (
            <OutCard key={request.id} order={index + 1} request={request} />
          )}
          emptyContent={
            <div className="flex flex-col items-center gap-3 bg-bg rounded-lg border p-6">
              <Inbox className="size-14 text-primary" />
              <h3 className="text-lg font-medium">
                {hasActiveFilters
                  ? "No requests match your filters"
                  : "No Out Requests"}
              </h3>
              <p className="text-muted-foreground text-center">
                {hasActiveFilters
                  ? "Try a different pharmacist name or status filter."
                  : "When you request items from other branches, they'll appear here."}
              </p>
            </div>
          }
        />
      </div>
    </section>
  );
};

const RequestPage = () => {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <RequestPageContent />
    </Suspense>
  );
};

export default RequestPage;
