"use client";

import { getProductsListApi } from "@/api/products";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useDebounce } from "@/hooks/use-debounce";
import { useQuery } from "@tanstack/react-query";
import { Box, Camera, Loader2, Search } from "lucide-react";
import { useState } from "react";
import { Badge } from "../ui/badge";

const HomeSearch = ({ onSelect }: { onSelect?: (id: string) => void }) => {
  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const debouncedSearch = useDebounce(search, 500);

  const { data: productsList, isFetching } = useQuery({
    queryKey: ["products", debouncedSearch],
    queryFn: () => getProductsListApi(debouncedSearch),
    enabled: debouncedSearch.length > 0,
  });

  const products = productsList?.data?.data?.data || [];
  const showDropdown = isFocused && search.length > 0;

  return (
    <div className="relative w-full z-50">
      <InputGroup className="bg-bg border-0 outline-0 h-12! rounded-lg">
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Search products, SKU, or barcode..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            // Delay closing to allow clicking on links
            setTimeout(() => setIsFocused(false), 200);
          }}
        />
        <InputGroupAddon align="inline-end">
          {isFetching && (
            <div className="flex items-center justify-center px-4">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>)}
        </InputGroupAddon>
      </InputGroup>

      {showDropdown && (
        <div className="bg-background absolute top-full left-0 right-0 mt-2  border rounded-lg shadow-lg overflow-hidden max-h-96 overflow-y-auto w-full">
          {isFetching && products.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Searching...
            </div>
          ) : products.length > 0 ? (
            <div className="flex flex-col">
              {products.slice(0, 5).map((product) => (
                <button
                  key={product.id}
                  onClick={() => {
                    setSearch("")
                    if (onSelect) onSelect(String(product.id));
                  }}
                  className="p-3 border-b last:border-0 hover:bg-bg transition-colors flex items-center justify-between w-full text-left"
                >
                  <div className="flex items-center gap-2">
                    <div className="bg-bg p-2 border rounded-lg w-fit">
                      <Box className="size-5" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.category?.name} • code: {product?.code || "-"}
                      </p>
                    </div>
                  </div>
                  <Badge variant={"success"}>
                    {product.category?.name}
                  </Badge>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No products found for &quot;{search}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HomeSearch;
