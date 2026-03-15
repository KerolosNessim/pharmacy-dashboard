import { getPharmaciesApi } from "@/api/pharmacies";
import { addPharmacistApi } from "@/api/pharmacists";
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
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
const formSchema = z.object({
  name: z.string().min(3, "Supervisor name is required"),
  id_number: z.string().min(3, "Supervisor id number is required"),
  password: z.string().min(3, "Supervisor password must be more than 3 char"),
  pharmacy_id: z.string().nonempty("Supervisor pharmacy must be selected"),
});

export type supervisorValues = z.infer<typeof formSchema>;

export const AddPharmacistForm = ({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["pharmacies"],
    queryFn: getPharmaciesApi,
  });
  const pharmacies = data?.data?.data?.data ?? [];
  const form = useForm<supervisorValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      id_number: "",
      password: "",
      pharmacy_id: "",
    },
  });
  async function onSubmit(values: supervisorValues) {
    console.log(values);
    const res = await addPharmacistApi(values);
    if (res?.ok) {
      toast.success(res?.data?.message);
      queryClient.invalidateQueries({
        queryKey: ["pharmacists"],
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
        {/* Supervisor Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pharmacist Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Pharmacist Name"
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
          name="id_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pharmacist Id</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Pharmacist Id"
                  {...field}
                  className="focus-visible:ring-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Supervisor phone */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pharmacist Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="******"
                  {...field}
                  className="focus-visible:ring-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Supervisor pharmacy */}
        <FormField
          control={form.control}
          name="pharmacy_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pharmacist Pharmacy</FormLabel>
              <FormControl>
                {isLoading ? (
                  <div className="p-2 flex items-center justify-center text-sm text-muted-foreground">
                    <Loader2 className="animate-spin w-5 h-5 mr-2" />
                    Loading Pharmacies...
                  </div>
                ) : pharmacies.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">
                    No pharmacies available
                  </div>
                ) : (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Pharmacy" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectGroup>
                        {pharmacies.map((pharmacy) => (
                          <SelectItem
                            key={pharmacy.id}
                            value={String(pharmacy.id)}
                          >
                            {pharmacy.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
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
                Add Pharmasist
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
