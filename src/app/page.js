"use client";
import { useState } from "react";
import GameCard from "@/components/GameCard";
import GameCardSkeleton from "@/components/GameCardSkeleton";
import GameModal from "@/components/GameModal";
import Header from "@/components/Header";
import { useAuth } from "@/components/AuthProvider";
import { useLists } from "@/lib/lists";

const EXAMPLES = [
  "I liked Hades and Hollow Knight, something similar on PC",
  "cozy games I can play on Switch in short sessions",
  "highly rated story-driven RPGs",
  "chill na laro na pang-laptop lang, pang-30 minutes lang",
];

export default function Home() {
  const { user, signIn } = useAuth();
  const { saved, hidden, savedIds, saveGame, unsaveGame, hideGame } = useLists(user);

  const [message, setMessage] = useState("");
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [light, setLight] = useState(false);
  const [detailId, setDetailId] = useState(null);

  async function search(text) {
    const query = typeof text === "string" ? text : message;
    setLoading(true);
    setError("");
    setGames([]);

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          exclude: [...hidden, ...saved.map((g) => g.id)],
          taste: saved.slice(0, 12).map((g) => g.name),
          light,
        }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Something went wrong.");
      else setGames(data.games);
    } catch {
      setError("Can not reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    search();
  }

  function handleMoreLike(game) {
    const text = `games like ${game.name}`;
    setMessage(text);
    window.scrollTo({ top: 0, behavior: "smooth" });
    search(text);
  }

  function handleToggleSave(game) {
    if (!user) return signIn();
    if (savedIds.has(game.id)) unsaveGame(game.id);
    else saveGame(game);
  }

  function handleHide(game) {
    if (!user) return signIn();
    hideGame(game);
    setGames((prev) => prev.filter((g) => g.id !== game.id));
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-6 sm:px-8">
      <Header savedCount={saved.length} hiddenCount={hidden.length} />

      <section className="max-w-3xl">
        <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
          What do you feel like playing?
        </h1>
        <p className="mt-4 max-w-prose font-serif text-xl leading-relaxed text-muted">
          Say what you liked, what you play on, and how much time you have. You get five games
          back, each with a short note on why it fits.
        </p>

        <form onSubmit={handleSubmit} className="mt-8">
          <label htmlFor="request" className="sr-only">
            Describe what you want to play
          </label>
          <textarea
            id="request"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder="e.g. I liked Hades and Hollow Knight, I play on PC"
            className="w-full resize-y rounded-xl border border-line bg-surface px-5 py-4 font-serif text-xl leading-snug placeholder:text-muted/70"
          />

          <div className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={light}
                onChange={(e) => setLight(e.target.checked)}
                className="h-4 w-4 accent-cobalt"
              />
              Lighter games for weak PCs (released 2020 or earlier)
            </label>

            <div className="flex items-center gap-4">
              <span className="text-xs text-muted">{message.length}/500</span>
              <button
                disabled={loading || message.trim().length < 5}
                className="rounded-full bg-cobalt px-6 py-2.5 font-semibold text-white hover:bg-cobalt-dark disabled:opacity-50"
              >
                {loading ? "Looking..." : "Find games"}
              </button>
            </div>
          </div>
        </form>

        <div className="mt-5 flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => setMessage(ex)}
              className="rounded-full border border-line bg-surface px-3 py-1.5 text-sm hover:border-cobalt"
            >
              {ex}
            </button>
          ))}
        </div>
      </section>

      {error && (
        <div role="alert" className="mt-8 flex flex-wrap items-center gap-4">
          <p className="text-alert">{error}</p>
          <button
            onClick={() => search()}
            disabled={loading}
            className="rounded-full border border-ink/30 px-4 py-1.5 text-sm font-medium hover:bg-ink hover:text-paper disabled:opacity-50"
          >
            Try again
          </button>
        </div>
      )}

      <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {loading && [0, 1, 2].map((i) => <GameCardSkeleton key={i} />)}
        {!loading &&
          games.map((g, i) => (
            <GameCard
              key={g.id}
              index={i}
              game={g}
              saved={savedIds.has(g.id)}
              onToggleSave={handleToggleSave}
              onHide={handleHide}
              onMoreLike={handleMoreLike}
              onDetails={(game) => setDetailId(game.id)}
            />
          ))}
      </section>

      <footer className="mt-16 text-sm text-muted">
        Game data from{" "}
        <a href="https://rawg.io" target="_blank" rel="noopener noreferrer" className="underline">
          RAWG
        </a>
        .
      </footer>

      {detailId && (
        <GameModal key={detailId} gameId={detailId} onClose={() => setDetailId(null)} />
      )}
    </main>
  );
}