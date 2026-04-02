import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Delivery } from "@/types/delivery";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { updateDeliveryApi } from "@/api/delivery";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
const formSchema = z.object({
  name: z.string().min(3, "Pharmacist name is required"),
  phone: z.string().min(3, "Pharmacist id number is required"),
});

export type deliveryValues = z.infer<typeof formSchema>;

export const EditDeliveryForm = ({
  setOpen,
  deliveryRep
}: {
  setOpen: (open: boolean) => void;
  deliveryRep: Delivery;
}) => {
  const form = useForm<deliveryValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: deliveryRep?.name,
      phone: deliveryRep?.phone,
    },
  });
  const queryClient = useQueryClient();
  async function onSubmit(values: deliveryValues) {
    const response = await updateDeliveryApi(deliveryRep?.id, values);
    if (response?.ok) {
      queryClient.invalidateQueries({ queryKey: ["deliveries"] });
      toast.success(response?.data?.message);
      setOpen(false);
    } else {
      toast.error(response?.error);
    }
  }

  const { isSubmitting } = form.formState;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/*  Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Delivery Representative Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Delivery Representative Name"
                  {...field}
                  className="focus-visible:ring-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* phone number */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Delivery Representative Phone Number</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter Delivery Representative Phone Number"
                  {...field}
                  className="focus-visible:ring-primary"
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
                <Pencil />
                Update Delivery Representative
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
