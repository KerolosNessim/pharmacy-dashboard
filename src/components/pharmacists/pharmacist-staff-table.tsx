"use client";
import { deletePharmacistApi, getPharmacistsApi, togglePharmacistStatusApi } from "@/api/pharmacists";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import EditPharmacistDialog from "./edit-pharmacist-dialog";

const PharmacistStaffTable = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["pharmacists"],
    queryFn: getPharmacistsApi,
  });
  console.log(data);
  const pharmacists = data?.data?.data?.data ?? [];
  const queryClient = useQueryClient();
  async function toggleStatus(id: string) {
    const res = await togglePharmacistStatusApi(id);
    console.log(res);
    if (res?.ok) {
      queryClient.invalidateQueries({ queryKey: ["pharmacists"] });
      toast.success(res?.data?.message || "Pharmacist status updated!");
    } else {
      toast.error(res?.error || "Failed to update status");
    }
  }

  async function deletePharmacist(id: string) {
    const res = await deletePharmacistApi(id);
    console.log(res);
    if (res?.ok) {
      queryClient.invalidateQueries({ queryKey: ["pharmacists"] });
      toast.success(res?.data?.message || "Pharmacist deleted successfully!");
    } else {
      toast.error(res?.error || "Failed to delete pharmacist");
    }
  }


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
              <TableHead>Actions</TableHead>
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
                  
                    <Switch
                      checked={pharmacist.status === "active"}
                      onCheckedChange={() =>
                        toggleStatus(String(pharmacist.id))
                      }
                    />
                </TableCell>
                <TableCell className="flex items-center gap-2">

                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deletePharmacist(String(pharmacist.id))}
                    >
                      <Trash2   />
                  </Button>
                  <EditPharmacistDialog  pharmacist={pharmacist} />
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
