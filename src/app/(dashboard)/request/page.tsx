"use client";
import { getRequestsApi } from "@/api/transfar";
import OutCard from "@/components/request/out-card";
import { Button } from "@/components/ui/button";
import { useGoBack } from "@/hooks/use-goback";
import { useUserStore } from "@/stores/user-store";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Inbox, Loader2, Plus } from "lucide-react";
import Link from "next/link";
const RequestPage = () => {
  const goBack = useGoBack();
const {user}= useUserStore()
  const { data,isLoading } = useQuery({
    queryKey: ["transfer-out"],
    queryFn: () => getRequestsApi("?type=out&status=all"),
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
        {user?.role!="super_admin"&&(
          <Link href={"request/create"}>
            <Button><Plus className="mr-2 h-4 w-4"/>Request Items</Button>
          </Link>
        )}
      </div>
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="size-8 animate-spin" />
          </div>
        ) : (
            requests.length === 0 ? (
                <div className="flex flex-col items-center gap-3 bg-bg rounded-lg border p-6 ">
                    <Inbox className="size-14 text-primary" />
                    <h3 className="text-lg font-medium">No Out Requests</h3>
                    <p className="text-muted-foreground">
                        When you request items from other branches, they&apos;ll appear
                        here.
                    </p>
                </div>
          ) : (
                <div className="lg:w-2/3 mx-auto space-y-4">
                {requests.map((request,index) => (
                    <OutCard key={request.id} order={index+1} request={request} />
                ))}
              </div>
            )
        )}
    </section>
  );
};

export default RequestPage;
