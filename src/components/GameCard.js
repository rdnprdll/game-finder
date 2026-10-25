// The spine color tells you which platform the game is on, like a game case
const SPINES = [
  { match: "PC", label: "PC", bg: "bg-ink" },
  { match: "PlayStation", label: "PlayStation", bg: "bg-[#0e5fc0]" },
  { match: "Nintendo Switch", label: "Switch", bg: "bg-[#d9202e]" },
  { match: "Xbox", label: "Xbox", bg: "bg-[#12792f]" },
];

function pickSpine(platforms = []) {
  for (const spine of SPINES) {
    if (platforms.some((p) => p.includes(spine.match))) return spine;
  }
  return { label: "Other", bg: "bg-muted" };
}

export default function GameCard({
  game,
  index = 0,
  saved,
  onToggleSave,
  onHide,
  onMoreLike,
  onDetails,
}) {
  const spine = pickSpine(game.platforms);
  const year = game.released ? game.released.slice(0, 4) : "Release date TBA";

  return (
    <article
      className="stock-in flex overflow-hidden rounded-md border border-line bg-surface"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className={`flex w-9 shrink-0 items-center justify-center text-white ${spine.bg}`}>
        <span className="rotate-180 text-sm font-bold [writing-mode:vertical-rl]">
          {spine.label}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        {game.image ? (
          <img src={game.image} alt={game.name} className="h-40 w-full object-cover" />
        ) : (
          <div className="flex h-40 w-full items-center justify-center bg-line text-muted">
            No image
          </div>
        )}

        <div className="flex flex-1 flex-col p-4">
          <h3 className="text-xl font-bold leading-tight">{game.name}</h3>

          <p className="mt-1 flex flex-wrap gap-x-3 text-sm text-muted">
            <span>{year}</span>
            {game.rating ? <span>Rated {game.rating} out of 5</span> : null}
          </p>

          {game.genres.length > 0 && <p className="mt-2 text-sm">{game.genres.join(", ")}</p>}
          <p className="mt-1 text-xs text-muted">{game.platforms.slice(0, 4).join(", ")}</p>

          {game.reason && (
            <figure className="mt-3 rounded-sm bg-note px-3 py-2">
              <figcaption className="sr-only">Why this game</figcaption>
              <p className="font-serif text-base italic leading-snug">{game.reason}</p>
            </figure>
          )}

          <div className="mt-auto pt-4">
            {(onToggleSave || onHide) && (
              <div className="flex items-center gap-4">
                {onToggleSave && (
                  <button
                    onClick={() => onToggleSave(game)}
                    aria-pressed={!!saved}
                    className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
                      saved
                        ? "bg-cobalt text-white"
                        : "border border-ink/30 hover:bg-ink hover:text-paper"
                    }`}
                  >
                    {saved ? "Saved" : "Save"}
                  </button>
                )}
                {onHide && (
                  <button
                    onClick={() => onHide(game)}
                    className="text-sm text-muted underline underline-offset-4 hover:text-ink"
                  >
                    Not interested
                  </button>
                )}
              </div>
            )}

            {(onDetails || onMoreLike) && (
              <div className="mt-3 flex gap-5 text-sm font-medium text-cobalt">
                {onDetails && (
                  <button onClick={() => onDetails(game)} className="underline underline-offset-4">
                    Details
                  </button>
                )}
                {onMoreLike && (
                  <button onClick={() => onMoreLike(game)} className="underline underline-offset-4">
                    More like this
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}