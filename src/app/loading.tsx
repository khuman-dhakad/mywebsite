export default function Loading() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col animate-pulse">
      {/* Header skeleton */}
      <header className="h-[60px] md:h-[72px] border-b border-stone-200 dark:border-stone-800 bg-white/60 dark:bg-stone-900/60 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-stone-200 dark:bg-stone-800" />
          <div className="h-5 w-40 rounded bg-stone-200 dark:bg-stone-800" />
        </div>
        <div className="hidden md:flex items-center gap-6">
          <div className="h-4 w-16 rounded bg-stone-200 dark:bg-stone-800" />
          <div className="h-4 w-20 rounded bg-stone-200 dark:bg-stone-800" />
          <div className="h-4 w-16 rounded bg-stone-200 dark:bg-stone-800" />
          <div className="h-9 w-28 rounded-lg bg-stone-200 dark:bg-stone-800" />
        </div>
      </header>

      {/* Hero skeleton */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="h-6 w-36 rounded-full bg-stone-200 dark:bg-stone-800" />
            <div className="h-10 sm:h-12 w-3/4 rounded-xl bg-stone-200 dark:bg-stone-800" />
            <div className="h-5 w-1/2 rounded bg-stone-200 dark:bg-stone-800" />
            <div className="h-20 w-full rounded-xl bg-stone-200 dark:bg-stone-800" />
            <div className="flex gap-4 pt-4">
              <div className="h-12 w-44 rounded-xl bg-stone-200 dark:bg-stone-800" />
              <div className="h-12 w-40 rounded-xl bg-stone-200 dark:bg-stone-800" />
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="aspect-[4/3] rounded-2xl bg-stone-200 dark:bg-stone-800" />
          </div>
        </div>
      </section>
    </div>
  );
}
