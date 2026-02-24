"use client";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from "@/components/ui/input-group";
import { Filter, Search } from "lucide-react";
import { Button } from "../ui/button";
import TransfarFilterForm from "./transfar-filter-form";
import { useState } from "react";
import { cn } from "@/lib/utils";
const TransferSearch = () => {
  const [showFilters, setShowFilters] = useState(false);
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
          <InputGroupInput placeholder="Search products, SKU, or barcode..." />
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

export default TransferSearch;
