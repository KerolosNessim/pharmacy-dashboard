import { Badge } from '@/components/ui/badge';
import { Truck } from 'lucide-react';
import React from 'react'

const TasksPage = () => {
  return (
    <section className="flex flex-col gap-4 p-4">
      {/* header */}
      <div>
        <h2 className="text-2xl font-bold">My Tasks</h2>
        <p className="text-muted-foreground text-sm">Tasks assigned to you</p>
      </div>
      {/* refill tasks */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Truck className="size-5 text-primary" />
          <h2 className=" font-bold">Refill Tasks</h2>
          <Badge variant={"success"}>0</Badge>
        </div>
        {/* no tacks */}
        <div className="flex flex-col items-center gap-2 bg-bg rounded-lg border p-6 text-muted-foreground">
          <Truck className="size-12 " />
          <p>No refill tasks assigned</p>
        </div>
      </div>
    </section>
  );
}

export default TasksPage