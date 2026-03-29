"use client";
import { Edit } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../ui/dialog";

import { UpdateSupervisorForm } from "./update-supervisor-form";
import { Supervisor } from "@/types/supervisor";

const UpdateSupervisorDialog = ({ supervisor }: { supervisor :Supervisor}) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"}>
          <Edit /> 
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Supervisor&apos;s info</DialogTitle>
        </DialogHeader>
        <UpdateSupervisorForm setOpen={setOpen} supervisor={supervisor} />
      </DialogContent>
    </Dialog>
  );
};

export default UpdateSupervisorDialog;
