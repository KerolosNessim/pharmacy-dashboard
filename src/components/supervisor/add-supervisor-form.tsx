import { getPharmaciesApi } from "@/api/pharmacies";
import { addSupervisorApi } from "@/api/supervisor";
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
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "../ui/label";

const formSchema = z.object({
  name: z.string().min(3, "Supervisor name is required"),
  email: z.string().email("Supervisor email is required"),
  pharmacy_id: z.string().nonempty("Supervisor pharmacy must be selected"),
  password: z.string("Supervisor password is required").optional(),
  id_number: z.string("Supervisor id number is required").optional(),
});

export type supervisorValues = z.infer<typeof formSchema>;

export const AddSupervisorForm = ({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) => {
  const queryClient = useQueryClient();
  const [withinvetaion, setWithinvetaion] = useState<boolean>(true);

  const { data, isLoading } = useQuery({
    queryKey: ["pharmacies"],
    queryFn: () => getPharmaciesApi(),
  });
  const pharmacies = data?.data?.data?.data ?? [];
  const form = useForm<supervisorValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      pharmacy_id: "",
      password: "",
      id_number: "",
    },
  });
  async function onSubmit(values: supervisorValues) {
    console.log(values);
    console.log("click");

    const res = await addSupervisorApi(values);
    if (res?.ok) {
      toast.success(res?.data?.message);
      queryClient.invalidateQueries({
        queryKey: ["pharmacies"],
      });
      queryClient.invalidateQueries({
        queryKey: ["supervisors"],
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
              <FormLabel>Supervisor Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Supervisor Name"
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supervisor Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Supervisor Email"
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
              <FormLabel>Supervisor Pharmacy</FormLabel>
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

        <RadioGroup
          className="flex items-center gap-3"
          defaultValue="option-one"
        >
          <div className="flex items-center gap-3">
            <RadioGroupItem
              onClick={() => setWithinvetaion(true)}
              value="option-one"
              id="option-one"
            />
            <Label htmlFor="option-one" className="cursor-pointer">
              Send Invitation
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem
              onClick={() => setWithinvetaion(false)}
              value="option-two"
              id="option-two"
            />
            <Label htmlFor="option-two" className="cursor-pointer">
              Don&apos;t Send Invitation
            </Label>
          </div>
        </RadioGroup>

        {!withinvetaion && (
          <>
          <FormField
            control={form.control}
            name="id_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Supervisor ID Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Supervisor ID Number"
                    {...field}
                    className="focus-visible:ring-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Supervisor Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Supervisor Password"
                    {...field}
                    className="focus-visible:ring-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          </>
        )}
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
                Add Supervisor
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
