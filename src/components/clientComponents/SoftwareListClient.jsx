"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, SlidersHorizontal, ArrowLeft, ArrowRight } from "lucide-react";

import http from "@/http";
import { imgUrl } from "@/lib";
import { SoftwareGridSkeleton } from "../ui/SoftwareSkeletons";

const SORT_OPTIONS = [
    { value: "latest", label: { en: "Latest", ne: "नयाँ", zh: "最新" } },
    { value: "oldest", label: { en: "Oldest", ne: "पुरानो", zh: "最旧" } },
    { value: "price-asc", label: { en: "Price: Low to High", ne: "मूल्य: सस्तो → महँगो", zh: "价格：低到高" } },
    { value: "price-desc", label: { en: "Price: High to Low", ne: "मूल्य: महँगो → सस्तो", zh: "价格：高到低" } },
];

function pickLocaleField(obj, locale) {
    if (!obj) return "";
    return obj?.[locale] ?? obj?.en ?? Object.values(obj)[0] ?? "";
}

function money(n) {
    const x = Number(n);
    if (Number.isNaN(x)) return n ?? "";
    return x.toString();
}

function buildQueryString(currentParams, updates) {
    const sp = new URLSearchParams(currentParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
        if (v === undefined || v === null || v === "") sp.delete(k);
        else sp.set(k, String(v));
    });
    return sp.toString();
}

export default function SoftwareListClient({ locale = "en", dict = {} }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // read from URL
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "12", 10));
    const sortBy = searchParams.get("sortBy") || "latest";
    const search = searchParams.get("search") || "";

    const [input, setInput] = useState(search);
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [pagination, setPagination] = useState(null);

    const sortLabel = useMemo(() => {
        const found = SORT_OPTIONS.find((s) => s.value === sortBy) || SORT_OPTIONS[0];
        return found.label?.[locale] ?? found.label.en;
    }, [sortBy, locale]);

    // debounce search input -> URL
    useEffect(() => {
        setInput(search);
    }, [search]);

    useEffect(() => {
        const t = setTimeout(() => {
            const qs = buildQueryString(searchParams, { search: input || "", page: 1 });
            router.replace(`${pathname}?${qs}`, { scroll: false });
        }, 400);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [input]);

    // fetch data when url params change
    useEffect(() => {
        let alive = true;
        setLoading(true);

        http
            .get("/frontend/software", {
                params: { page, limit, sortBy, search },
            })
            .then((res) => {
                if (!alive) return;
                const payload = res?.data;
                setItems(payload?.data || []);
                setPagination(payload?.pagination || null);
            })
            .catch(() => {
                if (!alive) return;
                setItems([]);
                setPagination(null);
            })
            .finally(() => {
                if (!alive) return;
                setLoading(false);
            });

        return () => {
            alive = false;
        };
    }, [page, limit, sortBy, search]);

    const totalPages = pagination?.totalPages ?? 1;
    const hasPrev = pagination?.hasPrevPage ?? page > 1;
    const hasNext = pagination?.hasNextPage ?? page < totalPages;

    const goPage = (nextPage) => {
        const safe = Math.min(Math.max(1, nextPage), totalPages || 1);
        const qs = buildQueryString(searchParams, { page: safe });
        router.push(`${pathname}?${qs}`, { scroll: false });
    };

    const changeSort = (v) => {
        const qs = buildQueryString(searchParams, { sortBy: v, page: 1 });
        router.push(`${pathname}?${qs}`, { scroll: false });
    };

    const changeLimit = (v) => {
        const qs = buildQueryString(searchParams, { limit: v, page: 1 });
        router.push(`${pathname}?${qs}`, { scroll: false });
    };

    return (
        <section className="mx-auto w-full max-w-6xl px-4 pb-14 pt-8">
            {/* Controls */}
            <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="flex w-full items-center gap-3 sm:max-w-xl">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={
                                locale === "ne"
                                    ? "सफ्टवेयर खोज्नुहोस्…"
                                    : locale === "zh"
                                        ? "搜索软件…"
                                        : "Search software…"
                            }
                            className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none ring-0 focus:border-zinc-300"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm">
                        <SlidersHorizontal className="h-4 w-4 text-zinc-500" />
                        <span className="text-zinc-600">
                            {locale === "ne" ? "क्रम:" : locale === "zh" ? "排序：" : "Sort:"}
                        </span>
                        <select
                            value={sortBy}
                            onChange={(e) => changeSort(e.target.value)}
                            className="bg-transparent text-sm outline-none"
                        >
                            {SORT_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>
                                    {o.label?.[locale] ?? o.label.en}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm">
                        <span className="text-zinc-600">
                            {locale === "ne" ? "देखाउने:" : locale === "zh" ? "每页：" : "Show:"}
                        </span>
                        <select
                            value={limit}
                            onChange={(e) => changeLimit(parseInt(e.target.value, 10))}
                            className="bg-transparent text-sm outline-none"
                        >
                            {[8, 12, 16, 24].map((n) => (
                                <option key={n} value={n}>
                                    {n}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="text-xs text-zinc-500">
                        {loading ? (
                            locale === "ne" ? "लोड हुँदैछ…" : locale === "zh" ? "加载中…" : "Loading…"
                        ) : (
                            <>
                                {locale === "ne"
                                    ? `क्रम: ${sortLabel}`
                                    : locale === "zh"
                                        ? `排序：${sortLabel}`
                                        : `Sorted by: ${sortLabel}`}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="mt-6">
                {loading ? (
                    <SoftwareGridSkeleton count={Math.min(limit, 8)} />
                ) : items?.length ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {items.map((it) => {
                            const title = pickLocaleField(it?.name, locale) || it?.slug;
                            const summary = pickLocaleField(it?.summary, locale);
                            const cover = it?.images?.[0] ? imgUrl(it.images[0]) : null;

                            const price = it?.price;
                            const discounted = it?.discounted_price;
                            const hasDiscount =
                                discounted !== undefined &&
                                discounted !== null &&
                                String(discounted) !== "" &&
                                Number(discounted) < Number(price);

                            return (
                                <Link
                                    key={it?._id}
                                    href={`/${locale}/services/software/${it?.slug}`}
                                    className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md"
                                >
                                    <div className="relative h-40 w-full bg-zinc-100">
                                        {cover ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={cover}
                                                alt={title}
                                                className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500">
                                                {locale === "ne" ? "छवि छैन" : locale === "zh" ? "无图片" : "No image"}
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <h3 className="line-clamp-1 text-sm font-semibold text-zinc-900">{title}</h3>

                                            <div className="text-right">
                                                {hasDiscount ? (
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-sm font-semibold text-zinc-900">
                                                            ${money(discounted)}
                                                        </span>
                                                        <span className="text-xs text-zinc-500 line-through">
                                                            ${money(price)}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm font-semibold text-zinc-900">
                                                        ${money(price)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {summary ? (
                                            <p className="mt-2 line-clamp-2 text-sm text-zinc-600">{summary}</p>
                                        ) : (
                                            <p className="mt-2 line-clamp-2 text-sm text-zinc-500">
                                                {locale === "ne"
                                                    ? "विवरण उपलब्ध छैन।"
                                                    : locale === "zh"
                                                        ? "暂无简介。"
                                                        : "No summary available."}
                                            </p>
                                        )}

                                        <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
                                            <span className="rounded-full bg-zinc-100 px-2 py-1">
                                                {locale === "ne" ? "सफ्टवेयर" : locale === "zh" ? "软件" : "Software"}
                                            </span>
                                            <span className="text-zinc-400">{it?.createdAt?.slice?.(0, 10)}</span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center">
                        <p className="text-sm font-medium text-zinc-900">
                            {locale === "ne"
                                ? "कुनै सफ्टवेयर फेला परेन।"
                                : locale === "zh"
                                    ? "未找到软件。"
                                    : "No software found."}
                        </p>
                        <p className="mt-2 text-sm text-zinc-600">
                            {locale === "ne"
                                ? "अर्को शब्दले खोज्नुहोस् वा फिल्टर परिवर्तन गर्नुहोस्।"
                                : locale === "zh"
                                    ? "尝试更换关键词或排序方式。"
                                    : "Try another keyword or change sorting."}
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-between gap-3">
                <button
                    onClick={() => goPage(page - 1)}
                    disabled={!hasPrev || loading}
                    className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <ArrowLeft className="h-4 w-4" />
                    {locale === "ne" ? "अघिल्लो" : locale === "zh" ? "上一页" : "Prev"}
                </button>

                <div className="text-sm text-zinc-600">
                    {locale === "ne"
                        ? `पृष्ठ ${page} / ${totalPages}`
                        : locale === "zh"
                            ? `第 ${page} / ${totalPages} 页`
                            : `Page ${page} / ${totalPages}`}
                </div>

                <button
                    onClick={() => goPage(page + 1)}
                    disabled={!hasNext || loading}
                    className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {locale === "ne" ? "अर्को" : locale === "zh" ? "下一页" : "Next"}
                    <ArrowRight className="h-4 w-4" />
                </button>
            </div>
        </section>
    );
}