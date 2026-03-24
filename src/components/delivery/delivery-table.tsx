"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Motorbike, Trash } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import EditDeliveryDialog from "./edit-delvery-dialog";

const DeliveryTable = () => {

const deliveryReps = [
  {
    name: "John Doe",
    phone: "123456789",
  },
  {
    name: "Jane Doe",
    phone: "123456789",
  },
];
  return (
    <div className="border rounded-lg! overflow-hidden ">

      {deliveryReps.length > 0 ? (
        <Table className="">
          <TableHeader className="bg-bg ">
            <TableRow className="hover:bg-bg ">
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead >
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-bg/50">
            {deliveryReps.map((deliveryRep, index) => (
              <TableRow
                key={index}
                className="hover:bg-muted-foreground/5  h-14  px-4 "
              >
                <TableCell>{deliveryRep?.name}</TableCell>
                <TableCell>{deliveryRep?.phone}</TableCell>
                <TableCell className="flex items-center gap-2">
                  <EditDeliveryDialog />
                  <Button variant={"destructive"} >
                    <Trash />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex flex-col items-center gap-2  p-6 text-muted-foreground">
          <Motorbike className="size-12 " />
          <p>No Delivery Representatives found</p>
        </div>
      )}
    </div>
  );
};

export default DeliveryTable;
