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

import { activateApi } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

// ================= Schema =================
const formSchema = z
  .object({
    id_number: z.string().min(3, "Employee ID is required"),
    password: z.string().min(3, "Password is required"),
    password_confirmation: z
      .string()
      .min(3, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

export type activateValues = z.infer<typeof formSchema>;

// ================= Component =================
export default function ActivateForm() {
  const searchParams = useSearchParams();
  const id_number = searchParams.get("id_number");
  
  const router = useRouter();
  const form = useForm<activateValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id_number: id_number||"",
      password: "",
      password_confirmation: "",
    },
  });
  const { isSubmitting } = form.formState;
  async function onSubmit(values: activateValues) {
    const res = await activateApi(values);
    if (res?.ok) {
      toast.success(res?.data?.message);
      router.push("/login");
    } else {
      toast.error(res?.error);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* employee id */}
        <FormField
          control={form.control}
          name="id_number"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Employee ID"
                  {...field}
                  className="focus-visible:ring-[#267e3a] h-12"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Password"
                  {...field}
                  className="focus-visible:ring-[#267e3a] h-12"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* password */}
        <FormField
          control={form.control}
          name="password_confirmation"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  {...field}
                  className="focus-visible:ring-[#267e3a] h-12"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full h-12 shadow-sm bg-[#267e3a] text-white"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Activate Account"
          )}
        </Button>
      </form>
    </Form>
  );
}
