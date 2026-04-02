"use client";
import HomeSearch from "@/components/home/home-search";
import { Badge } from "@/components/ui/badge";
import { useUserStore } from "@/stores/user-store";
import { Search, ArrowLeft } from "lucide-react";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { useState } from "react";
import { SingleProductDetails } from "@/components/home/single-product-details";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardStatsApi } from "@/api/products";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

export default function Home() {
  const { user } = useUserStore();
  const badges = ["SKU Search", "Live Pricing", "Insurance"];
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );


  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => getDashboardStatsApi(),
  });

  const dashboardStats = stats?.data?.data;
const cards = [
  {
    title: "Total Products",
    value: dashboardStats?.products_count ?? 0,
    allow: ["super_admin", "supervisor"],
  },
  {
    title: "Total Pharmacies",
    value: dashboardStats?.pharmacies_count ?? 0,
    allow: ["super_admin"],
  },
  {
    title: "Total Supervisors",
    value: dashboardStats?.supervisors_count ?? 0,
    allow: ["super_admin"],
  },
  {
    title: "Total Pharmacists",
    value: dashboardStats?.pharmacists_count ?? 0,
    allow: ["super_admin", "supervisor"],
  },
  {
    title: "Total Categories",
    value: dashboardStats?.categories_count ?? 0,
    allow: ["super_admin"],
  },
  {
    title: "Total Transfers",
    value: dashboardStats?.transfers?.total ?? 0,
    allow: ["super_admin", "supervisor"],
  },
  {
    title: "Completed Transfers",
    value: dashboardStats?.transfers?.completed ?? 0,
    allow: ["super_admin", "supervisor"],
  },
  {
    title: "Rejected Transfers",
    value: dashboardStats?.transfers?.rejected ?? 0,
    allow: ["super_admin", "supervisor"],
  },
];
  return (
    <section className="p-4 flex flex-col gap-4">
      {/* Back button visible when a product is selected */}
      {selectedProductId && (
        <div className="flex items-center gap-2 mb-2 animate-in fade-in slide-in-from-left-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedProductId(null)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to search
          </Button>
        </div>
      )}

      {/* search */}
      <HomeSearch onSelect={setSelectedProductId} />

      {/* conditionally show content vs product details */}
      {selectedProductId ? (
        <SingleProductDetails productId={selectedProductId} />
      ) : (
        <>
          <div className="md:max-w-md mx-auto text-sm flex flex-col gap-6 mt-4 animate-in fade-in zoom-in-95 duration-500">
            {/* icon */}
            <div className="relative size-16 bg-primary/20 rounded-lg flex items-center justify-center mx-auto">
              <Search className="size-8 text-primary" />
              <IoIosCheckmarkCircle className="size-5 text-primary absolute -bottom-1 -end-1" />
            </div>
            {/* content */}
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold">Hello, {user?.name} 👋🏻</h2>
              <p className="text-muted-foreground ">
                Find products instantly by name, SKU, or barcode. Check pricing,
                availability, offers, and insurance coverage across all
                branches.
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
          {user?.role !== "pharmacist" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {cards.map((card, index) => (
                <Card key={index} className={cn("gap-0", !card?.allow?.includes(user?.role ?? "") && "hidden")}>
                  <CardHeader>
                    <CardTitle className="text-muted-foreground">
                      {card?.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-primary">{card?.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
