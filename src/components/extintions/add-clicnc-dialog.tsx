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

import { AddClinicForm } from "./add-clinic-form";

const AddClinicDialog = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Add Specialty
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Specialty</DialogTitle>
          <DialogDescription>
            Create a new system&apos;s Specialty
          </DialogDescription>
        </DialogHeader>
        <AddClinicForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default AddClinicDialog;
