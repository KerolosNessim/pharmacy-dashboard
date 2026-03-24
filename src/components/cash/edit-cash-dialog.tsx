"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { EditCashForm } from "./edit-cash-form";
import { CashInvoice } from "@/app/(dashboard)/cash/page";
import { Edit } from "lucide-react";

const EditCashDialog = ({
  invoice,
  editInvoice,
}: {
  invoice: CashInvoice;
  editInvoice: (invoice: CashInvoice) => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Edit/>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Invoice</DialogTitle>
        </DialogHeader>

        <EditCashForm
          setOpen={setOpen}
          invoice={invoice}
          editInvoice={editInvoice}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditCashDialog;
