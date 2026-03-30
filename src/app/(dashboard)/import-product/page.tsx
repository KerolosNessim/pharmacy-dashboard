"use client";
import { AddProductForm } from "@/components/import-product/add-product-form";
import UploadFileProducts from "@/components/import-product/upload-file-products";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
        {/* tabs */}
        <Tabs defaultValue="upload-file" className="gap-4">
          <TabsList className="w-full bg-bg h-12!">
            <TabsTrigger
              className="data-[state=active]:bg-background! data-[state=active]:border-0! border-0"
              value="upload-file"
            >
              Upload File
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-background! data-[state=active]:border-0!  border-0"
              value="manually"
            >
              Add Manually
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="upload-file"
            className="flex flex-col gap-4"
          >
            <Card>
              <CardContent>
                <UploadFileProducts/>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="manually" className="flex flex-col gap-4">
            <Card>
              <CardContent>
                <AddProductForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default ImportProductPage;
