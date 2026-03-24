"use client";
import { useState } from "react";
import AddCashDialog from "@/components/cash/add-cash-dialog";
import CashTable from "@/components/cash/cash-table";
import { Button } from "@/components/ui/button";
import { useGoBack } from "@/hooks/use-goback";
import { ArrowLeft } from "lucide-react";

export interface CashInvoice {
  id: string;
  amount: string;
  status: string;
  date: string;
  delivery_rep: string;
  products_info: string;
}

const CashPage = () => {
  const goBack = useGoBack();

  const [invoices, setInvoices] = useState<CashInvoice[]>([]);

  const addInvoice = (invoice: CashInvoice) => {
    setInvoices((prev) => [invoice, ...prev]);
  };

  const deleteInvoice = (id: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
  };

  const editInvoice = (updated: CashInvoice) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === updated.id ? updated : inv)),
    );
  };

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

        <AddCashDialog addInvoice={addInvoice} />
      </div>

      <CashTable
        invoices={invoices}
        deleteInvoice={deleteInvoice}
        editInvoice={editInvoice}
      />
    </section>
  );
};

export default CashPage;
