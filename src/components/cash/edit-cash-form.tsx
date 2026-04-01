"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Cash } from "@/types/cash";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { getDeliveriesApi } from "@/api/delivery";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { updateCashApi } from "@/api/cash";
import { toast } from "sonner";

const formSchema = z.object({
  invoice_number: z.string().min(1, "Invoice number is required"),
  amount: z.string().min(1, "Amount is required"),
  status: z.enum(["delivery", "received_from_driver", "delivered_to_finance"]),
  delivery_representative_id: z.string().optional(),
  products_information: z.string().min(1, "Products information is required"),
  pharmacy_id: z.string().min(1, "Pharmacy is required"),
  neighborhood: z.string().min(1, "Neighborhood is required"),
  customer_name: z.string().min(1, "Customer name is required"),
  mobile_no: z.string().min(1, "Mobile number is required"),
  location: z.string().min(1, "Location is required"),
  notes: z.string().optional(),
});

export type cashValues = z.infer<typeof formSchema>;

export const EditCashForm = ({
  setOpen,
  invoice,
}: {
  setOpen: (open: boolean) => void;
  invoice: Cash;
}) => {
  const form = useForm<cashValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invoice_number: invoice?.invoice_number || "",
      amount: String(invoice?.amount) || "",
      status: invoice?.status as
        | "delivery"
        | "received_from_driver"
        | "delivered_to_finance",
      delivery_representative_id:
        String(invoice?.delivery_representative?.id) || "",
      products_information: invoice?.products_information || "",
      neighborhood: invoice?.neighborhood || "",
      customer_name: invoice?.customer_name || "",
      mobile_no: invoice?.mobile_no || "",
      location: invoice?.location || "",
      notes: invoice?.notes || "",
    },
  });

  const { data } = useQuery({
    queryKey: ["deliveries"],
    queryFn: () => getDeliveriesApi(),
  });

  const deliveries = data?.data?.data ?? [];
  const queryClient = useQueryClient();
  const onSubmit = async (values: cashValues) => {
    const res = await updateCashApi(invoice.id, values);
    if (res?.ok) {
      toast.success(res?.data?.message);
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["cash"] });
    } else {
      toast.error(res?.error);
    }
  };

  const { isSubmitting } = form.formState;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Invoice Number */}
          <FormField
            control={form.control}
            name="invoice_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invoice Number</FormLabel>
                <FormControl>
                  <Input
                    disabled
                    placeholder="Enter invoice number"
                    {...field}
                    className="focus-visible:ring-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Amount */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Amount <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    {...field}
                    className="focus-visible:ring-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Status <span className="text-destructive">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="delivery">Delivery</SelectItem>
                    <SelectItem value="received_from_driver">
                      Received from Driver
                    </SelectItem>
                    <SelectItem value="delivered_to_finance">
                      Delivered to Finance
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Delivery Rep */}
          <FormField
            control={form.control}
            name="delivery_representative_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Delivery Representative</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Delivery Rep" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {deliveries?.map((rep) => (
                      <SelectItem key={rep?.id} value={rep?.id.toString()}>
                        {rep?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Customer Name */}
          <FormField
            control={form.control}
            name="customer_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Customer name"
                    {...field}
                    className="focus-visible:ring-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Mobile No */}
          <FormField
            control={form.control}
            name="mobile_no"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile No</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Mobile number"
                    {...field}
                    className="focus-visible:ring-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Neighborhood */}
          <FormField
            control={form.control}
            name="neighborhood"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Neighborhood</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Neighborhood"
                    {...field}
                    className="focus-visible:ring-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Location */}
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Location"
                    {...field}
                    className=" focus-visible:ring-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Products Information */}
        <FormField
          control={form.control}
          name="products_information"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Products Information</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter invoice contents / products information..."
                  {...field}
                  className="focus-visible:ring-primary resize-none h-24"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional notes..."
                  {...field}
                  className="focus-visible:ring-primary resize-none h-20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Save />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
