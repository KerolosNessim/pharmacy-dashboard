"use client";
import { getCategoriesApi } from "@/api/categories";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { LibraryBig, Loader2 } from "lucide-react";
import { Badge } from "../ui/badge";

const CategoriesTable = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesApi,
  });
  console.log(data);
 const categories = data?.data?.data ?? [];
  return (
    <div className="border rounded-lg! overflow-hidden ">
      {isLoading && (
        <div className="flex items-center justify-center h-24">
          <Loader2 className="animate-spin" />
        </div>
      )}
      {categories.length > 0 ? (
        <Table className="">
          <TableHeader className="bg-bg ">
            <TableRow className="hover:bg-bg ">
              <TableHead>Name</TableHead>
              <TableHead>Products Count</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created at</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-bg/50">
            {data?.data?.data?.map((category, index) => (
              <TableRow
                key={index}
                className="hover:bg-muted-foreground/5  h-14  px-4 "
              >
                <TableCell>{category?.name}</TableCell>
                <TableCell>{category?.products_count}</TableCell>
                <TableCell>
                  <Badge variant="outline">{category?.status}</Badge>
                </TableCell>
                <TableCell>
                  {new Date(category?.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex flex-col items-center gap-2  p-6 text-muted-foreground">
          <LibraryBig className="size-12 " />
          <p>No categories found</p>
        </div>
      )}
    </div>
  );
};

export default CategoriesTable;
