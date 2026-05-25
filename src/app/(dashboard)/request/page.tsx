"use client";

import OutCard from "@/components/request/out-card";
import { TransferPaginatedList } from "@/components/transfer/transfer-paginated-list";
import { Button } from "@/components/ui/button";
import { useGoBack } from "@/hooks/use-goback";
import { useUserStore } from "@/stores/user-store";
import { ArrowLeft, Inbox, Plus } from "lucide-react";
import Link from "next/link";

const RequestPage = () => {
  const goBack = useGoBack();
  const { user } = useUserStore();

  return (
    <section className="flex flex-col gap-6 p-4">
      <div className="flex items-center justify-between">
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
        {user?.role != "super_admin" && (
          <Link href={"request/create"}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Request Items
            </Button>
          </Link>
        )}
      </div>

      <TransferPaginatedList
        listParams={{ type: "out", status: "all" }}
        listClassName="lg:w-2/3 mx-auto space-y-4"
        renderItem={(request, index) => (
          <OutCard key={request.id} order={index + 1} request={request} />
        )}
        emptyContent={
          <div className="flex flex-col items-center gap-3 bg-bg rounded-lg border p-6">
            <Inbox className="size-14 text-primary" />
            <h3 className="text-lg font-medium">No Out Requests</h3>
            <p className="text-muted-foreground">
              When you request items from other branches, they&apos;ll appear
              here.
            </p>
          </div>
        }
      />
    </section>
  );
};

export default RequestPage;
