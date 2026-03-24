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

const formSchema = z.object({
  products_info: z.string().min(3, "Products info is required"),
  amount: z.string().min(1, "Amount is required"),
  delivery_rep: z.string().min(1, "Delivery representative is required"),
  status: z.enum(["Delivery", "Received from Driver", "Delivered to Finance"]),
});

export type cashValues = z.infer<typeof formSchema>;

const deliveryReps = ["John Doe", "Jane Doe", "Ahmed", "Mohamed"];

export const AddCashForm = ({
  setOpen,
  addInvoice,
}: {
  setOpen: (open: boolean) => void;
  addInvoice: (invoice: any) => void;
}) => {
  const form = useForm<cashValues>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: cashValues) {
    const newInvoice = {
      id: "INV-" + Math.floor(Math.random() * 1000000),
      date: new Date().toISOString().split("T")[0],
      ...values,
    };

    addInvoice(newInvoice);
    setOpen(false);
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
            name="delivery_rep"
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
                      <SelectItem key={rep} value={rep}>
                        {rep}
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
                    <SelectItem value="Delivery">Delivery</SelectItem>
                    <SelectItem value="Received from Driver">
                      Received from Driver
                    </SelectItem>
                    <SelectItem value="Delivered to Finance">
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
          name="products_info"
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
