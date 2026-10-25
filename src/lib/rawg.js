export const GENRES = [
  "action", "indie", "adventure", "role-playing-games-rpg", "strategy",
  "shooter", "casual", "simulation", "puzzle", "arcade", "platformer",
  "racing", "sports", "fighting", "family",
];

export const PLATFORMS = {
  pc: 4,
  ps5: 187,
  ps4: 18,
  xbox_series: 186,
  xbox_one: 1,
  switch: 7,
};

function shape(g) {
  return {
    id: g.id,
    name: g.name,
    image: g.background_image,
    released: g.released,
    rating: g.rating,
    metacritic: g.metacritic || null,
    genres: (g.genres || []).map((x) => x.name),
    platforms: (g.platforms || []).map((p) => p.platform.name),
    // English tags only (RAWG has tags in many languages)
    tags: (g.tags || [])
      .filter((t) => t.language === "eng")
      .slice(0, 10)
      .map((t) => ({ slug: t.slug, name: t.name, count: t.games_count || 0 })),
  };
}

export async function fetchGames({
  genres = [],
  platforms = [],
  keywords = "",
  minMetacritic = 0,
  dates = "",
  tags = [],
  pageSize = 30,
}) {
  const url = new URL("https://api.rawg.io/api/games");
  url.searchParams.set("key", process.env.RAWG_API_KEY);
  url.searchParams.set("page_size", String(pageSize));
  url.searchParams.set("ordering", "-rating");
  if (genres.length) url.searchParams.set("genres", genres.join(","));
  if (platforms.length) url.searchParams.set("platforms", platforms.join(","));
  if (tags.length) url.searchParams.set("tags", tags.join(","));
  if (keywords) url.searchParams.set("search", keywords);
  if (minMetacritic > 0) url.searchParams.set("metacritic", `${minMetacritic},100`);
  if (dates) url.searchParams.set("dates", dates);

  const res = await fetch(url);
  if (!res.ok) throw new Error("RAWG request failed");
  const data = await res.json();

  return data.results.filter((g) => (g.ratings_count || 0) >= 30).map(shape);
}

// Find one game by name (the most-rated match is usually the main game)
export async function lookupGame(name) {
  const url = new URL("https://api.rawg.io/api/games");
  url.searchParams.set("key", process.env.RAWG_API_KEY);
  url.searchParams.set("search", name);
  url.searchParams.set("page_size", "3");

  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();

  const best = [...(data.results || [])].sort(
    (a, b) => (b.ratings_count || 0) - (a.ratings_count || 0)
  )[0];
  return best ? shape(best) : null;
}