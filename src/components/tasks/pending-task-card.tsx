"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Clock, Upload, UserRound } from "lucide-react";
import Link from "next/link";

interface TaskCardProps {
  id: string;
  title: string;
  sender: string;
  sendDate: string;
  sendTime: string;
}

export const PendingTaskCard = ({
  id,
  title,
  sender,
  sendDate,
  sendTime,
}: TaskCardProps) => {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
          <UserRound className="size-4" />
          <span>Sent By: {sender}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="size-4" />
            <span>Date: {sendDate}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="size-4" />
            <span>Time: {sendTime}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full gap-2" asChild>
          <Link href={`/tasks/${id}`}>
            <Upload className="size-4" />
            Upload Result
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
