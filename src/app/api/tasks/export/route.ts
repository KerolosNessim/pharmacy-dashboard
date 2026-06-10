import { getRole, getToken } from "@/actions/auth";
import { buildTasksExportQueryString } from "@/lib/tasks-query";
import { NextResponse } from "next/server";

const EXPORT_ROLES = new Set(["super_admin", "supervisor"]);

export async function GET(request: Request) {
  const role = await getRole();
  if (!role || !EXPORT_ROLES.has(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const token = await getToken();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = buildTasksExportQueryString({
    search: searchParams.get("search") ?? undefined,
    from_date: searchParams.get("from_date") ?? undefined,
    to_date: searchParams.get("to_date") ?? undefined,
  });

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  try {
    const response = await fetch(`${BASE_URL}/refill-tasks/export${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "accept-role": role,
        Accept: "application/json, application/octet-stream, */*",
      },
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Failed to export tasks" }));
      return NextResponse.json(
        { error: errorData.message ?? errorData.error ?? "Failed to export tasks" },
        { status: response.status },
      );
    }

    const blob = await response.blob();
    const headers = new Headers();
    const contentType =
      response.headers.get("Content-Type") || "application/octet-stream";
    const contentDisposition =
      response.headers.get("Content-Disposition") ||
      'attachment; filename="completed-tasks.xlsx"';

    headers.set("Content-Type", contentType);
    headers.set("Content-Disposition", contentDisposition);

    return new Response(blob, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Tasks export error:", error);
    return NextResponse.json(
      { error: "Network error occurred while exporting tasks" },
      { status: 500 },
    );
  }
}
