"use client";
import { AddProductForm } from "@/components/import-product/add-product-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGoBack } from "@/hooks/use-goback";
import { ArrowLeft } from "lucide-react";

const ImportProductPage = () => {
  const goBack = useGoBack();
  return (
    <section className="p-4">
      <div className="lg:w-2/3 mx-auto flex flex-col gap-4">
        {/* header */}
        <div className="flex items-center gap-2  ">
          <Button variant={"ghost"} className="hover:bg-bg" onClick={goBack}>
            <ArrowLeft />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Import Products</h2>
            <p className="text-muted-foreground text-sm">
              Upload details of products and tell me what to do with them
            </p>
          </div>
        </div>
        {/* content */}
        <Card>
          <CardContent>
            <AddProductForm />
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ImportProductPage;
