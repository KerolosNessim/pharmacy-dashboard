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
import { downloadCompletedTasksExport } from "@/lib/export-completed-tasks";
import { Task } from "@/types/tasks";
import {
  Calendar,
  CheckCircle2,
  Download,
  Eye,
  Loader2,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const CompletedTaskCard = ({
  task,
  selectable = false,
  selected = false,
  onToggleSelect,
}: {
  task: Task;
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: (id: number) => void;
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await downloadCompletedTasksExport({ task_id: task.id });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card
      className={cn(
        "flex flex-col border-blue-500 bg-blue-500/5",
        selectable && selected && "ring-2 ring-primary border-primary/40",
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            {selectable && (
              <input
                type="checkbox"
                checked={selected}
                onChange={() => onToggleSelect?.(task.id)}
                className="mt-1.5 size-4 shrink-0 accent-primary cursor-pointer"
                aria-label={`Select task ${task.refill_code}`}
              />
            )}
            <CardTitle className="text-lg line-clamp-1">
              {task?.description}
            </CardTitle>
          </div>
          <Badge
            variant="outline"
            className="text-blue-500 border-blue-500 bg-blue-500/10 flex gap-1 items-center shrink-0"
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
          <div className="flex items-center gap-2 text-sm text-blue-600/80 dark:text-blue-400">
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
      <CardFooter className="flex gap-2">
        {selectable && (
          <Button
            variant="outline"
            className="gap-2"
            disabled={isExporting}
            onClick={handleExport}
          >
            {isExporting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Download className="size-4" />
            )}
            Export
          </Button>
        )}
        <Button className="flex-1 gap-2" asChild>
          <Link href={`/tasks/completed/${task?.id}`}>
            <Eye className="size-4" />
            Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
