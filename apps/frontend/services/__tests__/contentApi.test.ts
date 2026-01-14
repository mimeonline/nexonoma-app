import { beforeAll, describe, expect, it, vi } from "vitest";

import { ApiError } from "@/services/apiUtils";
import { createContentApi } from "@/services/contentApi";

vi.stubGlobal("fetch", vi.fn());

describe("contentApi", () => {
  const lang = "en";
  const apiBase = "https://api.example.com";

  beforeAll(() => {
    process.env.NEXT_PUBLIC_API_URL = apiBase;
  });

  it("sorts tags in response unchanged (smoke fetch ok)", async () => {
    const mockData = {
      assetBlock: {
        id: "1",
        slug: "demo",
        type: "TOOL",
        name: "Demo",
        icon: null,
        tags: [],
        tagOrder: [],
        shortDescription: "s",
        longDescription: "l",
        organisationLevel: null,
        organizationalMaturity: null,
        impacts: null,
        decisionType: null,
        complexityLevel: null,
        valueStream: null,
        maturityLevel: null,
        cognitiveLoad: null,
      },
      structure: { paths: [] },
      relations: { items: [] },
    };

    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const api = createContentApi(lang);
    const result = await api.getContent("tool", "demo");

    expect(result).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith(`${apiBase}/content/tool/demo?lang=${lang}`, expect.any(Object));
  });

  it("throws ApiError on failure", async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ ok: false, status: 500, statusText: "Boom" });

    const api = createContentApi(lang);

    await expect(api.getContent("tool", "demo")).rejects.toBeInstanceOf(ApiError);
  });
});
