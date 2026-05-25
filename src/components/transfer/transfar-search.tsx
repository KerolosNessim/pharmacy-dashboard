"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Filter, Search } from "lucide-react";
import { Button } from "../ui/button";
import TransfarFilterForm from "./transfar-filter-form";
import { useState, useEffect, Suspense } from "react";
import { cn } from "@/lib/utils";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";

const TransferSearchContent = () => {
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search") ?? "";
  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    setSearchTerm(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    if (debouncedSearch === urlSearch) return;

    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearch.trim()) {
      params.set("search", debouncedSearch.trim());
    } else {
      params.delete("search");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [debouncedSearch, urlSearch, pathname, router, searchParams]);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <InputGroup className="bg-bg h-12! rounded-lg">
          <InputGroupAddon>
            <Search className="text-primary" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search pharmacy, product, SKU, code, or transfer #..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
        <Button
          onClick={toggleFilters}
          variant={"outline"}
          className={cn("h-12!", showFilters && "bg-primary! text-white!")}
        >
          <Filter />
        </Button>
      </div>

      <div
        className={cn("bg-bg p-4 border rounded-lg", !showFilters && "hidden")}
      >
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
  );
};

export default TransferSearch;
