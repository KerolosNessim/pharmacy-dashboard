"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Phone, Plus, X } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

// ================= Schema =================
const formSchema = z.object({
  doctorName: z.string().min(3, "Doctor name is required"),
  extensions: z
    .array(z.object({ value: z.string().min(3) }))
    .min(1, "At least one extension is required"),
  schedule: z.string().min(3, "Schedule is required"),
  clinicName: z.string().min(2, "Clinic name is required"),
  hospitalBranch: z.string().min(2, "Branch is required"),
});

type FormValues = z.infer<typeof formSchema>;

// ================= Component =================
export default function AddDoctorForm({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      doctorName: "",
      extensions: [],
      schedule: "",
      clinicName: "",
      hospitalBranch: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "extensions",
  });

  const [extensionInput, setExtensionInput] = useState("");

  function addExtension() {
    if (extensionInput.trim().length > 0) {
      append({ value: extensionInput });
      setExtensionInput("");
    }
  }

  function onSubmit(values: FormValues) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Doctor Name */}
        <FormField
          control={form.control}
          name="doctorName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doctor Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Dr. Ahmed Al-Salem"
                  {...field}
                  className="focus-visible:ring-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Extensions */}
        <FormItem>
          <FormLabel>Extensions</FormLabel>

          <div className="flex gap-2">
            <Input
              placeholder="e.g., 1234"
              value={extensionInput}
              onChange={(e) => setExtensionInput(e.target.value)}
              className="focus-visible:ring-primary"
            />

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={addExtension}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Extensions List */}
          <div className="flex flex-wrap gap-2 pt-2">
            {fields.map((field, index) => (
              <Badge
                key={field.id}
                variant="outline"
                className="flex items-center gap-2 px-3 py-1"
              >
                <Phone className="w-3 h-3" />
                {field.value}
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => remove(index)}
                  className="cursor-pointer p-0!"
                >
                  <X size={10}/>
                </Button>
              </Badge>
            ))}
          </div>

          <FormMessage>{form.formState.errors.extensions?.message}</FormMessage>
        </FormItem>

        {/* Schedule */}
        <FormField
          control={form.control}
          name="schedule"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Schedule</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Sun–Thu 8AM–4PM"
                  {...field}
                  className="focus-visible:ring-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Clinic */}
        <FormField
          control={form.control}
          name="clinicName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Clinic Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Neurology Clinic"
                  {...field}
                  className="focus-visible:ring-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Branch */}
        <FormField
          control={form.control}
          name="hospitalBranch"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hospital Branch</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Al Habib - Olaya"
                  {...field}
                  className="focus-visible:ring-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit">Add Doctor</Button>
        </div>
      </form>
    </Form>
  );
}
