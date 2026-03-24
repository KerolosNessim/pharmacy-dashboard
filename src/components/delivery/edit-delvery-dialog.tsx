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
import { EditDeliveryForm } from "./edit-delivery-form";

const EditDeliveryDialog = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"secondary"} className="hover:bg-bg">
          <Edit />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Delivery Representative</DialogTitle>
          <DialogDescription>Edit Delivery Representative</DialogDescription>
        </DialogHeader>
        <EditDeliveryForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default EditDeliveryDialog;
