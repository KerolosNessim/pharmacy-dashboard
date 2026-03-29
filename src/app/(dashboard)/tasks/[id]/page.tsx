"use client";
import { getSingleTaskApi } from "@/api/tasks";
import UploadResult from "@/components/tasks/upload-result";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useGoBack } from "@/hooks/use-goback";
import { useUserStore } from "@/stores/user-store";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";

const UploadTaskResultPage = () => {
  const goBack = useGoBack();
  const { id } = useParams();
  const { user } = useUserStore();
  const { data: task } = useQuery({
    queryKey: ["tasks", id],
    queryFn: () => getSingleTaskApi(`/${id}`),
  });
  const Task = task?.data?.data;

  return (
    <section className="flex flex-col gap-6 p-4 max-w-4xl mx-auto w-full">
      {/* header */}
      <div className="flex items-center gap-2">
        <Button variant={"ghost"} className="hover:bg-bg" onClick={goBack}>
          <ArrowLeft />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Task Details</h2>
          <p className="text-muted-foreground text-sm">
            Here are the details of the requested task.
          </p>
        </div>
      </div>

      {/* Task Details Info */}
      <Card className="bg-muted/30 border-dashed">
        <CardHeader>
          <CardTitle className="text-xl">
            Task Details: {Task?.refill_code}
          </CardTitle>
          <CardDescription className="text-base mt-2">
            <p>Task Description: {Task?.description}</p>

            <div className="flex items-center gap-2">
              <p>Task File:</p>
              <a
                href={Task?.file_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {Task?.file_link}
              </a>
            </div>
          </CardDescription>
        </CardHeader>
      </Card>
      {user?.role == "pharmacist" && <UploadResult id={id as string} />}
    </section>
  );
};

export default UploadTaskResultPage;
