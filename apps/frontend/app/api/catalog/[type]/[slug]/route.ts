import { NextResponse } from "next/server";

const BACKEND_CATALOG_ENDPOINT = process.env.CATALOG_API_URL?.trim() || "http://localhost:3001/catalog";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ type: string; slug: string }> | { type: string; slug: string } }
) {
  const { type, slug } = await params;

  try {
    const upstreamUrl = `${BACKEND_CATALOG_ENDPOINT.replace(/\/$/, "")}/${type}/${slug}`;
    const res = await fetch(upstreamUrl, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (res.status === 404) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream catalog request failed with status ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Catalog proxy (by slug) error", error);
    return NextResponse.json({ error: "Catalog proxy request failed" }, { status: 502 });
  }
}
