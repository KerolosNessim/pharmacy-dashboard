import { getCategoriesApi } from "@/api/categories";
import AddCategoryDialog from "@/components/categories/add-category-dialog";
import CategoriesTable from "@/components/categories/categories-table";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { LibraryBig } from "lucide-react";

const CategoriesPage = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["categories"],
    queryFn: () => getCategoriesApi(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <section className="p-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <LibraryBig />
              All Categories
            </CardTitle>
            <CardAction>
              <AddCategoryDialog />
            </CardAction>
          </CardHeader>
          <CardContent>
            <CategoriesTable />
          </CardContent>
        </Card>
      </section>
    </HydrationBoundary>
  );
};

export default CategoriesPage;
