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

const   AddCashDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog  open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Add Invoice
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[95vh] overflow-y-auto no-scrollbar" >
        <DialogHeader>
          <DialogTitle>Add Invoice</DialogTitle>
        </DialogHeader>

        <AddCashForm setOpen={setOpen}  />
      </DialogContent>
    </Dialog>
  );
};

export default AddCashDialog;
