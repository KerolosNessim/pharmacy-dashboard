import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
const formSchema = z.object({
  name: z.string().min(3, "Pharmacist name is required"),
  phone_number: z.string().min(3, "Pharmacist id number is required"),
});

export type deliveryValues = z.infer<typeof formSchema>;

export const AddDeliveryForm = ({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) => {

  const form = useForm<deliveryValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone_number: "",
    },
  });
  async function onSubmit(values: deliveryValues) {
    console.log(values);
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
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Delivery Representative Phone Number</FormLabel>
              <FormControl>
                <Input
                  type="number"
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
                <Plus />
                Add Delivery Representative
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
