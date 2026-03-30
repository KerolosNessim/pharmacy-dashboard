"use client";
import { deleteCategoriesApi, getCategoriesApi } from "@/api/categories";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LibraryBig, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import EditCategoryDialog from "./edit-category-dialog";
import AddSubCategoryDialog from "./add-subcategorey-dialog";

const CategoriesTable = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesApi,
  });
  const queryClient = useQueryClient();
  console.log(data);
  const categories = data?.data?.data ?? [];
  const handleDeleteCategory = async (id: string) => {
    const res = await deleteCategoriesApi(id);
    if (res.ok) {
      toast.success("Category deleted successfully");
      queryClient?.invalidateQueries({ queryKey: ["categories"] });
    } else {
      toast.error("Failed to delete category");
    }
  };
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
              <TableHead>Category Code</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created at</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-bg/50">
            {data?.data?.data?.map((category) => (
              <>
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.products_count}</TableCell>
                  <TableCell>{category.category_code}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{category.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(category.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteCategory(String(category.id))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <EditCategoryDialog category={category} />
                    <AddSubCategoryDialog parentId={category.id} />
                  </TableCell>
                </TableRow>
                {/* subcategories */}
                {category.children?.map((child) => (
                  <TableRow key={child.id} className="bg-bg">
                    <TableCell className="pl-8">{child.name}</TableCell>
                    <TableCell>{child.products_count}</TableCell>
                    <TableCell>{child.category_code}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{child.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(child.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteCategory(String(child.id))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <EditCategoryDialog category={child} />
                    </TableCell>
                  </TableRow>
                ))}
              </>
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
