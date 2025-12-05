import { NextResponse } from "next/server";

const BACKEND_GRID_ENDPOINT = process.env.GRID_API_URL?.trim() || "http://localhost:3001/grid";

export async function GET() {
  try {
    const upstreamUrl = `${BACKEND_GRID_ENDPOINT.replace(/\/$/, "")}/macros`;
    const res = await fetch(upstreamUrl, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream grid macros request failed with status ${res.status}` },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Grid macros proxy error", error);
    return NextResponse.json({ error: "Grid macros proxy request failed" }, { status: 502 });
  }
}
