"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, UploadCloud } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useGoBack } from "@/hooks/use-goback";
import { toast } from "sonner";
import { uploadTaskResultApi } from "@/api/tasks";

const formSchema = z.object({
  result_text: z.string().min(5, "Result must be at least 5 characters"),
  file: z.any().optional(),
});

type ResultValues = z.infer<typeof formSchema>;

const UploadResult = ({id}: {id: string}) => {
  const goBack = useGoBack();

  const form = useForm<ResultValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      result_text: "",
    },
  });

  const onSubmit = async (values: ResultValues) => {
    const formData = new FormData();
    formData.append("result_text", values.result_text);
    formData.append("result_file", values.file);
    const res = await uploadTaskResultApi(id, formData);
    console.log(res);
    if (res?.ok) {
      toast.success(res?.data?.message);
      goBack();
    }
    else {
      toast.error(res?.error);
    }
  };

  const { isSubmitting } = form.formState;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Result</CardTitle>
        <CardDescription>
          You cannot edit the result once it is submitted.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="result_text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Result / Clarification</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your findings or result here..."
                      className="min-h-[150px] resize-none focus-visible:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="file"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Attachment (File/Image)</FormLabel>
                  <FormControl>
                    <div className="relative border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center gap-2 text-muted-foreground bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer overflow-hidden">
                      <UploadCloud className="size-8" />
                      <span className="font-medium text-foreground text-center">
                        {value ? value.name : "Click to upload or drag & drop"}
                      </span>
                      {!value && (
                        <span className="text-sm">SVG, PNG, JPG or PDF (max. 5MB)</span>
                      )}
                      <Input
                        {...fieldProps}
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          onChange(file);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4 mt-4">
              <Button type="button" variant="outline" onClick={goBack}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin"/> : "Send Result"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UploadResult;