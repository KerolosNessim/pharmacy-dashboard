"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { parseScannedValue } from "@/lib/parse-scanned-value";
import type { IDetectedBarcode } from "@yudiel/react-qr-scanner";

const Scanner = dynamic(
  () => import("@yudiel/react-qr-scanner").then((mod) => mod.Scanner),
  {
    ssr: false,
    loading: () => (
      <p className="text-muted-foreground py-8 text-center text-sm">
        Opening camera...
      </p>
    ),
  }
);

type BarcodeScannerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScan: (value: string) => void;
};

export function BarcodeScannerDialog({
  open,
  onOpenChange,
  onScan,
}: BarcodeScannerDialogProps) {
  const [cameraError, setCameraError] = useState(false);

  const handleScan = (detectedCodes: IDetectedBarcode[]) => {
    const raw = detectedCodes[0]?.rawValue;
    const value = parseScannedValue(raw ?? "");

    if (!value) {
      toast.error("Invalid or unreadable barcode");
      return;
    }

    onScan(value);
    onOpenChange(false);
    toast.success("Barcode scanned successfully");
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) setCameraError(false);
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Scan Barcode</DialogTitle>
          <DialogDescription>
            Point your camera at a product barcode or QR code. Search matches
            code or SKU.
          </DialogDescription>
        </DialogHeader>

        {cameraError ? (
          <p className="text-destructive text-sm">
            Could not access the camera. Please allow camera permission and use
            HTTPS or localhost.
          </p>
        ) : open ? (
          <div className="overflow-hidden rounded-lg">
            <Scanner
              onScan={handleScan}
              onError={() => {
                setCameraError(true);
                toast.error("Failed to start camera");
              }}
              constraints={{ facingMode: "environment" }}
              styles={{ container: { width: "100%" } }}
            />
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
