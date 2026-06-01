"use client";

import { getTasksApi } from "@/api/tasks";
import { CompletedTasksList } from "@/components/tasks/completed-tasks-list";
import { PendingTasksList } from "@/components/tasks/pending-tasks-list";
import { ListPagination } from "@/components/shared/list-pagination";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGoBack } from "@/hooks/use-goback";
import { usePaginatedList } from "@/hooks/use-paginated-list";
import { parseNestedListResponse } from "@/lib/list-parse";
import type { Task } from "@/types/tasks";
import { format } from "date-fns";
import { ArrowLeft, CalendarIcon, CheckCircle2, Search, Truck } from "lucide-react";
import { useMemo, useState } from "react";

const TasksPage = () => {
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [search, setSearch] = useState("");
  const goBack = useGoBack();

  const fromDateString = fromDate ? format(fromDate, "yyyy-MM-dd") : "";
  const toDateString = toDate ? format(toDate, "yyyy-MM-dd") : "";

  const pendingFilters = useMemo(
    () => ({
      status: "pending",
      search: search.trim() || undefined,
      from_date: fromDateString,
      to_date: toDateString,
    }),
    [search, fromDateString, toDateString]
  );

  const completedFilters = useMemo(
    () => ({
      status: "completed",
      search: search.trim() || undefined,
      from_date: fromDateString,
      to_date: toDateString,
    }),
    [search, fromDateString, toDateString]
  );

  const pending = usePaginatedList<Task>({
    queryKey: ["refill-tasks", "pending", pendingFilters],
    fetchPage: async (page) => {
      const res = await getTasksApi({ ...pendingFilters, page });
      if (!res.ok) throw new Error(res.error ?? "Failed to load tasks");
      return parseNestedListResponse<Task>(res.data);
    },
  });

  const completed = usePaginatedList<Task>({
    queryKey: ["refill-tasks", "completed", completedFilters],
    fetchPage: async (page) => {
      const res = await getTasksApi({ ...completedFilters, page });
      if (!res.ok) throw new Error(res.error ?? "Failed to load tasks");
      return parseNestedListResponse<Task>(res.data);
    },
  });

  return (
    <section className="flex flex-col gap-6 p-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" className="hover:bg-bg" onClick={goBack}>
          <ArrowLeft />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Tasks Management</h2>
          <p className="text-muted-foreground text-sm">
            Manage tasks sent by Pharmacy Supervisor
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <InputGroup className="bg-bg border-0 outline-0 h-12! rounded-lg">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search task title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="lg:w-1/5 h-12! justify-start text-left font-normal border-0"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {fromDate ? (
                format(fromDate, "PPP")
              ) : (
                <span className="text-muted-foreground">From Date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={fromDate} onSelect={setFromDate} />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="lg:w-1/5 h-12! justify-start text-left font-normal border-0"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {toDate ? (
                format(toDate, "PPP")
              ) : (
                <span className="text-muted-foreground">To Date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={toDate} onSelect={setToDate} />
          </PopoverContent>
        </Popover>
      </div>

      <Tabs defaultValue="pending" className="flex flex-col gap-6">
        <TabsList className="w-full lg:w-[400px] bg-bg">
          <TabsTrigger
            className="data-[state=active]:bg-background! data-[state=active]:border-0! border-0 flex-1 gap-2"
            value="pending"
          >
            <Truck className="size-4" />
            Pending Tasks
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:bg-background! data-[state=active]:border-0! border-0 flex-1 gap-2"
            value="completed"
          >
            <CheckCircle2 className="size-4" />
            Completed Tasks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-0 space-y-4">
          <PendingTasksList tasks={pending.items} />
          {pending.pagination && pending.pagination.total > 0 && (
            <ListPagination
              pagination={pending.pagination}
              loadedCount={pending.items.length}
              accumulated={pending.accumulated}
              hasMore={pending.hasMore}
              onLoadMore={pending.loadMore}
              isLoadingMore={pending.isFetching}
              onPageChange={pending.goToPage}
            />
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-0 space-y-4">
          <CompletedTasksList tasks={completed.items} />
          {completed.pagination && completed.pagination.total > 0 && (
            <ListPagination
              pagination={completed.pagination}
              loadedCount={completed.items.length}
              accumulated={completed.accumulated}
              hasMore={completed.hasMore}
              onLoadMore={completed.loadMore}
              isLoadingMore={completed.isFetching}
              onPageChange={completed.goToPage}
            />
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default TasksPage;
