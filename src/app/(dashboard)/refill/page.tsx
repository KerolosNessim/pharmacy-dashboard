"use client";

import { addTaskBulkApi } from "@/api/tasks";
import { AddtaskForm } from "@/components/tasks/add-task-mauel";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FileSpreadsheet, Loader2, Upload, UploadCloud, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

const RefillPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = ""; // 🔥 reset input
    }
  };

  const uploadFile = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("sheet", file);
    const res = await addTaskBulkApi(formData);
    if (res?.ok) {
      toast.success(res?.data?.message);
      removeFile();
    } else {
      toast.error(res?.error);
    }
    setLoading(false);
  };

  return (
    <section className="flex flex-col gap-4 p-4">
      {/* header */}
      <div>
        <h2 className="text-2xl font-bold">Refill Tasks</h2>
        <p className="text-muted-foreground text-sm">
          Upload patient refill files and assign to pharmacists
        </p>
      </div>

      {/* refill tasks */}
      <div className="flex flex-col gap-2">
        {/* upload file */}
        <div className="bg-bg rounded-lg border p-4 flex flex-col gap-4">
          <div className="flex items-center gap-1">
            <FileSpreadsheet className="text-primary size-5" />
            <h3 className="font-semibold">Upload Refill File</h3>
          </div>

          {/* file preview */}
          {file ? (
            <>
              <div className="flex items-center justify-between bg-background p-3 rounded-lg">
                <span className="text-primary font-bold">{file.name}</span>
                <button
                  onClick={removeFile}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={18} />
                </button>
              </div>
              <Button
                className="w-fit ms-auto"
                onClick={uploadFile}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <UploadCloud />
                )}
                Upload
              </Button>
            </>
          ) : (
            <Field>
              <FieldLabel
                htmlFor="task-file"
                className="cursor-pointer w-full p-6 border-2 border-dashed rounded-lg flex items-center justify-center"
              >
                <div className="flex flex-col items-center gap-4 text-muted-foreground">
                  <Upload className="size-8" />
                  <p>Click to select Excel or CSV file</p>
                </div>
              </FieldLabel>

              <Input
                ref={inputRef}
                id="task-file"
                type="file"
                className="hidden"
                accept=".xlsx,.csv"
                onChange={handleFileChange}
              />
            </Field>
          )}
        </div>

        {/* manual task */}
        <div className="bg-bg rounded-lg border p-6">
          <div className="flex items-center gap-1 mb-4">
            <FileSpreadsheet className="text-primary size-5" />
            <h3 className="font-semibold">Add Refill Task Manually</h3>
          </div>

          <AddtaskForm />
        </div>
      </div>
    </section>
  );
};

export default RefillPage;
