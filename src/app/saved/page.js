"use client";
import Link from "next/link";
import GameCard from "@/components/GameCard";
import Header from "@/components/Header";
import { useAuth } from "@/components/AuthProvider";
import { useLists } from "@/lib/lists";

export default function Saved() {
  const { user, loading, signIn } = useAuth();
  const { saved, hidden, unsaveGame } = useLists(user);

  return (
    <main className="mx-auto max-w-6xl px-5 py-6 sm:px-8">
      <Header savedCount={saved.length} hiddenCount={hidden.length} />
      <h1 className="text-4xl font-extrabold tracking-tight">My list</h1>

      {loading ? (
        <p className="mt-6 text-muted">Loading...</p>
      ) : !user ? (
        <div className="mt-6">
          <p className="mb-4 text-muted">Sign in to see the games you saved.</p>
          <button
            onClick={signIn}
            className="rounded-full bg-cobalt px-6 py-2.5 font-semibold text-white hover:bg-cobalt-dark"
          >
            Sign in with Google
          </button>
        </div>
      ) : saved.length === 0 ? (
        <p className="mt-6 text-muted">
          Nothing saved yet.{" "}
          <Link href="/" className="text-cobalt underline underline-offset-4">
            Find some games
          </Link>{" "}
          and press Save.
        </p>
      ) : (
        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((g, i) => (
            <GameCard
              key={g.id}
              index={i}
              game={g}
              saved
              onToggleSave={() => unsaveGame(g.id)}
            />
          ))}
        </section>
      )}
    </main>
  );
}