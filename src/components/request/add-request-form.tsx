"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPharmaciesApi } from "@/api/pharmacies";
import { getProductsListApi } from "@/api/products";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { addRequestApi } from "@/api/transfar";

const requestSchema = z.object({
  from_pharmacy_id: z.string().min(1, "Please select a branch"),
  notes: z.string().min(3, "Notes is required"),
  items: z
    .array(
      z.object({
        product_id: z.string().min(1, "Please select a product"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
      }),
    )
    .min(1, "At least one item is required"),
});

export type RequestFormValues = z.infer<typeof requestSchema>;

export const AddRequestForm = ({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
  }) => {
  
  const queryClient = useQueryClient();
  const form = useForm<RequestFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(requestSchema) as any,
    defaultValues: {
      from_pharmacy_id: "",
      notes: "",
      items: [{ product_id: "", quantity: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const {isSubmitting}=form.formState
  const { data: pharmaciesData, isLoading: loadingPharmacies } = useQuery({
    queryKey: ["pharmacies"],
    queryFn: getPharmaciesApi,
  });

  const { data: productsData, isLoading: loadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProductsListApi(""),
  });

  const pharmacies = pharmaciesData?.data?.data?.data || [];
  const products = productsData?.data?.data?.data || [];

  const onSubmit = async (values: RequestFormValues) => {
    const payload = {
      from_pharmacy_id: Number(values.from_pharmacy_id),
      notes: values.notes,
      items: values.items.map((item) => ({
        product_id: Number(item.product_id),
        quantity: Number(item.quantity),
      })),
    };

    const res = await addRequestApi(payload)
    if (res?.ok) {
      toast.success(res?.data?.message);
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["transfer-out"] });
    }else{
      toast.error(res?.error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="from_pharmacy_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Request From Branch</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        loadingPharmacies
                          ? "Loading branches..."
                          : "Select a branch"
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent position="popper">
                  {pharmacies.map((pharmacy) => (
                    <SelectItem
                      key={pharmacy.id}
                      value={pharmacy.id.toString()}
                    >
                      {pharmacy.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Request Items</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ product_id: "", quantity: 1 })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className=" border p-4 rounded-md relative shadow-sm"
            >
              <div className=" space-y-4">
                <div className="flex items-end gap-4 w-full ">
                  <FormField
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    control={form.control as any}
                    name={`items.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            className="w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      className=" shrink-0"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <FormField
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  control={form.control as any}
                  name={`items.${index}.product_id`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={
                                loadingProducts
                                  ? "Loading products..."
                                  : "Select a product"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent position="popper">
                          {products.map((product) => (
                            <SelectItem
                              key={product.id}
                              value={product.id.toString()}
                            >
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g. urgent request for missing items in the pain relief department"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Submit Request"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddRequestForm;
