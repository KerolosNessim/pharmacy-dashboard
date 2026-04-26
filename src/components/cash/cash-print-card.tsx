"use client";

import { forwardRef } from "react";
import { Cash } from "@/types/cash";

const CashPrintCard = forwardRef<HTMLDivElement, { invoice: Cash }>(
  ({ invoice }, ref) => {
    return (
      <div ref={ref} className="p-8 bg-white text-black w-full max-w-2xl mx-auto font-sans">
        {/* Header */}
        <div className="flex justify-between items-center border-b-2 border-primary pb-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary">ME Pharmacy</h1>
            <p className="text-sm text-gray-500">Your Health, Our Priority</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold uppercase tracking-wider">Invoice</h2>
            <p className="text-sm font-semibold">#{invoice.invoice_number}</p>
            <p className="text-xs text-gray-500">{new Date(invoice.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-2 border-b">Customer Details</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-semibold">Name:</span> {invoice.customer_name || "-"}</p>
              <p><span className="font-semibold">Mobile:</span> {invoice.mobile_no || "-"}</p>
              <p><span className="font-semibold">Neighborhood:</span> {invoice.neighborhood || "-"}</p>
              <p><span className="font-semibold">Location:</span> {invoice.location || "-"}</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-2 border-b">Delivery Info</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-semibold">Representative:</span> {invoice.delivery_representative?.name || "-"}</p>
              <p><span className="font-semibold">Rep. Phone:</span> {invoice.delivery_representative?.phone || "-"}</p>
              <p><span className="font-semibold">Pharmacy:</span> {invoice.pharmacy_name}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-400 uppercase mb-2 border-b">Information</h3>
          <div className="p-4 bg-gray-50 rounded border text-sm min-h-[100px]">
            {invoice.products_information || "No additional information provided."}
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-2 border-b">Notes</h3>
            <p className="text-sm italic text-gray-700">{invoice.notes}</p>
          </div>
        )}

        {/* Summary */}
        <div className="flex justify-end mb-8">
          <div className="w-64 space-y-2">
            <div className="flex justify-between py-2 border-t border-gray-200">
              <span className="font-semibold">Subtotal</span>
              <span>{invoice.amount} EGP</span>
            </div>
            <div className="flex justify-between py-3 border-t-2 border-primary text-lg font-bold">
              <span>Total Amount</span>
              <span className="text-primary">{invoice.amount} EGP</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t pt-6 text-center text-xs text-gray-400 space-y-1">
          <p>Status: <span className="font-bold text-black uppercase">{invoice.status.replaceAll("_", " ")}</span></p>
          <p>This is a computer-generated invoice and does not require a physical signature.</p>
          <p>© {new Date().getFullYear()} ME Pharmacy. All rights reserved.</p>
        </div>
      </div>
    );
  }
);

CashPrintCard.displayName = "CashPrintCard";

export default CashPrintCard;
