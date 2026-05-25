"use client";

import { useMemo, useState } from "react";
import AddCashDialog from "@/components/cash/add-cash-dialog";
import CashTable from "@/components/cash/cash-table";
import { Button } from "@/components/ui/button";
import { useGoBack } from "@/hooks/use-goback";
import { ArrowLeft, Download, X, Calendar as CalendarIcon } from "lucide-react";
import { getCashApi } from "@/api/cash";
import { useUserStore } from "@/stores/user-store";
import { exportToExcel } from "@/lib/export-excel";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { usePaginatedList } from "@/hooks/use-paginated-list";
import { ListPagination } from "@/components/shared/list-pagination";
import { parseNestedListResponse } from "@/lib/list-parse";
import { Loader2 } from "lucide-react";

const CashPage = () => {
  const goBack = useGoBack();
  const { user } = useUserStore();

  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const from_date = startDate ? format(startDate, "yyyy-MM-dd") : "";
  const to_date = endDate ? format(endDate, "yyyy-MM-dd") : "";

  const listFilters = useMemo(
    () => ({ from_date, to_date }),
    [from_date, to_date]
  );

  const {
    items: invoices,
    pagination,
    isLoading,
    isFetching,
    accumulated,
    hasMore,
    loadMore,
    goToPage,
  } = usePaginatedList({
    queryKey: ["cash", "list", listFilters],
    fetchPage: async (page) => {
      const res = await getCashApi({ ...listFilters, page });
      if (!res.ok) throw new Error(res.error ?? "Failed to load invoices");
      return parseNestedListResponse(res.data);
    },
  });

  const handleExport = () => {
    const exportData = invoices.map((inv) => ({
      "Invoice Number": inv.invoice_number,
      "Customer Name": inv.customer_name || "-",
      "Mobile No": inv.mobile_no || "-",
      Date: new Date(inv.created_at).toLocaleDateString(),
      Amount: inv.amount,
      Status: inv.status.replaceAll("_", " "),
      "Delivery Rep": inv.delivery_representative?.name || "-",
      "Rep Phone": inv.delivery_representative?.phone || "-",
      Pharmacy: inv.pharmacy_name,
      Neighborhood: inv.neighborhood || "-",
      Location: inv.location || "-",
      Notes: inv.notes || "-",
      Information: inv.products_information || "-",
    }));

    exportToExcel(exportData, `Cash_Invoices_${new Date().toLocaleDateString()}`);
  };

  return (
    <section className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={goBack}>
            <ArrowLeft />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Cash Management</h2>
            <p className="text-muted-foreground text-sm">Manage invoices</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={invoices.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export to Excel
          </Button>
          {user?.role !== "super_admin" && <AddCashDialog />}
        </div>
      </div>

      <div className="bg-bg p-4 rounded-xl border flex flex-wrap items-center gap-4">
        <div className="flex flex-col gap-1.5 min-w-[200px] flex-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Start Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full h-10 justify-start text-left font-normal bg-background",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                {startDate ? format(startDate, "yyyy-MM-dd") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={startDate} onSelect={setStartDate} />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col gap-1.5 min-w-[200px] flex-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            End Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full h-10 justify-start text-left font-normal bg-background",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                {endDate ? format(endDate, "yyyy-MM-dd") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={endDate} onSelect={setEndDate} />
            </PopoverContent>
          </Popover>
        </div>

        {(startDate || endDate) && (
          <Button
            variant="ghost"
            onClick={() => {
              setStartDate(undefined);
              setEndDate(undefined);
            }}
            className="h-10 mt-5 self-end text-sm text-destructive hover:bg-destructive/10 hover:text-destructive gap-1"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <CashTable invoices={invoices} />
          {pagination && pagination.total > 0 && (
            <ListPagination
              pagination={pagination}
              loadedCount={invoices.length}
              accumulated={accumulated}
              hasMore={hasMore}
              onLoadMore={loadMore}
              isLoadingMore={isFetching}
              onPageChange={goToPage}
            />
          )}
        </>
      )}
    </section>
  );
};

export default CashPage;
