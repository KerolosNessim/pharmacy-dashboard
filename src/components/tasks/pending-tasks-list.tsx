"use client";
import { PendingTaskCard } from "./pending-task-card";

export const PendingTasksList = () => {
  const pendingTasks = [
    {
      id: "TASK-001",
      title: "Review Monthly Inventory Report",
      sender: "Pharmacy Supervisor",
      sendDate: "2024-03-24",
      sendTime: "09:00 AM",
    },
    {
      id: "TASK-002",
      title: "Check Expired Medications",
      sender: "Pharmacy Supervisor",
      sendDate: "2024-03-23",
      sendTime: "02:30 PM",
    },
    {
      id: "TASK-003",
      title: "Update Shelf Pricing",
      sender: "Pharmacy Supervisor",
      sendDate: "2024-03-22",
      sendTime: "11:15 AM",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {pendingTasks.map((task) => (
        <PendingTaskCard key={task.id} {...task} />
      ))}
    </div>
  );
};
