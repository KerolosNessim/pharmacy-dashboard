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
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDeliveriesApi } from "@/api/delivery";
import { addCashApi } from "@/api/cash";
import { toast } from "sonner";
import { useUserStore } from "@/stores/user-store";

const formSchema = z.object({
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

export const AddCashForm = ({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
  }) => {
  const {user}=useUserStore()
  const form = useForm<cashValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      status: "delivery",
      delivery_representative_id: "",
      products_information: "",
      pharmacy_id: user?.pharmacy_id?.toString()||"",
      neighborhood: "",
      customer_name: "",
      mobile_no: "",
      location: "",
      notes: "",
    },
  });

  const { data } = useQuery({
    queryKey: ["deliveries"],
    queryFn: getDeliveriesApi,
  });
  const deliveryReps = data?.data?.data ?? [];
  const queryClient = useQueryClient();

  async function onSubmit(values: cashValues) {
    const res = await addCashApi(values);
    if (res?.ok) {
      toast.success(res?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["cash"] });
      setOpen(false);
    } else {
      toast.error(res?.error);
    }
  }

  const { isSubmitting } = form.formState;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Amount */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount <span className="text-destructive">*</span></FormLabel>
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
                <FormLabel>Status <span className="text-destructive">*</span></FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="delivery">Delivery</SelectItem>
                    <SelectItem value="received_from_driver">Received from Driver</SelectItem>
                    <SelectItem value="delivered_to_finance">Delivered to Finance</SelectItem>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Delivery Rep" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {deliveryReps.map((rep) => (
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
                  <Input placeholder="Customer name" {...field} className="focus-visible:ring-primary" />
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
                  <Input placeholder="Mobile number" {...field} className="focus-visible:ring-primary" />
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
                  <Input placeholder="Neighborhood" {...field} className="focus-visible:ring-primary" />
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
              <FormItem className="col-span-2">
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Location" {...field} className=" focus-visible:ring-primary" />
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
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Plus />
                Create Invoice
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
