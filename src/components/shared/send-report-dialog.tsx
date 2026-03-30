"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { File } from "lucide-react";
import SendReportForm from "./send-report-form";
import { Button } from "../ui/button";
import { useState } from "react";

const SendReportDialog = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <File /> Send Report
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="gap-4">
          <DialogTitle asChild>
            <div className="flex flex-col gap-2">
              <p className="flex items-center gap-2 text-lg font-semibold">
                <File className="text-primary" />
                Send Transfer Report
              </p>
              <p className="text-sm text-muted-foreground">
                Send a transfer history report for a specific date range to any
                email address.
              </p>
            </div>
          </DialogTitle>
          <DialogDescription asChild>
            <SendReportForm setOpen={setOpen} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default SendReportDialog;
