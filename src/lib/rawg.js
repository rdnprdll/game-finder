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

export async function fetchGames({ genres, platforms, keywords, minMetacritic }) {
  const url = new URL("https://api.rawg.io/api/games");
  url.searchParams.set("key", process.env.RAWG_API_KEY);
  url.searchParams.set("page_size", "30");
  url.searchParams.set("ordering", "-rating");
  if (genres.length) url.searchParams.set("genres", genres.join(","));
  if (platforms.length) url.searchParams.set("platforms", platforms.join(","));
  if (keywords) url.searchParams.set("search", keywords);
  if (minMetacritic > 0) url.searchParams.set("metacritic", `${minMetacritic},100`);

  const res = await fetch(url);
  if (!res.ok) throw new Error("RAWG request failed");
  const data = await res.json();

  return data.results
    .filter((g) => (g.ratings_count || 0) >= 30)
    .map((g) => ({
      id: g.id,
      name: g.name,
      image: g.background_image,
      released: g.released,
      rating: g.rating,
      genres: (g.genres || []).map((x) => x.name),
      platforms: (g.platforms || []).map((p) => p.platform.name),
    }));
}