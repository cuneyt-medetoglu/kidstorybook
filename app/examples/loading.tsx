export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-background py-12 md:py-20">
        <div className="container relative px-4 md:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-muted mb-6 animate-pulse" />
            <div className="h-12 bg-muted rounded-lg w-3/4 mx-auto mb-4 animate-pulse" />
            <div className="h-6 bg-muted rounded-lg w-full mx-auto animate-pulse" />
          </div>
        </div>
      </section>

      {/* Filter chips skeleton */}
      <section className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
        <div className="container px-4 md:px-6 lg:px-8 py-4">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-9 w-20 bg-muted rounded-full animate-pulse" />
            ))}
          </div>
        </div>
      </section>

      {/* Cards skeleton */}
      <section className="container px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-card rounded-xl border p-4 md:p-5 animate-pulse">
              <div className="relative aspect-[3/4] rounded-lg bg-muted mb-4" />
              <div className="space-y-2 mb-4">
                <div className="h-5 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-3 bg-muted rounded w-1/3" />
                <div className="flex gap-2">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="w-10 h-10 md:w-14 md:h-14 rounded bg-muted" />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-11 bg-muted rounded-lg" />
                <div className="h-11 bg-muted rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
