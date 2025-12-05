import { NextResponse } from "next/server";

const BACKEND_GRID_ENDPOINT = process.env.GRID_API_URL?.trim() || "http://localhost:3001/grid";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ macroSlug: string }> | { macroSlug: string } },
) {
  const { macroSlug } = await params;

  try {
    const upstreamUrl = `${BACKEND_GRID_ENDPOINT.replace(/\/$/, "")}/macros/${macroSlug}/clusters`;
    const res = await fetch(upstreamUrl, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (res.status === 404) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream grid clusters request failed with status ${res.status}` },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Grid clusters proxy error", error);
    return NextResponse.json({ error: "Grid clusters proxy request failed" }, { status: 502 });
  }
}
