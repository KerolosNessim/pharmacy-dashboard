"use client";

import { Button } from "@/components/ui/button";
import { CompletedTaskCard } from "./completed-task-card";
import { CompletedTasksExportMenu } from "./completed-tasks-export-menu";
import { Task } from "@/types/tasks";
import { LIST_PER_PAGE } from "@/lib/api-pagination";
import type { TasksExportParams } from "@/lib/tasks-query";

type CompletedTasksListProps = {
  tasks: Task[];
  canExport?: boolean;
  selectedIds: number[];
  onToggleSelect: (id: number) => void;
  onSelectAllOnPage: () => void;
  onClearSelection: () => void;
  exportFilters: Pick<
    TasksExportParams,
    "search" | "date_from" | "date_to" | "pharmacy_id"
  >;
  currentPage: number;
  perPage?: number;
  totalCount: number;
};

export const CompletedTasksList = ({
  tasks,
  canExport = false,
  selectedIds,
  onToggleSelect,
  onSelectAllOnPage,
  onClearSelection,
  exportFilters,
  currentPage,
  perPage = LIST_PER_PAGE,
  totalCount,
}: CompletedTasksListProps) => {
  const allOnPageSelected =
    tasks.length > 0 && tasks.every((t) => selectedIds.includes(t.id));
  const selectedSet = new Set(selectedIds);

  return (
    <>
      {canExport && tasks.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={allOnPageSelected ? onClearSelection : onSelectAllOnPage}
            >
              {allOnPageSelected ? "Clear Selection" : "Select Page"}
            </Button>
            {selectedIds.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {selectedIds.length} selected
              </span>
            )}
          </div>
          <CompletedTasksExportMenu
            baseFilters={exportFilters}
            selectedIds={selectedIds}
            currentPage={currentPage}
            perPage={perPage}
            pageTaskCount={tasks.length}
            totalCount={totalCount}
          />
        </div>
      )}

      {tasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <CompletedTaskCard
              key={task.id}
              task={task}
              selectable={canExport}
              selected={selectedSet.has(task.id)}
              onToggleSelect={onToggleSelect}
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">No completed tasks</p>
        </div>
      )}
    </>
  );
};
