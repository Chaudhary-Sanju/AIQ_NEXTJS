"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
    Search,
    ShoppingCart,
    ChevronLeft,
    ChevronRight,
    PackageCheck,
    Star,
    Tag,
    SlidersHorizontal,
    LayoutGrid,
} from "lucide-react";
import { TbTruckDelivery } from "react-icons/tb"; // for free delivery icon
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
    prev: {
        en: "Prev",
        ne: "अघिल्लो",
        zh: "上一页",
    },
    next: {
        en: "Next",
        ne: "अर्को",
        zh: "下一页",
    },
    categories: {
        en: "Categories",
        ne: "कोटीहरू",
        zh: "分类",
    },
    allCategories: {
        en: "All Categories",
        ne: "सबै कोटीहरू",
        zh: "全部分类",
    },
    // TAB LABELS (new)
    allProducts: {
        en: "All Products",
        ne: "सबै उत्पादनहरू",
        zh: "全部商品",
    },
    "bulkPurchase": {
        "en": "Bulk Purchase (Free Delivery)",
        "ne": "थोक खरिद (निःशुल्क डेलिभरी)",
        "zh": "批量采购（免费配送）"
    },
    "bbqDelivery": {
        "en": "BBQ & Delivery Services",
        "ne": "बार्बेक्यु र डेलिभरी सेवा",
        "zh": "烧烤与配送服务"
    },
    nepaliProduct: {
        en: "Nepali Product (Made In Nepal)",
        ne: "नेपाली उत्पादन (नेपालमा बनेको)",
        zh: "尼泊尔产品（尼泊尔制造）",
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

const getFirstImage = (product) => {
    if (Array.isArray(product?.images) && product.images.length) return product.images[0];
    if (Array.isArray(product?.image) && product.image.length) return product.image[0];
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
        displayName: pick(p?.name, locale) || "Product",
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
            averageRating: Number(p?.reviewSummary?.averageRating ?? p?.rating?.average ?? 0),
            totalReviews: Number(p?.reviewSummary?.totalReviews ?? p?.rating?.totalReviews ?? 0),
        },
    };
};

export default function ProductsPageView({ locale = "en", dict }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [rows, setRows] = useState([]);
    const [categories, setCategories] = useState([]);
    const [categoryInfo, setCategoryInfo] = useState(null);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [categoryLoading, setCategoryLoading] = useState(true);
    const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");

    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "";
    const category = searchParams.get("category") || "";

    const t = {
        title: dict?.productsPage?.title || UI.title[locale] || UI.title.en,
        subtitle: dict?.productsPage?.subtitle || UI.subtitle[locale] || UI.subtitle.en,
        searchPlaceholder: dict?.productsPage?.searchPlaceholder || UI.searchPlaceholder[locale] || UI.searchPlaceholder.en,
        sortLabel: dict?.productsPage?.sortLabel || UI.sortLabel[locale] || UI.sortLabel.en,
        noProducts: dict?.productsPage?.noProducts || UI.noProducts[locale] || UI.noProducts.en,
        addToCart: dict?.productsPage?.addToCart || UI.addToCart[locale] || UI.addToCart.en,
        results: dict?.productsPage?.results || UI.results[locale] || UI.results.en,
        page: dict?.productsPage?.page || UI.page[locale] || UI.page.en,
        notRatedYet: dict?.productsPage?.notRatedYet || UI.notRatedYet[locale] || UI.notRatedYet.en,
        review: dict?.productsPage?.review || UI.review[locale] || UI.review.en,
        reviews: dict?.productsPage?.reviews || UI.reviews[locale] || UI.reviews.en,
        prev: dict?.productsPage?.prev || UI.prev[locale] || UI.prev.en,
        next: dict?.productsPage?.next || UI.next[locale] || UI.next.en,
        categories: dict?.productsPage?.categories || UI.categories[locale] || UI.categories.en,
        allCategories: dict?.productsPage?.allCategories || UI.allCategories[locale] || UI.allCategories.en,
    };

    // Tab labels with multi-language support
    const tabsLabels = {
        allProducts: dict?.productsPage?.allProducts || UI.allProducts[locale] || UI.allProducts.en,
        bulkPurchase: dict?.productsPage?.bulkPurchase || UI.bulkPurchase[locale] || UI.bulkPurchase.en,
        bbqDelivery: dict?.productsPage?.bbqDelivery || UI.bbqDelivery[locale] || UI.bbqDelivery.en,
        nepaliProduct: dict?.productsPage?.nepaliProduct || UI.nepaliProduct[locale] || UI.nepaliProduct.en,
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
        if (!params.get("page")) params.set("page", "1");
        if (!params.get("limit")) params.set("limit", "10");
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
                updateQuery({ search: searchInput || "", page: 1, limit });
            }
        }, 450);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchInput]);

    useEffect(() => {
        setSearchInput(search);
    }, [search]);

    useEffect(() => {
        let mounted = true;
        async function loadCategories() {
            setCategoryLoading(true);
            try {
                const res = await http.get("/frontend/category");
                const data = Array.isArray(res?.data?.data) ? res.data.data : [];
                if (mounted) setCategories(data.filter((c) => c?.status === true));
            } catch (e) {
                console.error("Categories fetch error:", e);
                if (mounted) setCategories([]);
            } finally {
                if (mounted) setCategoryLoading(false);
            }
        }
        loadCategories();
        return () => { mounted = false; };
    }, []);

    useEffect(() => {
        let mounted = true;
        async function load() {
            setLoading(true);
            try {
                const query = new URLSearchParams({ page: String(page), limit: String(limit) });
                if (search) { query.set("search", search); query.set("q", search); }
                if (sortBy) { query.set("sortBy", sortBy); query.set("sort", sortBy); }
                const apiUrl = category
                    ? `/frontend/category/${category}/products?${query.toString()}`
                    : `/frontend/product?${query.toString()}`;
                const res = await http.get(apiUrl);
                const data = Array.isArray(res?.data?.data) ? res.data.data : [];
                const apiCategory = res?.data?.category || null;
                const pag = res?.data?.pagination || normalizeMetaToPagination(res?.data?.meta) || null;
                const mapped = data.filter((p) => p?.status === true).map((p) => normalizeProduct(p, locale));
                if (mounted) {
                    setRows(mapped);
                    setCategoryInfo(apiCategory);
                    setPagination(pag);
                }
            } catch (e) {
                console.error("Products fetch error:", e);
                if (mounted) {
                    setRows([]);
                    setCategoryInfo(null);
                    setPagination(null);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        }
        load();
        return () => { mounted = false; };
    }, [locale, page, limit, search, sortBy, category]);

    const products = useMemo(() => rows, [rows]);
    const pageTitle = category ? pick(categoryInfo?.name, locale) || category : t.title;

    const bulkPurchaseUrl = `/${locale}/bulk-purchase?page=1&limit=10`;
    const isBulkPurchasePage = pathname === `/${locale}/bulk-purchase`;

    return (
        <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-white to-blue-50 py-8 md:py-12">
            <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />
            <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />

            <div className="relative mx-auto w-full max-w-7xl px-4 md:px-6">
                {/* Header & search/sort bar */}
                <div className="mb-6 rounded-[32px] border border-orange-100 bg-white/95 p-5 shadow-[0_18px_45px_rgba(15,42,94,0.08)] backdrop-blur md:p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#1a4b8f]">
                                <PackageCheck className="h-4 w-4" />
                                A Grocery
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight text-neutral-950 md:text-[36px]">{pageTitle}</h1>
                            <p className="mt-1 text-sm leading-6 text-neutral-500">{t.subtitle}</p>
                        </div>
                        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px] lg:w-[720px]">
                            <div className="relative">
                                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                                <input
                                    type="text"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    placeholder={t.searchPlaceholder}
                                    className="h-12 w-full rounded-2xl border border-orange-100 bg-white pl-11 pr-4 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-[#1a4b8f] focus:ring-4 focus:ring-[#1a4b8f]/10"
                                />
                            </div>
                            <div className="relative">
                                <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                                <select
                                    value={sortBy}
                                    onChange={(e) => updateQuery({ sortBy: e.target.value, page: 1, limit })}
                                    className="h-12 w-full appearance-none rounded-2xl border border-orange-100 bg-white px-4 pl-11 text-sm text-neutral-900 outline-none transition focus:border-[#1a4b8f] focus:ring-4 focus:ring-[#1a4b8f]/10"
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
                </div>

                {/* TABS SECTION – multi-language */}
                <div className="mb-6 flex flex-wrap gap-2 border-b border-orange-100 pb-2">
                    <button
                        type="button"
                        onClick={() => {
                            if (isBulkPurchasePage) {
                                router.push(`/${locale}/product?page=1&limit=10`);
                            } else {
                                updateQuery({ category: "", page: 1 });
                            }
                        }}
                        className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${!isBulkPurchasePage && !category
                            ? "bg-[#1a4b8f] text-white shadow-md shadow-[#1a4b8f]/20"
                            : "bg-white text-neutral-700 hover:bg-orange-50 hover:text-[#1a4b8f] border border-orange-200"
                            }`}
                    >
                        {tabsLabels.allProducts}
                    </button>

                    <Link
                        href={bulkPurchaseUrl}
                        className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${isBulkPurchasePage
                            ? "bg-[#1a4b8f] text-white shadow-md shadow-[#1a4b8f]/20"
                            : "bg-white text-neutral-700 hover:bg-orange-50 hover:text-[#1a4b8f] border border-orange-200"
                            }`}
                    >
                        {tabsLabels.bulkPurchase}
                    </Link>

                    <button
                        type="button"
                        onClick={() => {
                            if (!isBulkPurchasePage) {
                                updateQuery({ category: "bbq", page: 1 });
                            } else {
                                router.push(`/${locale}/product?category=bbq&page=1&limit=10`);
                            }
                        }}
                        className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${!isBulkPurchasePage && category === "bbq"
                            ? "bg-[#1a4b8f] text-white shadow-md shadow-[#1a4b8f]/20"
                            : "bg-white text-neutral-700 hover:bg-orange-50 hover:text-[#1a4b8f] border border-orange-200"
                            }`}
                    >
                        {tabsLabels.bbqDelivery}
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            if (!isBulkPurchasePage) {
                                updateQuery({ category: "madeinnepal", page: 1 });
                            } else {
                                router.push(`/${locale}/product?category=madeinnepal&page=1&limit=10`);
                            }
                        }}
                        className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${!isBulkPurchasePage && category === "madeinnepal"
                            ? "bg-[#1a4b8f] text-white shadow-md shadow-[#1a4b8f]/20"
                            : "bg-white text-neutral-700 hover:bg-orange-50 hover:text-[#1a4b8f] border border-orange-200"
                            }`}
                    >
                        {tabsLabels.nepaliProduct}
                    </button>
                </div>

                {/* Main grid: sidebar + products */}
                <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
                    <CategorySidebar
                        locale={locale}
                        t={t}
                        categories={categories}
                        activeCategory={category}
                        updateQuery={updateQuery}
                        loading={categoryLoading}
                    />

                    <div className="min-w-0">
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-orange-100 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
                            <p className="text-sm font-semibold text-neutral-600">
                                <span className="font-bold text-[#1a4b8f]">{pagination?.totalItems || 0}</span>{" "}
                                {t.results}
                            </p>
                            {pagination && (
                                <p className="text-sm font-semibold text-neutral-500">
                                    {t.page}{" "}
                                    <span className="text-neutral-900">{pagination.currentPage}</span> /{" "}
                                    {pagination.totalPages}
                                </p>
                            )}
                        </div>

                        {loading ? (
                            <SkeletonGrid count={Math.min(limit, 10)} />
                        ) : products.length === 0 ? (
                            <div className="rounded-[28px] border border-dashed border-orange-200 bg-white/90 p-8 text-center text-sm font-semibold text-neutral-500 shadow-sm">
                                {t.noProducts}
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-4">
                                    {products.map((p) => (
                                        <ProductCard
                                            key={p.id}
                                            p={p}
                                            locale={locale}
                                            addToCartText={t.addToCart}
                                            notRatedYetText={t.notRatedYet}
                                            reviewText={t.review}
                                            reviewsText={t.reviews}
                                        />
                                    ))}
                                </div>
                                {pagination?.totalPages > 1 && (
                                    <Pagination pagination={pagination} updateQuery={updateQuery} t={t} limit={limit} />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

// ==================== Helper Components ====================

function CategorySidebar({ locale, t, categories, activeCategory, updateQuery, loading }) {
    return (
        <aside className="h-fit rounded-[28px] border border-orange-100 bg-white/95 p-4 shadow-sm lg:sticky lg:top-24">
            <div className="mb-4 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-50 text-[#1a4b8f]">
                    <LayoutGrid className="h-5 w-5" />
                </div>
                <div>
                    <h2 className="text-base font-extrabold text-neutral-900">{t.categories}</h2>
                    <p className="text-xs text-neutral-500">{categories.length} {t.results}</p>
                </div>
            </div>
            <div className="space-y-2">
                <button
                    type="button"
                    onClick={() => updateQuery({ category: "", page: 1 })}
                    className={`flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-3 text-left text-sm font-semibold transition ${!activeCategory
                        ? "bg-[#1a4b8f] text-white shadow-md"
                        : "border border-orange-100 bg-orange-50/60 text-neutral-700 hover:border-[#1a4b8f] hover:text-[#1a4b8f]"
                        }`}
                >
                    <span className="line-clamp-1">{t.allCategories}</span>
                </button>
                {loading
                    ? Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="h-12 animate-pulse rounded-2xl bg-orange-100/70" />
                    ))
                    : categories.map((cat) => {
                        const isActive = activeCategory === cat.slug;
                        return (
                            <button
                                key={cat._id}
                                type="button"
                                onClick={() => updateQuery({ category: cat.slug, page: 1 })}
                                className={`flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-3 text-left text-sm font-semibold transition ${isActive
                                    ? "bg-[#1a4b8f] text-white shadow-md"
                                    : "border border-orange-100 bg-white text-neutral-700 hover:border-[#1a4b8f] hover:text-[#1a4b8f]"
                                    }`}
                            >
                                <span className="line-clamp-1">{pick(cat?.name, locale) || cat?.slug}</span>
                                <span className={`inline-flex min-w-[34px] items-center justify-center rounded-full px-2 py-1 text-xs font-bold ${isActive ? "bg-white/15 text-white" : "bg-orange-50 text-[#1a4b8f]"
                                    }`}>
                                    {Number(cat?.productCount || 0)}
                                </span>
                            </button>
                        );
                    })}
            </div>
        </aside>
    );
}

function normalizeMetaToPagination(meta) {
    if (!meta) return null;
    const currentPage = Number(meta.page || 1);
    const totalPages = Number(meta.totalPages || 1);
    return {
        currentPage,
        totalPages,
        totalItems: Number(meta.total || 0),
        hasPrevPage: Boolean(meta.hasPrev),
        hasNextPage: Boolean(meta.hasNext),
        prevPage: currentPage > 1 ? currentPage - 1 : null,
        nextPage: currentPage < totalPages ? currentPage + 1 : null,
    };
}

function SkeletonGrid({ count = 10 }) {
    return (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="rounded-[24px] border border-orange-100 bg-white p-2.5 shadow-sm">
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

function Pagination({ pagination, updateQuery, t, limit }) {
    const pages = getVisiblePages(pagination.currentPage, pagination.totalPages);
    return (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <button
                type="button"
                disabled={!pagination?.hasPrevPage}
                onClick={() => updateQuery({ page: pagination.prevPage || 1, limit })}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-orange-200 bg-white px-4 text-sm font-bold text-neutral-700 transition hover:border-[#1a4b8f] hover:text-[#1a4b8f] disabled:cursor-not-allowed disabled:opacity-50"
            >
                <ChevronLeft className="h-4 w-4" /> {t.prev}
            </button>
            {pages.map((pageNum, index) => {
                if (pageNum === "...") {
                    return (
                        <span key={`dots-${index}`} className="flex h-11 min-w-[44px] items-center justify-center rounded-xl border border-orange-100 bg-white px-3 text-sm font-bold text-neutral-400">
                            ...
                        </span>
                    );
                }
                const active = pageNum === pagination.currentPage;
                return (
                    <button
                        key={pageNum}
                        type="button"
                        onClick={() => updateQuery({ page: pageNum, limit })}
                        className={`h-11 min-w-[44px] rounded-xl px-3 text-sm font-bold transition ${active
                            ? "bg-[#1a4b8f] text-white shadow-lg shadow-[#1a4b8f]/20"
                            : "border border-orange-200 bg-white text-neutral-700 hover:border-[#1a4b8f] hover:text-[#1a4b8f]"
                            }`}
                    >
                        {pageNum}
                    </button>
                );
            })}
            <button
                type="button"
                disabled={!pagination?.hasNextPage}
                onClick={() => updateQuery({ page: pagination.nextPage || pagination.currentPage, limit })}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-orange-200 bg-white px-4 text-sm font-bold text-neutral-700 transition hover:border-[#1a4b8f] hover:text-[#1a4b8f] disabled:cursor-not-allowed disabled:opacity-50"
            >
                {t.next} <ChevronRight className="h-4 w-4" />
            </button>
        </div>
    );
}

function getVisiblePages(currentPage, totalPages) {
    if (totalPages <= 7) return Array.from({ length: totalPages }).map((_, i) => i + 1);
    const pages = [1];
    if (currentPage > 4) pages.push("...");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 3) pages.push("...");
    pages.push(totalPages);
    return pages;
}

function ProductCard({ p, locale, addToCartText, notRatedYetText, reviewText, reviewsText }) {
    const { addToCart, busy } = useCart();
    const [error, setError] = useState("");
    const href = `/${locale}/product/${p.slug}`;
    const averageRating = Number(p?.reviewSummary?.averageRating || 0);
    const totalReviews = Number(p?.reviewSummary?.totalReviews || 0);
    const hasDiscount = p.discounted_price !== null && p.discounted_price !== undefined && String(p.discounted_price) !== "" && Number(p.discounted_price) < Number(p.price);
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
    const stock = Number(p?.qty ?? p?.stock ?? 0);
    const hasStock = p?.sellOnNoStock ? true : stock > 0;

    const handleAddToCart = () => {
        setError("");
        if (p?.sellOnNoStock) {
            addToCart(p.id, 1, p);
            return;
        }
        if (stock <= 0) {
            setError("No Stock");
            return;
        }
        addToCart(p.id, 1, p);
    };

    return (
        <div className="group flex h-full flex-col rounded-[24px] border border-orange-100 bg-white p-2.5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_18px_40px_rgba(15,42,94,0.10)]">
            <Link href={href} className="relative block h-[150px] w-full overflow-hidden rounded-2xl border border-orange-100 bg-gradient-to-br from-white to-orange-50">
                {/* Discount badge (top-left) */}
                {discountPercent && (
                    <span className="absolute left-2 top-2 z-10 inline-flex items-center gap-1 rounded-full bg-red-500 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
                        <Tag className="h-3 w-3" /> -{discountPercent}%
                    </span>
                )}
                {/* FREE DELIVERY badge (top-right) */}
                <span className="absolute right-2 top-2 z-10 inline-flex items-center rounded-full bg-emerald-600 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
                    <TbTruckDelivery className="me-1 h-3 w-3" /> Free Delivery
                </span>
                {displayImage ? (
                    <Image src={imgUrl(displayImage)} alt={p.displayName || "Product"} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 1024px) 178px, 220px" unoptimized />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-neutral-400">No Image</div>
                )}
            </Link>
            <Link href={href} className="mt-3 block">
                <h3 className="line-clamp-1 text-[13px] font-bold text-neutral-950 transition group-hover:text-[#1a4b8f]">{p.displayName}</h3>
            </Link>
            <p className="mt-1.5 line-clamp-2 min-h-[38px] text-[11px] leading-[1.7] text-neutral-500">{p.displaySummary || ""}</p>
            <div className="mt-2 flex min-h-[20px] items-center gap-1 text-[11px]">
                {totalReviews > 0 ? (
                    <>
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-neutral-900">{averageRating.toFixed(1)}</span>
                        <span className="text-neutral-500">({totalReviews} {totalReviews === 1 ? reviewText : reviewsText})</span>
                    </>
                ) : (
                    <span className="text-neutral-400">{notRatedYetText}</span>
                )}
            </div>
            <div className="mt-1 min-h-[18px] text-[11px]">
                {hasDiscount ? (
                    <div className="flex items-center gap-1.5">
                        <span className="text-neutral-400 line-through">{money(p.price)}</span>
                        {discountPercent && <span className="font-bold text-red-500">-{discountPercent}%</span>}
                    </div>
                ) : (
                    <span className="invisible">discount</span>
                )}
            </div>
            <div className="text-[16px] font-bold leading-none text-[#1a4b8f]">{money(finalPrice)}</div>
            <div className="mt-1 min-h-[16px] text-[11px] font-semibold">
                {!p?.sellOnNoStock ? (
                    stock > 0 ? <span className="text-neutral-500">Stock: {stock}</span> : <span className="text-red-500">No Stock</span>
                ) : (
                    <span className="invisible">Stock</span>
                )}
            </div>
            <div className="mt-2 min-h-[16px] text-[11px] font-semibold text-red-500">
                {error ? error : <span className="invisible">message</span>}
            </div>
            <button
                type="button"
                disabled={busy || !hasStock}
                onClick={handleAddToCart}
                className="mt-auto flex h-10 w-full items-center justify-center gap-2 rounded-2xl bg-[#1a4b8f] px-2 text-[11px] font-bold text-white shadow-sm transition hover:bg-[#0f2a5e] disabled:cursor-not-allowed disabled:opacity-60"
            >
                <ShoppingCart className="h-3.5 w-3.5" />
                {hasStock ? addToCartText : "No Stock"}
            </button>
        </div>
    );
}