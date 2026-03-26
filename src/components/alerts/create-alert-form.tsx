"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { createAlertApi } from "@/api/alerts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";
import { useQueryClient } from "@tanstack/react-query";

// ================= Schema =================
const formSchema = z.object({
  title: z.string().min(3, "Title is required"),
  body: z.string().min(3, "Description is required"),
});
  

export type craeteAlertsValues = z.infer<typeof formSchema>;



// ================= Component =================
export default function CraeteAlertsForm( ) {
const queryClient = useQueryClient();
  const form = useForm<craeteAlertsValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      body: "",
    },
  });

  const { isSubmitting } = form.formState;


  async function onSubmit(values: craeteAlertsValues) {
    const res = await createAlertApi(values);
    if (res?.ok) {
      toast.success(res?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      form.reset();
    } else {
      toast.error(res?.error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Title"
                  {...field}
                  className="focus-visible:ring-[#267e3a] h-12"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* body */}
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Description"
                  {...field}
                  className="focus-visible:ring-[#267e3a] h-40"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-fit ms-auto h-12 shadow-sm bg-[#267e3a] text-white"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Create Alert"
          )}
        </Button>
      </form>
    </Form>
  );
}
