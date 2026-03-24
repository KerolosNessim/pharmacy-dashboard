"use client";
import { CompletedTasksList } from "@/components/tasks/completed-tasks-list";
import { PendingTasksList } from "@/components/tasks/pending-tasks-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGoBack } from "@/hooks/use-goback";
import { ArrowLeft, CalendarIcon, CheckCircle2, Search, Truck } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";

const TasksPage = () => {
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const goBack = useGoBack();

  return (
    <section className="flex flex-col gap-6 p-4">
      {/* header */}
      <div className="flex items-center gap-2">
        <Button variant={"ghost"} className="hover:bg-bg" onClick={goBack}>
          <ArrowLeft />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Tasks Management</h2>
          <p className="text-muted-foreground text-sm">
            Manage tasks sent by Pharmacy Supervisor
          </p>
        </div>
      </div>

      {/* filters */}
      <div className="flex flex-col lg:flex-row gap-4" >
        {/* search */}
        <InputGroup className="bg-bg border-0 outline-0 h-12! rounded-lg">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search task title..."
          />
        </InputGroup>
        {/* from date */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="lg:w-1/5 h-12! justify-start text-left font-normal border-0"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {fromDate ? format(fromDate, "PPP") : <span className="text-muted-foreground">From Date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={fromDate}
                onSelect={setFromDate}
              />
            </PopoverContent>
        </Popover>
        {/* to date */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
              className="lg:w-1/5 h-12! justify-start text-left font-normal border-0"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {toDate ? format(toDate, "PPP") : <span className="text-muted-foreground">To Date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={toDate}
                onSelect={setToDate}
              />
            </PopoverContent>
          </Popover>
      </div>

      {/* tasks tabs */}
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

        <TabsContent value="pending" className="mt-0">
          <PendingTasksList />
        </TabsContent>
        <TabsContent value="completed" className="mt-0">
          <CompletedTasksList />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default TasksPage;