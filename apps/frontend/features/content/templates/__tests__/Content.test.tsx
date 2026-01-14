import { describe, expect, it } from "vitest";

import type { ContentTag } from "@/types/content";
import { sortTags } from "../Content";

describe("ContentTemplate helpers", () => {
  const tags: ContentTag[] = [
    { slug: "b", label: "B" },
    { slug: "a", label: "A" },
    { slug: "c", label: "C" },
  ];

  it("sorts tags by provided tagOrder first", () => {
    const ordered = sortTags(tags, ["c", "a"]);
    expect(ordered.map((t) => t.slug)).toEqual(["c", "a", "b"]);
  });

  it("falls back to alphabetical when tagOrder is empty", () => {
    const ordered = sortTags(tags, []);
    expect(ordered.map((t) => t.slug)).toEqual(["a", "b", "c"]);
  });
});
