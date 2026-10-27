import { Skeleton } from "@/components/ui/skeleton";

/** Route-level fallback. The demo data resolves instantly, so this is a
 *  brief paint-safety skeleton rather than a network loading state. */
export default function Loading() {
  return (
    <div className="flex h-full flex-col" aria-busy="true" aria-label="Loading workspace">
      <div className="flex h-14 shrink-0 items-center gap-3 border-b border-line/70 px-4">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="ml-auto h-7 w-20" />
      </div>
      <div className="mx-auto w-full max-w-3xl flex-1 space-y-5 px-5 py-8">
        <Skeleton className="h-2.5 w-24" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-11/12" />
        <div className="pt-6">
          <Skeleton className="h-28 w-full rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 gap-2 pt-2 sm:grid-cols-2">
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
