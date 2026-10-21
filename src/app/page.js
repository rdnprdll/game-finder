"use client";
import { useState } from "react";
import GameCard from "@/components/GameCard";

export default function Home() {
  const [query, setQuery] = useState("");
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const res = await fetch(`/api/games?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Search failed.");
        setGames([]);
      } else {
        setGames(data.games);
      }
    } catch {
      setError("Can't reach the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-1">Game Finder</h1>
      <p className="text-zinc-400 mb-6">Search any game to get started.</p>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Hollow Knight"
          className="flex-1 rounded-lg bg-zinc-900 px-4 py-2 outline-none"
        />
        <button className="rounded-lg bg-indigo-600 px-5 py-2 font-semibold hover:bg-indigo-500">
          Search
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-400">{error}</p>}
      {!loading && !error && searched && games.length === 0 && <p>No games found.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((g) => (
          <GameCard key={g.id} game={g} />
        ))}
      </div>

      <p className="text-xs text-zinc-600 mt-10">Game data from RAWG.</p>
    </main>
  );
}