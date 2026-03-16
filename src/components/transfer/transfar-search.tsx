"use client";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from "@/components/ui/input-group";
import { Filter, Search } from "lucide-react";
import { Button } from "../ui/button";
import TransfarFilterForm from "./transfar-filter-form";
import { useState, useEffect, Suspense } from "react";
import { cn } from "@/lib/utils";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const TransferSearchContent = () => {
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      if (searchTerm !== (searchParams.get("search") || "")) {
        if (searchTerm) {
          params.set("search", searchTerm);
        } else {
          params.delete("search");
        }
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, pathname, router, searchParams]);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  return (
    <div className="flex flex-col gap-4">
      {/* search bar */}
      <div className="flex items-center gap-2">
        <InputGroup className="bg-bg h-12! rounded-lg  ">
          <InputGroupAddon>
            <Search className="text-primary" />
          </InputGroupAddon>
          <InputGroupInput 
            placeholder="Search products, SKU, or barcode..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
        <Button onClick={toggleFilters} variant={"outline"} className={cn("h-12!", showFilters && "bg-primary! text-white!")}>
          <Filter />
        </Button>
      </div>

      {/* filters */}
      <div className={cn("bg-bg p-4 border rounded-lg",!showFilters && "hidden")}>
        <div className="flex items-center gap-2 mb-4">
          <Filter className="text-primary size-4" />
          <p className=" font-semibold">Filter Transfers</p>
        </div>
        <TransfarFilterForm />
      </div>
    </div>
  );
};

const TransferSearch = () => {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <TransferSearchContent />
    </Suspense>
  )
}

export default TransferSearch;
