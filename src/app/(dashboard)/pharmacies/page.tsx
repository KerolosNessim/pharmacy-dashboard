import { getPharmaciesApi } from "@/api/pharmacies";
import AddPharmacyDialog from "@/components/pharmacies/add-pharmacies-dialog";
import PharmaciesTable from "@/components/pharmacies/pharmacies-table";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { Building2 } from "lucide-react";

const PharmaciesPage = async () => {
  const queryClient = new QueryClient();

await queryClient.prefetchQuery({
  queryKey: ["pharmacies"],
  queryFn: () => getPharmaciesApi(),
});

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <section className="p-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <Building2 />
              All Pharmacies
            </CardTitle>
            <CardAction>
              <AddPharmacyDialog />
            </CardAction>
          </CardHeader>
          <CardContent>
            <PharmaciesTable/>
          </CardContent>
        </Card>
      </section>
    </HydrationBoundary>
  );
};

export default PharmaciesPage;
