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
import { AddDeliveryForm } from "./add-delivery-form";


const AddDeliveryDialog = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Add Delivery Representative
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Delivery Representative</DialogTitle>
          <DialogDescription>
            Create a new system&apos;s Delivery Representative
          </DialogDescription>
        </DialogHeader>
        <AddDeliveryForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default AddDeliveryDialog;
