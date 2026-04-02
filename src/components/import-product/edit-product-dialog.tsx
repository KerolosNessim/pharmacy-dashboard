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
import { EditProductForm } from "./edit-product-from";
import { ProductItem } from "@/types/products";


const EditProductDialog = ({product}: {product: ProductItem}) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      
        <DialogTrigger asChild>
          <Button variant="outline">
            <Pencil />
          </Button>
        </DialogTrigger>
      <DialogContent className="max-h-[95vh] overflow-y-auto no-scrollbar">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>Edit system&apos;s Product</DialogDescription>
          <EditProductForm product={product} setOpen={setOpen} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductDialog;
