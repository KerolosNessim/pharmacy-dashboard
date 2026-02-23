import MyTransferCard from "@/components/transfer/my-transfer-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  CircleAlert,
  History,
  Printer,
  User,
} from "lucide-react";
import Link from "next/link";
import { GoArrowDownLeft, GoArrowUpRight } from "react-icons/go";

const TransferPage = () => {
  return (
    <section className="flex flex-col gap-4 p-4">
      {/* header */}
      <div>
        <p className="text-muted-foreground text-sm">Welcome back,</p>
        <h2 className="text-2xl font-bold">Alrashidi</h2>
      </div>
      {/* in & out */}
      <div className="grid grid-cols-2 gap-4">
        <Link href={"/transfer"} className="w-full ">
          <Button
            variant={"secondary"}
            className="w-full h-fit flex-col py-6 border rounded-xl"
          >
            <div className="size-12 rounded-full bg-primary/30 text-primary flex justify-center items-center">
              <GoArrowDownLeft className="size-8" />
            </div>
            <h2 className="text-2xl font-bold">IN</h2>
            <p className="text-muted-foreground">Incoming</p>
          </Button>
        </Link>
        <Link href={"/transfer"} className="w-full ">
          <Button
            variant={"secondary"}
            className="w-full h-fit flex-col py-6 border rounded-xl"
          >
            <div className="size-12 rounded-full bg-primary/30 text-primary flex justify-center items-center">
              <GoArrowUpRight className="size-8" />
            </div>
            <h2 className="text-2xl font-bold">OUT</h2>
            <p className="text-muted-foreground">Requested Items</p>
          </Button>
        </Link>
      </div>
      {/* transfer History */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <History className="size-5 text-primary" />
          <h2 className=" font-bold">Transfers</h2>
        </div>
        <div className="border rounded-xl overflow-hidden">
          <Link href={"/transfer"} className="w-full ">
            <Button
              variant={"secondary"}
              className="w-full h-fit flex-row justify-between border-b rounded-none"
            >
              <div className="flex items-center gap-2">
                <div className="size-10 rounded-lg bg-primary/30 text-primary flex justify-center items-center">
                  <History className="size-5 " />
                </div>
                <p className="font-bold">All Transfers</p>
              </div>
              <ChevronRight className="size-5 text-muted-foreground" />
            </Button>
          </Link>
          <Link href={"/transfer"} className="w-full ">
            <Button
              variant={"secondary"}
              className="w-full h-fit flex-row justify-between  rounded-none"
            >
              <div className="flex items-center gap-2">
                <div className="size-10 rounded-lg bg-orange-400/30 text-orange-400 flex justify-center items-center">
                  <CircleAlert className="size-5 " />
                </div>
                <p className="font-bold">Pending </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={"pending"}>5</Badge>
                <ChevronRight className="size-5 text-muted-foreground" />
              </div>
            </Button>
          </Link>
        </div>
      </div>
      {/* my transfer  */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <User className="size-5 text-primary" />
          <h2 className=" font-bold"> My Transfers</h2>
          <Badge variant={"success"}>6</Badge>
        </div>
        <div className="border rounded-xl overflow-hidden">
          {Array.from({ length: 6 }).map((_, index) => (
            <MyTransferCard key={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TransferPage;
