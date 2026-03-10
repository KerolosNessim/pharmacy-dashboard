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

import { AddPharmacyForm } from "./add-pharmacy-form";

const AddPharmacyDialog = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Add Pharmacy
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Pharmacy</DialogTitle>
          <DialogDescription>
            Create a new system&apos;s pharmacy
          </DialogDescription>
        </DialogHeader>
        <AddPharmacyForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default AddPharmacyDialog;
