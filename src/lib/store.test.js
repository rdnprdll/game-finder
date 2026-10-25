import { describe, it, expect } from "vitest";
import { limit, getCached, setCached } from "./store";

describe("store (memory fallback when Redis is not configured)", () => {
  it("rate limits", async () => {
    const opts = { limit: 2, windowMs: 60_000 };
    expect((await limit("store-a", opts)).ok).toBe(true);
    expect((await limit("store-a", opts)).ok).toBe(true);
    expect((await limit("store-a", opts)).ok).toBe(false);
  });

  it("caches values", async () => {
    await setCached("store-key", { a: 1 }, 1000);
    expect(await getCached("store-key")).toEqual({ a: 1 });
  });

  it("returns null for a missing key", async () => {
    expect(await getCached("store-missing")).toBeNull();
  });
});