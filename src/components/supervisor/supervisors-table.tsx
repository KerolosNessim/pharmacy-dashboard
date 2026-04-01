"use client";
import { deleteSupervisorApi, getSupervisorApi, toggleSupervisorStatusApi } from "@/api/supervisor";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2, UserStar } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "../ui/switch";
import UpdateSupervisorDialog from "./update-supervisor-dialog";
import { Button } from "../ui/button";
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { getPharmaciesApi } from "@/api/pharmacies";
import { Pharmacy } from "@/types/pharmacies";


const SupervisorsTable = () => {
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
    queryKey: ["supervisors", queryParams],
    queryFn: () => getSupervisorApi(queryParams),
  });
  console.log(data);
  const supervisors = data?.data?.data?.data ?? [];

  const queryClient = useQueryClient();
async function toggleStatus(id: string) {
    const res = await toggleSupervisorStatusApi(id);
  console.log(res);
  if (res?.ok) {
    queryClient.invalidateQueries({ queryKey: ["supervisors"] });
    toast.success(res?.data?.message||"Supervisor status updated!");
  }
  else {
    toast.error(res?.error|| "Failed to update status");
  }
  }
  
  async function deleteSupervisor(id: string) {
    const res = await deleteSupervisorApi(id);
    console.log(res);
    if (res?.ok) {
      queryClient.invalidateQueries({ queryKey: ["supervisors"] });
      toast.success(res?.data?.message || "Supervisor deleted successfully!");
    } else {
      toast.error(res?.error || "Failed to delete supervisor");
    }
  }

  
    const { data: pharmaciesData } = useQuery({
      queryKey: ["pharmacies"],
      queryFn: () => getPharmaciesApi(),
    });

    const pharmacies = pharmaciesData?.data?.data?.data ?? [];

  return (
    <>
    <div className="flex items-center gap-2 mb-4">
      <Input
        placeholder="Search by Supervisor name"
        value={search}
          onChange={(e) => setSearch(e.target.value)}
          className=" focus-visible:ring-primary"
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
          {pharmacies.map((pharmacy:Pharmacy) => (
            <SelectItem key={pharmacy.id} value={String(pharmacy.id)}>
              {pharmacy.name}
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
      {supervisors.length > 0 ? (
        <Table className="">
          <TableHeader className="bg-bg ">
            <TableRow className="hover:bg-bg ">
              <TableHead>Name</TableHead>
              <TableHead>Id</TableHead>
              <TableHead>Pharmacy</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Edit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-bg/50">
            {supervisors.map((supervisor, index) => (
              <TableRow
                key={index}
                className="hover:bg-muted-foreground/5  h-14  px-4 "
              >
                <TableCell>{supervisor?.name}</TableCell>
                <TableCell>{supervisor?.id_number}</TableCell>
                <TableCell>{supervisor?.pharmacy?.name}</TableCell>
                <TableCell>
                  <Switch
                    checked={supervisor.status === "active"}
                    onCheckedChange={() => toggleStatus(String(supervisor.id))}
                  />
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  <Button onClick={() => deleteSupervisor(String(supervisor.id))} variant={"destructive"} >
                    <Trash2 />
                  </Button>
                  <UpdateSupervisorDialog supervisor={supervisor} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex flex-col items-center gap-2  p-6 text-muted-foreground">
          <UserStar className="size-12 " />
          <p>No Supervisors found</p>
        </div>
      )}
    </div>
    </>
  );
};;

export default SupervisorsTable;
