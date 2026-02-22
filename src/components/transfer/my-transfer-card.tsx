import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Printer
} from "lucide-react";

const MyTransferCard = () => {
  return (
    <div
      className="w-full p-3 border-b last:border-b-0 bg-bg flex items-center justify-between"
    >
      {/* details */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">20 Feb</p>
          <Badge variant={"pending"} className="rounded-[4px]">
            Pending
          </Badge>
        </div>
        <p className="font-semibold">To: Neuro Pharmacy</p>
        <p className="text-sm text-muted-foreground">12 items</p>
      </div>
      {/* action */}
      <Button variant={"ghost"} size={"icon-xs"} className="hover:text-primary">
        <Printer className="size-5" />
      </Button>
    </div>
  );
};

export default MyTransferCard;
