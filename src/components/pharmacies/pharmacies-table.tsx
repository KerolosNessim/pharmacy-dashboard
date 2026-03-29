"use client";
import { deletePharmacyApi, getPharmaciesApi } from "@/api/pharmacies";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, Loader2, Trash2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { toast } from "sonner";
import EditPharmacyDialog from "./edit-pharmacies-dialog";

const PharmaciesTable = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["pharmacies",],
    queryFn: getPharmaciesApi,
  });

  const queryClient = useQueryClient();
  const handleDeletePharmacy = async (id: string) => {
    const res = await deletePharmacyApi(id);
    if (res?.ok) {
      toast.success(res?.data?.message);
      queryClient.invalidateQueries({
        queryKey: ["pharmacies"],
      });
    }
    else{
      toast.error(res?.error);
    }
  };
  console.log(data);
  const pharmacies = data?.data?.data?.data ?? [];
  return (
    <div className="border rounded-lg! overflow-hidden ">
      {isLoading && (
        <div className="flex items-center justify-center h-24">
          <Loader2 className="animate-spin" />
        </div>
      )}
      {pharmacies.length > 0 ? (
        <Table className="">
          <TableHeader className="bg-bg ">
            <TableRow className="hover:bg-bg ">
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Supervisor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created at</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-bg/50">
            {pharmacies.map((pharmacy, index) => (
              <TableRow
                key={index}
                className="hover:bg-muted-foreground/5  h-14  px-4 "
              >
                <TableCell>{pharmacy?.name}</TableCell>
                <TableCell>{pharmacy?.address}</TableCell>
                <TableCell>{pharmacy?.phone}</TableCell>
                <TableCell>{pharmacy?.supervisor?.name ?? "-"}</TableCell>
                <TableCell>
                  <Badge variant="outline">{pharmacy?.status}</Badge>
                </TableCell>
                <TableCell>
                  {new Date(pharmacy?.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeletePharmacy(String(pharmacy.id))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <EditPharmacyDialog pharmacy={pharmacy} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex flex-col items-center gap-2  p-6 text-muted-foreground">
          <Building2 className="size-12 " />
          <p>No Pharmacies found</p>
        </div>
      )}
    </div>
  );
};

export default PharmaciesTable;
