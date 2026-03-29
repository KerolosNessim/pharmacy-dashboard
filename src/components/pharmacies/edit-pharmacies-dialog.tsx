"use client";
import { Pencil, Plus } from "lucide-react";
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

import { Pharmacy } from "@/types/pharmacies";
import { EditPharmacyForm } from "./edit-pharmacies-form";

const EditPharmacyDialog = ({pharmacy}: {pharmacy: Pharmacy}) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Pencil /> 
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Pharmacy</DialogTitle>
          <DialogDescription>
            Edit a system&apos;s pharmacy
          </DialogDescription>
        </DialogHeader>
        <EditPharmacyForm setOpen={setOpen} pharmacy={pharmacy} />
      </DialogContent>
    </Dialog>
  );
};

export default EditPharmacyDialog;
