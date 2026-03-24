"use client";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, CheckCircle2 } from "lucide-react";

interface CompletedTaskCardProps {
  id: string;
  title: string;
  sendDate: string;
  uploadDate: string;
}

export const CompletedTaskCard = ({
  title,
  sendDate,
  uploadDate,
}: CompletedTaskCardProps) => {
  return (
    <Card className="flex flex-col border-emerald-500/20 bg-emerald-500/5">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge variant="outline" className="text-emerald-500 border-emerald-500 bg-emerald-500/10 flex gap-1 items-center">
            <CheckCircle2 className="size-3" />
            Completed
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3 mt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="size-4" />
            <span>Sent: {sendDate}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-emerald-600/80 dark:text-emerald-400">
            <Calendar className="size-4" />
            <span>Uploaded: {uploadDate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
