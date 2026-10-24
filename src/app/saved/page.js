"use client";
import Link from "next/link";
import GameCard from "@/components/GameCard";
import { useAuth } from "@/components/AuthProvider";
import { useLists } from "@/lib/lists";

export default function Saved() {
  const { user, loading, signIn } = useAuth();
  const { saved, unsaveGame } = useLists(user);

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My list</h1>
        <Link href="/" className="underline text-sm text-zinc-300">Back to recommendations</Link>
      </div>

      {loading ? (
        <p className="text-zinc-400">Loading...</p>
      ) : !user ? (
        <div>
          <p className="text-zinc-400 mb-3">Sign in to see your saved games.</p>
          <button onClick={signIn} className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold">
            Sign in with Google
          </button>
        </div>
      ) : saved.length === 0 ? (
        <p className="text-zinc-400">Nothing saved yet. Go get some recommendations!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {saved.map((g) => (
            <GameCard key={g.id} game={g} saved onToggleSave={() => unsaveGame(g.id)} />
          ))}
        </div>
      )}
    </main>
  );
}