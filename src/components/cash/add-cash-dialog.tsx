"use client";
import { Plus } from "lucide-react";
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
import { AddCashForm } from "./add-cash-form";


const AddCashDialog = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Add Invoice
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Cash Invoice</DialogTitle>
          <DialogDescription>
            Create a new external invoice record
          </DialogDescription>
        </DialogHeader>
        <AddCashForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default AddCashDialog;
