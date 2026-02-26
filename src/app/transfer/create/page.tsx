"use client";
import { Button } from "@/components/ui/button";
import { useGoBack } from "@/hooks/use-goback";
import { ArrowLeft, Inbox } from "lucide-react";

const TransferCreatePage = () => {
  const goBack = useGoBack();
  return (
    <section className="flex flex-col gap-4 p-4">
      {/* header */}
      <div className="flex items-center gap-2">
        <Button variant={"ghost"} className="hover:bg-bg" onClick={goBack}>
          <ArrowLeft />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Incoming Requests</h2>
          <p className="text-muted-foreground text-sm">
            Requests from other branches
          </p>
        </div>
      </div>
      {/* refill tasks */}
      <div className="flex flex-col gap-2">
        {/* no tacks */}
        <div className="flex flex-col items-center gap-3 bg-bg rounded-lg border p-6 ">
          <Inbox className="size-14 text-primary" />
          <h3 className="text-lg font-medium">No Incoming Requests</h3>
          <p className="text-muted-foreground">
            When other branches request items from you, they&apos;ll appear here.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TransferCreatePage;
