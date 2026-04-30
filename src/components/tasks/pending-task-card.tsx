"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserStore } from "@/stores/user-store";
import { Task } from "@/types/tasks";
import { Calendar, Clock, Eye, UserRound } from "lucide-react";
import Link from "next/link";

export const PendingTaskCard = ({ task }: { task: Task }) => {
  console.log(task);

const {user} = useUserStore()
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg line-clamp-1">
          {task?.description}
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
          <UserRound className="size-4" />
          <span>Sent By: {task?.uploaded_by?.name}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
          <UserRound className="size-4" />
          <span>Sent To: {task?.assigned_to?.name}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="size-4" />
            <span>Date: {new Date(task?.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="size-4" />
            <span>Time: {new Date(task?.created_at).toLocaleTimeString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full gap-2" asChild>
          <Link href={`/tasks/${task?.id}`}>
            <Eye className="size-4" />
            Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
