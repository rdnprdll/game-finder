"use client";
import { useState } from "react";
import GameCard from "@/components/GameCard";
import Header from "@/components/Header";

export default function Search() {
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
      setError("Can not reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-6 sm:px-8">
      <Header />
      <h1 className="text-4xl font-extrabold tracking-tight">Search by title</h1>

      <form onSubmit={handleSearch} className="mt-6 flex max-w-2xl gap-2">
        <label htmlFor="title" className="sr-only">
          Game title
        </label>
        <input
          id="title"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Hollow Knight"
          className="flex-1 rounded-full border border-line bg-surface px-5 py-2.5 text-lg"
        />
        <button
          disabled={loading}
          className="rounded-full bg-cobalt px-6 py-2.5 font-semibold text-white hover:bg-cobalt-dark disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-6 text-alert">
          {error}
        </p>
      )}
      {!loading && !error && searched && games.length === 0 && (
        <p className="mt-6 text-muted">No games found. Check the spelling or try a shorter title.</p>
      )}

      <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((g, i) => (
          <GameCard key={g.id} index={i} game={g} />
        ))}
      </section>
    </main>
  );
}