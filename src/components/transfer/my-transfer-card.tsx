import { Badge } from "@/components/ui/badge";
import { RequestItem } from "@/types/transfar";

const MyTransferCard = ({ transfar }: { transfar: RequestItem }) => {
  return (
    <div className="w-full p-3 border-b last:border-b-0 bg-bg flex items-center justify-between">
      {/* details */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            {transfar?.created_at}
          </p>
        </div>
        <p className="font-semibold">From: {transfar?.from_pharmacy}</p>
        <p className="font-semibold">To: {transfar?.to_pharmacy}</p>
        <p className="text-sm text-muted-foreground">
          {transfar?.medications?.reduce((acc, item) => acc + item.quantity, 0)}
          items
        </p>
      </div>
      {/* status */}
      <Badge
        variant={
          transfar?.status == "pending"
            ? "pending"
            : transfar.status == "completed" || transfar.status == "approved"
              ? "success"
              : transfar.status == "Rejected" || transfar.status == "cancelled"
                ? "destructive"
                : "default"
        }
      >
        {transfar?.status}
      </Badge>

      {/* action */}

      {/* <Button variant={"ghost"} size={"icon-xs"} className="hover:text-primary">
        <Printer className="size-5" />
      </Button> */}
    </div>
  );
};

export default MyTransferCard;
