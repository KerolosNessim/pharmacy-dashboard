"use client";
import AddDeliveryDialog from "@/components/delivery/add-delivery-dialog";
import DeliveryTable from "@/components/delivery/delivery-table";
import { Button } from "@/components/ui/button";
import { useGoBack } from "@/hooks/use-goback";
import { ArrowLeft } from "lucide-react";

const DeliveryPage = () => {
  const goBack = useGoBack();
  return (
    <section className="flex flex-col gap-4 p-4">
      {/* header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant={"ghost"} className="hover:bg-bg" onClick={goBack}>
            <ArrowLeft />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Delivery Representatives</h2>
            <p className="text-muted-foreground text-sm">
              Manage delivery representatives and their tasks
            </p>
          </div>
        </div>
        <AddDeliveryDialog />
      </div>
      {/* delivery representatives */}
      <DeliveryTable />
    </section>
  );
};

export default DeliveryPage;
