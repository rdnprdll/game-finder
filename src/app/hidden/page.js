"use client";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { useLists } from "@/lib/lists";

export default function Hidden() {
  const { user, loading, signIn } = useAuth();
  const { hiddenItems, unhideGame } = useLists(user);

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Not interested</h1>
        <Link href="/" className="underline text-sm text-zinc-300">
          Back to recommendations
        </Link>
      </div>

      {loading ? (
        <p className="text-zinc-400">Loading...</p>
      ) : !user ? (
        <div>
          <p className="text-zinc-400 mb-3">Sign in to see games you hid.</p>
          <button onClick={signIn} className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold">
            Sign in with Google
          </button>
        </div>
      ) : hiddenItems.length === 0 ? (
            <p className="text-zinc-400">You have not hidden any games.</p>
      ) : (
        <ul className="space-y-2">
          {hiddenItems.map((g) => (
            <li
              key={g.id}
              className="flex items-center justify-between rounded-lg bg-zinc-900 px-4 py-3"
            >
              <span>{g.name}</span>
              <button
                onClick={() => unhideGame(g.id)}
                className="rounded-lg bg-zinc-800 px-3 py-1 text-sm hover:bg-zinc-700"
              >
                Show again
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}