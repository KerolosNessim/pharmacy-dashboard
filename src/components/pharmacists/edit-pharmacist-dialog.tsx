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

import { AddPharmacistForm } from "./add-pharmacist-form";
import { useUserStore } from "@/stores/user-store";
import { EditPharmacistForm } from "./edit-pharmaciest-form";
import { Pharmacist } from "@/types/pharmacists";

const EditPharmacistDialog = ({pharmacist}:{
  pharmacist:Pharmacist
}) => {
  const [open, setOpen] = useState(false);
  const { user } = useUserStore();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {user?.role !== "pharmacist" && (
        <DialogTrigger asChild>
          <Button variant="outline">
            <Pencil />
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Pharmacist</DialogTitle>
          <DialogDescription>Edit system&apos;s Pharmacist</DialogDescription>
        </DialogHeader>
        <EditPharmacistForm setOpen={setOpen}  pharmacist={pharmacist} />
      </DialogContent>
    </Dialog>
  );
};

export default EditPharmacistDialog;
