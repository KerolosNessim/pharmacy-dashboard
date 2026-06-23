"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";

type TransferDetailsLinkProps = {
  transferId: number;
  className?: string;
};

export function TransferDetailsLink({
  transferId,
  className,
}: TransferDetailsLinkProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      asChild
      title="View details"
      className={cn("shrink-0", className)}
    >
      <Link href={`/transfer/${transferId}`}>
        <Eye className="size-5" />
      </Link>
    </Button>
  );
}
