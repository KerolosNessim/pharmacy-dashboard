import { getRole, getToken } from "@/actions/auth";
import { buildAllPharmaciesReportFilename } from "@/lib/transfer-report-params";
import { buildTransferReportQueryString } from "@/lib/transfer-query";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from_date = searchParams.get("from_date");
  const to_date = searchParams.get("to_date");

  if (!from_date || !to_date) {
    return NextResponse.json({ error: "Date range is required" }, { status: 400 });
  }

  const role = await getRole();
  const isSuperAdmin = role === "super_admin";

  const pharmacyParam = searchParams.get("pharmacy_id");
  const pharmacy_id =
    isSuperAdmin &&
    pharmacyParam &&
    pharmacyParam.trim() !== "" &&
    pharmacyParam !== "all"
      ? pharmacyParam.trim()
      : undefined;

  const token = await getToken();
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const query = buildTransferReportQueryString({
    from_date,
    to_date,
    pharmacy_id,
    type: searchParams.get("type") ?? undefined,
    pharmacist_name: searchParams.get("pharmacist_name") ?? undefined,
    creator_name: searchParams.get("creator_name") ?? undefined,
    status: searchParams.get("status") ?? undefined,
  });

  try {
    const response = await fetch(`${BASE_URL}/reports/transfer${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "accept-role": role || "",
        Accept: "application/json, application/octet-stream, */*",
      },
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Failed to download report" }));
      return NextResponse.json(
        { error: errorData.message },
        { status: response.status },
      );
    }

    const blob = await response.blob();
    const headers = new Headers();
    const contentType =
      response.headers.get("Content-Type") || "application/octet-stream";
    const contentDisposition =
      response.headers.get("Content-Disposition") ||
      `attachment; filename="${
        isSuperAdmin && !pharmacy_id
          ? buildAllPharmaciesReportFilename(from_date, to_date)
          : `transfer-report-${from_date}-to-${to_date}.xlsx`
      }"`;

    headers.set("Content-Type", contentType);
    headers.set("Content-Disposition", contentDisposition);

    return new Response(blob, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Download Error:", error);
    return NextResponse.json(
      { error: "Network error occurred while downloading" },
      { status: 500 },
    );
  }
}
