"use client";
import { Edit } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { EditCashForm } from "./edit-cash-form";
import { CashInvoice } from "@/app/(dashboard)/cash/page";

const EditCashDialog = ({ invoice }: { invoice: CashInvoice }) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"secondary"} className="hover:bg-bg">
          <Edit />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Cash Invoice</DialogTitle>
          <DialogDescription>Update external invoice record</DialogDescription>
        </DialogHeader>
        <EditCashForm setOpen={setOpen} invoice={invoice} />
      </DialogContent>
    </Dialog>
  );
};

export default EditCashDialog;
