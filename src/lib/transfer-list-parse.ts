import { parseNestedListResponse, getShownRange } from "@/lib/list-parse";
import type { TransferResponse } from "@/types/transfar";
import type { ParsedListResult } from "@/types/pagination";
import type { RequestItem } from "@/types/transfar";

export { getShownRange };

export function parseTransferListResponse(
  body: TransferResponse | undefined
): ParsedListResult<RequestItem> {
  return parseNestedListResponse<RequestItem>(body);
}
