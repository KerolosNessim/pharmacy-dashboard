import {
  buildTasksExportQueryString,
  type TasksExportParams,
} from "@/lib/tasks-query";
import { toast } from "sonner";

export async function downloadCompletedTasksExport(
  params: TasksExportParams,
): Promise<boolean> {
  const query = buildTasksExportQueryString(params);

  try {
    const res = await fetch(`/api/tasks/export${query}`);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "Failed to export tasks");
      return false;
    }

    const blob = await res.blob();
    const disposition = res.headers.get("Content-Disposition");
    const filenameMatch = disposition?.match(/filename="?([^";\n]+)"?/);
    const filename = filenameMatch?.[1] ?? "completed-tasks.xlsx";
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Export downloaded");
    return true;
  } catch {
    toast.error("Failed to export tasks");
    return false;
  }
}
