import { addCategoryApi, addSubCategoryApi } from "@/api/categories";
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
  name: z.string().min(3, "Category name is required"),
  parent_id: z.string().min(1, "Parent category is required"),
});

export type SubcategoyValues = z.infer<typeof formSchema>;

export const AddSubCategoryForm = ({
  setOpen,
  parentId,
}: {
  setOpen: (open: boolean) => void;
  parentId: number;
}) => {
  const queryClient = useQueryClient();

  const form = useForm<SubcategoyValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      parent_id: String(parentId),
    },
  });
  async function onSubmit(values: SubcategoyValues) {
    const res = await addSubCategoryApi(values);
    if (res?.ok) {
      toast.success(res?.data?.message);
      queryClient.invalidateQueries({
        queryKey: ["categories"],
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
        {/* Doctor Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sub Category Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Pain Relief"
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
                Add Sub Category
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
