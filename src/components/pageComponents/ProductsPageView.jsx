"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowUpRight, Search, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";

import http from "@/http";
import { imgUrl } from "@/lib";

const pick = (obj, locale = "en") => {
    if (!obj || typeof obj !== "object") return "";
    return obj?.[locale] || obj?.en || obj?.ne || obj?.zh || "";
};

const money = (n) => {
    const num = Number(n);
    if (Number.isNaN(num)) return "";
    return `Rs. ${num}`;
};

const UI = {
    title: {
        en: "All Products",
        ne: "सबै उत्पादनहरू",
        zh: "全部商品",
    },
    subtitle: {
        en: "Browse and search products",
        ne: "उत्पादनहरू हेर्नुहोस् र खोज्नुहोस्",
        zh: "浏览并搜索商品",
    },
    searchPlaceholder: {
        en: "Search products...",
        ne: "उत्पादन खोज्नुहोस्...",
        zh: "搜索商品...",
    },
    sortLabel: {
        en: "Sort by",
        ne: "क्रमबद्ध गर्नुहोस्",
        zh: "排序方式",
    },
    sortDefault: {
        en: "Default",
        ne: "पूर्वनिर्धारित",
        zh: "默认",
    },
    latest: {
        en: "Latest",
        ne: "नवीनतम",
        zh: "最新",
    },
    oldest: {
        en: "Oldest",
        ne: "पुरानो",
        zh: "最早",
    },
    nameAsc: {
        en: "Name A-Z",
        ne: "नाम अ-ज्ञ",
        zh: "名称 A-Z",
    },
    nameDesc: {
        en: "Name Z-A",
        ne: "नाम ज्ञ-अ",
        zh: "名称 Z-A",
    },
    priceAsc: {
        en: "Price Low to High",
        ne: "कम मूल्यदेखि बढी",
        zh: "价格从低到高",
    },
    priceDesc: {
        en: "Price High to Low",
        ne: "बढी मूल्यदेखि कम",
        zh: "价格从高到低",
    },
    noProducts: {
        en: "No products found.",
        ne: "कुनै उत्पादन फेला परेन।",
        zh: "未找到商品。",
    },
    addToCart: {
        en: "Add to Cart",
        ne: "कार्टमा थप्नुहोस्",
        zh: "加入购物车",
    },
    results: {
        en: "products found",
        ne: "उत्पादन भेटियो",
        zh: "件商品",
    },
    page: {
        en: "Page",
        ne: "पृष्ठ",
        zh: "页",
    },
};

const SORT_OPTIONS = [
    { value: "", key: "sortDefault" },
    { value: "latest", key: "latest" },
    { value: "oldest", key: "oldest" },
    { value: "name-asc", key: "nameAsc" },
    { value: "name-desc", key: "nameDesc" },
    { value: "price-asc", key: "priceAsc" },
    { value: "price-desc", key: "priceDesc" },
];

export default function ProductsPageView({ locale = "en", dict }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [rows, setRows] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);

    const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");

    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "";

    const t = {
        title: dict?.productsPage?.title || UI.title[locale] || UI.title.en,
        subtitle: dict?.productsPage?.subtitle || UI.subtitle[locale] || UI.subtitle.en,
        searchPlaceholder: dict?.productsPage?.searchPlaceholder || UI.searchPlaceholder[locale] || UI.searchPlaceholder.en,
        sortLabel: dict?.productsPage?.sortLabel || UI.sortLabel[locale] || UI.sortLabel.en,
        noProducts: dict?.productsPage?.noProducts || UI.noProducts[locale] || UI.noProducts.en,
        addToCart: dict?.productsPage?.addToCart || UI.addToCart[locale] || UI.addToCart.en,
        results: dict?.productsPage?.results || UI.results[locale] || UI.results.en,
        page: dict?.productsPage?.page || UI.page[locale] || UI.page.en,
    };

    const sortLabelMap = {
        sortDefault: dict?.productsPage?.sortDefault || UI.sortDefault[locale] || UI.sortDefault.en,
        latest: dict?.productsPage?.latest || UI.latest[locale] || UI.latest.en,
        oldest: dict?.productsPage?.oldest || UI.oldest[locale] || UI.oldest.en,
        nameAsc: dict?.productsPage?.nameAsc || UI.nameAsc[locale] || UI.nameAsc.en,
        nameDesc: dict?.productsPage?.nameDesc || UI.nameDesc[locale] || UI.nameDesc.en,
        priceAsc: dict?.productsPage?.priceAsc || UI.priceAsc[locale] || UI.priceAsc.en,
        priceDesc: dict?.productsPage?.priceDesc || UI.priceDesc[locale] || UI.priceDesc.en,
    };

    const updateQuery = (updates = {}) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(updates).forEach(([key, value]) => {
            if (value === undefined || value === null || value === "") {
                params.delete(key);
            } else {
                params.set(key, String(value));
            }
        });

        router.push(`${pathname}?${params.toString()}`);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInput !== search) {
                updateQuery({
                    search: searchInput || "",
                    page: 1,
                });
            }
        }, 450);

        return () => clearTimeout(timer);
    }, [searchInput]);

    useEffect(() => {
        let mounted = true;

        async function load() {
            setLoading(true);

            try {
                const query = new URLSearchParams({
                    page: String(page),
                    limit: String(limit),
                    search,
                    sortBy,
                });

                const res = await http.get(`/frontend/product?${query.toString()}`);
                const data = Array.isArray(res?.data?.data) ? res.data.data : [];
                const pag = res?.data?.pagination || null;

                const mapped = data
                    .filter((p) => p?.status === true)
                    .map((p) => ({
                        id: p?._id,
                        slug: p?.slug,
                        name: pick(p?.name, locale),
                        summary: pick(p?.summary, locale),
                        price: p?.price,
                        discounted_price: p?.discounted_price,
                        image: Array.isArray(p?.images) ? p.images[0] : null,
                    }));

                if (mounted) {
                    setRows(mapped);
                    setPagination(pag);
                }
            } catch (e) {
                if (mounted) {
                    setRows([]);
                    setPagination(null);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        }

        load();

        return () => {
            mounted = false;
        };
    }, [locale, page, limit, search, sortBy]);

    const products = useMemo(() => rows, [rows]);

    return (
        <section className="py-8 md:py-12">
            <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
                <div className="mb-6 p-5 md:p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <h1 className="text-2xl font-extrabold text-[#1f1f1f] md:text-[34px]">
                                {t.title}
                            </h1>
                            <p className="mt-1 text-sm text-slate-600">
                                {t.subtitle}
                            </p>
                        </div>

                        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px] lg:w-[720px]">
                            <div className="relative">
                                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    placeholder={t.searchPlaceholder}
                                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#5b4fd4] focus:ring-4 focus:ring-[#5b4fd4]/10"
                                />
                            </div>

                            <select
                                value={sortBy}
                                onChange={(e) =>
                                    updateQuery({
                                        sortBy: e.target.value,
                                        page: 1,
                                    })
                                }
                                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-[#5b4fd4] focus:ring-4 focus:ring-[#5b4fd4]/10"
                            >
                                {SORT_OPTIONS.map((opt) => (
                                    <option key={opt.value || "default"} value={opt.value}>
                                        {sortLabelMap[opt.key]}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="mb-4 flex items-center justify-between gap-3">
                    <p className="text-sm text-slate-600">
                        {(pagination?.totalItems || 0)} {t.results}
                    </p>

                    {pagination ? (
                        <p className="text-sm text-slate-500">
                            {t.page} {pagination.currentPage} / {pagination.totalPages}
                        </p>
                    ) : null}
                </div>

                {loading ? (
                    <SkeletonGrid count={Math.min(limit, 10)} />
                ) : products.length === 0 ? (
                    <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-600 shadow-sm">
                        {t.noProducts}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5 lg:gap-4">
                            {products.map((p) => (
                                <ProductCard key={p.id} p={p} locale={locale} addToCartText={t.addToCart} />
                            ))}
                        </div>

                        {pagination?.totalPages > 1 ? (
                            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                                <button
                                    type="button"
                                    disabled={!pagination?.hasPrevPage}
                                    onClick={() => updateQuery({ page: pagination.prevPage || 1 })}
                                    className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-[#5b4fd4] hover:text-[#5b4fd4] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Prev
                                </button>

                                {Array.from({ length: pagination.totalPages }).map((_, i) => {
                                    const pageNum = i + 1;
                                    const active = pageNum === pagination.currentPage;

                                    return (
                                        <button
                                            key={pageNum}
                                            type="button"
                                            onClick={() => updateQuery({ page: pageNum })}
                                            className={[
                                                "h-11 min-w-[44px] rounded-xl px-3 text-sm font-semibold transition",
                                                active
                                                    ? "bg-[#5b4fd4] text-white"
                                                    : "border border-slate-200 bg-white text-slate-700 hover:border-[#5b4fd4] hover:text-[#5b4fd4]",
                                            ].join(" ")}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}

                                <button
                                    type="button"
                                    disabled={!pagination?.hasNextPage}
                                    onClick={() => updateQuery({ page: pagination.nextPage || pagination.currentPage })}
                                    className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-[#5b4fd4] hover:text-[#5b4fd4] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        ) : null}
                    </>
                )}
            </div>
        </section>
    );
}

function SkeletonGrid({ count = 10 }) {
    return (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5 lg:gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-white p-2.5 shadow-sm">
                    <div className="h-[140px] w-full animate-pulse rounded-xl bg-slate-200" />
                    <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-slate-200" />
                    <div className="mt-2 h-3 w-full animate-pulse rounded bg-slate-200" />
                    <div className="mt-1 h-3 w-5/6 animate-pulse rounded bg-slate-200" />
                    <div className="mt-3 h-3 w-10 animate-pulse rounded bg-slate-200" />
                    <div className="mt-2 h-4 w-16 animate-pulse rounded bg-slate-200" />
                    <div className="mt-3 h-9 w-full animate-pulse rounded-xl bg-slate-200" />
                </div>
            ))}
        </div>
    );
}

function ProductCard({ p, locale, addToCartText }) {
    const href = `/${locale}/product/${p.slug}`;

    const hasDiscount =
        p.discounted_price !== null &&
        p.discounted_price !== undefined &&
        String(p.discounted_price) !== "" &&
        Number(p.discounted_price) < Number(p.price);

    const discountPercent = (() => {
        if (!hasDiscount) return null;
        const price = Number(p.price);
        const disc = Number(p.discounted_price);
        if (!price || Number.isNaN(price) || Number.isNaN(disc)) return null;
        const pct = Math.round(((price - disc) / price) * 100);
        return pct > 0 ? pct : null;
    })();

    return (
        <div className="rounded-2xl bg-white p-2.5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <Link
                href={href}
                className="relative block h-[140px] w-full overflow-hidden rounded-xl border border-[#efefef] bg-white"
            >
                {p.image ? (
                    <Image
                        src={imgUrl(p.image)}
                        alt={p.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 168px, 220px"
                        unoptimized
                    />
                ) : null}
            </Link>

            <Link href={href} className="mt-2.5 block">
                <h3 className="line-clamp-1 text-[13px] font-bold text-[#202020]">
                    {p.name}
                </h3>
            </Link>

            <p className="mt-1.5 line-clamp-3 min-h-[42px] text-[10px] leading-[1.45] text-[#666]">
                {p.summary || "Lorem ipsum dolor sit amet, consectetur adipisicing elit."}
            </p>

            <div className="mt-2 flex items-center gap-1 text-[11px]">
                <span className="text-[#72b843]">★</span>
                <span className="font-medium text-[#2d2d2d]">4.5</span>
            </div>

            <div className="mt-1 min-h-[16px] text-[11px]">
                {hasDiscount ? (
                    <div className="flex items-center gap-1.5">
                        <span className="text-[#8b5cf6] line-through">{money(p.price)}</span>
                        {discountPercent ? (
                            <span className="font-semibold text-[#ef4444]">-{discountPercent}%</span>
                        ) : null}
                    </div>
                ) : (
                    <div />
                )}
            </div>

            <div className="text-[15px] font-extrabold leading-none text-[#5b4fd4]">
                {money(hasDiscount ? p.discounted_price : p.price)}
            </div>

            <button
                type="button"
                onClick={() => console.log("add to cart", p.id)}
                className="mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-[#5b4fd4] px-2 text-[11px] font-medium text-white transition hover:bg-[#4b3fd0]"
            >
                <ShoppingCart className="h-3.5 w-3.5" />
                {addToCartText}
            </button>
        </div>
    );
}