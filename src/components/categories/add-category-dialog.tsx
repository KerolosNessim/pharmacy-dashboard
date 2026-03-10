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

import { AddCategoryForm } from "./add-category-form";

const AddCategoryDialog = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Add Category
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Catgory</DialogTitle>
          <DialogDescription>
            Create a new system&apos;s category
          </DialogDescription>
        </DialogHeader>
          <AddCategoryForm setOpen={setOpen}/>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryDialog;

// categoryForm

