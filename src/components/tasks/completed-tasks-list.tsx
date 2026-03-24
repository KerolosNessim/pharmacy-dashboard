"use client";
import { CompletedTaskCard } from "./completed-task-card";

export const CompletedTasksList = () => {
  const completedTasks = [
    {
      id: "TASK-004",
      title: "Audit Daily Sales Register",
      sendDate: "2024-03-20",
      uploadDate: "2024-03-21",
    },
    {
      id: "TASK-005",
      title: "Organize Storage Room B",
      sendDate: "2024-03-18",
      uploadDate: "2024-03-19",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {completedTasks.map((task) => (
        <CompletedTaskCard key={task.id} {...task} />
      ))}
    </div>
  );
};
