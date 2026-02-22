"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { imgUrl } from "@/lib";
import http from "@/http";

import { SectionHeaderSkeleton, SoftwareGridSkeleton } from "@/components/ui/SoftwareSkeletons";


function pickLocaleField(obj, locale) {
    if (!obj) return "";
    return obj?.[locale] ?? obj?.en ?? Object.values(obj)[0] ?? "";
}

function money(n) {
    const x = Number(n);
    if (Number.isNaN(x)) return n ?? "";
    return x.toString();
}

export default function SimilarSoftware({
    slug,
    locale = "en",
    title,
    limit = 8,
    className = "mx-auto w-full max-w-6xl px-4 pb-14 pt-8",
}) {
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);

    useEffect(() => {
        if (!slug) return;

        let alive = true;
        setLoading(true);

        http
            .get(`/frontend/software/similar/${encodeURIComponent(slug)}`)
            .then((res) => {
                if (!alive) return;
                const json = res?.data;
                const data = json?.data ?? [];
                setItems(Array.isArray(data) ? data : []);
            })
            .catch(() => {
                if (!alive) return;
                setItems([]);
            })
            .finally(() => {
                if (!alive) return;
                setLoading(false);
            });

        return () => {
            alive = false;
        };
    }, [slug]);

    const heading =
        title ||
        (locale === "ne"
            ? "सम्बन्धित सफ्टवेयर"
            : locale === "zh"
                ? "相似软件"
                : "Similar Software");

    if (!slug) return null;

    return (
        <section className={className}>
            <div className="mb-4 flex items-end justify-between gap-3">
                <h2 className="text-lg font-semibold text-zinc-900">{heading}</h2>

                <Link
                    href={`/${locale}/services/software/listSoftware`}
                    className="text-sm text-zinc-600 hover:text-zinc-900"
                >
                    {locale === "ne" ? "सबै हेर्नुहोस्" : locale === "zh" ? "查看全部" : "View all"}
                </Link>
            </div>

            {loading ? (
                <>
                    <SoftwareGridSkeleton count={Math.min(limit, 8)} />
                </>
            ) : items?.length ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {items.slice(0, limit).map((it) => {
                        const t = pickLocaleField(it?.name, locale) || it?.slug;
                        const s = pickLocaleField(it?.summary, locale);
                        const cover = it?.images?.[0] ? imgUrl(it.images[0]) : null;

                        const p = it?.price;
                        const d = it?.discounted_price;
                        const hasDiscount =
                            d !== undefined &&
                            d !== null &&
                            String(d) !== "" &&
                            Number(d) < Number(p);

                        return (
                            <Link
                                key={it?._id}
                                href={`/${locale}/services/software/${it?.slug}`}
                                className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md"
                            >
                                <div className="relative h-28 w-full bg-zinc-100">
                                    {cover ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={cover}
                                            alt={t}
                                            className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500">
                                            {locale === "ne" ? "छवि छैन" : locale === "zh" ? "无图片" : "No image"}
                                        </div>
                                    )}
                                </div>

                                <div className="p-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="line-clamp-1 text-sm font-semibold text-zinc-900">{t}</h3>

                                        <div className="text-right">
                                            {hasDiscount ? (
                                                <div className="flex flex-col items-end">
                                                    <span className="text-sm font-semibold text-zinc-900">
                                                        ${money(d)}
                                                    </span>
                                                    <span className="text-xs text-zinc-500 line-through">
                                                        ${money(p)}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-sm font-semibold text-zinc-900">
                                                    ${money(p)}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {s ? <p className="mt-1 line-clamp-2 text-xs text-zinc-600">{s}</p> : null}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-sm text-zinc-600">
                    {locale === "ne"
                        ? "सम्बन्धित सफ्टवेयर उपलब्ध छैन।"
                        : locale === "zh"
                            ? "暂无相似软件。"
                            : "No similar software found."}
                </div>
            )}
        </section>
    );
}