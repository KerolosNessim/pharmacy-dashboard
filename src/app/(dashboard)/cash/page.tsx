"use client";
import { useState } from "react";
import AddCashDialog from "@/components/cash/add-cash-dialog";
import CashTable from "@/components/cash/cash-table";
import { Button } from "@/components/ui/button";
import { useGoBack } from "@/hooks/use-goback";
import { ArrowLeft } from "lucide-react";
import { getCashApi } from "@/api/cash";
import { useQuery } from "@tanstack/react-query";



const CashPage = () => {
  const goBack = useGoBack();
const {data} = useQuery({
  queryKey: ["cash"],
  queryFn: getCashApi,
})

  const invoices=data?.data?.data?.data??[]

  return (
    <section className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={goBack}>
            <ArrowLeft />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Cash Management</h2>
            <p className="text-muted-foreground text-sm">Manage invoices</p>
          </div>
        </div>

        <AddCashDialog  />
      </div>

      <CashTable
        invoices={invoices}
      />
    </section>
  );
};

export default CashPage;
