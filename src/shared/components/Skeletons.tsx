export function PostListSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="grid gap-4 md:grid-cols-[240px,1fr]">
          <div className="card-thumb rounded-xl bg-neutral-100" />
          <div className="space-y-3">
            <div className="h-4 w-2/3 rounded-full bg-neutral-100" />
            <div className="flex gap-2">
              <div className="h-5 w-16 rounded-full bg-neutral-100" />
              <div className="h-5 w-20 rounded-full bg-neutral-100" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full rounded-full bg-neutral-100" />
              <div className="h-3 w-4/5 rounded-full bg-neutral-100" />
            </div>
            <div className="h-3 w-1/2 rounded-full bg-neutral-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-6 w-2/3 rounded-full bg-neutral-100" />
      <div className="h-4 w-1/3 rounded-full bg-neutral-100" />
      <div className="detail-cover rounded-xl bg-neutral-100" />
      <div className="space-y-2">
        <div className="h-3 w-full rounded-full bg-neutral-100" />
        <div className="h-3 w-5/6 rounded-full bg-neutral-100" />
        <div className="h-3 w-4/6 rounded-full bg-neutral-100" />
      </div>
    </div>
  );
}

