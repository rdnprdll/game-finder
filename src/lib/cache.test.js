import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { cacheGet, cacheSet } from "./cache";

describe("cache", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("returns a stored value", () => {
    cacheSet("hello", { x: 1 }, 1000);
    expect(cacheGet("hello")).toEqual({ x: 1 });
  });

  it("returns null for a missing key", () => {
    expect(cacheGet("does-not-exist")).toBeNull();
  });

  it("expires after the time is up", () => {
    cacheSet("short", "value", 1000);
    vi.advanceTimersByTime(1001);
    expect(cacheGet("short")).toBeNull();
  });

  it("drops the oldest entries when it gets full", () => {
    for (let i = 0; i <= 200; i++) cacheSet(`evict-${i}`, i, 60_000);
    expect(cacheGet("evict-0")).toBeNull();
    expect(cacheGet("evict-200")).toBe(200);
  });
});