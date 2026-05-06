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
import { loginApi } from "@/api/auth";
import { Loader2 } from "lucide-react";
import { setRole, setToken } from "@/actions/auth";
import { useUserStore } from "@/stores/user-store";
import { getFCMToken } from "@/lib/firebase/client";
import Link from "next/link";

// ================= Schema =================
const formSchema = z.object({
  id_number: z.string().min(3, "Employee ID is required"),
  password: z.string().min(3, "Password is required"),
});

export type loginValues = z.infer<typeof formSchema> & {
  fcm_token?: string | null;
};

// ================= Component =================
export default function LoginForm() {
  const router = useRouter();
  const { setUser, setClientToken } = useUserStore();
  const form = useForm<loginValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id_number: "",
      password: "",
    },
  });
  const { isSubmitting } = form.formState;
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const fcm_token = await getFCMToken();
    console.log("fcm token", fcm_token);
    const res = await loginApi({ ...values, fcm_token });
    if (res?.ok) {
      toast.success(res?.data?.message);
      await setToken(res?.data?.data?.token);
      setClientToken(res?.data?.data?.token);
      await setRole(
        res?.data?.data?.admin?.role || res?.data?.data?.pharmacist?.role,
      );
      if (res?.data?.data?.admin || res?.data?.data?.pharmacist) {
        setUser(res?.data?.data?.admin || res?.data?.data?.pharmacist);
      }
      router.push("/");
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

        <Link
          href="/forget-password"
          className="block underline text-right text-sm text-primary"
        >
          forget password?
        </Link>
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
