"use client";

import { getSingleTaskApi } from "@/api/tasks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGoBack } from "@/hooks/use-goback";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  FileText,
  UserRound,
} from "lucide-react";
import { useParams } from "next/navigation";

const CompletedTaskPage = () => {
  const goBack = useGoBack();
  const { id } = useParams();
  const { data: taskResponse } = useQuery({
    queryKey: ["tasks", id],
    queryFn: () => getSingleTaskApi(`/${id}`),
  });
  const task = taskResponse?.data?.data;

  const formatDateTime = (date: string | null | undefined) => {
    if (!date) return "N/A";
    return (
      new Date(date).toLocaleDateString() +
      " - " +
      new Date(date).toLocaleTimeString()
    );
  };

  return (
    <section className="flex flex-col gap-6 p-4 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-2">
        <Button variant="ghost" className="hover:bg-bg" onClick={goBack}>
          <ArrowLeft />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Completed Task</h2>
          <p className="text-muted-foreground text-sm">
            View the details and result of this completed task.
          </p>
        </div>
      </div>

      <Card className="border-emerald-500/20 bg-emerald-500/5">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-xl">
              {task?.refill_code ?? "Task Details"}
            </CardTitle>
            <Badge
              variant="outline"
              className="text-emerald-500 border-emerald-500 bg-emerald-500/10 flex gap-1 items-center shrink-0"
            >
              <CheckCircle2 className="size-3" />
              Completed
            </Badge>
          </div>
          <CardDescription className="text-base mt-2">
            {task?.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <UserRound className="size-4 shrink-0" />
              <span>
                <span className="font-medium text-foreground">Sent By:</span>{" "}
                {task?.uploaded_by?.name ?? "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <UserRound className="size-4 shrink-0" />
              <span>
                <span className="font-medium text-foreground">Sent To:</span>{" "}
                {task?.assigned_to?.name ?? "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="size-4 shrink-0" />
              <span>
                <span className="font-medium text-foreground">Sent:</span>{" "}
                {formatDateTime(task?.created_at)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-emerald-600/80 dark:text-emerald-400">
              <Calendar className="size-4 shrink-0" />
              <span>
                <span className="font-medium">Completed:</span>{" "}
                {formatDateTime(task?.result_submitted_at)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Task File</p>
            {task?.file_link ? (
              <a
                href={task.file_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline break-all text-sm"
              >
                {task.file_name ?? task.file_link}
              </a>
            ) : (
              <p className="text-sm text-muted-foreground">No file attached</p>
            )}
          </div>

          {(task?.remark_1 || task?.remark_2 || task?.remark_3) && (
            <div className="bg-background rounded-lg p-4 border space-y-4">
              <h3 className="font-semibold text-foreground">Remarks</h3>
              {task?.remark_1 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Remark 1
                  </p>
                  <p className="text-foreground">{task.remark_1}</p>
                </div>
              )}
              {task?.remark_2 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Remark 2
                  </p>
                  <p className="text-foreground">{task.remark_2}</p>
                </div>
              )}
              {task?.remark_3 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Remark 3
                  </p>
                  <p className="text-foreground">{task.remark_3}</p>
                </div>
              )}
            </div>
          )}

          <div className="bg-background rounded-lg p-4 border space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="size-4 text-emerald-500" />
              <h3 className="font-semibold text-foreground">Task Result</h3>
            </div>
            {task?.result_text ? (
              <p className="text-foreground whitespace-pre-wrap">
                {task.result_text}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">No result text</p>
            )}
            {task?.result_file_url && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Result Attachment
                </p>
                <a
                  href={task.result_file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline break-all text-sm"
                >
                  {task.result_file_name ?? task.result_file_url}
                </a>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default CompletedTaskPage;
