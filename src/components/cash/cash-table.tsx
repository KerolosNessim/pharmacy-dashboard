"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import EditCashDialog from "./edit-cash-dialog";
import { CashInvoice } from "@/app/(dashboard)/cash/page";
import { Trash } from "lucide-react";

const CashTable = ({
  invoices,
  deleteInvoice,
  editInvoice,
}: {
  invoices: CashInvoice[];
  deleteInvoice: (id: string) => void;
  editInvoice: (invoice: CashInvoice) => void;
}) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      {invoices.length > 0 ? (
        <Table className="bg-bg">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Rep</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {invoices.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell>{inv.id}</TableCell>
                <TableCell>{inv.date}</TableCell>
                <TableCell>{inv.delivery_rep}</TableCell>
                <TableCell>{inv.amount}</TableCell>
                <TableCell>{inv.status}</TableCell>
                <TableCell className="flex gap-2">
                  <EditCashDialog invoice={inv} editInvoice={editInvoice} />

                  <Button
                    variant="destructive"
                    onClick={() => deleteInvoice(inv.id)}
                  >
                    <Trash />
                  </Button>
                </TableCell>
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
