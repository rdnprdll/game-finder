"use client";
import Header from "@/components/Header";
import { useAuth } from "@/components/AuthProvider";
import { useLists } from "@/lib/lists";

export default function Hidden() {
  const { user, loading, signIn } = useAuth();
  const { saved, hiddenItems, unhideGame } = useLists(user);

  return (
    <main className="mx-auto max-w-3xl px-5 py-6 sm:px-8">
      <Header savedCount={saved.length} hiddenCount={hiddenItems.length} />
      <h1 className="text-4xl font-extrabold tracking-tight">Games you hid</h1>
      <p className="mt-2 text-muted">These will not show up in your recommendations.</p>

      {loading ? (
        <p className="mt-6 text-muted">Loading...</p>
      ) : !user ? (
        <div className="mt-6">
          <p className="mb-4 text-muted">Sign in to see the games you hid.</p>
          <button
            onClick={signIn}
            className="rounded-full bg-cobalt px-6 py-2.5 font-semibold text-white hover:bg-cobalt-dark"
          >
            Sign in with Google
          </button>
        </div>
      ) : hiddenItems.length === 0 ? (
        <p className="mt-6 text-muted">You have not hidden any games.</p>
      ) : (
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {hiddenItems.map((g) => (
            <li key={g.id} className="flex items-center justify-between gap-4 py-3">
              <span className="font-medium">{g.name}</span>
              <button
                onClick={() => unhideGame(g.id)}
                className="rounded-full border border-ink/30 px-4 py-1.5 text-sm font-medium hover:bg-ink hover:text-paper"
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