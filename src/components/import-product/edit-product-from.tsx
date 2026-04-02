"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, Pencil, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategoriesApi } from "@/api/categories";
import { updateProductApi } from "@/api/products";
import { ProductItem } from "@/types/products";
import { useState } from "react";
import Image from "next/image";

// Update this schema later if you have more complex validations or API constraints
const formSchema = z.object({
  image: z.any().optional(),
  name: z.string().min(2, "Product name is required"),
  description: z.string().optional(),
  sku: z.string().optional(),
  code: z.string().min(2, "Product code is required"),
  price: z.string().min(0.01, "Price must be greater than 0"),
  category_id: z.string().min(1, "Category is required"),
  active_ingredients: z.string().min(2, "Active ingredients are required"),
  dosage_form: z.string().min(2, "Dosage form is required"),
  concentration: z.string().optional(),
  side_effects: z.string().optional(),
  storage_instructions: z.string().optional(),
  manufacturer: z.string().min(2, "Manufacturer is required"),
  status: z.enum(["active", "inactive"]).default("active"),
});

export type ProductFormValues = z.infer<typeof formSchema>;

export const EditProductForm = ({product, setOpen}: {product: ProductItem, setOpen: (open: boolean) => void}) => {
  const [preview, setPreview] = useState<string | null>(product?.image || null);
  const [fileKey, setFileKey] = useState(0);
  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategoriesApi(),
  });

  const queryClient = useQueryClient();
  const form = useForm<ProductFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      image: undefined,
      name: product?.name||"",
      description: product?.description || "",
      sku: product?.sku || "",
      code: product?.code||"",
      price: product?.price||"",
      category_id: String(product?.category_id)||"", // Defaulting to 1, or can be 0 and left empty to force user to fill
      active_ingredients: product?.active_ingredients||"",
      concentration: product?.concentration || "",
      side_effects: product?.side_effects || "",
      storage_instructions: product?.storage_instructions || "",
      dosage_form: product?.dosage_form||"",
      manufacturer: product?.manufacturer||"",
      status: (product?.status as "active" | "inactive") || "active",
    },
  });

  const clearImage = () => {
    form.setValue("image", undefined);
    setPreview(null);
    setFileKey(prev => prev + 1);
  }

  async function onSubmit(values: ProductFormValues) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key === "image" && !(value instanceof File)) {
        return;
      }
      if (value !== undefined && value !== null) {
        formData.append(key, value as string | Blob);
      }
    });
    // For Laravel/PHP backends, PUT with FormData sometimes doesn't work, so it might need '_method=PUT'.
    // If the backend requires it, uncomment the following line and change updateProductApi to POST:
    // formData.append("_method", "PUT");

    const res = await updateProductApi(String(product?.id), formData);
    if (res?.ok) {
      toast.success("Product updated successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["categories-stats"] });
      setOpen(false);
      form.reset();
    } else {
      toast.error(res?.error);
    }
  }

  const { isSubmitting } = form.formState;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Image</FormLabel>
                <FormControl>
                  <Input
                    key={fileKey}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      field.onChange(file);

                      if (file) {
                        const imageUrl = URL.createObjectURL(file);
                        setPreview(imageUrl);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {preview && (
            <div className="mt-4 relative w-fit">
              <Image
                src={preview}
                alt="preview"
                width={400}
                height={400}
                className="w-40 h-40 object-cover rounded-lg border "
              />
              <Button
                onClick={clearImage}
                type="button"
                className="absolute -top-4 -right-4 rounded-full p-0! size-8 flex items-center justify-center"
                variant="destructive"
                size="sm"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input
                    className="focus-visible:ring-primary"
                    placeholder="e.g. Advance"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input
                    className="focus-visible:ring-primary"
                    placeholder="e.g. Advance"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <Input
                    className="focus-visible:ring-primary"
                    placeholder="e.g. Advance"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Code</FormLabel>
                <FormControl>
                  <Input
                    className="focus-visible:ring-primary"
                    placeholder="e.g. PANA-405"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    className="focus-visible:ring-primary"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 20.5"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category ID</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger className="w-full focus-visible:ring-primary">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {data?.data?.data?.map((category) => [
                        <SelectItem
                          disabled={
                            category?.children && category.children.length > 0
                          }
                          key={category?.id}
                          value={String(category?.id)}
                        >
                          {category?.name}
                        </SelectItem>,
                        category?.children?.map((child) => (
                          <SelectItem key={child?.id} value={String(child?.id)}>
                            <div className="flex items-center gap-2 ps-4">
                              <span className="text-muted-foreground/50">
                                --
                              </span>
                              {child?.name}
                            </div>
                          </SelectItem>
                        )) || [],
                      ])}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="active_ingredients"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Active Ingredients</FormLabel>
                <FormControl>
                  <Input
                    className="focus-visible:ring-primary"
                    placeholder="e.g. Paracetamol,tamol"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="concentration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Concentration</FormLabel>
                <FormControl>
                  <Input
                    className="focus-visible:ring-primary"
                    placeholder="e.g. 500mg"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="side_effects"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Side Effects</FormLabel>
                <FormControl>
                  <Input
                    className="focus-visible:ring-primary"
                    placeholder="e.g. Nausea, Dizziness"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="storage_instructions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Storage Instructions</FormLabel>
                <FormControl>
                  <Input
                    className="focus-visible:ring-primary"
                    placeholder="e.g. Store in a cool, dry place"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dosage_form"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dosage Form</FormLabel>
                <FormControl>
                  <Input
                    className="focus-visible:ring-primary"
                    placeholder="e.g. Tablets"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="manufacturer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Manufacturer</FormLabel>
                <FormControl>
                  <Input
                    className="focus-visible:ring-primary"
                    placeholder="e.g. GSK"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full focus-visible:ring-primary">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent position="popper">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="animate-spin w-4 h-4 mr-2" />
            ) : (
              <>
                <Pencil className="w-4 h-4 mr-2" />
                Edit Product
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
