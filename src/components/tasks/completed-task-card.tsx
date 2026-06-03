"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Task } from "@/types/tasks";
import { Calendar, CheckCircle2, Eye, UserRound } from "lucide-react";
import Link from "next/link";


export const CompletedTaskCard = ({
  task
}: {task: Task}) => {
  return (
    <Card className="flex flex-col border-emerald-500/20 bg-emerald-500/5">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-lg line-clamp-1">
            {task?.description}
          </CardTitle>
          <Badge
            variant="outline"
            className="text-emerald-500 border-emerald-500 bg-emerald-500/10 flex gap-1 items-center"
          >
            <CheckCircle2 className="size-3" />
            Completed
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
          <UserRound className="size-4" />
          <span>Sent By: {task?.uploaded_by?.name}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
          <UserRound className="size-4" />
          <span>Sent To: {task?.assigned_to?.name}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3 mt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="size-4" />
            <span>
              Sent:{" "}
              {task?.created_at
                ? new Date(task.created_at).toLocaleDateString() +
                  " - " +
                  new Date(task.created_at).toLocaleTimeString()
                : "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-emerald-600/80 dark:text-emerald-400">
            <Calendar className="size-4" />
            <span>
              Uploaded:{" "}
              {task?.result_submitted_at
                ? new Date(task.result_submitted_at).toLocaleDateString() +
                  " - " +
                  new Date(task.result_submitted_at).toLocaleTimeString()
                : "N/A"}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full gap-2" asChild>
          <Link href={`/tasks/completed/${task?.id}`}>
            <Eye className="size-4" />
            Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
