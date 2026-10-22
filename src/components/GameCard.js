export default function GameCard({ game }) {
  return (
    <div className="rounded-xl overflow-hidden bg-zinc-900 text-white shadow">
      {game.image ? (
        <img src={game.image} alt={game.name} className="h-40 w-full object-cover" />
      ) : (
        <div className="h-40 w-full bg-zinc-800 flex items-center justify-center text-zinc-500">
          No image
        </div>
      )}
      <div className="p-4">
        <h3 className="font-bold text-lg">{game.name}</h3>
        <p className="text-sm text-zinc-400">
          {game.released || "TBA"} · ⭐ {game.rating || "N/A"}
        </p>
        <p className="text-sm mt-2">{game.genres.join(", ")}</p>
        <p className="text-xs text-zinc-500 mt-1">
          {game.platforms.slice(0, 4).join(", ")}
        </p>
        {game.reason && (
          <p className="text-sm mt-3 text-indigo-300">{game.reason}</p>
        )}
      </div>
    </div>
  );
}