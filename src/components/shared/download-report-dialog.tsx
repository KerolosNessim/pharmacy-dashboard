"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Download, FileText } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import DownloadReportForm from "./download-report-form";

const DownloadReportDialog = () => {
  const [open, setOpen] = useState(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Download className="mr-2 h-4 w-4" /> Download Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader className="gap-4">
          <DialogTitle asChild>
            <div className="flex flex-col gap-2">
              <p className="flex items-center gap-2 text-lg font-semibold">
                <FileText className="text-primary" />
                Download Transfer Report
              </p>
              <p className="text-sm text-muted-foreground">
                Select a date range to download the transfer history report.
              </p>
            </div>
          </DialogTitle>
          <DialogDescription asChild>
            <DownloadReportForm setOpen={setOpen} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadReportDialog;
