import { parseNestedListResponse, getShownRange } from "@/lib/list-parse";
import type { TransferResponse, TransferTotals, RequestItem } from "@/types/transfar";
import type { ParsedListResult } from "@/types/pagination";

export { getShownRange };

export type TransferListResult<T> = ParsedListResult<T> & {
  totals: TransferTotals;
};

const emptyTotals: TransferTotals = { total_in: 0, total_out: 0 };

export function parseTransferListResponse(
  body: TransferResponse | undefined
): TransferListResult<RequestItem> {
  return {
    ...parseNestedListResponse<RequestItem>(body),
    totals: body?.data?.totals ?? emptyTotals,
  };
}
