import { RequestItem } from "@/types/transfar";

const STORAGE_PREFIX = "transfer-share-";

export function formatTransferShareMessage(
  transfar: RequestItem,
  order?: number
): string {
  const medicationLines = (transfar.medications ?? []).map(
    (med) =>
      `• ${med.name}\n  Code: ${med.product_code || "—"} | Qty: ${med.quantity}`
  );

  return [
    "*ME Pharmacy - Transfer Request*",
    "",
    order != null ? `Order: #${order}` : null,
    `Transfer ID: #${transfar.id}`,
    `Date: ${transfar.created_at}`,
    `Created by: ${transfar.creator_name}`,
    `Status: ${transfar.status}`,
    "",
    `*From:* ${transfar.from_pharmacy}`,
    `*To:* ${transfar.to_pharmacy}`,
    "",
    "*Medications:*",
    ...(medicationLines.length > 0 ? medicationLines : ["—"]),
    transfar.notes?.trim() ? ["", `*Notes:*\n${transfar.notes.trim()}`] : [],
  ]
    .flat()
    .filter((line) => line !== null && line !== "")
    .join("\n");
}

function saveTransferToStorage(transfar: RequestItem, order?: number) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      `${STORAGE_PREFIX}${transfar.id}`,
      JSON.stringify({
        transfar,
        order,
        message: formatTransferShareMessage(transfar, order),
        savedAt: new Date().toISOString(),
      })
    );
  } catch {
    /* ignore quota errors */
  }
}

function copyToClipboard(text: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    void navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

/** Saves transfer text locally, copies it, and opens WhatsApp to share. */
export function shareTransferViaWhatsApp(
  transfar: RequestItem,
  order?: number
): void {
  const message = formatTransferShareMessage(transfar, order);

  saveTransferToStorage(transfar, order);
  copyToClipboard(message);

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
}
