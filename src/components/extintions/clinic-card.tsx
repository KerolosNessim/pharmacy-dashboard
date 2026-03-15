import React from "react";
import { Button } from "../ui/button";
import { Heart, Phone, User } from "lucide-react";
import { singleClinic } from "@/types/extintions";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

const ClinicCard = ({ clinic }: { clinic: singleClinic }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"secondary"}
          className="h-fit border p-3 justify-start"
        >
          <div className="size-12  rounded-lg flex items-center justify-center bg-red-500/20 text-red-500">
            <Heart className="size-5" />
          </div>
          <div className="flex flex-col gap-1">
            <h2>{clinic?.name}</h2>
            <p className="text-muted-foreground text-xs text-start">
              {clinic?.doctors?.length} doctors
            </p>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="gap-4">
          <DialogTitle>{clinic?.name}</DialogTitle>
          <DialogDescription>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                {
                  clinic?.doctors?.length>0?clinic?.doctors?.map((doctor) => {
                  return (
                    <div key={doctor.id} className=" rounded-lg p-4 bg-bg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/30 text-primary size-12 rounded-md flex items-center justify-center">
                           <User />
                        </div>
                        <h2 className=" font-bold">
                          {doctor?.name}
                        </h2>
                      </div>
                      <Button
                        variant={"secondary"}
                        className=" bg-primary/20 text-primary text-lg rounded-full"
                      >
                        <Phone />
                        <span className="underline">{doctor?.phone}</span>
                      </Button>
                    </div>
                  );
                }):
                <p className="text-center text-muted-foreground ">No doctors found</p>
                }
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ClinicCard;
