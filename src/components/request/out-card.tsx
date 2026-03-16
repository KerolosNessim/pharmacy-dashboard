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
const OutCard = ({ order,request }: { order: number,request:RequestItem }) => {
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
            {request.created_at}
          </p>
        </CardDescription>
        <CardAction className="flex items-center gap-1">
          <Badge variant={"outline"} className="rounded border-2">
            {request.creator_name}
          </Badge>
          <Button variant={"ghost"}>
            <Printer className="size-5" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="font-semibold text-lg">
          <span className="text-base text-muted-foreground">From:</span> {request.to_pharmacy}
        </p>
        <p className="font-semibold text-lg">
          <span className="text-base text-muted-foreground">To:</span>{request.from_pharmacy}
        </p>
        <div className="flex flex-col gap-2">
          <p className="text-base text-muted-foreground font-semibold">
            Medications ({request.medications.length}):
          </p>
          {request.medications.map((medication,index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-background/50 rounded">
              <p>{medication?.name}</p>
              <Badge variant={"outline"} className="rounded border-2">
                x{medication?.quantity}
              </Badge>
          </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t">
        <div className="flex items-center gap-2">
          <p className="text-base text-muted-foreground">Status:</p>
          <Badge variant={request?.status=="pending"?"pending":request.status=="completed" || request.status=="approved"?"success":request.status=="rejected" || request.status=="cancelled"?"destructive": "default"}>{request.status}</Badge>
        </div>
      </CardFooter>
    </Card>
  );
};

export default OutCard;
