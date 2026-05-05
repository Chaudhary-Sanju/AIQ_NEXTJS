"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

import http from "@/http";
import { imgUrl } from "@/lib";

const pick = (obj, locale = "en") => {
    if (!obj || typeof obj !== "object") return "";
    return obj?.[locale] || obj?.en || obj?.ne || obj?.zh || "";
};

const money = (n) => {
    const num = Number(n);
    if (Number.isNaN(num)) return "";
    return `HK$ ${num}`;
};

const UI = {
    featuredProduct: {
        en: "Featured Products",
        ne: "विशेष उत्पादनहरू",
        zh: "精选商品",
    },
    trendingProduct: {
        en: "Trending Products",
        ne: "ट्रेन्डिङ उत्पादनहरू",
        zh: "热门趋势",
    },
    hotProduct: {
        en: "Hot Products",
        ne: "तातो उत्पादनहरू",
        zh: "热销商品",
    },
    mostSearchedProduct: {
        en: "Most Searched",
        ne: "धेरै खोजिएका",
        zh: "搜索最多",
    },
    seeAll: {
        en: "See more products",
        ne: "थप उत्पादन हेर्नुहोस्",
        zh: "查看更多商品",
    },
    noProducts: {
        en: "No products found.",
        ne: "उत्पादनहरू फेला परेनन्।",
        zh: "未找到商品。",
    },
    addToCart: {
        en: "Add to Cart",
        ne: "कार्टमा थप्नुहोस्",
        zh: "加入购物车",
    },
    notRatedYet: {
        en: "Not rated yet",
        ne: "अहिलेसम्म रेट गरिएको छैन",
        zh: "暂无评分",
    },
    review: {
        en: "review",
        ne: "समीक्षा",
        zh: "评价",
    },
    reviews: {
        en: "reviews",
        ne: "समीक्षाहरू",
        zh: "评价",
    },
};

export default function ProductTypeSection({
    locale = "en",
    type = "featuredProduct",
    limit = 6,
    className = "my-2",
    title,
    seeAllHref,
}) {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);

    const resolvedTitle =
        title || UI?.[type]?.[locale] || UI?.[type]?.en || type;

    const resolvedSeeAll = UI?.seeAll?.[locale] || UI.seeAll.en;
    const resolvedNoProducts = UI?.noProducts?.[locale] || UI.noProducts.en;
    const resolvedSeeAllHref = seeAllHref || `/${locale}/product`;

    useEffect(() => {
        let mounted = true;

        async function load() {
            setLoading(true);

            try {
                const res = await http.get(
                    `/frontend/product/type/${type}?limit=${limit}`
                );

                const data = Array.isArray(res?.data?.data)
                    ? res.data.data
                    : [];

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
                        reviewSummary: {
                            averageRating: Number(
                                p?.reviewSummary?.averageRating || 0
                            ),
                            totalReviews: Number(
                                p?.reviewSummary?.totalReviews || 0
                            ),
                        },
                    }));

                if (mounted) setRows(mapped);
            } catch (e) {
                if (mounted) setRows([]);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        load();

        return () => {
            mounted = false;
        };
    }, [type, limit, locale]);

    const products = useMemo(() => rows, [rows]);

    return (
        <section className={className}>
            <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
                <div className="rounded-md p-4 md:p-5">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <h2 className="text-xl font-extrabold text-[#1f1f1f] md:text-[30px]">
                            {resolvedTitle}
                        </h2>

                        <Link
                            href={resolvedSeeAllHref}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1f1f1f] hover:text-[#5b4fd4]"
                        >
                            <ArrowUpRight className="h-4 w-4" />
                            <span>{resolvedSeeAll}</span>
                        </Link>
                    </div>

                    {loading ? (
                        <SkeletonGrid count={Math.min(limit, 6)} />
                    ) : products.length === 0 ? (
                        <div className="rounded-md bg-white p-5 text-sm text-slate-600">
                            {resolvedNoProducts}
                        </div>
                    ) : (
                        <>
                            <div className="hidden lg:grid lg:grid-cols-6 lg:gap-3">
                                {products.map((p) => (
                                    <ProductCard
                                        key={p.id}
                                        p={p}
                                        locale={locale}
                                    />
                                ))}
                            </div>

                            <div className="lg:hidden">
                                <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
                                    {products.map((p) => (
                                        <div
                                            key={p.id}
                                            className="w-[168px] shrink-0"
                                        >
                                            <ProductCard
                                                p={p}
                                                locale={locale}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <style jsx>{`
                                    .no-scrollbar::-webkit-scrollbar {
                                        display: none;
                                    }

                                    .no-scrollbar {
                                        -ms-overflow-style: none;
                                        scrollbar-width: none;
                                    }
                                `}</style>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}

function SkeletonGrid({ count = 6 }) {
    return (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="rounded-md bg-white p-2.5 shadow-sm">
                    <div className="h-[112px] w-full animate-pulse rounded-sm bg-slate-200" />
                    <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-slate-200" />
                    <div className="mt-2 h-3 w-full animate-pulse rounded bg-slate-200" />
                    <div className="mt-1 h-3 w-5/6 animate-pulse rounded bg-slate-200" />
                    <div className="mt-3 h-3 w-20 animate-pulse rounded bg-slate-200" />
                    <div className="mt-2 h-4 w-16 animate-pulse rounded bg-slate-200" />
                    <div className="mt-3 h-8 w-full animate-pulse rounded bg-slate-200" />
                </div>
            ))}
        </div>
    );
}

function ProductCard({ p, locale }) {
    const { addToCart, busy } = useCart();

    const href = `/${locale}/product/${p.slug}`;

    const addToCartText = UI.addToCart?.[locale] || UI.addToCart.en;
    const notRatedYetText = UI.notRatedYet?.[locale] || UI.notRatedYet.en;
    const reviewText = UI.review?.[locale] || UI.review.en;
    const reviewsText = UI.reviews?.[locale] || UI.reviews.en;

    const averageRating = Number(p?.reviewSummary?.averageRating || 0);
    const totalReviews = Number(p?.reviewSummary?.totalReviews || 0);

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
        <div className="rounded-md bg-white p-2.5 shadow-sm">
            <Link
                href={href}
                className="relative block h-[110px] w-full overflow-hidden rounded-sm border border-[#efefef] bg-white"
            >
                {p.image ? (
                    <Image
                        src={imgUrl(p.image)}
                        alt={p.name || "Product"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 168px, 180px"
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
                {p.summary ||
                    "Lorem ipsum dolor sit amet, consectetur adipisicing elit."}
            </p>

            <div className="mt-2 flex min-h-[18px] items-center gap-1 text-[11px]">
                {totalReviews > 0 ? (
                    <>
                        <span className="text-[#72b843]">★</span>

                        <span className="font-semibold text-[#2d2d2d]">
                            {averageRating.toFixed(1)}
                        </span>

                        <span className="text-slate-500">
                            ({totalReviews}{" "}
                            {totalReviews === 1 ? reviewText : reviewsText})
                        </span>
                    </>
                ) : (
                    <span className="text-slate-400">
                        {notRatedYetText}
                    </span>
                )}
            </div>

            <div className="mt-1 min-h-[16px] text-[11px]">
                {hasDiscount ? (
                    <div className="flex items-center gap-1.5">
                        <span className="text-[#8b5cf6] line-through">
                            {money(p.price)}
                        </span>

                        {discountPercent ? (
                            <span className="font-semibold text-[#ef4444]">
                                -{discountPercent}%
                            </span>
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
                disabled={busy}
                onClick={() => addToCart(p.id, 1)}
                className="mt-3 flex h-8 w-full items-center justify-center gap-2 rounded-[4px] bg-[#5b4fd4] px-2 text-[11px] font-medium text-white transition hover:bg-[#4b3fd0] disabled:cursor-not-allowed disabled:opacity-60"
            >
                <ShoppingCart className="h-3.5 w-3.5" />
                {addToCartText}
            </button>
        </div>
    );
}