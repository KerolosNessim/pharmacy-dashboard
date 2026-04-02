"use client"
import { deleteAlertApi } from "@/api/alerts";
import { Alert } from "@/types/alerts";
import { useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useUserStore } from "@/stores/user-store";

const AlertsCard = ({ alert }: { alert: Alert }) => {
  const queryClient = useQueryClient();
  const {user}=useUserStore()
async function deleteAlert(id:string){
    const res =await deleteAlertApi(id)
  if (res?.ok) {
      toast.success("Alert deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
  }
  else{
    toast.error("Failed to delete alert");
  }
}
  return (
    <Card className="relative">
      <CardHeader>
        <div  dangerouslySetInnerHTML={{ __html: alert?.body }} />
      </CardHeader>
      {user?.role=="super_admin"&&(
        <Button className="absolute -top-2 -right-2 rounded-full p-0! size-6" variant="destructive" size="sm" onClick={() => deleteAlert(alert.id.toString())}>
          <X/>
        </Button>
      )}
    </Card>
  );
};

export default AlertsCard;
