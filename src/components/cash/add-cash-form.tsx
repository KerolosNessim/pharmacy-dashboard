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

const formSchema = z.object({
  products_information: z.string().min(3, "Products info is required"),
  amount: z.string().min(1, "Amount is required"),
  delivery_representative_id: z
    .string()
    .min(1, "Delivery representative is required"),
  status: z.enum(["delivery", "received_from_driver", "delivered_to_finance"]),
});

export type cashValues = z.infer<typeof formSchema>;


export const  AddCashForm = ({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) => {
  const form = useForm<cashValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      products_information: "",
      amount: "",
      delivery_representative_id: "",
      status: "delivery",
    },
  });

  const {data} = useQuery({
    queryKey: ["deliveries"],
    queryFn: getDeliveriesApi,
  })
  const deliveryReps = data?.data?.data ?? []
  const queryClient = useQueryClient();
  async function onSubmit(values: cashValues) {
    const res = await addCashApi(values);
    if (res?.ok) {
      toast.success(res?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["cash"] });
      setOpen(false);
    }
    else {
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
              <FormItem className="col-span-2">
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter Invoice Amount"
                    {...field}
                    className="focus-visible:ring-primary"
                  />
                </FormControl>
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
                      <SelectValue placeholder="Select Delivery Representative" />
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

          {/* Status */}
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
        </div>

        {/* Products Info */}
        <FormField
          control={form.control}
          name="products_information"
          render={({field}) => (
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
