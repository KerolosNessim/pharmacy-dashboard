import { LIST_PER_PAGE } from "@/lib/api-pagination";

export type TasksExportParams = {
  status?: string;
  search?: string;
  date_from?: string;
  date_to?: string;
  pharmacy_id?: number | string;
  task_id?: number;
  task_ids?: number[];
  scope?: "page";
  page?: number;
  per_page?: number;
};

export function buildTasksExportQueryString(
  params: TasksExportParams = {},
): string {
  const qs = new URLSearchParams();

  qs.set("status", params.status ?? "completed");

  const search = params.search?.trim();
  if (search) qs.set("search", search);
  if (params.date_from) qs.set("date_from", params.date_from);
  if (params.date_to) qs.set("date_to", params.date_to);
  if (params.pharmacy_id != null && params.pharmacy_id !== "") {
    qs.set("pharmacy_id", String(params.pharmacy_id));
  }

  if (params.task_id != null) {
    qs.set("task_id", String(params.task_id));
  } else if (params.task_ids?.length) {
    for (const id of params.task_ids) {
      qs.append("task_ids[]", String(id));
    }
  } else if (params.scope === "page") {
    qs.set("scope", "page");
    qs.set("page", String(params.page ?? 1));
    qs.set("per_page", String(params.per_page ?? LIST_PER_PAGE));
  }

  return `?${qs.toString()}`;
}
