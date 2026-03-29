import { addPharmacyApi, updatePharmacyApi } from "@/api/pharmacies";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Pharmacy } from "@/types/pharmacies";
const formSchema = z.object({
  name: z.string().min(3, "Pharmacy name is required"),
  address: z.string().min(3, "Pharmacy address is required"),
  phone: z.string().min(3, "Pharmacy phone is required"),
});

export type pharmacyValues = z.infer<typeof formSchema>;

export const EditPharmacyForm = ({
  setOpen,
  pharmacy
}: {
  setOpen: (open: boolean) => void;
  pharmacy: Pharmacy;
}) => {
  const queryClient = useQueryClient();

  const form = useForm<pharmacyValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: pharmacy?.name || "",
      address: pharmacy?.address || "",
      phone: pharmacy?.phone || "",
    },
  });
  async function onSubmit(values: pharmacyValues) {
    const res = await updatePharmacyApi(String(pharmacy.id), values);
    console.log(res);
    if (res?.ok) {
      toast.success(res?.data?.message);
      queryClient.invalidateQueries({
        queryKey: ["pharmacies"],
      });
      form.reset();
      setOpen(false);
    } else {
      toast.error(res?.error);
    }
  }

  const { isSubmitting } = form.formState;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Pharmacy Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pharmacy Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Pharmacy Name"
                  {...field}
                  className="focus-visible:ring-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Pharmacy address */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pharmacy Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Pharmacy Address"
                  {...field}
                  className="focus-visible:ring-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Pharmacy phone */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pharmacy Phone</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., 01000000000"
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
                Edit Pharmacy
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
