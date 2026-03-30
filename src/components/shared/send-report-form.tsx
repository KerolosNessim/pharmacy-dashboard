"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2, Mail } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "../ui/input";
import { sendReportApi } from "@/api/transfar";
import { toast } from "sonner";
const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email" })
    .nonempty({ message: "Email is required" }),
  from_date: z.date({ message: "Date is required" }),
  to_date: z.date({ message: "Date is required" }),
});

export type SendReportValues = z.infer<typeof formSchema>;
const SendReportForm = ({ setOpen }: { setOpen: (open: boolean) => void }) => {
  const form = useForm<SendReportValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      from_date: new Date(),
      to_date: new Date(),
    },
  });
  const {isSubmitting}=form.formState;
  async function onSubmit(data: SendReportValues) {
    const { email, from_date, to_date } = data;
    const fromDate = format(from_date, "yyyy-MM-dd");
    const toDate = format(to_date, "yyyy-MM-dd");

    const payload = {
      email,
      from_date: fromDate,
      to_date: toDate,
    };
    const res = await sendReportApi(payload);
    if (res?.ok) {
      toast.success(res?.data?.message);
      form.reset();
      setOpen(false);
    } else {
      toast.error(res?.error);
    }
  }
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="flex gap-4">
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-2">
              <FieldLabel
                className="text-black dark:text-white"
                htmlFor="email"
              >
                Email Address
              </FieldLabel>
              <Input
                type="email"
                {...field}
                placeholder="Enter your email"
                className="focus-visible:ring-primary h-12! "
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <div className="flex gap-2 max-md:flex-col max-md:gap-4">
          <Controller
            name="from_date"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-2">
                <FieldLabel
                  className="text-black dark:text-white"
                  htmlFor="from_date"
                >
                  From{" "}
                </FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[280px] justify-start text-left font-normal h-12! ",
                        !field.value && "text-muted-foreground  ",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-bg">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="to_date"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-2">
                <FieldLabel
                  className="text-black dark:text-white"
                  htmlFor="to_date"
                >
                  To{" "}
                </FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[280px] justify-start text-left font-normal h-12! ",
                        !field.value && "text-muted-foreground  ",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-bg">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" className="h-12" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> :
              <>
              <Mail />
              Send Report
              </>
              }
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-12"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
};

export default SendReportForm;
