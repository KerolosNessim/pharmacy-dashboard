"use client";

import { Share2 } from "lucide-react";
import { Button } from "../ui/button";
import { RequestItem } from "@/types/transfar";
import { shareTransferViaWhatsApp } from "@/lib/share-transfer";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type TransferShareButtonProps = {
  transfar: RequestItem;
  order?: number;
  className?: string;
};

export function TransferShareButton({
  transfar,
  order,
  className,
}: TransferShareButtonProps) {
  const handleShare = () => {
    try {
      shareTransferViaWhatsApp(transfar, order);
      toast.success("Transfer copied. Opening WhatsApp…");
    } catch {
      toast.error("Could not share transfer");
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleShare}
      title="Share via WhatsApp"
      className={cn(
        "shrink-0 text-muted-foreground hover:text-[#25D366] hover:bg-[#25D366]/10",
        className
      )}
    >
      <Share2 className="size-5" />
    </Button>
  );
}
