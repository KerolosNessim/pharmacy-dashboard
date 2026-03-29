import { addCategoryApi, updateCategoryApi } from "@/api/categories";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { category } from "@/types/categories";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Edit, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
const formSchema = z.object({
  name: z.string().min(3, "Category name is required"),
});

export type editCategoryValues = z.infer<typeof formSchema>;

export const EditCategoryForm = ({
  setOpen,
  category,
}: {
  setOpen: (open: boolean) => void;
  category: category;
}) => {
  const queryClient = useQueryClient();

  const form = useForm<editCategoryValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category.name || "",
    },
  });
  async function onSubmit(values: editCategoryValues) {
    const res = await updateCategoryApi(values,category.id.toString());
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
              <FormLabel>Category Name</FormLabel>
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
                <Edit />
                Edit Category
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
