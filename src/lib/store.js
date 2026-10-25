import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { rateLimit as memoryLimit } from "./rateLimit";
import { cacheGet as memoryGet, cacheSet as memorySet } from "./cache";

const hasRedis = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);
const redis = hasRedis ? Redis.fromEnv() : null;
const limiters = new Map();

export async function limit(key, { limit: max, windowMs }) {
  if (!redis) return memoryLimit(key, { limit: max, windowMs });

  try {
    const id = `${max}:${windowMs}`;
    if (!limiters.has(id)) {
      limiters.set(
        id,
        new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(max, `${Math.round(windowMs / 1000)} s`),
          prefix: `gf:rl:${id}`,
        })
      );
    }
    const { success, reset } = await limiters.get(id).limit(key);
    if (success) return { ok: true };
    return { ok: false, retryAfter: Math.max(1, Math.ceil((reset - Date.now()) / 1000)) };
  } catch (err) {
    console.error("[store] Redis limit failed, using memory:", err.message);
    return memoryLimit(key, { limit: max, windowMs });
  }
}

export async function getCached(key) {
  if (!redis) return memoryGet(key);
  try {
    return (await redis.get(key)) ?? null;
  } catch (err) {
    console.error("[store] Redis get failed, using memory:", err.message);
    return memoryGet(key);
  }
}

export async function setCached(key, value, ttlMs) {
  if (!redis) return memorySet(key, value, ttlMs);
  try {
    await redis.set(key, value, { ex: Math.ceil(ttlMs / 1000) });
  } catch (err) {
    console.error("[store] Redis set failed, using memory:", err.message);
    memorySet(key, value, ttlMs);
  }
}