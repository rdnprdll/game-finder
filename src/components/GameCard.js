export default function GameCard({ game, saved, onToggleSave, onHide }) {
  return (
    <div className="rounded-xl overflow-hidden bg-zinc-900 text-white shadow flex flex-col">
      {game.image ? (
        <img src={game.image} alt={game.name} className="h-40 w-full object-cover" />
      ) : (
        <div className="h-40 w-full bg-zinc-800 flex items-center justify-center text-zinc-500">
          No image
        </div>
      )}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-lg">{game.name}</h3>
        <p className="text-sm text-zinc-400">
          {game.released || "TBA"} · ⭐ {game.rating || "N/A"}
        </p>
        <p className="text-sm mt-2">{game.genres.join(", ")}</p>
        <p className="text-xs text-zinc-500 mt-1">
          {game.platforms.slice(0, 4).join(", ")}
        </p>

        {game.reason && (
          <div className="mt-3">
            <p className="text-xs font-semibold text-zinc-400">Why this game?</p>
            <p className="text-sm text-indigo-300">{game.reason}</p>
          </div>
        )}

        {(onToggleSave || onHide) && (
          <div className="flex gap-2 mt-auto pt-4">
            {onToggleSave && (
              <button
                onClick={() => onToggleSave(game)}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold ${
                  saved ? "bg-indigo-600" : "bg-zinc-800 hover:bg-zinc-700"
                }`}
              >
                {saved ? "★ Saved" : "☆ Save"}
              </button>
            )}
            {onHide && (
              <button
                onClick={() => onHide(game)}
                className="flex-1 rounded-lg bg-zinc-800 px-3 py-2 text-sm hover:bg-zinc-700"
              >
                Not interested
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}