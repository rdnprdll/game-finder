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
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/60 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Game details"
        className="my-8 w-full max-w-2xl rounded-md border border-line bg-surface p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight">
            {data ? data.name : "Loading"}
          </h2>
          <button
            onClick={onClose}
            className="shrink-0 rounded-full border border-ink/30 px-4 py-1.5 text-sm font-medium hover:bg-ink hover:text-paper"
          >
            Close
          </button>
        </div>

        {status === "loading" && <p className="mt-4 text-muted">Loading details...</p>}
        {status === "error" && (
          <p role="alert" className="mt-4 text-alert">
            {error}
          </p>
        )}

        {status === "done" && (
          <div className="mt-4 space-y-5">
            <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
              {data.released && <span>{data.released}</span>}
              {data.rating ? <span>Rated {data.rating} out of 5</span> : null}
              {data.metacritic ? <span>Metacritic {data.metacritic}</span> : null}
              {data.playtime ? <span>About {data.playtime} hours to play</span> : null}
              {data.esrb && <span>{data.esrb}</span>}
            </p>

            {data.genres.length > 0 && <p className="text-sm">{data.genres.join(", ")}</p>}

            {data.screenshots.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {data.screenshots.map((src) => (
                  <img
                    key={src}
                    src={src}
                    alt={`Screenshot of ${data.name}`}
                    className="rounded-sm object-cover"
                  />
                ))}
              </div>
            )}

            {data.description && (
              <p className="max-w-prose font-serif text-lg leading-relaxed">{data.description}</p>
            )}

            {data.developers.length > 0 && (
              <p className="text-sm text-muted">Made by {data.developers.join(", ")}</p>
            )}

            {data.pc && (
              <details className="rounded-md border border-line p-3 text-sm">
                <summary className="cursor-pointer font-semibold">
                  PC requirements (from RAWG, may be incomplete)
                </summary>
                {data.pc.minimum && <p className="mt-2 text-muted">{data.pc.minimum}</p>}
                {data.pc.recommended && <p className="mt-2 text-muted">{data.pc.recommended}</p>}
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
                    className="rounded-full bg-cobalt px-4 py-1.5 text-sm font-semibold text-white hover:bg-cobalt-dark"
                  >
                    {s.name}
                  </a>
                ))}
                {data.website && (
                  <a
                    href={data.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-ink/30 px-4 py-1.5 text-sm font-medium hover:bg-ink hover:text-paper"
                  >
                    Official site
                  </a>
                )}
              </div>
            )}

            <p className="text-xs text-muted">
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