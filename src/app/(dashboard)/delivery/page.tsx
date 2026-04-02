"use client";
import { getDeliveriesApi } from "@/api/delivery";
import AddDeliveryDialog from "@/components/delivery/add-delivery-dialog";
import DeliveryTable from "@/components/delivery/delivery-table";
import { Button } from "@/components/ui/button";
import { useGoBack } from "@/hooks/use-goback";
import { useUserStore } from "@/stores/user-store";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";

const DeliveryPage = () => {
  const { user } = useUserStore();
  const goBack = useGoBack();
  const { data } = useQuery({
    queryKey: ["deliveries"],
    queryFn: () => getDeliveriesApi(),
  });
  const deliveries = data?.data?.data ?? [];
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
        {user?.role === "super_admin" && <AddDeliveryDialog />}
      </div>
      {/* delivery representatives */}
      <DeliveryTable user={user} deliveries={deliveries} />
    </section>
  );
};

export default DeliveryPage;
