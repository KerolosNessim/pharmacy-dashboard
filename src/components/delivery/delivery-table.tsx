"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Loader2, Motorbike, Trash } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import EditDeliveryDialog from "./edit-delvery-dialog";
import { Delivery } from "@/types/delivery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDeliveryApi } from "@/api/delivery";
import { toast } from "sonner";
import { useState } from "react";
import { user } from "@/types/auth";

const DeliveryTable = ({ deliveries, user }: { deliveries: Delivery[], user: user | null }) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  async function deleteDelivery(id: number) {
    setLoading(true);
    const response = await deleteDeliveryApi(id);
    if (response?.ok) {
      queryClient.invalidateQueries({ queryKey: ["deliveries"] });
      toast.success(response?.data?.message);
    } else {
      toast.error(response?.error);
    }
    setLoading(false);
  }

  return (
    <div className="border rounded-lg! overflow-hidden ">
      {deliveries.length > 0 ? (
        <Table className="">
          <TableHeader className="bg-bg ">
            <TableRow className="hover:bg-bg ">
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              {user?.role === "super_admin" && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody className="bg-bg/50">
            {deliveries.map((deliveryRep, index) => (
              <TableRow
                key={index}
                className="hover:bg-muted-foreground/5  h-14  px-4 "
              >
                <TableCell>{deliveryRep?.name}</TableCell>
                <TableCell>{deliveryRep?.phone}</TableCell>
                {user?.role === "super_admin" && (
                  <TableCell className="flex items-center gap-2">
                    <EditDeliveryDialog deliveryRep={deliveryRep} />
                    <Button
                      disabled={loading}
                      onClick={() => deleteDelivery(deliveryRep?.id)}
                      variant={"destructive"}
                    >
                      <Trash />
                    </Button>
                  </TableCell>)}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex flex-col items-center gap-2  p-6 text-muted-foreground">
          <Motorbike className="size-12 " />
          <p>No Delivery Representatives found</p>
        </div>
      )}
    </div>
  );
};

export default DeliveryTable;
