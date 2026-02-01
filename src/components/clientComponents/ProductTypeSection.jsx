"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Heart, ShoppingCart } from "lucide-react";

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
    featuredProduct: { en: "Featured Products", ne: "विशेष उत्पादनहरू", zh: "精选商品" },
    trendingProduct: { en: "Trending Products", ne: "ट्रेन्डिङ उत्पादनहरू", zh: "热门趋势" },
    hotProduct: { en: "Hot Products", ne: "तातो उत्पादनहरू", zh: "热销商品" },
    mostSearchedProduct: { en: "Most Searched", ne: "धेरै खोजिएका", zh: "搜索最多" },
};

export default function ProductTypeSection({
    locale = "en",
    type = "featuredProduct",
    limit = 10,
    className = "my-10",
    title, // optional override
    seeAllHref, // optional override
}) {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(() => new Set());

    const resolvedTitle =
        title ||
        UI?.[type]?.[locale] ||
        UI?.[type]?.en ||
        type;

    const resolvedSeeAll =
        locale === "ne" ? "सबै हेर्नुहोस्" : locale === "zh" ? "查看全部" : "See All";

    const resolvedSeeAllHref = seeAllHref || `/${locale}/products?type=${type}`;

    useEffect(() => {
        let mounted = true;

        async function load() {
            setLoading(true);
            try {
                const res = await http.get(`/frontend/product/type/${type}?limit=${limit}`);
                const data = Array.isArray(res?.data?.data) ? res.data.data : [];

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

    const toggleLike = (id) => {
        setLiked((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    return (
        <section className={className}>
            <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-extrabold text-slate-900">{resolvedTitle}</h2>

                    <Link
                        href={resolvedSeeAllHref}
                        className="inline-flex items-center gap-2 font-semibold text-slate-900 hover:text-[#4f46e5]"
                    >
                        {resolvedSeeAll}
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#4f46e5] text-white">
                            <ArrowRight className="h-5 w-5" />
                        </span>
                    </Link>
                </div>

                {/* Body */}
                {loading ? (
                    <SkeletonGrid count={Math.min(limit, 10)} />
                ) : products.length === 0 ? (
                    <div className="rounded-xl border bg-white p-6 text-slate-600">No products found.</div>
                ) : (
                    <>
                        {/* Desktop grid */}
                        <div className="hidden gap-4 lg:grid lg:grid-cols-5">
                            {products.map((p) => (
                                <ProductCard
                                    key={p.id}
                                    p={p}
                                    locale={locale}
                                    liked={liked.has(p.id)}
                                    onToggleLike={() => toggleLike(p.id)}
                                />
                            ))}
                        </div>

                        {/* Mobile / tablet horizontal scroll */}
                        <div className="lg:hidden">
                            <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-2">
                                {products.map((p) => (
                                    <div key={p.id} className="w-[220px] shrink-0">
                                        <ProductCard
                                            p={p}
                                            locale={locale}
                                            liked={liked.has(p.id)}
                                            onToggleLike={() => toggleLike(p.id)}
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
        </section>
    );
}

function SkeletonGrid({ count = 10 }) {
    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-black/5">
                    <div className="aspect-square w-full rounded-lg bg-slate-200 animate-pulse" />
                    <div className="mt-3 h-4 w-2/3 rounded bg-slate-200 animate-pulse" />
                    <div className="mt-2 h-3 w-full rounded bg-slate-200 animate-pulse" />
                    <div className="mt-2 h-3 w-4/5 rounded bg-slate-200 animate-pulse" />
                    <div className="mt-4 h-10 w-full rounded-lg bg-slate-200 animate-pulse" />
                </div>
            ))}
        </div>
    );
}

function ProductCard({ p, locale, liked, onToggleLike }) {
    const href = `/${locale}/product/${p.slug}`; // change if your route differs

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
        <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-black/5">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-slate-100">
                {p.image ? (
                    <Link href={href} className="block h-full w-full">
                        <Image
                            src={imgUrl(p.image)}
                            alt={p.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 220px, 20vw"
                            unoptimized
                        />
                    </Link>
                ) : null}

                <button
                    type="button"
                    onClick={onToggleLike}
                    aria-label="Wishlist"
                    className="absolute right-2 top-2 z-10 rounded-full bg-white/90 p-1.5 shadow ring-1 ring-black/5"
                >
                    <Heart className={["h-5 w-5", liked ? "fill-red-500 text-red-500" : "text-red-500"].join(" ")} />
                </button>
            </div>

            <Link href={href} className="mt-3 block">
                <h3 className="line-clamp-1 text-sm font-extrabold text-slate-900">{p.name}</h3>
            </Link>

            <p className="mt-2 line-clamp-2 text-xs text-slate-600 min-h-8">
                {p.summary || "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
            </p>

            <div className="mt-3 flex items-center gap-2 text-xs">
                <span className="text-green-500">★</span>
                <span className="font-semibold text-slate-800">4.0</span>
            </div>

            <div className="mt-3">
                {hasDiscount ? (
                    <div className="flex items-center gap-2 text-sm min-h-7">
                        <span className="text-slate-400 line-through">{money(p.price)}</span>
                        {discountPercent ? <span className="text-red-500">-{discountPercent}%</span> : null}
                    </div>
                ) : <div className="flex items-center gap-2 text-sm min-h-7"></div>}

                <div className="text-sm font-extrabold text-[#4f46e5]">
                    {money(hasDiscount ? p.discounted_price : p.price)}
                </div>
            </div>

            <button
                type="button"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#4f46e5] px-3 py-2 text-sm font-semibold text-white hover:bg-[#4338ca]"
                onClick={() => console.log("add to cart", p.id)}
            >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
            </button>
        </div>
    );
}
