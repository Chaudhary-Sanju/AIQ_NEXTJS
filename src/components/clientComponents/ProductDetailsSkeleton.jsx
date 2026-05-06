export default function ProductDetailsSkeleton() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-blue-50 py-8 md:py-12">
            <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />
            <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-4 md:px-6">
                {/* Breadcrumb skeleton */}
                <div className="mb-5 flex items-center gap-2">
                    <div className="h-4 w-16 animate-pulse rounded bg-orange-100" />
                    <div className="h-4 w-4 animate-pulse rounded bg-orange-100" />
                    <div className="h-4 w-24 animate-pulse rounded bg-orange-100" />
                    <div className="h-4 w-4 animate-pulse rounded bg-orange-100" />
                    <div className="h-4 w-36 animate-pulse rounded bg-orange-100" />
                </div>

                <div className="rounded-[32px] border border-orange-100 bg-white/95 p-4 shadow-[0_24px_70px_rgba(15,42,94,0.10)] backdrop-blur md:p-6 lg:p-8">
                    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
                        {/* Left Gallery */}
                        <div className="grid gap-4 md:grid-cols-[96px_minmax(0,1fr)]">
                            {/* Thumbnails */}
                            <div className="order-2 flex gap-3 overflow-x-auto md:order-1 md:flex-col md:overflow-visible">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-20 w-20 shrink-0 animate-pulse rounded-2xl border border-orange-100 bg-orange-100/70"
                                    />
                                ))}
                            </div>

                            {/* Main image */}
                            <div className="order-1 md:order-2">
                                <div className="relative aspect-square animate-pulse overflow-hidden rounded-[30px] border border-orange-100 bg-gradient-to-br from-orange-50 to-blue-50">
                                    <div className="absolute left-4 top-4 h-7 w-20 rounded-full bg-orange-100" />
                                    <div className="absolute inset-10 rounded-[26px] bg-white/70" />
                                </div>
                            </div>
                        </div>

                        {/* Right Info */}
                        <div className="flex flex-col">
                            <div className="mb-4 h-8 w-36 animate-pulse rounded-full border border-orange-100 bg-orange-50" />

                            <div className="h-9 w-11/12 animate-pulse rounded-xl bg-neutral-200 md:h-11" />
                            <div className="mt-3 h-8 w-3/5 animate-pulse rounded-xl bg-neutral-100" />

                            <div className="mt-4 flex items-center gap-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-5 w-5 animate-pulse rounded bg-yellow-100"
                                    />
                                ))}
                                <div className="ml-2 h-4 w-28 animate-pulse rounded bg-neutral-100" />
                            </div>

                            <div className="mt-6 flex items-end gap-3">
                                <div className="h-10 w-36 animate-pulse rounded-xl bg-blue-100" />
                                <div className="h-5 w-24 animate-pulse rounded bg-neutral-100" />
                            </div>

                            <div className="mt-2 h-4 w-40 animate-pulse rounded bg-neutral-100" />

                            <div className="mt-6 space-y-2">
                                <div className="h-4 w-full animate-pulse rounded bg-neutral-100" />
                                <div className="h-4 w-5/6 animate-pulse rounded bg-neutral-100" />
                                <div className="h-4 w-4/6 animate-pulse rounded bg-neutral-100" />
                            </div>

                            <div className="mt-6 grid gap-3 rounded-2xl border border-orange-100 bg-orange-50/60 p-4 sm:grid-cols-2">
                                <div className="h-5 w-full animate-pulse rounded bg-white" />
                                <div className="h-5 w-full animate-pulse rounded bg-white" />
                                <div className="h-7 w-32 animate-pulse rounded-full bg-white sm:col-span-2" />
                            </div>

                            <div className="mt-6 grid gap-3 sm:grid-cols-3">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-14 animate-pulse rounded-2xl border border-orange-100 bg-white"
                                    />
                                ))}
                            </div>

                            <div className="mt-8">
                                <div className="mb-3 h-5 w-24 animate-pulse rounded bg-neutral-100" />

                                <div className="h-12 w-40 animate-pulse rounded-2xl border border-orange-100 bg-white" />
                            </div>

                            <div className="mt-8 h-14 w-full animate-pulse rounded-2xl bg-blue-100 md:max-w-[320px]" />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mt-10 rounded-[26px] border border-orange-100 bg-gradient-to-br from-white to-orange-50/40 p-5 md:p-7">
                        <div className="h-8 w-44 animate-pulse rounded bg-neutral-200" />

                        <div className="mt-4 space-y-2">
                            <div className="h-4 w-full animate-pulse rounded bg-neutral-100" />
                            <div className="h-4 w-11/12 animate-pulse rounded bg-neutral-100" />
                            <div className="h-4 w-5/6 animate-pulse rounded bg-neutral-100" />
                            <div className="h-4 w-3/5 animate-pulse rounded bg-neutral-100" />
                        </div>
                    </div>

                    {/* Reviews */}
                    <div className="mt-8 rounded-[26px] border border-orange-100 bg-white p-5 md:p-7">
                        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                            <div>
                                <div className="h-8 w-48 animate-pulse rounded bg-neutral-200" />
                                <div className="mt-2 h-4 w-60 animate-pulse rounded bg-neutral-100" />
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="h-5 w-28 animate-pulse rounded bg-yellow-100" />
                                <div className="h-9 w-14 animate-pulse rounded bg-neutral-200" />
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="h-4 w-10 animate-pulse rounded bg-neutral-100" />
                                    <div className="h-2 flex-1 animate-pulse rounded-full bg-orange-50" />
                                    <div className="h-4 w-10 animate-pulse rounded bg-neutral-100" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}