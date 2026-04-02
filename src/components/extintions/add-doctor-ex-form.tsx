import { addDoctorApi, getClinicsApi } from "@/api/extintions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { singleClinic } from "@/types/extintions";
const formSchema = z.object({
  name: z.string().min(3, "Clinic name is required"),
  phone: z.string().min(3, "Clinic phone is required"),
  clinic_id: z.string().min(1, "Clinic address is required"),
});

export type DoctorExtensionValues = z.infer<typeof formSchema>;

export const AddDoctorExtensionForm = ({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) => {
  const form = useForm<DoctorExtensionValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      clinic_id: "",
    },
  });
  const {data:clinics} = useQuery({
    queryKey: ["clinics"],
    queryFn: () => getClinicsApi(),
  });

  const clinicsList = clinics?.data?.data;

  const queryClient = useQueryClient();
  async function onSubmit(values: DoctorExtensionValues) {
    const res = await addDoctorApi(values);
    if (res?.ok) {
      toast.success(res?.data?.message);
      setOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["clinics"] });
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
              <FormLabel>Doctor Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Doctor Name"
                  {...field}
                  className="focus-visible:ring-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Supervisor address */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doctor Phone</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Doctor Phone"
                  {...field}
                  className="focus-visible:ring-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Supervisor address */}
        <FormField
          control={form.control}
          name="clinic_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specialty </FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Specialty" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {clinicsList?.map((clinic: singleClinic) => (
                      <SelectItem key={clinic.id} value={String(clinic.id)}>
                        {clinic.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                Add Doctor
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
