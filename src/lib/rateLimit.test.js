import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { rateLimit } from "./rateLimit";

describe("rateLimit", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("allows requests up to the limit, then blocks", () => {
    const opts = { limit: 3, windowMs: 60_000 };
    expect(rateLimit("user-a", opts).ok).toBe(true);
    expect(rateLimit("user-a", opts).ok).toBe(true);
    expect(rateLimit("user-a", opts).ok).toBe(true);

    const blocked = rateLimit("user-a", opts);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfter).toBeGreaterThan(0);
  });

  it("tracks each key separately", () => {
    const opts = { limit: 1, windowMs: 60_000 };
    expect(rateLimit("user-b", opts).ok).toBe(true);
    expect(rateLimit("user-b", opts).ok).toBe(false);
    expect(rateLimit("user-c", opts).ok).toBe(true);
  });

  it("allows requests again after the window passes", () => {
    const opts = { limit: 1, windowMs: 60_000 };
    expect(rateLimit("user-d", opts).ok).toBe(true);
    expect(rateLimit("user-d", opts).ok).toBe(false);

    vi.advanceTimersByTime(60_001);
    expect(rateLimit("user-d", opts).ok).toBe(true);
  });
});