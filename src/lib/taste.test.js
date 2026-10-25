import { describe, it, expect } from "vitest";
import { tasteFrom, scoreCandidate, mergeUnique, rankCandidates } from "./taste";

const hades = {
  genres: ["Action", "Indie"],
  tags: [
    { slug: "roguelike", name: "Roguelike", count: 5000 },
    { slug: "singleplayer", name: "Singleplayer", count: 200000 },
    { slug: "atmospheric", name: "Atmospheric", count: 30000 },
  ],
};
const knight = {
  genres: ["Action", "Platformer"],
  tags: [
    { slug: "metroidvania", name: "Metroidvania", count: 3000 },
    { slug: "atmospheric", name: "Atmospheric", count: 30000 },
    { slug: "singleplayer", name: "Singleplayer", count: 200000 },
  ],
};

describe("tasteFrom", () => {
  it("ignores generic tags", () => {
    const taste = tasteFrom([hades, knight]);
    expect(taste.tagSlugs.has("singleplayer")).toBe(false);
  });

  it("puts shared tags first", () => {
    const taste = tasteFrom([hades, knight]);
    expect(taste.top[0].slug).toBe("atmospheric");
  });

  it("prefers the more specific tag when counts tie", () => {
    const taste = tasteFrom([hades, knight]);
    expect(taste.top[1].slug).toBe("metroidvania"); // smaller than roguelike? 3000 < 5000
  });

  it("works with no liked games", () => {
    const taste = tasteFrom([]);
    expect(taste.top).toEqual([]);
  });
});

describe("scoring and ranking", () => {
  const taste = tasteFrom([hades, knight]);
  const match = { id: 1, genres: ["Action"], tags: [{ slug: "roguelike" }, { slug: "atmospheric" }], rating: 4 };
  const noMatch = { id: 2, genres: ["Sports"], tags: [{ slug: "football" }], rating: 4.9 };

  it("scores games that share tags higher, even with a lower rating", () => {
    expect(scoreCandidate(match, taste)).toBeGreaterThan(scoreCandidate(noMatch, taste));
  });

  it("ranks matches first and respects the limit", () => {
    const ranked = rankCandidates([noMatch, match], taste, 1);
    expect(ranked).toHaveLength(1);
    expect(ranked[0].id).toBe(1);
  });
});

describe("mergeUnique", () => {
  it("removes duplicate games by id", () => {
    const merged = mergeUnique([[{ id: 1 }, { id: 2 }], [{ id: 2 }, { id: 3 }]]);
    expect(merged.map((g) => g.id)).toEqual([1, 2, 3]);
  });
});