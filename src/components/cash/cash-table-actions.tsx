"use client";

import { Cash } from "@/types/cash";
import { Printer, Trash } from "lucide-react";
import { Button } from "../ui/button";
import EditCashDialog from "./edit-cash-dialog";
import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { deleteCashApi } from "@/api/cash";
import { toast } from "sonner";
import { useReactToPrint } from "react-to-print";
import CashPrintCard from "./cash-print-card";

const CashTableActions = ({ invoice }: { invoice: Cash }) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Invoice-${invoice.invoice_number}`,
  });

  const deleteCash = async (id: number) => {
    setLoading(true);
    const res = await deleteCashApi(id);
    if (res?.ok) {
      toast.success(res?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["cash"] });
    } else {
      toast.error(res?.error);
    }
    setLoading(false);
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePrint()}
        title="Print Invoice"
      >
        <Printer className="size-4" />
      </Button>

      <EditCashDialog invoice={invoice} />

      <Button
        variant="destructive"
        size="icon"
        onClick={() => deleteCash(invoice.id)}
        disabled={loading}
        title="Delete Invoice"
      >
        <Trash className="size-4" />
      </Button>

      {/* Hidden Print Card */}
      <div className="hidden">
        <CashPrintCard ref={printRef} invoice={invoice} />
      </div>
    </div>
  );
};

export default CashTableActions;
