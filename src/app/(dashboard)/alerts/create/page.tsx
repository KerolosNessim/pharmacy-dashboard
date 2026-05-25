"use client";

import { getAlertsApi } from "@/api/alerts";
import AlertsCard from "@/components/alerts/alerts-card";
import TextEditor from "@/components/alerts/tiptap";
import { ListPagination } from "@/components/shared/list-pagination";
import { Button } from "@/components/ui/button";
import { useGoBack } from "@/hooks/use-goback";
import { usePaginatedList } from "@/hooks/use-paginated-list";
import { parseNestedListResponse } from "@/lib/list-parse";
import type { Alert } from "@/types/alerts";
import { ChevronLeft, Loader2 } from "lucide-react";

const CreateAlertPage = () => {
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
          <h1 className="text-2xl font-bold">Create Alerts</h1>
          <p className="text-muted-foreground">Manage your alerts</p>
        </div>
      </div>
      <TextEditor />
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin" />
        </div>
      ) : alerts.length > 0 ? (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">Alerts</h2>
          {alerts.map((alert) => (
            <AlertsCard key={alert.id} alert={alert} />
          ))}
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
        </div>
      ) : null}
    </section>
  );
};

export default CreateAlertPage;
