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
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { getPharmaciesApi } from "@/api/pharmacies";
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";

const PharmacistStaffTable = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [pharmacy_id, setPharmacy] = useState("");
 const debouncedSearch = useDebounce(search, 500);
  const queryParams = {
    search: debouncedSearch,
    status: status === "all" ? "" : status,
    pharmacy_id: pharmacy_id === "all" ? "" : pharmacy_id,
  };
  const { data, isLoading } = useQuery({
    queryKey: ["pharmacists", queryParams],
    queryFn: () => getPharmacistsApi(queryParams),
  });
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

    const { data:pharmaciesData} = useQuery({
      queryKey: ["pharmacies"],
      queryFn: getPharmaciesApi,
    });

  const pharmacies = pharmaciesData?.data?.data?.data ?? [];

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <Input
          placeholder="Search Pharmacist"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="focus-visible:ring-primary"
        />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        <Select value={pharmacy_id} onValueChange={setPharmacy}>
          <SelectTrigger>
            <SelectValue placeholder="Select Pharmacy" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="all">All Pharmacies</SelectItem>
            {pharmacies.map((pharmacy, index) => (
              <SelectItem key={index} value={String(pharmacy.id)}>
                {pharmacy?.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
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
                      <Trash2 />
                    </Button>
                    <EditPharmacistDialog pharmacist={pharmacist} />
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
    </>
  );
};

export default PharmacistStaffTable;
