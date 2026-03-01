"use client";
import { Button } from "@/components/ui/button";
import { useGoBack } from "@/hooks/use-goback";
import { ArrowLeft, ArrowUpDown, History, Upload } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UploadTabContent from "@/components/upload/upload-tab-content";
import ProductSyncContent from "@/components/upload/product-sync-content";
import UploadHistoryContent from "@/components/upload/upload-history-content";

const UploadPage = () => {
  const goBack = useGoBack();
  return (
    <section className=" flex flex-col gap-4 ">
      {/* header */}
      <div className="flex items-center gap-2 p-4 border-b ">
        <Button variant={"ghost"} className="hover:bg-bg" onClick={goBack}>
          <ArrowLeft />
        </Button>
        <div>
          <h2 className="text-xl font-bold">File Upload</h2>
          <p className="text-muted-foreground text-sm">
            Upload files and tell me what to do with them
          </p>
        </div>
      </div>
      {/* tabs */}
      <div className="p-4">
        <Tabs defaultValue="upload" className="gap-4 lg:w-[65%] w-full mx-auto">
          <TabsList className="w-full bg-bg h-12! ">
            <TabsTrigger
              className="data-[state=active]:bg-background! data-[state=active]:border-0! border-0"
              value="upload"
            >
              <Upload />
              Upload
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-background! data-[state=active]:border-0!  border-0"
              value="data-sync"
            >
              <ArrowUpDown />
              Data Sync
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-background! data-[state=active]:border-0!  border-0"
              value="history"
            >
              <History />
              History
            </TabsTrigger>
          </TabsList>
          <TabsContent value="upload" className="flex flex-col gap-4">
            <UploadTabContent />
          </TabsContent>
          <TabsContent value="data-sync" className="flex flex-col gap-4">
            <ProductSyncContent />
          </TabsContent>
          <TabsContent value="history" className="flex flex-col gap-4">
            <UploadHistoryContent />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default UploadPage;
