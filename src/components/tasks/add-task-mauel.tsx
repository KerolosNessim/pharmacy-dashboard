"use client";
import { getPharmacistsApi } from "@/api/pharmacists";
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
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { addTaskApi } from "@/api/tasks";
import { toast } from "sonner";
const formSchema = z.object({
  assigned_to: z.string().min(1, "Pharmacist name is required"),
  file_link: z.string().optional(),
  description: z
    .string()
    .nonempty("description is required")
    .min(10, "description must be at least 10 characters"),
});

export type taskValues = z.infer<typeof formSchema>;

export const AddtaskForm = () => {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["pharmacists"],
    queryFn: () => getPharmacistsApi(),
  });
  const pharmacists = data?.data?.data?.data ?? [];
  const form = useForm<taskValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assigned_to: "",
      file_link: "",
      description: "",
    },
  });
  async function onSubmit(values: taskValues) {
    const res = await addTaskApi(values);
    console.log(res);
    if (res.ok) {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      form.reset();
      toast.success(res?.data?.message);
    } else {
      toast.error(res?.error);
    }
  }

  const { isSubmitting } = form.formState;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Pharmacist Name */}
        <FormField
          control={form.control}
          name="assigned_to"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assigned Pharmacist</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Pharmacist" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectGroup>
                      {pharmacists.map((pharmacist) => (
                        <SelectItem
                          key={pharmacist.id}
                          value={String(pharmacist.id)}
                        >
                          {pharmacist.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Pharmacist address */}
        <FormField
          control={form.control}
          name="file_link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>File Link</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter File Link"
                  {...field}
                  className="focus-visible:ring-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Pharmacist pharmacy */}
        {/* Pharmacist address */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter Description"
                  {...field}
                  className="focus-visible:ring-primary min-h-30"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Plus />
                Add Task
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
