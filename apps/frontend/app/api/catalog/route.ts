import { serverLogger } from "@/lib/server-logger";
import { NextResponse } from "next/server";

const BACKEND_CATALOG_ENDPOINT =
  process.env.CATALOG_API_URL?.trim() || "http://localhost:3001/catalog";

export async function GET() {
  try {
    const res = await fetch(BACKEND_CATALOG_ENDPOINT, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream catalog request failed with status ${res.status}` },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    serverLogger.error("Catalog proxy error", { error });
    return NextResponse.json({ error: "Catalog proxy request failed" }, { status: 502 });
  }
}
