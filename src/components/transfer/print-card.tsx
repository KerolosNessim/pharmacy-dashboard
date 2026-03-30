"use client";

import { forwardRef } from "react";
import { RequestItem } from "@/types/transfar";

const PrintCard = forwardRef<
  HTMLDivElement,
  {  transfar: RequestItem }
>(({ transfar }, ref) => {
  return (
    <div ref={ref} className="p-6 bg-white text-black w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <h1 className="text-2xl font-bold text-primary">ME Pharmacy</h1>
        <div className="text-right text-sm">
          <p>Transfer Request</p>
          <p>{transfar.created_at}</p>
        </div>
      </div>

      {/* From / To */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-2">
          <p className="font-semibold">From:</p>
          <p>{transfar.from_pharmacy}</p>
        </div>
        <div className="flex items-center gap-2">
          <p className="font-semibold">To:</p>
          <p>{transfar.to_pharmacy}</p>
        </div>
      </div>

      {/* Medications Table */}
      <table className="w-full border border-gray-300 text-sm mb-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Medication</th>
            <th className="p-2 border">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {transfar.medications?.map((med, i) => (
            <tr key={i}>
              <td className="p-2 border">{med.name}</td>
              <td className="p-2 border text-center">{med.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer */}
      <div className="flex justify-between items-center border-t pt-4">
        <p>
          <span className={`font-semibold `}>Status:</span>
          <span className={`font-semibold ${transfar.status === "pending" ? "text-yellow-500" : transfar.status === "completed" || transfar.status === "approved" || transfar.status === "recieved" || transfar.status === "Completed" || transfar.status === "Approved" || transfar.status === "Recieved" ? "text-green-500" : "text-red-500"}`}>
            {transfar.status}
          </span>
        </p>
        <p className="text-sm">Created by: {transfar.creator_name}</p>
      </div>
    </div>
  );
});

PrintCard.displayName = "PrintCard";

export default PrintCard;
