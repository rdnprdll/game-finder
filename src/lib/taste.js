// Tags that almost every game has. They say nothing about taste.
const GENERIC_TAGS = new Set([
  "singleplayer", "multiplayer", "steam-achievements", "full-controller-support",
  "steam-trading-cards", "steam-cloud", "steam-leaderboards", "steam-workshop",
  "cooperative", "co-op", "online-co-op", "local-co-op", "partial-controller-support",
  "controller-support", "exclusive", "achievements", "includes-level-editor",
  "captions-available", "stats", "commentary-available", "cross-platform-multiplayer",
  "remote-play-on-tv", "valve-anti-cheat-enabled",
]);

// What the liked games have in common
export function tasteFrom(likedGames) {
  const counts = new Map();
  const genreNames = new Set();

  for (const game of likedGames) {
    (game.genres || []).forEach((g) => genreNames.add(g));
    for (const t of game.tags || []) {
      if (GENERIC_TAGS.has(t.slug)) continue;
      const entry = counts.get(t.slug) || {
        slug: t.slug,
        name: t.name,
        hits: 0,
        size: t.count || 1e9,
      };
      entry.hits += 1;
      counts.set(t.slug, entry);
    }
  }

  // most shared first, and among ties the more specific (smaller) tag first
  const sorted = [...counts.values()].sort(
    (a, b) => b.hits - a.hits || (a.size === b.size ? 0 : a.size < b.size ? -1 : 1)
  );

  return {
    top: sorted.slice(0, 3),
    tagSlugs: new Set(sorted.map((t) => t.slug)),
    genreNames,
  };
}

export function scoreCandidate(candidate, taste) {
  const sharedTags = (candidate.tags || []).filter((t) => taste.tagSlugs?.has(t.slug)).length;
  const sharedGenres = (candidate.genres || []).filter((g) => taste.genreNames?.has(g)).length;
  return sharedTags * 3 + sharedGenres + (candidate.rating || 0) / 5;
}

export function mergeUnique(lists) {
  const seen = new Map();
  for (const list of lists) {
    for (const game of list) {
      if (!seen.has(game.id)) seen.set(game.id, game);
    }
  }
  return [...seen.values()];
}

export function rankCandidates(candidates, taste, max = 30) {
  return [...candidates]
    .sort((a, b) => scoreCandidate(b, taste) - scoreCandidate(a, taste))
    .slice(0, max);
}