"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useGoBack } from "@/hooks/use-goback";
import { ArrowLeft, Paperclip, UploadCloud } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const UploadTaskResultPage = () => {
  const goBack = useGoBack();
  const router = useRouter();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate upload delay
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/tasks");
    }, 1000);
  };

  return (
    <section className="flex flex-col gap-6 p-4 max-w-4xl mx-auto w-full">
      {/* header */}
      <div className="flex items-center gap-2">
        <Button variant={"ghost"} className="hover:bg-bg" onClick={goBack}>
          <ArrowLeft />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Upload Task Result</h2>
          <p className="text-muted-foreground text-sm">
            Provide the result and attachments for the requested task.
          </p>
        </div>
      </div>

      {/* Task Details Info */}
      <Card className="bg-muted/30 border-dashed">
        <CardHeader>
          <CardTitle className="text-xl">Task Details: {id}</CardTitle>
          <CardDescription className="text-base mt-2">
            Please visually inspect all items in storage room B for expiration dates within the next 30 days. Log any found items and organize the rest properly.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle>Task Result</CardTitle>
          <CardDescription>
            You cannot edit the result once it is submitted.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <label htmlFor="result" className="font-medium">Result / Clarification</label>
              <Textarea
                id="result"
                placeholder="Write your findings or result here..."
                required
                className="min-h-[150px] resize-none"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="font-medium">Attachment (File/Image)</label>
              <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center gap-2 text-muted-foreground bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer">
                <UploadCloud className="size-8" />
                <span className="font-medium text-foreground">Click to upload or drag & drop</span>
                <span className="text-sm">SVG, PNG, JPG or PDF (max. 5MB)</span>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-4">
              <Button type="button" variant="outline" onClick={goBack}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Send Result"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};

export default UploadTaskResultPage;
