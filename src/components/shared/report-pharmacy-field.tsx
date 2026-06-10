"use client";

import { Controller, useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PHARMACY_OPTIONS_QUERY_KEY,
  fetchPharmacyOptions,
} from "@/lib/pharmacy-options";
import {
  REPORT_ALL_PHARMACIES,
  showReportPharmacyField,
} from "@/lib/transfer-report-params";
import { useUserStore } from "@/stores/user-store";

export function ReportPharmacyField() {
  const { user } = useUserStore();
  const { control } = useFormContext();

  const { data: pharmacies = [] } = useQuery({
    queryKey: PHARMACY_OPTIONS_QUERY_KEY,
    queryFn: fetchPharmacyOptions,
    enabled: showReportPharmacyField(user),
  });

  if (!showReportPharmacyField(user)) {
    return null;
  }

  return (
    <Controller
      name="pharmacy_id"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className="gap-2">
          <FieldLabel
            className="text-black dark:text-white"
            htmlFor="report-pharmacy_id"
          >
            Pharmacy (optional)
          </FieldLabel>
          <Select
            value={field.value || REPORT_ALL_PHARMACIES}
            onValueChange={field.onChange}
          >
            <SelectTrigger
              id="report-pharmacy_id"
              className="h-12 w-full"
              aria-invalid={fieldState.invalid}
            >
              <SelectValue placeholder="All pharmacies" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value={REPORT_ALL_PHARMACIES}>
                All pharmacies
              </SelectItem>
              {pharmacies.map((pharmacy) => (
                <SelectItem key={pharmacy.id} value={String(pharmacy.id)}>
                  {pharmacy.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
