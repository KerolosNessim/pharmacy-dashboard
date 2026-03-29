import { getPharmacistsApi } from "@/api/pharmacists";
import AddPharmacistDialog from "@/components/pharmacists/add-pharmacist-dialog";
import PharmacistStaffTable from "@/components/pharmacists/pharmacist-staff-table";
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
import { Users } from "lucide-react";

const PharmacistsStaffPage = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["pharmacists"],
    queryFn: () => getPharmacistsApi(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <section className="p-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <Users />
              All Pharmacists Staff
            </CardTitle>
            <CardAction>
              <AddPharmacistDialog />
            </CardAction>
          </CardHeader>
          <CardContent>
            <PharmacistStaffTable />
          </CardContent>
        </Card>
      </section>
    </HydrationBoundary>
  );
};

export default PharmacistsStaffPage;
