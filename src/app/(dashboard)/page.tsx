"use client"
import HomeSearch from "@/components/home/home-search";
import { Badge } from "@/components/ui/badge";
import { useUserStore } from "@/stores/user-store";
import { Search, ArrowLeft } from "lucide-react";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { useState } from "react";
import { SingleProductDetails } from "@/components/home/single-product-details";
import { Button } from "@/components/ui/button";

export default function Home() {
  const {user} = useUserStore();
  const badges = ["SKU Search","Live Pricing","Insurance"];
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

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
        <div className="md:max-w-md mx-auto text-sm flex flex-col gap-6 mt-12 animate-in fade-in zoom-in-95 duration-500">
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
      )}
    </section>
  );
}
