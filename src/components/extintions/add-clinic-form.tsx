import { addClinicApi } from "@/api/extintions";
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
import { Loader2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
const formSchema = z.object({
  name: z.string().min(3, "Clinic name is required"),
  // phone: z.string().min(3, "Clinic phone is required"),
  // address: z.string().min(3, "Clinic address is required"),
});

export type ClinicValues = z.infer<typeof formSchema>;

export const AddClinicForm = ({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) => {
  const form = useForm<ClinicValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      // phone: "",
      // address: "",
    },
  });

  const queryClient = useQueryClient();
  async function onSubmit(values: ClinicValues) {
    const res = await addClinicApi(values);
    if (res?.ok) {
      toast.success(res?.data?.message);
      setOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["cliencs"] });
    } else {
      toast.error(res?.error);
    }
  }

  const { isSubmitting } = form.formState;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Supervisor Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specialty Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Specialty Name"
                  {...field}
                  className="focus-visible:ring-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Supervisor address */}
        {/* <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Clinic Phone</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Clinic Phone"
                  {...field}
                  className="focus-visible:ring-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        {/* Supervisor address */}
        {/* <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Clinic Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Clinic Address"
                  {...field}
                  className="focus-visible:ring-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

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
                Add Specialty
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
