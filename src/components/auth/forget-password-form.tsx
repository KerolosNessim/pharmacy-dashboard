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
import { forgetPasswordApi, loginApi } from "@/api/auth";
import { Loader2 } from "lucide-react";
import { setRole, setToken } from "@/actions/auth";
import { useUserStore } from "@/stores/user-store";
import { getFCMToken } from "@/lib/firebase/client";

// ================= Schema =================
const formSchema = z.object({
  id_number: z.string().min(3, "Employee ID is required"),
});

export type forgetPasswordValues = z.infer<typeof formSchema> 

// ================= Component =================
export default function ForgetPasswordForm() {
  const form = useForm<forgetPasswordValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id_number: "",
    },
  });
  const { isSubmitting } = form.formState;
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await forgetPasswordApi(values);
    if (res?.ok) {
      toast.success(res?.data?.message);
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


        <Button
          type="submit"
          className="w-full h-12 shadow-sm bg-[#267e3a] text-white"
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : "Sign in"}
        </Button>
      </form>
    </Form>
  );
}
