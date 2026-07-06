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
import ProductShareButton from "@/components/clientComponents/ProductShareButton";

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
    title: {
        en: "Similar Products",
        ne: "मिल्दोजुल्दो उत्पादनहरू",
        zh: "相似商品",
    },
    seeAll: {
        en: "See more products",
        ne: "थप उत्पादन हेर्नुहोस्",
        zh: "查看更多商品",
    },
    noProducts: {
        en: "No similar products found.",
        ne: "मिल्दोजुल्दो उत्पादनहरू फेला परेनन्।",
        zh: "未找到相似商品。",
    },
    addToCart: {
        en: "Add to Cart",
        ne: "कार्टमा थप्नुहोस्",
        zh: "加入购物车",
    },
    noReviewYet: {
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
    noStock: {
        en: "No Stock",
        ne: "स्टक छैन",
        zh: "缺货",
    },
    noMoreStock: {
        en: "No more stock available",
        ne: "थप स्टक उपलब्ध छैन",
        zh: "没有更多库存",
    },
};

const makeCartProduct = (p, locale = "en") => {
    return {
        _id: p.id,
        id: p.id,
        slug: p.slug || "",
        name: {
            en: p.name || "Product",
            ne: p.name || "Product",
            zh: p.name || "Product",
            [locale]: p.name || "Product",
        },
        summary: {
            en: p.summary || "",
            ne: p.summary || "",
            zh: p.summary || "",
            [locale]: p.summary || "",
        },
        price: p.price,
        discounted_price: p.discounted_price,
        image: p.image ? [p.image] : [],
        images: p.image ? [p.image] : [],
        qty: p.qty,
        stock: p.stock,
        sellOnNoStock: p.sellOnNoStock,
    };
};

export default function SimilarProductsSection({
    locale = "en",
    slug,
    limit = 6,
    className = "my-8",
    title,
    seeAllHref,
}) {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);

    const resolvedTitle = title || UI?.title?.[locale] || UI?.title?.en;
    const resolvedSeeAll = UI?.seeAll?.[locale] || UI?.seeAll?.en;
    const resolvedEmpty = UI?.noProducts?.[locale] || UI?.noProducts?.en;
    const resolvedSeeAllHref =
        seeAllHref || `/${locale}/product?page=1&limit=10`;

    useEffect(() => {
        let mounted = true;

        async function load() {
            if (!slug) {
                setRows([]);
                setLoading(false);
                return;
            }

            setLoading(true);

            try {
                const res = await http.get(
                    `/frontend/product/related/${slug}?limit=${limit}`
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
                        discounted_price:
                            p?.discounted_price ?? p?.discountPrice ?? null,
                        image: Array.isArray(p?.images)
                            ? p.images[0]
                            : Array.isArray(p?.image)
                                ? p.image[0]
                                : typeof p?.image === "string"
                                    ? p.image
                                    : null,
                        qty: p?.qty,
                        stock: p?.stock,
                        sellOnNoStock: p?.sellOnNoStock,
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
    }, [slug, limit, locale]);

    const products = useMemo(() => rows, [rows]);

    if (!loading && products.length === 0) return null;

    return (
        <section className={className}>
            <div className="mx-auto w-full max-w-7xl px-4 pt-10 md:px-6">
                <div className="rounded-[32px] border border-orange-100 bg-white/95 p-4 shadow-[0_18px_45px_rgba(15,42,94,0.08)] backdrop-blur md:p-5 lg:p-6">
                    <div className="mb-5 flex items-center justify-between gap-3">
                        <div>
                            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#1a4b8f]">
                                <PackageCheck className="h-4 w-4" />
                                Products
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
                            {resolvedEmpty}
                        </div>
                    ) : (
                        <>
                            <div className="hidden lg:grid lg:grid-cols-5 lg:gap-4">
                                {products.map((p) => (
                                    <div key={p.id} className="flex">
                                        <ProductCard p={p} locale={locale} />
                                    </div>
                                ))}
                            </div>

                            <div className="lg:hidden">
                                <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2">
                                    {products.map((p) => (
                                        <div
                                            key={p.id}
                                            className="flex w-[178px] shrink-0"
                                        >
                                            <ProductCard p={p} locale={locale} />
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

function SkeletonGrid({ count = 5 }) {
    return (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
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
    const { addToCart, busy, cartItems = [] } = useCart();
    const [error, setError] = useState("");

    const href = `/${locale}/product/${p.slug}`;

    const addToCartText = UI.addToCart?.[locale] || UI.addToCart.en;
    const noReviewYetText = UI.noReviewYet?.[locale] || UI.noReviewYet.en;
    const reviewText = UI.review?.[locale] || UI.review.en;
    const reviewsText = UI.reviews?.[locale] || UI.reviews.en;
    const noStockText = UI.noStock?.[locale] || UI.noStock.en;
    const noMoreStockText = UI.noMoreStock?.[locale] || UI.noMoreStock.en;

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

    const stock = Number(p?.qty ?? p?.stock ?? 0);
    const hasStock = p?.sellOnNoStock ? true : stock > 0;

    const existingCartQty = Array.isArray(cartItems)
        ? cartItems.reduce((sum, item) => {
            const itemId = item?.productId || item?._id || item?.id;
            return itemId === p.id ? sum + Number(item?.quantity || 0) : sum;
        }, 0)
        : 0;

    const handleAddToCart = () => {
        setError("");

        if (p?.sellOnNoStock) {
            addToCart(p.id, 1, makeCartProduct(p, locale));
            return;
        }

        if (stock <= 0) {
            setError(noStockText);
            return;
        }

        if (existingCartQty >= stock) {
            setError(noMoreStockText);
            return;
        }

        addToCart(p.id, 1, makeCartProduct(p, locale));
    };

    return (
        <div className="group flex h-full w-full flex-col rounded-[24px] border border-orange-100 bg-white p-2.5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_18px_40px_rgba(15,42,94,0.10)]">
            <div className="relative h-[150px] w-full overflow-hidden rounded-2xl border border-orange-100 bg-gradient-to-br from-white to-orange-50">
                <Link href={href} className="block h-full w-full">
                    {discountPercent ? (
                        <span className="absolute left-2 top-2 z-10 inline-flex items-center gap-1 rounded-full bg-red-500 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
                            <Tag className="h-3 w-3" />
                            -{discountPercent}%
                        </span>
                    ) : null}

                    {p.image ? (
                        <Image
                            src={imgUrl(p.image)}
                            alt={p.name || "Product"}
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

                <ProductShareButton
                    locale={locale}
                    slug={p.slug}
                    title={p.name || "Product"}
                    summary={p.summary || ""}
                    className="absolute bottom-2 right-2 z-20"
                />
            </div>

            <Link href={href} className="mt-3 block">
                <h3 className="line-clamp-1 text-[13px] font-bold text-neutral-950 transition group-hover:text-[#1a4b8f]">
                    {p.name}
                </h3>
            </Link>

            <p className="mt-1.5 line-clamp-2 min-h-[38px] text-[11px] leading-[1.7] text-neutral-500">
                {p.summary || ""}
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
                    <span className="text-neutral-400">{noReviewYetText}</span>
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
                    <span className="invisible">discount</span>
                )}
            </div>

            <div className="text-[16px] font-bold leading-none text-[#1a4b8f]">
                {money(hasDiscount ? p.discounted_price : p.price)}
            </div>

            <div className="mt-1 min-h-[16px] text-[11px] font-semibold">
                {!p?.sellOnNoStock ? (
                    hasStock ? (
                        <span className="text-neutral-500">Stock: {stock}</span>
                    ) : (
                        <span className="text-red-500">{noStockText}</span>
                    )
                ) : (
                    <span className="invisible">Stock placeholder</span>
                )}
            </div>

            <div className="mt-2 min-h-[16px] text-[11px] font-semibold text-red-500">
                {error ? error : <span className="invisible">Error placeholder</span>}
            </div>

            <button
                type="button"
                disabled={busy || !hasStock}
                onClick={handleAddToCart}
                className="mt-auto flex h-10 w-full items-center justify-center gap-2 rounded-2xl bg-[#1a4b8f] px-2 text-[11px] font-bold text-white shadow-sm transition hover:bg-[#0f2a5e] disabled:cursor-not-allowed disabled:opacity-60"
            >
                <ShoppingCart className="h-3.5 w-3.5" />
                {hasStock ? addToCartText : noStockText}
            </button>
        </div>
    );
}