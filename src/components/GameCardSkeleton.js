export default function GameCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-zinc-900 animate-pulse">
      <div className="h-40 w-full bg-zinc-800" />
      <div className="p-4 space-y-3">
        <div className="h-5 w-3/4 rounded bg-zinc-800" />
        <div className="h-3 w-1/2 rounded bg-zinc-800" />
        <div className="h-3 w-2/3 rounded bg-zinc-800" />
        <div className="h-3 w-full rounded bg-zinc-800" />
        <div className="h-3 w-5/6 rounded bg-zinc-800" />
      </div>
    </div>
  );
}