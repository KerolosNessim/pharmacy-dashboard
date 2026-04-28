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

import { registerApi } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// ================= Schema =================
const formSchema = z
  .object({
    name: z.string().min(3, "Name is required"),
    id_number: z.string().min(3, "ID Number is required"),
    password: z.string().min(3, "Password is required"),
    password_confirmation: z
      .string()
      .min(3, "Password Confirmation is required"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

export type RegisterValues = z.infer<typeof formSchema>;
const RegisterForm = () => {
  const form = useForm<RegisterValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      id_number: "",
      password: "",
      password_confirmation: "",
    },
  });
  const {isSubmitting} = form.formState
  const onSubmit = async (values: RegisterValues) => {
    const res = await registerApi(values)
    if(!res.ok){
      toast.error(res.error)
    }
    else {
      toast.success(res.data?.message)
      form.reset()
    }
    
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* employee id */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Name"
                  {...field}
                  className="focus-visible:ring-[#267e3a] h-12"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* id number */}
        <FormField
          control={form.control}
          name="id_number"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="ID Number"
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
        {/* password confirmation */}
        <FormField
          control={form.control}
          name="password_confirmation"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Password Confirmation"
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
          {isSubmitting ? <Loader2 className=" animate-spin" /> : "Register"}
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
