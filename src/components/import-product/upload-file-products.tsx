"use client";
import { Loader2, Upload, UploadCloud, X } from "lucide-react";
import React, { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { addProductsBulkApi } from "@/api/products";
import { toast } from "sonner";

const UploadFileProducts = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  console.log("iam here...");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const uploadFile = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("sheet", file);
    const res = await addProductsBulkApi(formData);
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
        <h2 className="text-2xl font-bold">Products</h2>
        <p className="text-muted-foreground text-sm">Upload products details</p>
      </div>

      {/* refill tasks */}
      <div className="flex flex-col gap-2">
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
              htmlFor="product-file"
              className="cursor-pointer w-full p-6 border-2 border-dashed rounded-lg flex items-center justify-center"
            >
              <div className="flex flex-col items-center gap-4 text-muted-foreground">
                <Upload className="size-8" />
                <p>Click to select Excel or CSV file</p>
              </div>
            </FieldLabel>

            <Input
              ref={inputRef}
              id="product-file"
              type="file"
              className="hidden"
              accept=".xlsx,.csv"
              onChange={handleFileChange}
            />
          </Field>
        )}
      </div>
    </section>
  );
};

export default UploadFileProducts;
