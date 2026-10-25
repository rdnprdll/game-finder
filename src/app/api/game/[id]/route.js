import { NextResponse } from "next/server";
import { limit, getCached, setCached } from "@/lib/store";
import { safeUrl, plainText } from "@/lib/safe";

export const maxDuration = 30;

const DAY = 24 * 60 * 60 * 1000;

async function rawg(path) {
  const url = new URL(`https://api.rawg.io/api${path}`);
  url.searchParams.set("key", process.env.RAWG_API_KEY);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`RAWG ${res.status}`);
  return res.json();
}

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    if (!/^\d{1,9}$/.test(id)) {
      return NextResponse.json({ error: "Bad game id." }, { status: 400 });
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rl = await limit(`detail:${ip}`, { limit: 30, windowMs: 60_000 });
    if (!rl.ok) {
      return NextResponse.json(
        { error: `Slow down a bit. Try again in ${rl.retryAfter} seconds.` },
        { status: 429 }
      );
    }

    const key = `gf:d:${id}`;
    const cached = await getCached(key);
    if (cached) return NextResponse.json(cached);

    // screenshots and stores are nice to have, so a failure there is fine
    const [detail, shots, stores] = await Promise.all([
      rawg(`/games/${id}`),
      rawg(`/games/${id}/screenshots`).catch(() => null),
      rawg(`/games/${id}/stores`).catch(() => null),
    ]);

    const storeNames = new Map(
      (detail.stores || []).map((s) => [s.store?.id, s.store?.name])
    );
    const storeLinks = (stores?.results || [])
      .map((s) => ({ name: storeNames.get(s.store_id) || "Store", url: safeUrl(s.url) }))
      .filter((s) => s.url)
      .slice(0, 6);

    const pcPlatform = (detail.platforms || []).find((p) => p.platform?.slug === "pc");
    const req = pcPlatform?.requirements;
    const pc =
      req && (req.minimum || req.recommended)
        ? {
            minimum: plainText(req.minimum).slice(0, 800),
            recommended: plainText(req.recommended).slice(0, 800),
          }
        : null;

    const data = {
      id: detail.id,
      slug: detail.slug,
      name: detail.name,
      released: detail.released || null,
      rating: detail.rating || 0,
      metacritic: detail.metacritic || null,
      playtime: detail.playtime || 0,
      esrb: detail.esrb_rating?.name || null,
      description: plainText(detail.description_raw || detail.description).slice(0, 1200),
      developers: (detail.developers || []).map((d) => d.name).slice(0, 3),
      genres: (detail.genres || []).map((g) => g.name),
      website: safeUrl(detail.website),
      screenshots: (shots?.results || []).map((s) => safeUrl(s.image)).filter(Boolean).slice(0, 4),
      stores: storeLinks,
      pc,
    };

    await setCached(key, data, DAY);
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not load game details." }, { status: 500 });
  }
}