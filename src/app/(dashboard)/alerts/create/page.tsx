"use client";

import { getAlertsApi } from "@/api/alerts";
import AlertsCard from "@/components/alerts/alerts-card";
import CraeteAlertsForm from "@/components/alerts/create-alert-form";
import { Button } from "@/components/ui/button";
import { useGoBack } from "@/hooks/use-goback";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";

const CreateAlertPage = () => {
  const goBack = useGoBack();
  const {data}=useQuery({
    queryKey:["alerts"],
    queryFn:getAlertsApi
  })

  const alerts =data?.data?.data??[]
  return (
    <section className="p-4">
      <div className="flex items-center gap-2">
        <Button variant={"ghost"} onClick={goBack}>
          <ChevronLeft />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create Alerts</h1>
          <p className="text-muted-foreground">Manage your alerts</p>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-4">
        <CraeteAlertsForm />
        {alerts.length > 0 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">Alerts</h2>
            {alerts.map((alert) => (
              <AlertsCard key={alert.id} alert={alert} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CreateAlertPage;
