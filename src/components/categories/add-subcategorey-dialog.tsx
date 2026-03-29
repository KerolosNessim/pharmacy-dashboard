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

import { AddSubCategoryForm } from "./add-subcategory-form";

const AddSubCategoryDialog = ({ parentId }: { parentId: number }) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Add Sub Category
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Sub Catgory</DialogTitle>
          <DialogDescription>
            Create a new system&apos;s category
          </DialogDescription>
        </DialogHeader>
        <AddSubCategoryForm setOpen={setOpen} parentId={parentId} />
      </DialogContent>
    </Dialog>
  );
};

export default AddSubCategoryDialog;

// categoryForm
