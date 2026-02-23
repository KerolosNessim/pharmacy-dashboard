import React from "react";
import { Button } from "../ui/button";
import { Heart } from "lucide-react";

const ClinicCard = () => {
  return (
    <Button variant={"secondary"} className="h-fit border p-3 justify-start">
      <div className="size-12  rounded-lg flex items-center justify-center bg-red-500/20 text-red-500">
        <Heart className="size-5" />
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="">IVF Clinic</h2>
        <p className="text-muted-foreground text-xs">4 doctors</p>
      </div>
    </Button>
  );
};

export default ClinicCard;
