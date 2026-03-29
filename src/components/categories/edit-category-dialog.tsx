"use client";
import { Edit } from "lucide-react";
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

import { EditCategoryForm } from "./edit-category-form";
import { category } from "@/types/categories";

const EditCategoryDialog = ({category}:{category:category}) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button  variant="outline">
          <Edit />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Catgory</DialogTitle>
          <DialogDescription>Edit system&apos;s category</DialogDescription>
        </DialogHeader>
        <EditCategoryForm category={category} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default EditCategoryDialog;

// categoryForm
