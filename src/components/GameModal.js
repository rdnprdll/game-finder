"use client";
import { useEffect, useState } from "react";

export default function GameModal({ gameId, onClose }) {
  const [state, setState] = useState({ status: "loading", data: null, error: "" });

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/game/${gameId}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Could not load details.");
        return data;
      })
      .then((data) => {
        if (!cancelled) setState({ status: "done", data, error: "" });
      })
      .catch((err) => {
        if (!cancelled) setState({ status: "error", data: null, error: err.message });
      });
    return () => {
      cancelled = true;
    };
  }, [gameId]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const { status, data, error } = state;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Game details"
        className="my-8 w-full max-w-2xl rounded-xl bg-zinc-900 p-5 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-2xl font-bold">{data ? data.name : "Loading..."}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg bg-zinc-800 px-3 py-1 hover:bg-zinc-700"
          >
            ✕
          </button>
        </div>

        {status === "loading" && <p className="mt-4 text-zinc-400">Loading details...</p>}
        {status === "error" && <p className="mt-4 text-red-400">{error}</p>}

        {status === "done" && (
          <div className="mt-3 space-y-4">
            <p className="text-sm text-zinc-400">
              {[
                data.released,
                data.rating ? `⭐ ${data.rating}` : null,
                data.metacritic ? `Metacritic ${data.metacritic}` : null,
                data.playtime ? `about ${data.playtime} hours` : null,
                data.esrb,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>

            {data.genres.length > 0 && <p className="text-sm">{data.genres.join(", ")}</p>}

            {data.screenshots.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {data.screenshots.map((src) => (
                  <img
                    key={src}
                    src={src}
                    alt={`Screenshot of ${data.name}`}
                    className="rounded-lg object-cover"
                  />
                ))}
              </div>
            )}

            {data.description && (
              <p className="text-sm leading-relaxed text-zinc-200">{data.description}</p>
            )}

            {data.developers.length > 0 && (
              <p className="text-sm text-zinc-400">By {data.developers.join(", ")}</p>
            )}

            {data.pc && (
              <details className="rounded-lg bg-zinc-800 p-3 text-sm">
                <summary className="cursor-pointer font-semibold">
                  PC requirements (from RAWG, may be incomplete)
                </summary>
                {data.pc.minimum && (
                  <p className="mt-2 text-zinc-300">{data.pc.minimum}</p>
                )}
                {data.pc.recommended && (
                  <p className="mt-2 text-zinc-300">{data.pc.recommended}</p>
                )}
              </details>
            )}

            {(data.stores.length > 0 || data.website) && (
              <div className="flex flex-wrap gap-2">
                {data.stores.map((s) => (
                  <a
                    key={s.url}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-indigo-600 px-3 py-1 text-sm hover:bg-indigo-500"
                  >
                    {s.name}
                  </a>
                ))}
                {data.website && (
                  <a
                    href={data.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-zinc-800 px-3 py-1 text-sm hover:bg-zinc-700"
                  >
                    Official site
                  </a>
                )}
              </div>
            )}

            <p className="text-xs text-zinc-500">
              Data from{" "}
              <a
                href={`https://rawg.io/games/${data.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                RAWG
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}