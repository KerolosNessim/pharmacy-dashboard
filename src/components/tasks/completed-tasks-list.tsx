"use client";
import { CompletedTaskCard } from "./completed-task-card";
import { Task } from "@/types/tasks";

export const CompletedTasksList = ({tasks}: {tasks: Task[]}) => {


  return (
    <>
    {tasks.length >0 ? (
      
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks?.map((task) => (
        <CompletedTaskCard key={task.id} task={task} />
      ))}
    </div>) : (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No completed tasks</p>
      </div>
    )}
    </>
  );
};
