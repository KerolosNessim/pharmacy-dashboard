import { getSupervisorApi } from "@/api/supervisor";
import AddSupervisorDialog from "@/components/supervisor/add-supervisor-dialog";
import SupervisorsTable from "@/components/supervisor/supervisors-table";
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
import { UserStar } from "lucide-react";

const SupervisorPage = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["supervisors"],
    queryFn: () => getSupervisorApi(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <section className="p-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <UserStar />
              All Supervisor
            </CardTitle>
            <CardAction>
              <AddSupervisorDialog />
            </CardAction>
          </CardHeader>
          <CardContent>
            <SupervisorsTable />
          </CardContent>
        </Card>
      </section>
    </HydrationBoundary>
  );
};

export default SupervisorPage;
