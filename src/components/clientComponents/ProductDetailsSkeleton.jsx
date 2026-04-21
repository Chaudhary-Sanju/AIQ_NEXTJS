export default function ProductDetailsSkeleton() {
    return (
        <section className="py-8 md:py-12">
            <div className="mx-auto max-w-7xl px-4 md:px-6">
                <div className="rounded-[28px] bg-[#f8f8fb] p-4 md:p-6 lg:p-8">
                    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">

                        {/* LEFT SIDE */}
                        <div className="grid gap-4 md:grid-cols-[96px_minmax(0,1fr)]">

                            {/* thumbnails */}
                            <div className="flex gap-3 md:flex-col">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-20 w-20 animate-pulse rounded-2xl bg-slate-200"
                                    />
                                ))}
                            </div>

                            {/* main image */}
                            <div className="aspect-square animate-pulse rounded-[28px] bg-slate-200" />
                        </div>

                        {/* RIGHT SIDE */}
                        <div className="flex flex-col gap-4">

                            <div className="h-8 w-3/4 animate-pulse rounded bg-slate-200" />

                            <div className="flex gap-3">
                                <div className="h-6 w-20 animate-pulse rounded bg-slate-200" />
                                <div className="h-5 w-16 animate-pulse rounded bg-slate-200" />
                            </div>

                            <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />

                            <div className="space-y-2">
                                <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                                <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200" />
                                <div className="h-4 w-4/6 animate-pulse rounded bg-slate-200" />
                            </div>

                            <div className="mt-4 h-12 w-40 animate-pulse rounded-xl bg-slate-200" />

                            <div className="mt-6 h-14 w-64 animate-pulse rounded-2xl bg-slate-200" />
                        </div>
                    </div>

                    {/* description */}
                    <div className="mt-10 rounded-[24px] bg-white p-5 md:p-7">
                        <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />
                        <div className="mt-3 space-y-2">
                            <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                            <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200" />
                            <div className="h-4 w-4/6 animate-pulse rounded bg-slate-200" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}