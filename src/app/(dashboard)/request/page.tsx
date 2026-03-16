"use client";
import { getRequestsApi } from "@/api/transfar";
import OutCard from "@/components/request/out-card";
import RequestDialog from "@/components/request/request-dialog";
import { Button } from "@/components/ui/button";
import { useGoBack } from "@/hooks/use-goback";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
const RequestPage = () => {
  const goBack = useGoBack();

  const { data,isLoading } = useQuery({
    queryKey: ["transfer-out"],
    queryFn: () => getRequestsApi("?type=out"),
  });
  const requests = data?.data?.data?.data ?? [];

  return (
    <section className="flex flex-col gap-6 p-4">
      {/* header */}
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
        <RequestDialog />
      </div>
      <div className="lg:w-2/3 mx-auto space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="size-8 animate-spin" />
          </div>
        ) : (
          requests.map((request,index) => (
            <OutCard key={request.id} order={index+1} request={request} />
          ))
        )}
      </div>
    </section>
  );
};

export default RequestPage;
