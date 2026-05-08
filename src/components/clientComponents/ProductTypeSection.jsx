"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowUpRight,
    ShoppingCart,
    Star,
    Tag,
    PackageCheck,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";

import http from "@/http";
import { imgUrl } from "@/lib";

const pick = (obj, locale = "en") => {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    if (typeof obj !== "object") return "";
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

const getFirstImage = (product) => {
    if (Array.isArray(product?.images) && product.images.length) {
        return product.images[0];
    }

    if (Array.isArray(product?.image) && product.image.length) {
        return product.image[0];
    }

    if (product?.featuredImage) return product.featuredImage;
    if (product?.thumbnail) return product.thumbnail;

    if (typeof product?.image === "string") return product.image;

    return null;
};

const normalizeProduct = (p, locale) => {
    const firstImage = getFirstImage(p);

    return {
        _id: p?._id,
        id: p?._id,
        slug: p?.slug || "",
        name: p?.name || {
            en: pick(p?.name, "en") || pick(p?.name, locale) || "Product",
            ne: pick(p?.name, "ne") || pick(p?.name, locale) || "Product",
            zh: pick(p?.name, "zh") || pick(p?.name, locale) || "Product",
        },
        displayName: pick(p?.name, locale),
        summary: p?.summary || {
            en: pick(p?.summary, "en"),
            ne: pick(p?.summary, "ne"),
            zh: pick(p?.summary, "zh"),
        },
        displaySummary: pick(p?.summary, locale),
        price: p?.price,
        discounted_price: p?.discounted_price ?? p?.discountPrice ?? null,
        image: firstImage ? [firstImage] : [],
        images: firstImage ? [firstImage] : [],
        singleImage: firstImage,
        qty: p?.qty,
        stock: p?.stock,
        sellOnNoStock: p?.sellOnNoStock,
        reviewSummary: {
            averageRating: Number(p?.reviewSummary?.averageRating || 0),
            totalReviews: Number(p?.reviewSummary?.totalReviews || 0),
        },
    };
};

export default function ProductTypeSection({
    locale = "en",
    type = "featuredProduct",
    limit = 6,
    className = "py-2",
    title,
    seeAllHref,
}) {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);

    const resolvedTitle =
        title || UI?.[type]?.[locale] || UI?.[type]?.en || type;

    const resolvedSeeAll = UI?.seeAll?.[locale] || UI.seeAll.en;
    const resolvedNoProducts = UI?.noProducts?.[locale] || UI.noProducts.en;
    const resolvedSeeAllHref =
        seeAllHref || `/${locale}/product?page=1&limit=10`;

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
                    .map((p) => normalizeProduct(p, locale));

                if (mounted) setRows(mapped);
            } catch {
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
                <div className="rounded-[32px] p-4 md:p-5 lg:p-6">
                    <div className="mb-5 flex items-center justify-between gap-3">
                        <div>
                            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#1a4b8f]">
                                <PackageCheck className="h-4 w-4" />
                                A Grocery
                            </div>

                            <h2 className="text-xl font-bold text-neutral-950 md:text-[30px]">
                                {resolvedTitle}
                            </h2>
                        </div>

                        <Link
                            href={resolvedSeeAllHref}
                            className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-white px-4 py-2 text-xs font-bold text-[#1a4b8f] transition hover:bg-orange-50 md:text-sm"
                        >
                            <ArrowUpRight className="h-4 w-4" />
                            <span className="hidden sm:inline">
                                {resolvedSeeAll}
                            </span>
                            <span className="sm:hidden">More</span>
                        </Link>
                    </div>

                    {loading ? (
                        <SkeletonGrid count={Math.min(limit, 6)} />
                    ) : products.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-orange-200 bg-orange-50/40 p-5 text-sm text-neutral-500">
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
                                <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2">
                                    {products.map((p) => (
                                        <div
                                            key={p.id}
                                            className="w-[178px] shrink-0"
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
                <div
                    key={i}
                    className="rounded-[24px] border border-orange-100 bg-white p-2.5 shadow-sm"
                >
                    <div className="h-[150px] w-full animate-pulse rounded-2xl bg-orange-100/70" />
                    <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-neutral-200" />
                    <div className="mt-2 h-3 w-full animate-pulse rounded bg-neutral-100" />
                    <div className="mt-1 h-3 w-5/6 animate-pulse rounded bg-neutral-100" />
                    <div className="mt-3 h-3 w-20 animate-pulse rounded bg-neutral-100" />
                    <div className="mt-2 h-5 w-16 animate-pulse rounded bg-neutral-200" />
                    <div className="mt-3 h-10 w-full animate-pulse rounded-2xl bg-orange-100" />
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

    const finalPrice = hasDiscount ? p.discounted_price : p.price;

    const displayImage = p.singleImage || p.images?.[0] || p.image?.[0];

    return (
        <div className="group rounded-[24px] border border-orange-100 bg-white p-2.5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_18px_40px_rgba(15,42,94,0.10)]">
            <Link
                href={href}
                className="relative block h-[150px] w-full overflow-hidden rounded-2xl border border-orange-100 bg-gradient-to-br from-white to-orange-50"
            >
                {discountPercent ? (
                    <span className="absolute left-2 top-2 z-10 inline-flex items-center gap-1 rounded-full bg-red-500 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
                        <Tag className="h-3 w-3" />
                        -{discountPercent}%
                    </span>
                ) : null}

                {displayImage ? (
                    <Image
                        src={imgUrl(displayImage)}
                        alt={p.displayName || "Product"}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="(max-width: 1024px) 178px, 220px"
                        unoptimized
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-neutral-400">
                        No Image
                    </div>
                )}
            </Link>

            <Link href={href} className="mt-3 block">
                <h3 className="line-clamp-1 text-[13px] font-bold text-neutral-950 transition group-hover:text-[#1a4b8f]">
                    {p.displayName}
                </h3>
            </Link>

            <p className="mt-1.5 line-clamp-2 min-h-[38px] text-[11px] leading-[1.7] text-neutral-500">
                {p.displaySummary || ""}
            </p>

            <div className="mt-2 flex min-h-[20px] items-center gap-1 text-[11px]">
                {totalReviews > 0 ? (
                    <>
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />

                        <span className="font-bold text-neutral-900">
                            {averageRating.toFixed(1)}
                        </span>

                        <span className="text-neutral-500">
                            ({totalReviews}{" "}
                            {totalReviews === 1 ? reviewText : reviewsText})
                        </span>
                    </>
                ) : (
                    <span className="text-neutral-400">{notRatedYetText}</span>
                )}
            </div>

            <div className="mt-1 min-h-[18px] text-[11px]">
                {hasDiscount ? (
                    <div className="flex items-center gap-1.5">
                        <span className="text-neutral-400 line-through">
                            {money(p.price)}
                        </span>

                        {discountPercent ? (
                            <span className="font-bold text-red-500">
                                -{discountPercent}%
                            </span>
                        ) : null}
                    </div>
                ) : (
                    <div />
                )}
            </div>

            <div className="text-[16px] font-bold leading-none text-[#1a4b8f]">
                {money(finalPrice)}
            </div>

            <button
                type="button"
                disabled={busy}
                onClick={() => addToCart(p.id, 1, p)}
                className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-2xl bg-[#1a4b8f] px-2 text-[11px] font-bold text-white shadow-sm transition hover:bg-[#0f2a5e] disabled:cursor-not-allowed disabled:opacity-60"
            >
                <ShoppingCart className="h-3.5 w-3.5" />
                {addToCartText}
            </button>
        </div>
    );
}