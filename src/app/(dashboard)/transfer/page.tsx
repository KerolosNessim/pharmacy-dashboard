"use client";

import DownloadReportDialog from "@/components/shared/download-report-dialog";
import SendReportDialog from "@/components/shared/send-report-dialog";
import MyTransferCard from "@/components/transfer/my-transfer-card";
import { TransferPaginatedList } from "@/components/transfer/transfer-paginated-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTransferTotal } from "@/hooks/use-transfer-list";
import { useUserStore } from "@/stores/user-store";
import {
  ChevronRight,
  CircleCheck,
  CircleX,
  History,
  Inbox,
  User,
} from "lucide-react";
import Link from "next/link";
import { GoArrowDownLeft, GoArrowUpRight } from "react-icons/go";

const TransferPage = () => {
  const { user } = useUserStore();

  const { data: incomingTotal = 0 } = useTransferTotal({
    type: "in",
    status: "all",
  });
  const { data: outgoingTotal = 0 } = useTransferTotal({
    type: "out",
    status: "all",
  });
  const { data: completedTotal = 0 } = useTransferTotal({
    type: "all",
    status: "completed",
  });
  const { data: uncompletedTotal = 0 } = useTransferTotal({
    type: "all",
    status: "uncomplete",
  });

  return (
    <section className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">Welcome back,</p>
          <h2 className="text-2xl font-bold">{user?.name}</h2>
        </div>
        {user?.role !== "super_admin" && <SendReportDialog />}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Link href={"/transfer/incoming"} className="w-full ">
          <Button
            variant={"secondary"}
            className="w-full h-fit flex-col py-6 border rounded-xl"
          >
            <div className="size-12 rounded-full bg-primary/30 text-primary flex justify-center items-center">
              <GoArrowDownLeft className="size-8" />
            </div>
            <h2 className="text-xl font-bold">Request Items</h2>
            <Badge variant={"success"}>{incomingTotal}</Badge>
          </Button>
        </Link>
        <Link href={"/request"} className="w-full ">
          <Button
            variant={"secondary"}
            className="w-full h-fit flex-col py-6 border rounded-xl"
          >
            <div className="size-12 rounded-full bg-primary/30 text-primary flex justify-center items-center">
              <GoArrowUpRight className="size-8" />
            </div>
            <h2 className="text-xl font-bold">Issue To</h2>
            <Badge variant={"success"}>{outgoingTotal}</Badge>
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="size-5 text-primary" />
            <h2 className=" font-bold">Transfers</h2>
          </div>
          <DownloadReportDialog />
        </div>
        <div className="border rounded-xl overflow-hidden flex items-center max-lg:flex-wrap">
          <Link href={"/transfer/history"} className="w-full ">
            <Button
              variant={"secondary"}
              className="w-full h-fit flex-row justify-between border-e rounded-none"
            >
              <div className="flex items-center gap-2">
                <div className="size-10 rounded-lg bg-primary/30 text-primary flex justify-center items-center">
                  <History className="size-5 " />
                </div>
                <p className="font-bold">All Transfers</p>
              </div>
              <ChevronRight className="size-5 text-muted-foreground" />
            </Button>
          </Link>
          <Link href={"/transfer/completed"} className="w-full border-e">
            <Button
              variant={"secondary"}
              className="w-full h-fit flex-row justify-between  rounded-none"
            >
              <div className="flex items-center gap-2">
                <div className="size-10 rounded-lg bg-primary/30 text-primary flex justify-center items-center">
                  <CircleCheck className="size-5 " />
                </div>
                <p className="font-bold ">Completed </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={"success"}>{completedTotal}</Badge>
                <ChevronRight className="size-5 text-muted-foreground" />
              </div>
            </Button>
          </Link>
          <Link href={"/transfer/uncompleted"} className="w-full ">
            <Button
              variant={"secondary"}
              className="w-full h-fit flex-row justify-between  rounded-none"
            >
              <div className="flex items-center gap-2">
                <div className="size-10 rounded-lg bg-destructive/30 text-destructive flex justify-center items-center">
                  <CircleX className="size-5 " />
                </div>
                <p className="font-bold">Un completed </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={"pending"}>{uncompletedTotal}</Badge>
                <ChevronRight className="size-5 text-muted-foreground" />
              </div>
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <User className="size-5 text-primary" />
          <h2 className=" font-bold"> My Transfers</h2>
        </div>

        <TransferPaginatedList
          listParams={{ type: "all", status: "all" }}
          listClassName="border rounded-xl overflow-hidden"
          renderItem={(transfer) => (
            <MyTransferCard key={transfer.id} transfar={transfer} />
          )}
          emptyContent={
            <div className="flex flex-col items-center gap-3 bg-bg rounded-lg border p-6 ">
              <Inbox className="size-14 text-primary" />
              <h3 className="text-lg font-medium">No Transfer Requests</h3>
              <p className="text-muted-foreground">
                When you request items from other branches, they&apos;ll appear
                here.
              </p>
            </div>
          }
        />
      </div>
    </section>
  );
};

export default TransferPage;
