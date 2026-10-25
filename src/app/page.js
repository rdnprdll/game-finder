"use client";
import { useState } from "react";
import Link from "next/link";
import GameCard from "@/components/GameCard";
import GameCardSkeleton from "@/components/GameCardSkeleton";
import { useAuth } from "@/components/AuthProvider";
import { useLists } from "@/lib/lists";

const EXAMPLES = [
  "I liked Hades and Hollow Knight, something similar on PC",
  "cozy games I can play on Switch in short sessions",
  "highly rated story-driven RPGs",
];

export default function Home() {
  const { user, loading: authLoading, signIn, logOut } = useAuth();
  const { saved, hidden, savedIds, saveGame, unsaveGame, hideGame } = useLists(user);

  const [message, setMessage] = useState("");
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [light, setLight] = useState(false);

  async function search() {
    setLoading(true);
    setError("");
    setGames([]);

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, exclude: hidden, light }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Something went wrong.");
      else setGames(data.games);
    } catch {
      setError("Can't reach the server.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    search();
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
    <main className="min-h-screen bg-zinc-950 text-white p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Game Finder</h1>
        <div className="flex items-center gap-3 text-sm">
          {user && (
            <Link href="/saved" className="underline text-zinc-300">
              My list ({saved.length})
            </Link>
          )}
          {authLoading ? null : user ? (
            <>
              <span className="text-zinc-400 hidden sm:inline">{user.displayName}</span>
              <button onClick={logOut} className="rounded-lg bg-zinc-800 px-3 py-1 hover:bg-zinc-700">
                Sign out
              </button>
            </>
          ) : (
            <button onClick={signIn} className="rounded-lg bg-zinc-800 px-3 py-1 hover:bg-zinc-700">
              Sign in with Google
            </button>
          )}
        </div>
      </div>

      <p className="text-zinc-400 mb-6">
        Tell me what you like, what you play on, and how much time you have.
      </p>

      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={500}
          rows={3}
          placeholder="e.g. I liked Hades and Hollow Knight, I play on PC"
          className="w-full rounded-lg bg-zinc-900 px-4 py-3 outline-none"
        />

        <label className="flex items-center gap-2 mt-2 text-sm text-zinc-300 cursor-pointer">
          <input
            type="checkbox"
            checked={light}
            onChange={(e) => setLight(e.target.checked)}
          />
          Lighter games for weak PCs (released 2020 or earlier)
        </label>

        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-zinc-500">{message.length}/500</span>
          <button
            disabled={loading || message.trim().length < 5}
            className="rounded-lg bg-indigo-600 px-5 py-2 font-semibold hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading ? "Thinking..." : "Recommend"}
          </button>
        </div>
      </form>

      <div className="flex flex-wrap gap-2 mb-6">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            onClick={() => setMessage(ex)}
            className="text-xs rounded-full bg-zinc-900 px-3 py-1 text-zinc-300 hover:bg-zinc-800"
          >
            {ex}
          </button>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-3 mb-4">
          <p className="text-red-400">{error}</p>
          <button
            onClick={search}
            disabled={loading}
            className="rounded-lg bg-zinc-800 px-3 py-1 text-sm hover:bg-zinc-700 disabled:opacity-50"
          >
            Try again
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && [0, 1, 2].map((i) => <GameCardSkeleton key={i} />)}
        {!loading &&
          games.map((g) => (
            <GameCard
              key={g.id}
              game={g}
              saved={savedIds.has(g.id)}
              onToggleSave={handleToggleSave}
              onHide={handleHide}
            />
          ))}
      </div>

      <p className="text-xs text-zinc-600 mt-10">
        Game data from RAWG. <Link href="/search" className="underline">Search by title</Link>
      </p>
    </main>
  );
}