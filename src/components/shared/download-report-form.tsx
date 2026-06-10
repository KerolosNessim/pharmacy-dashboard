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
import { Calendar as CalendarIcon, Download, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { FormProvider } from "react-hook-form";
import {
  buildTransferReportQueryString,
  type TransferReportParams,
} from "@/lib/transfer-query";
import {
  buildResolvedReportFilters,
  isSuperAdmin,
  REPORT_ALL_PHARMACIES,
} from "@/lib/transfer-report-params";
import { useUserStore } from "@/stores/user-store";
import { ReportPharmacyField } from "./report-pharmacy-field";

const formSchema = z.object({
  from_date: z.date({ message: "Start date is required" }),
  to_date: z.date({ message: "End date is required" }),
  pharmacy_id: z.string().optional(),
});

export type DownloadReportValues = z.infer<typeof formSchema>;

type DownloadReportFormProps = {
  setOpen: (open: boolean) => void;
  reportFilters?: Omit<TransferReportParams, "from_date" | "to_date">;
};

const DownloadReportForm = ({
  setOpen,
  reportFilters,
}: DownloadReportFormProps) => {
  const { user } = useUserStore();

  const form = useForm<DownloadReportValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      from_date: new Date(),
      to_date: new Date(),
      pharmacy_id: isSuperAdmin(user)
        ? REPORT_ALL_PHARMACIES
        : "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data: DownloadReportValues) {
    const { from_date, to_date, pharmacy_id } = data;
    const fromDate = format(from_date, "yyyy-MM-dd");
    const toDate = format(to_date, "yyyy-MM-dd");

    const resolvedFilters = buildResolvedReportFilters(
      reportFilters,
      user,
      pharmacy_id,
    );

    const query = buildTransferReportQueryString({
      from_date: fromDate,
      to_date: toDate,
      ...resolvedFilters,
    });
    const downloadUrl = `/api/reports/transfer${query}`;

    window.location.assign(downloadUrl);

    toast.success("Download started...");
    setOpen(false);
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="flex flex-col gap-6">
          <ReportPharmacyField />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="from_date"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-2">
                <FieldLabel
                  className="text-black dark:text-white"
                  htmlFor="from_date"
                >
                  From Date
                </FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-12",
                        !field.value && "text-muted-foreground",
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
                  <PopoverContent className="w-auto p-0 bg-bg" align="start">
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
                  To Date
                </FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-12",
                        !field.value && "text-muted-foreground",
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
                  <PopoverContent className="w-auto p-0 bg-bg" align="start">
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
        
        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            className="h-12"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit" className="h-12" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download
              </>
            )}
          </Button>
        </div>
        </FieldGroup>
      </form>
    </FormProvider>
  );
};

export default DownloadReportForm;
