"use client";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Task } from "@/types/tasks";
import { Calendar, CheckCircle2 } from "lucide-react";


export const CompletedTaskCard = ({
  task
}: {task: Task}) => {
  return (
    <Card className="flex flex-col border-emerald-500/20 bg-emerald-500/5">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-lg line-clamp-1">{task?.description}</CardTitle>
          <Badge
            variant="outline"
            className="text-emerald-500 border-emerald-500 bg-emerald-500/10 flex gap-1 items-center"
          >
            <CheckCircle2 className="size-3" />
            Completed
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3 mt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="size-4" />
            <span>Sent: {task?.created_at ? new Date(task.created_at).toLocaleDateString() + " - " + new Date(task.created_at).toLocaleTimeString() : 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-emerald-600/80 dark:text-emerald-400">
            <Calendar className="size-4" />
            <span>Uploaded: {task?.result_submitted_at ? new Date(task.result_submitted_at).toLocaleDateString() + " - " + new Date(task.result_submitted_at).toLocaleTimeString() : 'N/A'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
