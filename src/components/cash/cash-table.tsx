"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CircleCheckBig, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import EditCashDialog from "./edit-cash-dialog";

const CashTable = () => {
  const invoices = [
    {
      id: "INV-123456",
      amount: "1,500",
      status: "Delivery",
      date: "2024-03-24",
      delivery_rep: "John Doe",
    },
    {
      id: "INV-654321",
      amount: "2,350 ",
      status: "Received from Driver",
      date: "2024-03-23",
      delivery_rep: "Ahmed",
    },
    {
      id: "INV-987654",
      amount: "5,000 ",
      status: "Delivered to Finance",
      date: "2024-03-22",
      delivery_rep: "Jane Doe",
    },
  ];

  return (
    <div className="border rounded-lg! overflow-hidden ">
      {invoices.length > 0 ? (
        <Table className="">
          <TableHeader className="bg-bg ">
            <TableRow className="hover:bg-bg ">
              <TableHead>Invoice Number</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Rep Name</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-bg/50">
            {invoices.map((invoice, index) => (
              <TableRow
                key={index}
                className="hover:bg-muted-foreground/5 h-14 px-4 "
              >
                <TableCell className="font-medium">{invoice.id}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>{invoice.delivery_rep}</TableCell>
                <TableCell>{invoice.amount}</TableCell>
                <TableCell>
                  <Badge variant={"outline"}>{invoice.status}</Badge>
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  <EditCashDialog invoice={invoice} />
                  <Button variant={"destructive"}>
                    <Trash />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex flex-col items-center gap-2  p-6 text-muted-foreground">
          <CircleCheckBig className="size-12 " />
          <p>No Invoices found</p>
        </div>
      )}
    </div>
  );
};

export default CashTable;
