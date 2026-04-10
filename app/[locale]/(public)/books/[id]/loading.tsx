import { Skeleton } from "@/components/ui/skeleton"

export default function BookDetailLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top bar skeleton */}
      <div className="flex h-14 items-center justify-between border-b px-4">
        <Skeleton className="h-6 w-32" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>

      {/* Book viewer skeleton */}
      <div className="flex flex-1 items-center justify-center p-4 md:p-8">
        <div className="flex w-full max-w-5xl gap-4">
          {/* Image panel */}
          <Skeleton className="hidden aspect-[4/3] w-1/2 rounded-xl md:block" />
          {/* Text panel */}
          <div className="flex w-full flex-col justify-center gap-4 rounded-xl border bg-white p-8 shadow-xl dark:bg-slate-800 md:w-1/2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-[90%]" />
            <Skeleton className="h-5 w-[80%]" />
            <Skeleton className="mt-2 h-5 w-[75%]" />
          </div>
        </div>
      </div>

      {/* Bottom controls skeleton */}
      <div className="flex h-16 items-center justify-center gap-4 border-t px-4">
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
    </div>
  )
}
