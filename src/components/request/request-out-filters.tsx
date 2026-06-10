"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { User } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import { REQUEST_OUT_STATUS_FILTER_OPTIONS } from "@/lib/transfer-status";

const RequestOutFiltersContent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlPharmacistName = searchParams.get("pharmacist_name") ?? "";
  const urlStatus = searchParams.get("status") ?? "all";

  const [pharmacistName, setPharmacistName] = useState(urlPharmacistName);
  const debouncedPharmacistName = useDebounce(pharmacistName, 500);

  useEffect(() => {
    setPharmacistName(urlPharmacistName);
  }, [urlPharmacistName]);

  useEffect(() => {
    if (debouncedPharmacistName === urlPharmacistName) return;

    const params = new URLSearchParams(searchParams.toString());
    if (debouncedPharmacistName.trim()) {
      params.set("pharmacist_name", debouncedPharmacistName.trim());
    } else {
      params.delete("pharmacist_name");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [
    debouncedPharmacistName,
    urlPharmacistName,
    pathname,
    router,
    searchParams,
  ]);

  const handleStatusChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set("status", value);
    } else {
      params.delete("status");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <InputGroup className="bg-bg h-12! rounded-lg flex-1">
        <InputGroupAddon>
          <User className="text-primary" />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Filter by pharmacist name..."
          value={pharmacistName}
          onChange={(e) => setPharmacistName(e.target.value)}
        />
      </InputGroup>

      <Select value={urlStatus} onValueChange={handleStatusChange}>
        <SelectTrigger className="h-12! w-full sm:w-[200px] bg-bg">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            {REQUEST_OUT_STATUS_FILTER_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

const RequestOutFilters = () => {
  return (
    <Suspense fallback={<div className="h-12 animate-pulse rounded-lg bg-muted" />}>
      <RequestOutFiltersContent />
    </Suspense>
  );
};

export default RequestOutFilters;
