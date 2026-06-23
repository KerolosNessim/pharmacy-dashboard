import type { QueryClient } from "@tanstack/react-query";

export function invalidateTransferQueries(
  queryClient: QueryClient,
  transferId?: number
) {
  queryClient.invalidateQueries({ queryKey: ["transfers", "list"] });
  queryClient.invalidateQueries({ queryKey: ["transfers", "total"] });
  if (transferId != null) {
    queryClient.invalidateQueries({
      queryKey: ["transfers", "detail", transferId],
    });
  }
}
