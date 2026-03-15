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

import { AddDoctorExtensionForm } from "./add-doctor-ex-form";

const AddDoctorExtensionDialog = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Add Doctor
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Doctor</DialogTitle>
          <DialogDescription>
            Create a new system&apos;s Doctor
          </DialogDescription>
        </DialogHeader>
        <AddDoctorExtensionForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default AddDoctorExtensionDialog;
