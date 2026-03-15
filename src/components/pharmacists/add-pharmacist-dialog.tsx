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

import { AddPharmacistForm } from "./add-pharmacist-form";

const AddPharmacistDialog = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Add Pharmacist
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Pharmacist</DialogTitle>
          <DialogDescription>
            Create a new system&apos;s Pharmacist
          </DialogDescription>
        </DialogHeader>
        <AddPharmacistForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default AddPharmacistDialog;
