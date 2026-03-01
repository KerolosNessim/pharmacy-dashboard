"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Textarea } from "../ui/textarea";
const formSchema = z.object({
  file: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
});

const ImportProductForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: "",
      description: "",
      category: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">CSV Format</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground text-sm">
            Required columns: name, sku, price, category
          </p>
          <div className="bg-background p-4 border  rounded-md text-sm text-muted-foreground">
            <p>name,sku,price,category</p>
            <p>Pain Relief Cream,SKU001,5000,skin-care</p>
            <p>Vitamin C Serum,SKU002,7500,skin-care</p>
            <p>Baby Shampoo,SKU003,3000,mom-baby</p>
          </div>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="flex gap-4">
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-2">
                  <FieldLabel htmlFor="description">
                    Paste CSV Data:{" "}
                  </FieldLabel>
                  <Textarea
                    {...field}
                    placeholder={`name,sku,price,category
Product Name,SKU123,5000,skin-care
Another Product,SKU456,7500,vitamins-supplements`}
                    className="focus-visible:ring-primary min-h-60 bg-background! placeholder:text-muted-foreground"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button type="submit">
              <Upload /> Import Products
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};

export default ImportProductForm;
