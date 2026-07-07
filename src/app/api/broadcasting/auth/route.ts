import { getPharmacyId, getRole, getToken } from "@/actions/auth";
import {
  canAccessPrivateChannel,
  signPrivateChannel,
} from "@/lib/pusher-server-auth";
import { NextResponse } from "next/server";

type AuthBody = {
  socket_id?: string;
  channel_name?: string;
};

async function parseAuthBody(request: Request): Promise<AuthBody> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const body = (await request.json()) as AuthBody;
    return {
      socket_id: body.socket_id,
      channel_name: body.channel_name,
    };
  }

  const form = await request.formData();
  return {
    socket_id: form.get("socket_id")?.toString(),
    channel_name: form.get("channel_name")?.toString(),
  };
}

async function authorizeViaLaravel(
  baseUrl: string,
  token: string,
  role: string,
  socket_id: string,
  channel_name: string,
) {
  const authPayload = { socket_id, channel_name };
  const commonHeaders = {
    Authorization: `Bearer ${token}`,
    "accept-role": role || "",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  };

  let response = await fetch(`${baseUrl}/broadcasting/auth`, {
    method: "POST",
    headers: {
      ...commonHeaders,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authPayload),
  });

  let text = await response.text();

  if (!text.trim()) {
    const formBody = new URLSearchParams(authPayload);
    response = await fetch(`${baseUrl}/broadcasting/auth`, {
      method: "POST",
      headers: {
        ...commonHeaders,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formBody.toString(),
    });
    text = await response.text();
  }

  return { response, text };
}

export async function POST(request: Request) {
  const token = await getToken();
  const role = await getRole();
  const pharmacyId = await getPharmacyId();

  if (!token) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  const { socket_id, channel_name } = await parseAuthBody(request);

  if (!socket_id || !channel_name) {
    return NextResponse.json(
      { message: "socket_id and channel_name are required." },
      { status: 422 },
    );
  }

  // Local Pusher signing (fixes 403 when Laravel channel rules are too strict)
  if (canAccessPrivateChannel(channel_name, role, pharmacyId)) {
    const signed = signPrivateChannel(socket_id, channel_name);
    if (signed) {
      return NextResponse.json(signed);
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!baseUrl) {
    return NextResponse.json(
      { message: "API base URL is not configured." },
      { status: 500 },
    );
  }

  try {
    const { response, text } = await authorizeViaLaravel(
      baseUrl,
      token,
      role || "",
      socket_id,
      channel_name,
    );

    if (!text.trim()) {
      return NextResponse.json(
        {
          message:
            "Broadcasting auth returned an empty response. Add PUSHER_APP_SECRET to .env or fix Laravel channels.php.",
        },
        { status: response.ok ? 502 : response.status },
      );
    }

    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      return new NextResponse(text, {
        status: response.status,
        headers: {
          "Content-Type":
            response.headers.get("Content-Type") ?? "application/json",
        },
      });
    }

    // Laravel denied but we can still sign chat channels locally
    if (
      response.status === 403 &&
      canAccessPrivateChannel(channel_name, role, pharmacyId)
    ) {
      const signed = signPrivateChannel(socket_id, channel_name);
      if (signed) {
        return NextResponse.json(signed);
      }
    }

    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { message: "Failed to reach broadcasting auth service." },
      { status: 502 },
    );
  }
}
