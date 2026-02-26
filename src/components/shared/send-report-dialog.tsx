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

const SendReportDialog = ({ button }: { button: React.ReactNode }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{button}</DialogTrigger>
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
            <SendReportForm />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default SendReportDialog;
