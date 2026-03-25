"use client";
import { PendingTaskCard } from "./pending-task-card";
import { Task } from "@/types/tasks";

export const PendingTasksList = ({ tasks }: { tasks: Task[] }) => {
  return (
    <>
      {tasks.length >0 ? (
        
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks?.map((task) => (
          <PendingTaskCard key={task.id} task={task} />
        ))}
      </div>):(
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">No pending tasks</p>
        </div>
      )}
    </>
  );
};
