"use client";
import AddCashDialog from "@/components/cash/add-cash-dialog";
import CashTable from "@/components/cash/cash-table";
import { Button } from "@/components/ui/button";
import { useGoBack } from "@/hooks/use-goback";
import { ArrowLeft } from "lucide-react";
import { getCashApi } from "@/api/cash";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/stores/user-store";
import { exportToExcel } from "@/lib/export-excel";
import { Download } from "lucide-react";

const CashPage = () => {
  const goBack = useGoBack();
  const { user } = useUserStore();
  const { data } = useQuery({
    queryKey: ["cash"],
    queryFn: () => getCashApi(),
  });

  const invoices = data?.data?.data?.data ?? [];

  const handleExport = () => {
    const exportData = invoices.map((inv) => ({
      "Invoice Number": inv.invoice_number,
      "Customer Name": inv.customer_name || "-",
      "Mobile No": inv.mobile_no || "-",
      "Date": new Date(inv.created_at).toLocaleDateString(),
      "Amount": inv.amount,
      "Status": inv.status.replaceAll("_", " "),
      "Delivery Rep": inv.delivery_representative?.name || "-",
      "Rep Phone": inv.delivery_representative?.phone || "-",
      "Pharmacy": inv.pharmacy_name,
      "Neighborhood": inv.neighborhood || "-",
      "Location": inv.location || "-",
      "Notes": inv.notes || "-",
      "Information": inv.products_information || "-",
    }));

    exportToExcel(exportData, `Cash_Invoices_${new Date().toLocaleDateString()}`);
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
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport} disabled={invoices.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export to Excel
          </Button>
          {user?.role !== "super_admin" && <AddCashDialog />}
        </div>
      </div>

      <CashTable invoices={invoices} />
    </section>
  );
};

export default CashPage;
