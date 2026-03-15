"use client";
import { getPharmacistsApi } from "@/api/pharmacists";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Users } from "lucide-react";
import { Badge } from "../ui/badge";

const PharmacistStaffTable = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["pharmacists"],
    queryFn: getPharmacistsApi,
  });
  console.log(data);
  const pharmacists = data?.data?.data?.data ?? [];

  return (
    <div className="border rounded-lg! overflow-hidden ">
      {isLoading && (
        <div className="flex items-center justify-center h-24">
          <Loader2 className="animate-spin" />
        </div>
      )}
      {pharmacists.length > 0 ? (
        <Table className="">
          <TableHeader className="bg-bg ">
            <TableRow className="hover:bg-bg ">
              <TableHead>Name</TableHead>
              <TableHead>Id</TableHead>
              <TableHead>Pharmacy</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-bg/50">
            {pharmacists.map((pharmacist, index) => (
              <TableRow
                key={index}
                className="hover:bg-muted-foreground/5  h-14  px-4 "
              >
                <TableCell>{pharmacist?.name}</TableCell>
                <TableCell>{pharmacist?.id_number}</TableCell>
                <TableCell>{pharmacist?.pharmacy?.name}</TableCell>
                <TableCell>
                  <Badge variant={"outline"}>{pharmacist?.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex flex-col items-center gap-2  p-6 text-muted-foreground">
          <Users className="size-12 " />
          <p>No Pharmacists found</p>
        </div>
      )}
    </div>
  );
};

export default PharmacistStaffTable;
