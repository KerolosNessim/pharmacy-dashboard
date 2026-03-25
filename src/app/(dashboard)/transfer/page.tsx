"use client";
import { getRequestsApi } from "@/api/transfar";
import MyTransferCard from "@/components/transfer/my-transfer-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/user-store";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, CircleCheck, File, History, Inbox, User } from "lucide-react";
import Link from "next/link";
import { GoArrowDownLeft, GoArrowUpRight } from "react-icons/go";

const TransferPage = () => {
  const { user } = useUserStore();
  const { data } = useQuery({
    queryKey: ["transfers"],
    queryFn: () => getRequestsApi("?type=all&status=all"),
  });
  console.log(data);
  const { data:completedData } = useQuery({
    queryKey: ["completed-transfers"],
    queryFn: () => getRequestsApi("?type=all&status=completed"),
  });
  const transfers = data?.data?.data?.data ?? [];
  const completedTransfers = completedData?.data?.data?.data ?? [];
  return (
    <section className="flex flex-col gap-4 p-4">
      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">Welcome back,</p>
          <h2 className="text-2xl font-bold">{user?.name}</h2>
        </div>
        {/* <Button>
          <File /> Send Report
        </Button> */}
      </div>
      {/* in & out */}
      <div className="grid grid-cols-2 gap-4">
        <Link href={"/transfer/incoming"} className="w-full ">
          <Button
            variant={"secondary"}
            className="w-full h-fit flex-col py-6 border rounded-xl"
          >
            <div className="size-12 rounded-full bg-primary/30 text-primary flex justify-center items-center">
              <GoArrowDownLeft className="size-8" />
            </div>
            <h2 className="text-2xl font-bold">IN</h2>
            <p className="text-muted-foreground">Incoming</p>
            <Badge variant={"success"}>{data?.data?.data?.totals?.total_in}</Badge>
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
            <h2 className="text-2xl font-bold">OUT</h2>
            <p className="text-muted-foreground">Requested Items</p>
            <Badge variant={"success"}>{data?.data?.data?.totals?.total_out}</Badge>
          </Button>
        </Link>
      </div>
      {/* transfer History */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <History className="size-5 text-primary" />
          <h2 className=" font-bold">Transfers</h2>
        </div>
        <div className="border rounded-xl overflow-hidden">
          <Link href={"/transfer/history"} className="w-full ">
            <Button
              variant={"secondary"}
              className="w-full h-fit flex-row justify-between border-b rounded-none"
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
          <Link href={"/transfer/completed"} className="w-full ">
            <Button
              variant={"secondary"}
              className="w-full h-fit flex-row justify-between  rounded-none"
            >
              <div className="flex items-center gap-2">
                <div className="size-10 rounded-lg bg-primary/30 text-primary flex justify-center items-center">
                  <CircleCheck className="size-5 " />
                </div>
                <p className="font-bold">Completed </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={"success"}>{completedTransfers.length}</Badge>
                <ChevronRight className="size-5 text-muted-foreground" />
              </div>
            </Button>
          </Link>
        </div>
      </div>
      {/* my transfer  */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <User className="size-5 text-primary" />
          <h2 className=" font-bold"> My Transfers</h2>
          <Badge variant={"success"}>{transfers.length}</Badge>
        </div>
        {transfers.length === 0 ? (
          <div className="flex flex-col items-center gap-3 bg-bg rounded-lg border p-6 ">
            <Inbox className="size-14 text-primary" />
            <h3 className="text-lg font-medium">No Transfer Requests</h3>
            <p className="text-muted-foreground">
              When you request items from other branches, they&apos;ll appear
              here.
            </p>
          </div>
        ) : (
          <div className="border rounded-xl overflow-hidden">
            {transfers.map((transfer, index) => (
              <MyTransferCard key={index} transfar={transfer} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TransferPage;
