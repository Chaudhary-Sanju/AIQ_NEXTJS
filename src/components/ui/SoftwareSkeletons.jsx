"use client";

import Skeleton from "@/components/ui/Skeleton";

/* Card used in list + similar grids */
export function SoftwareCardSkeleton() {
    return (
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <Skeleton className="h-28 w-full rounded-none" />
            <div className="p-3">
                <div className="flex items-start justify-between gap-3">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-14" />
                </div>
                <Skeleton className="mt-2 h-3 w-11/12" />
                <Skeleton className="mt-2 h-3 w-8/12" />
            </div>
        </div>
    );
}

/* Grid skeleton */
export function SoftwareGridSkeleton({ count = 8 }) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: count }).map((_, i) => (
                <SoftwareCardSkeleton key={i} />
            ))}
        </div>
    );
}

/* Detail page skeleton (image + info) */
export function SoftwareDetailSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
                <div className="mt-4 flex gap-3 overflow-hidden">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-16 w-24 rounded-xl" />
                    ))}
                </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <Skeleton className="h-7 w-2/3" />
                <Skeleton className="mt-3 h-4 w-11/12" />
                <Skeleton className="mt-2 h-4 w-9/12" />

                <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="mt-2 h-8 w-28" />
                    <Skeleton className="mt-2 h-4 w-20" />
                </div>

                <div className="mt-6">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="mt-3 h-4 w-11/12" />
                    <Skeleton className="mt-2 h-4 w-10/12" />
                    <Skeleton className="mt-2 h-4 w-9/12" />
                </div>
            </div>
        </div>
    );
}

/* Section header skeleton (title + action link) */
export function SectionHeaderSkeleton() {
    return (
        <div className="mb-4 flex items-end justify-between gap-3">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-20" />
        </div>
    );
}