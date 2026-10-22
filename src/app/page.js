"use client";
import { useState } from "react";
import GameCard from "@/components/GameCard";

const EXAMPLES = [
  "I liked Hades and Hollow Knight, something similar on PC",
  "cozy games I can play on Switch in short sessions",
  "highly rated story-driven RPGs",
];

export default function Home() {
  const [message, setMessage] = useState("");
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setGames([]);

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
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

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-1">Game Finder</h1>
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

      {error && <p className="text-red-400 mb-4">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((g) => (
          <GameCard key={g.id} game={g} />
        ))}
      </div>

      <p className="text-xs text-zinc-600 mt-10">
        Game data from RAWG. <a href="/search" className="underline">Search by title</a>
      </p>
    </main>
  );
}