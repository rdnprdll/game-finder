"use client";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export default function Header({ savedCount, hiddenCount }) {
  const { user, loading, signIn, logOut } = useAuth();

  const count = (n) => (typeof n === "number" ? ` (${n})` : "");

  return (
    <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 pb-8">
      <Link href="/" className="text-2xl font-extrabold tracking-tight">
        Game Finder
      </Link>

      <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium">
        <Link href="/search" className="underline-offset-4 hover:underline">
          Search by title
        </Link>
        {user && (
          <>
            <Link href="/saved" className="underline-offset-4 hover:underline">
              My list{count(savedCount)}
            </Link>
            <Link href="/hidden" className="text-muted underline-offset-4 hover:underline">
              Hidden{count(hiddenCount)}
            </Link>
          </>
        )}
        {loading ? null : user ? (
          <>
            <span className="hidden text-muted sm:inline">{user.displayName}</span>
            <button
              onClick={logOut}
              className="rounded-full border border-ink/30 px-4 py-1.5 hover:bg-ink hover:text-paper"
            >
              Sign out
            </button>
          </>
        ) : (
          <button
            onClick={signIn}
            className="rounded-full bg-ink px-4 py-1.5 text-paper hover:bg-cobalt"
          >
            Sign in with Google
          </button>
        )}
      </nav>
    </header>
  );
}