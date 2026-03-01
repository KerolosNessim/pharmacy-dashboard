import { AlertCircle, Database, Download, Files, RefreshCcw, Upload } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import DangerZone from "./danger-zone";
import DataSyncCard from "./data-sync-card";

const ProductSyncContent = () => {
  return (
    <div className="flex flex-col gap-4">
      {/* info card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-semibold">
            <Database /> Product Data Sync
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {/* alert */}
          <div className="bg-muted-foreground/10 p-6 rounded-lg flex items-start gap-2">
            <AlertCircle className="text-blue-500" />
            <div className="space-y-1 text-sm">
              <h2 className="font-semibold">Direct Sync via Shared Storage</h2>
              <p className="text-muted-foreground">
                Sync scraped product details between development and production
                environments. Export from development, then import in production
                - both use the same shared storage.
              </p>
            </div>
          </div>
          {/* details */}
          <div className="bg-blue-500/10 border border-blue-500 p-6 rounded-lg flex flex-col gap-2">
            <h2 className="font-semibold flex items-center gap-2 text-blue-500">
              <AlertCircle className="text-blue-500" size={20} />
              Sync Data Available
            </h2>
            <p className="text-muted-foreground">
              9,264 products ready to import
              <br />
              Exported: 2/14/2026, 7:08:59 AM
              <br />
              By: Alrashidi
            </p>
          </div>
          {/* steps */}
          <div className="flex items-center gap-4 max-lg:flex-col">
            <div className="p-4 border-2 border-dashed rounded-lg lg:w-1/2 w-full flex flex-col gap-2 items-center">
              <Upload className="size-12 text-primary" />
              <p className="font-semibold text-lg">Step 1: Export</p>
              <p className="text-muted-foreground">
                Save scraped data to shared storage
              </p>
              <Button>
                <Upload />
                Export to Shared Storage
              </Button>
            </div>
            <div className="p-4 border-2 border-dashed rounded-lg lg:w-1/2 w-full flex flex-col gap-2 items-center">
              <Download className="size-12 text-primary" />
              <p className="font-semibold text-lg">Step 2: Import</p>
              <p className="text-muted-foreground">
                Load data from shared storage
              </p>
              <Button variant={"outline"} className="bg-transparent! ">
                <Download />
                Import from Shared Storage
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* sare card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-semibold">
            <Files /> Shared Uploaded Files
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {/* alert */}
          <div className="bg-muted-foreground/10 p-6 rounded-lg flex items-start gap-2">
            <AlertCircle className="text-blue-500" />
            <div className="space-y-1 text-sm">
              <h2 className="font-semibold">Cross-Environment File Sync</h2>
              <p className="text-muted-foreground">
                Files uploaded from production are automatically saved to shared
                storage. You can process them here to import the data into this
                environment.
              </p>
            </div>
          </div>
          {/* files */}
          <div className="flex flex-col gap-4">
            {
              Array.from({ length: 5 }).map((_, index) => (
                <DataSyncCard key={index} />
              ))
            }
          </div>
          {/* refresh button */}
          <Button variant={"ghost"} className="h-fit hover:bg-muted-foreground/10!">
            <RefreshCcw className="size-6"/>
          </Button>
        </CardContent>
      </Card>
      {/* danger zone */}
      <DangerZone />
    </div>
  );
};

export default ProductSyncContent;
