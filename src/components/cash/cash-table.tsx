"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Cash } from "@/types/cash";
import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import EditCashDialog from "./edit-cash-dialog";
import { Badge } from "../ui/badge";
import { useQueryClient } from "@tanstack/react-query";
import { deleteCashApi } from "@/api/cash";
import { useState } from "react";
import { toast } from "sonner";
import { useUserStore } from "@/stores/user-store";

const CashTable = ({
  invoices,
}: {
  invoices: Cash[];
  }) => {
  const [loading, setLoading] = useState(false)
  const {user}=useUserStore()
  const queryClient = useQueryClient();
  const deleteCash = async (id: number) => {
    setLoading(true)
    const res = await deleteCashApi(id);
    if(res?.ok){
      toast.success(res?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["cash"] });
    }
    else{
      toast.error(res?.error);
    }
    setLoading(false)
  };
  
  return (
    <div className="border rounded-lg overflow-hidden">
      {invoices.length > 0 ? (
        <Table className="bg-bg">
          <TableHeader>
            <TableRow>
              <TableHead>Invoice Number</TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead>Mobile No</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Rep</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              {
                user?.role!="pharmacist"&&(
                  <TableHead>Actions</TableHead>
                )
              }
            </TableRow>
          </TableHeader>

          <TableBody>
            {invoices.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell>{inv?.invoice_number}</TableCell>
                <TableCell>{inv?.customer_name || "-"}</TableCell>
                <TableCell>{inv?.mobile_no || "-"}</TableCell>
                <TableCell>{new Date(inv?.created_at).toLocaleDateString()}</TableCell>
                <TableCell>{inv?.delivery_representative?.name || "-"}</TableCell>
                <TableCell>{inv?.amount}</TableCell>
                <TableCell>
                  <Badge className="capitalize">
                    {inv.status.replaceAll("_", " ")}
                  </Badge>
                </TableCell>
                {
                  user?.role!="pharmacist"&&(
                    <TableCell className="flex gap-2">
                  <EditCashDialog invoice={inv} />

                  <Button
                    variant="destructive"
                    onClick={() => deleteCash(inv?.id)}
                    disabled={loading}
                  >
                    <Trash />
                  </Button>
                </TableCell>
                  )
                }
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="p-6 text-center">No invoices</p>
      )}
    </div>
  );
};

export default CashTable;
