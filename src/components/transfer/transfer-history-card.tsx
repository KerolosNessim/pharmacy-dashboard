import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { Clock, Printer } from "lucide-react";
import { Button } from "../ui/button";
import { RequestItem } from "@/types/transfar";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import PrintCard from "./print-card";
const TransferHistoryCard = ({order,transfar}:{order:number,transfar:RequestItem}) => {
  const printRef = useRef<HTMLDivElement>(null);

const handlePrint = useReactToPrint({
  contentRef: printRef,
  documentTitle: `Transfer-${order}`,
});
  return (
    <Card>
      <CardHeader className="items-center!">
        <CardDescription className="flex items-center gap-2">
          <Badge variant={"outline"} className="rounded border-2">
            #{order}
          </Badge>
          {/* date */}
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Clock className="size-4" />
            {transfar?.created_at}
          </p>
        </CardDescription>
        <CardAction className="flex items-center gap-1">
          <Badge variant={"outline"} className="rounded border-2">
            {transfar?.creator_name}
          </Badge>
          <Button variant="ghost" onClick={handlePrint}>
            <Printer className="size-5" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="font-semibold text-lg">
          <span className="text-base text-muted-foreground">From:</span>{" "}
          {transfar?.from_pharmacy}
        </p>
        <p className="font-semibold text-lg">
          <span className="text-base text-muted-foreground">To:</span>{" "}
          {transfar?.to_pharmacy}
        </p>
        <div className="flex flex-col gap-2">
          <p className="text-base text-muted-foreground font-semibold">
            Medications ({transfar?.medications?.length}):
          </p>
          {transfar?.medications?.map((medication, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-background/50 rounded"
            >
              <p>{medication.name}</p>
              <Badge variant={"outline"} className="rounded border-2">
                x{medication.quantity}
              </Badge>
            </div>
          ))}
        </div>
        <div className="hidden">
          <PrintCard ref={printRef}    transfar={transfar} />
        </div>
      </CardContent>
      <CardFooter className="border-t">
        <div className="flex items-center gap-2">
          <p className="text-base text-muted-foreground">Status:</p>
          <Badge
            variant={
              transfar?.status == "pending"
                ? "pending"
                : transfar.status == "completed" ||
                    transfar.status == "approved"
                  ? "success"
                  : transfar.status == "Rejected" ||
                      transfar.status == "cancelled"
                    ? "destructive"
                    : "default"
            }
          >
            {transfar?.status}
          </Badge>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TransferHistoryCard;
