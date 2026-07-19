export function parseScannedValue(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  try {
    const json = JSON.parse(trimmed) as {
      code?: string;
      sku?: string;
      barcode?: string;
      id?: string | number;
    };
    // Prefer product identifiers used in search (code / sku / barcode)
    if (json.code) return String(json.code);
    if (json.sku) return String(json.sku);
    if (json.barcode) return String(json.barcode);
    if (json.id != null) return String(json.id);
  } catch {
    // not JSON — use raw value
  }

  const urlMatch = trimmed.match(/\/products\/(\d+)/);
  if (urlMatch) return urlMatch[1];

  return trimmed;
}
