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

import { AddSupervisorForm } from "./add-supervisor-form";

const AddSupervisorDialog = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Add Supervisor
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Supervisor</DialogTitle>
          <DialogDescription>
            Create a new system&apos;s Supervisor
          </DialogDescription>
        </DialogHeader>
        <AddSupervisorForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default AddSupervisorDialog;
