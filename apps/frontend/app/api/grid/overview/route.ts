import { getApiBase } from "@/services/apiUtils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") ?? "de";
  const baseUrl = getApiBase();
  const url = `${baseUrl}/grid/overview?lang=${lang}`;

  const res = await fetch(url, { cache: "no-store" });
  const body = await res.text();

  return new Response(body, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("content-type") ?? "application/json",
    },
  });
}
