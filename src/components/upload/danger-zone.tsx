import { AlertCircle, RefreshCcw } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

const DangerZone = () => {
  return (
    <div className="bg-red-500/10 border border-red-500 rounded-lg p-6 flex flex-col gap-4">
      <h2 className="flex items-center gap-2  font-semibold text-2xl text-red-500">
        <AlertCircle />
        Danger Zone
      </h2>
      <div className="flex items-end justify-between max-md:flex-col max-md:items-start gap-4">
        <div>
          <h3 className="font-semibold text-lg">Clean All Data</h3>
          <p className="text-muted-foreground ">
            Delete all transfers and chat messages across all branches.
          </p>
        </div>
        <div>
          <Button variant={"destructive"} className="bg-red-500"><RefreshCcw/>  Clean All Data</Button>
        </div>
      </div>
    </div>
  );
};

export default DangerZone;
