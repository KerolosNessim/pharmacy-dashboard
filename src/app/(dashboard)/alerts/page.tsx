"use client";

import { getAlertsApi } from "@/api/alerts";
import AlertsCard from "@/components/alerts/alerts-card";
import { ListPagination } from "@/components/shared/list-pagination";
import { Button } from "@/components/ui/button";
import { useGoBack } from "@/hooks/use-goback";
import { usePaginatedList } from "@/hooks/use-paginated-list";
import { parseNestedListResponse } from "@/lib/list-parse";
import type { Alert } from "@/types/alerts";
import { ChevronLeft, Loader2 } from "lucide-react";

const AlertPage = () => {
  const goBack = useGoBack();

  const {
    items: alerts,
    pagination,
    isLoading,
    isFetching,
    accumulated,
    hasMore,
    loadMore,
    goToPage,
  } = usePaginatedList<Alert>({
    queryKey: ["alerts", "list"],
    fetchPage: async (page) => {
      const res = await getAlertsApi({ page });
      if (!res.ok) throw new Error(res.error ?? "Failed to load alerts");
      return parseNestedListResponse<Alert>(res.data);
    },
  });

  return (
    <section className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={goBack}>
          <ChevronLeft />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Alerts</h1>
          <p className="text-muted-foreground">See all system&apos;s alerts</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : alerts.length > 0 ? (
        <>
          <div className="flex flex-col gap-4">
            {alerts.map((alert) => (
              <AlertsCard key={alert.id} alert={alert} />
            ))}
          </div>
          {pagination && (
            <ListPagination
              pagination={pagination}
              loadedCount={alerts.length}
              accumulated={accumulated}
              hasMore={hasMore}
              onLoadMore={loadMore}
              isLoadingMore={isFetching}
              onPageChange={goToPage}
            />
          )}
        </>
      ) : (
        <p className="text-muted-foreground text-center py-8">No alerts yet.</p>
      )}
    </section>
  );
};

export default AlertPage;
