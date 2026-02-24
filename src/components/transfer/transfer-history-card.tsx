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
const TransferHistoryCard = ({order}:{order:number}) => {
  return (
    <Card>
      <CardHeader className="items-center!" >
        <CardDescription className="flex items-center gap-2">
          <Badge variant={"outline"} className="rounded border-2">
            #{order}
          </Badge>
          {/* date */}
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Clock className="size-4" />
            Feb 24, 2026 at 12:40 AM
          </p>
        </CardDescription>
        <CardAction className="flex items-center gap-1">
          <Badge variant={"outline"} className="rounded border-2">
            Alrashidi
          </Badge>
          <Button variant={"ghost"}>
            <Printer className="size-5" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="font-semibold text-lg">
          <span className="text-base text-muted-foreground">From:</span> QASSIM
          STREET PHARMACY
        </p>
        <p className="font-semibold text-lg">
          <span className="text-base text-muted-foreground">To:</span> Neuro
          Pharmacy
        </p>
        <div className="flex flex-col gap-2">
          <p className="text-base text-muted-foreground font-semibold">
            Medications (1):
          </p>
          <div className="flex items-center justify-between p-2 bg-background/50 rounded">
            <p>Medication Name</p>
            <Badge variant={"outline"} className="rounded border-2">
             x3
            </Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t">
        <div className="flex items-center gap-2">
          <p className="text-base text-muted-foreground">Status:</p>
          <Badge variant={"pending"} >
            Completed
          </Badge>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TransferHistoryCard;
