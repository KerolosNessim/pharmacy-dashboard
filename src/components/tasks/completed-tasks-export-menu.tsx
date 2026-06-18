"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { downloadCompletedTasksExport } from "@/lib/export-completed-tasks";
import type { TasksExportParams } from "@/lib/tasks-query";
import { ChevronDown, Download, Loader2 } from "lucide-react";
import { useState } from "react";

type CompletedTasksExportMenuProps = {
  baseFilters: Pick<
    TasksExportParams,
    "search" | "date_from" | "date_to" | "pharmacy_id"
  >;
  selectedIds: number[];
  currentPage: number;
  perPage: number;
  pageTaskCount: number;
  totalCount: number;
};

export const CompletedTasksExportMenu = ({
  baseFilters,
  selectedIds,
  currentPage,
  perPage,
  pageTaskCount,
  totalCount,
}: CompletedTasksExportMenuProps) => {
  const [open, setOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const runExport = async (params: TasksExportParams) => {
    setIsExporting(true);
    try {
      const ok = await downloadCompletedTasksExport({
        status: "completed",
        ...baseFilters,
        ...params,
      });
      if (ok) setOpen(false);
    } finally {
      setIsExporting(false);
    }
  };

  const hasSelection = selectedIds.length > 0;
  const canExportPage = pageTaskCount > 0;
  const canExportAll = totalCount > 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className="h-10 shrink-0"
          disabled={isExporting || (!canExportPage && !canExportAll)}
        >
          {isExporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          {isExporting ? "Exporting..." : "Export"}
          <ChevronDown className="ml-2 h-4 w-4 opacity-70" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 p-2">
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            className="justify-start h-auto py-2.5 px-3"
            disabled={isExporting || !hasSelection}
            onClick={() => runExport({ task_ids: selectedIds })}
          >
            <div className="text-left">
              <p className="font-medium">Export Selected</p>
              <p className="text-xs text-muted-foreground font-normal">
                {hasSelection
                  ? `${selectedIds.length} task${selectedIds.length === 1 ? "" : "s"}`
                  : "Select tasks below"}
              </p>
            </div>
          </Button>
          <Button
            variant="ghost"
            className="justify-start h-auto py-2.5 px-3"
            disabled={isExporting || !canExportPage}
            onClick={() =>
              runExport({
                scope: "page",
                page: currentPage,
                per_page: perPage,
              })
            }
          >
            <div className="text-left">
              <p className="font-medium">Export Current Page</p>
              <p className="text-xs text-muted-foreground font-normal">
                Page {currentPage} ({pageTaskCount} task
                {pageTaskCount === 1 ? "" : "s"})
              </p>
            </div>
          </Button>
          <Button
            variant="ghost"
            className="justify-start h-auto py-2.5 px-3"
            disabled={isExporting || !canExportAll}
            onClick={() => runExport({})}
          >
            <div className="text-left">
              <p className="font-medium">Export All Matching Filters</p>
              <p className="text-xs text-muted-foreground font-normal">
                {totalCount} completed task{totalCount === 1 ? "" : "s"}
              </p>
            </div>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
