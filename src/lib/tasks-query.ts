export type TasksExportParams = {
  search?: string;
  from_date?: string;
  to_date?: string;
};

/** Query string for completed-tasks export (no pagination). */
export function buildTasksExportQueryString(
  params: TasksExportParams = {},
): string {
  const qs = new URLSearchParams();

  const search = params.search?.trim();
  if (search) qs.set("search", search);
  if (params.from_date) qs.set("from_date", params.from_date);
  if (params.to_date) qs.set("to_date", params.to_date);

  const query = qs.toString();
  return query ? `?${query}` : "";
}
