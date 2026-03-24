"use client";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { AddCashForm } from "./add-cash-form";

const AddCashDialog = ({ addInvoice }: { addInvoice: any }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Add Invoice
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Invoice</DialogTitle>
        </DialogHeader>

        <AddCashForm setOpen={setOpen} addInvoice={addInvoice} />
      </DialogContent>
    </Dialog>
  );
};

export default AddCashDialog;
