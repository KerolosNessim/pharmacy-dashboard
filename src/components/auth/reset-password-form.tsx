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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { forgetPasswordApi, loginApi, resetPasswordApi } from "@/api/auth";
import { Loader2 } from "lucide-react";
import { setRole, setToken } from "@/actions/auth";
import { useUserStore } from "@/stores/user-store";
import { getFCMToken } from "@/lib/firebase/client";

// ================= Schema =================
const formSchema = z
  .object({
    id_number: z.string().min(3, "Employee ID is required"),
    password: z.string().min(3, "Password is required"),
    password_confirmation: z.string().min(3, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  });

export type resetPasswordValues = z.infer<typeof formSchema>;

interface ResetPasswordFormProps {
  token: string;
  id_number: string;
}

// ================= Component =================
export default function ResetPasswordForm({
  token,
  id_number,
}: ResetPasswordFormProps) {
  const router = useRouter();
  const form = useForm<resetPasswordValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id_number: id_number || "",
      password: "",
      password_confirmation: "",
    },
  });
  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await resetPasswordApi({ ...values, token });
    if (res?.ok) {
      toast.success(res?.data?.message || "Password reset successfully");
      router.push("/login");
    } else {
      toast.error(res?.error || "Something went wrong");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* employee id (hidden or read-only if provided) */}
        <FormField
          control={form.control}
          name="id_number"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Employee ID"
                  {...field}
                  readOnly={!!id_number}
                  className="focus-visible:ring-[#267e3a] h-12 bg-muted/50"
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
                  placeholder="New Password"
                  type="password"
                  {...field}
                  className="focus-visible:ring-[#267e3a] h-12"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* password confirmation */}
        <FormField
          control={form.control}
          name="password_confirmation"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Confirm New Password"
                  type="password"
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
          disabled={isSubmitting}
          className="w-full h-12 shadow-sm bg-[#267e3a] text-white hover:bg-[#1e662f]"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Reset Password"
          )}
        </Button>
      </form>
    </Form>
  );
}
