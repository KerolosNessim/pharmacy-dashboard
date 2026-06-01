"use client";

import {
  deletePharmacistApi,
  getPharmacistsApi,
  togglePharmacistStatusApi,
} from "@/api/pharmacists";
import {
  PHARMACY_OPTIONS_QUERY_KEY,
  fetchPharmacyOptions,
} from "@/lib/pharmacy-options";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useMemo, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { usePaginatedList } from "@/hooks/use-paginated-list";
import { ListPagination } from "@/components/shared/list-pagination";
import { parseFlatListResponse } from "@/lib/list-parse";
import type { Pharmacist } from "@/types/pharmacists";

const PharmacistStaffTable = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [pharmacy, setPharmacy] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const queryClient = useQueryClient();

  const listFilters = useMemo(
    () => ({
      search: debouncedSearch,
      status: status === "all" ? "" : status,
      pharmacy: pharmacy === "all" ? "" : pharmacy,
    }),
    [debouncedSearch, status, pharmacy]
  );

  const {
    items: pharmacists,
    pagination,
    isLoading,
    isFetching,
    accumulated,
    hasMore,
    loadMore,
    goToPage,
  } = usePaginatedList<Pharmacist>({
    queryKey: ["pharmacists", "list", listFilters],
    fetchPage: async (page) => {
      const res = await getPharmacistsApi({ ...listFilters, page });
      if (!res.ok) throw new Error(res.error ?? "Failed to load pharmacists");
      return parseFlatListResponse<Pharmacist>(res.data);
    },
  });

  const { data: pharmacies = [] } = useQuery({
    queryKey: PHARMACY_OPTIONS_QUERY_KEY,
    queryFn: fetchPharmacyOptions,
  });

  async function toggleStatus(id: string) {
    const res = await togglePharmacistStatusApi(id);
    if (res?.ok) {
      queryClient.invalidateQueries({ queryKey: ["pharmacists"] });
      toast.success(res?.data?.message || "Pharmacist status updated!");
    } else {
      toast.error(res?.error || "Failed to update status");
    }
  }

  async function deletePharmacist(id: string) {
    const res = await deletePharmacistApi(id);
    if (res?.ok) {
      queryClient.invalidateQueries({ queryKey: ["pharmacists"] });
      toast.success(res?.data?.message || "Pharmacist deleted successfully!");
    } else {
      toast.error(res?.error || "Failed to delete pharmacist");
    }
  }

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
        <Select value={pharmacy} onValueChange={setPharmacy}>
          <SelectTrigger>
            <SelectValue placeholder="Select Pharmacy" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="all">All Pharmacies</SelectItem>
            {pharmacies.map((p) => (
              <SelectItem key={p.id} value={String(p.id)}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-24">
            <Loader2 className="animate-spin" />
          </div>
        ) : pharmacists.length > 0 ? (
          <>
            <Table>
              <TableHeader className="bg-bg">
                <TableRow className="hover:bg-bg">
                  <TableHead>Name</TableHead>
                  <TableHead>Id</TableHead>
                  <TableHead>Pharmacy</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-bg/50">
                {pharmacists.map((pharmacist) => (
                  <TableRow
                    key={pharmacist.id}
                    className="hover:bg-muted-foreground/5 h-14 px-4"
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
            {pagination && (
              <div className="p-4 border-t">
                <ListPagination
                  pagination={pagination}
                  loadedCount={pharmacists.length}
                  accumulated={accumulated}
                  hasMore={hasMore}
                  onLoadMore={loadMore}
                  isLoadingMore={isFetching}
                  onPageChange={goToPage}
                />
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 p-6 text-muted-foreground">
            <Users className="size-12" />
            <p>No Pharmacists found</p>
          </div>
        )}
      </div>
    </>
  );
};

export default PharmacistStaffTable;
