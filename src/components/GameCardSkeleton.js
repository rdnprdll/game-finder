export default function GameCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex overflow-hidden rounded-md border border-line bg-surface motion-safe:animate-pulse"
    >
      <div className="w-9 shrink-0 bg-line" />
      <div className="flex-1">
        <div className="h-40 bg-line/70" />
        <div className="space-y-3 p-4">
          <div className="h-5 w-3/4 rounded bg-line" />
          <div className="h-3 w-1/2 rounded bg-line" />
          <div className="h-3 w-2/3 rounded bg-line" />
          <div className="h-12 w-full rounded bg-line/70" />
        </div>
      </div>
    </div>
  );
}