import { getRole, getToken } from "@/actions/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from_date = searchParams.get("from_date");
  const to_date = searchParams.get("to_date");

  if (!from_date || !to_date) {
    return NextResponse.json({ error: "Date range is required" }, { status: 400 });
  }

  const token = await getToken();
  const role = await getRole();
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  try {
    const response = await fetch(
      `${BASE_URL}/reports/download-transfer-report?from_date=${from_date}&to_date=${to_date}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "accept-role": role || "",
          Accept: "application/json, application/octet-stream, */*",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Failed to download report" }));
      return NextResponse.json({ error: errorData.message }, { status: response.status });
    }

    // Get the blob from the response
    const blob = await response.blob();
    
    // Set up the headers for the file download
    const headers = new Headers();
    const contentType = response.headers.get("Content-Type") || "application/octet-stream";
    const contentDisposition = response.headers.get("Content-Disposition") || `attachment; filename="transfer-report-${from_date}-to-${to_date}.xlsx"`;

    headers.set("Content-Type", contentType);
    headers.set("Content-Disposition", contentDisposition);

    return new Response(blob, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Download Error:", error);
    return NextResponse.json({ error: "Network error occurred while downloading" }, { status: 500 });
  }
}
