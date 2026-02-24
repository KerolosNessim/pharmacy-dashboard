"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CircleCheckBig } from "lucide-react";
import { useGoBack } from "@/hooks/use-goback";

const CashPage = () => {
  const goBack = useGoBack();
  return (
    <section className="flex flex-col gap-4 p-4">
      {/* header */}
      <div className="flex items-center gap-2">
        <Button variant={"ghost"} className="hover:bg-bg" onClick={goBack}>
          <ArrowLeft />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Cash Reimbursements</h2>
          <p className="text-muted-foreground text-sm">
            Pending patient share payments to pharmacists
          </p>
        </div>
      </div>
      {/* refill tasks */}
      <div className="flex flex-col gap-2">
        {/* no tacks */}
        <div className="flex flex-col items-center gap-3 bg-bg rounded-lg border p-6 ">
          <CircleCheckBig className="size-14 text-primary" />
          <h3 className="text-lg font-medium">All Clear!</h3>
          <p className="text-muted-foreground">No refill tasks assigned</p>
        </div>
      </div>
    </section>
  );
};

export default CashPage;
