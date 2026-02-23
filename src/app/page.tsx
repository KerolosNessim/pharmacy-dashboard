import HomeSearch from "@/components/home/home-search";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { IoIosCheckmarkCircle } from "react-icons/io";
export default function Home() {
  const badges = ["43,000+ Products", "32 Branches", "Live Pricing","Insurance"];

  return (
    <section className="p-4">
      {/* search */}
      <HomeSearch/>
      {/* content */}
      <div className="  md:max-w-md mx-auto text-sm flex flex-col gap-6 mt-12">
        {/* icon */}
        <div className="relative size-16 bg-primary/20 rounded-lg flex items-center justify-center mx-auto">
          <Search className="size-8 text-primary" />
          <IoIosCheckmarkCircle className="size-5 text-primary absolute -bottom-1 -end-1" />
        </div>
        {/* content */}
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold">Hello, Alrashidi 👋🏻</h2>
          <p className="text-muted-foreground ">
            Find products instantly by name, SKU, or barcode. Check pricing,
            availability, offers, and insurance coverage across all branches.
          </p>
        </div>
        {/* badges */}
        <div className="flex flex-col gap-2">
          <p className="text-center text-muted-foreground">
            Connected to ME Pharmacies database
          </p>
          <div className="flex justify-center gap-2">
            {badges.map((badge, index) => (
              <Badge key={index} variant={"success"} className="text-xs">
                {badge}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
