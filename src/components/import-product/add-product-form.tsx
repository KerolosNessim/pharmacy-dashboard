"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, Plus } from "lucide-react";
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
import { addProductApi } from "@/api/products";

// Update this schema later if you have more complex validations or API constraints
const formSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  code: z.string().min(2, "Product code is required"),
  price: z.string().min(0.01, "Price must be greater than 0"),
  category_id: z.string().min(1, "Category is required"),
  active_ingredients: z.string().min(2, "Active ingredients are required"),
  dosage_form: z.string().min(2, "Dosage form is required"),
  manufacturer: z.string().min(2, "Manufacturer is required"),
  status: z.enum(["active", "inactive"]).default("active"),
});

export type ProductFormValues = z.infer<typeof formSchema>;

export const AddProductForm = () => {

  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesApi,
  });

  const queryClient = useQueryClient()
  const form = useForm<ProductFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: "",
      code: "",
      price: "",
      category_id: "", // Defaulting to 1, or can be 0 and left empty to force user to fill
      active_ingredients: "",
      dosage_form: "",
      manufacturer: "",
      status: "active",
    },
  });

  async function onSubmit(values: ProductFormValues) {
    const res = await addProductApi(values)
    if(res?.ok){
      toast.success("Product added successfully")
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["categories-stats"] })
    }
    else{
      toast.error(res?.error)
    }
  }

  const { isSubmitting } = form.formState;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col gap-4">
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
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Code</FormLabel>
                <FormControl>
                  <Input
                    className="focus-visible:ring-primary"
                    placeholder="e.g. PANA-405" {...field} />
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
                  <Select
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full focus-visible:ring-primary">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {data?.data?.data?.map((category, index) => (
                        <SelectItem key={index} value={String(category?.id)}>
                          {category?.name}
                        </SelectItem>
                      ))}
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
                  </FormControl >
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="animate-spin w-4 h-4 mr-2" />
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
