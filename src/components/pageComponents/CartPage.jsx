"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Minus,
    Plus,
    ShoppingBag,
    Trash2,
    X,
    ArrowRight,
    PackageCheck,
    ShieldCheck,
    Truck,
} from "lucide-react";

import { imgUrl } from "@/lib";
import { useCart } from "@/contexts/CartContext";

const pick = (obj, locale = "en") => {
    if (!obj || typeof obj !== "object") return "";
    return obj?.[locale] || obj?.en || obj?.ne || obj?.zh || "";
};

const money = (n) => {
    const num = Number(n);
    if (Number.isNaN(num)) return "HK$ 0";
    return `HK$ ${num}`;
};

const t = {
    en: {
        cart: "Shopping Cart",
        empty: "Your cart is empty.",
        emptyDesc: "Looks like you haven’t added anything to your cart yet.",
        continue: "Continue Shopping",
        clear: "Clear Cart",
        summary: "Order Summary",
        subtotal: "Subtotal",
        total: "Total",
        checkout: "Proceed to Checkout",
        remove: "Remove",
        items: "items",
        stock: "Stock",
        outOfStock: "Out of stock",
        maxStock: "Maximum stock reached",
        sale: "Sale",
        noImage: "No Image",
        secure: "Secure checkout",
        delivery: "Fast delivery support",
        support: "Reliable service",
    },
    ne: {
        cart: "शपिङ कार्ट",
        empty: "तपाईंको कार्ट खाली छ।",
        emptyDesc: "तपाईंले अहिलेसम्म कुनै उत्पादन कार्टमा थप्नुभएको छैन।",
        continue: "किनमेल जारी राख्नुहोस्",
        clear: "कार्ट खाली गर्नुहोस्",
        summary: "अर्डर सारांश",
        subtotal: "सबटोटल",
        total: "कुल",
        checkout: "चेकआउट गर्नुहोस्",
        remove: "हटाउनुहोस्",
        items: "वस्तुहरू",
        stock: "स्टक",
        outOfStock: "स्टक सकियो",
        maxStock: "अधिकतम स्टक पुग्यो",
        sale: "सेल",
        noImage: "तस्बिर छैन",
        secure: "सुरक्षित चेकआउट",
        delivery: "छिटो डेलिभरी सहयोग",
        support: "भरपर्दो सेवा",
    },
    zh: {
        cart: "购物车",
        empty: "您的购物车是空的。",
        emptyDesc: "您还没有将任何商品添加到购物车。",
        continue: "继续购物",
        clear: "清空购物车",
        summary: "订单摘要",
        subtotal: "小计",
        total: "总计",
        checkout: "去结账",
        remove: "移除",
        items: "件商品",
        stock: "库存",
        outOfStock: "缺货",
        maxStock: "已达最大库存",
        sale: "优惠",
        noImage: "无图片",
        secure: "安全结账",
        delivery: "快速配送支持",
        support: "可靠服务",
    },
};

const normalizeCartItems = (items = [], locale = "en") => {
    return items
        .map((item, index) => {
            const product =
                item?.productId && typeof item.productId === "object"
                    ? item.productId
                    : {};

            const productId = product?._id || item?.productId || item?._id || index;

            const price = Number(item?.price || product?.price || 0);
            const discount = item?.discounted_price ?? product?.discounted_price;

            const hasDiscount =
                discount !== null &&
                discount !== undefined &&
                discount !== "" &&
                Number(discount) < price;

            const finalPrice = hasDiscount ? Number(discount) : price;
            const quantity = Number(item?.quantity || 1);

            return {
                id: productId,
                slug: product?.slug || "",
                name: pick(product?.name, locale) || (typeof product?.name === "string" ? product.name : "Product"),
                summary: pick(product?.summary, locale) || (typeof product?.summary === "string" ? product.summary : ""),
                image: Array.isArray(product?.images)
                    ? product.images[0]
                    : Array.isArray(product?.image)
                        ? product.image[0]
                        : null,

                price,
                discounted_price: discount,
                hasDiscount,
                finalPrice,
                quantity,
                lineTotal: finalPrice * quantity,

                stock: Number(product?.qty || 0),
                sellOnNoStock: Boolean(product?.sellOnNoStock),
            };
        })
        .filter((item) => item?.id);
};

export default function CartPage({ locale = "en" }) {
    const lang = t[locale] || t.en;

    const { cart, loading, busy, updateQty, removeItem, clearCart } = useCart();

    const [updatingItemId, setUpdatingItemId] = useState(null);

    const rawItems = Array.isArray(cart?.items) ? cart.items : [];

    const products = useMemo(() => {
        return normalizeCartItems(rawItems, locale);
    }, [rawItems, locale]);

    const productListHref = `/${locale}/product?page=1&limit=10`;

    const handleQtyUpdate = async (id, qty) => {
        try {
            setUpdatingItemId(String(id));
            await updateQty(id, qty);
        } finally {
            setUpdatingItemId(null);
        }
    };

    if (loading && !cart) {
        return (
            <main className="min-h-[70vh] bg-gradient-to-br from-orange-50 via-white to-blue-50">
                <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
                    <div className="mb-6 h-9 w-52 animate-pulse rounded-xl bg-orange-100" />

                    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_370px]">
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="h-36 animate-pulse rounded-3xl bg-white shadow-sm ring-1 ring-orange-100"
                                />
                            ))}
                        </div>

                        <div className="h-72 animate-pulse rounded-3xl bg-white shadow-sm ring-1 ring-orange-100" />
                    </div>
                </div>
            </main>
        );
    }

    if (!products.length) {
        return (
            <main className="relative min-h-[70vh] overflow-hidden bg-gradient-to-br from-orange-50 via-white to-blue-50">
                <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />
                <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />

                <div className="relative mx-auto flex max-w-7xl items-center justify-center px-4 py-16 md:px-6">
                    <div className="mx-auto max-w-md rounded-[32px] border border-orange-100 bg-white/90 p-8 text-center shadow-[0_24px_70px_rgba(15,42,94,0.12)] backdrop-blur">
                        <div className="mx-auto mb-5 flex h-18 w-18 items-center justify-center rounded-full bg-orange-50 text-[#1a4b8f] ring-8 ring-orange-100/60">
                            <ShoppingBag className="h-9 w-9" />
                        </div>

                        <h1 className="text-2xl font-bold text-neutral-950">
                            {lang.cart}
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-neutral-500">
                            {lang.emptyDesc}
                        </p>

                        <Link
                            href={productListHref}
                            className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#1a4b8f] px-6 text-sm font-bold text-white shadow-lg shadow-[#1a4b8f]/20 transition hover:bg-[#0f2a5e]"
                        >
                            {lang.continue}
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-white to-blue-50">
            <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />
            <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-4 py-8 md:px-6 lg:py-10">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#1a4b8f] shadow-sm">
                            <ShoppingBag className="h-4 w-4" />
                            {lang.cart}
                        </div>

                        <h1 className="text-[30px] font-bold tracking-tight text-neutral-950 md:text-4xl">
                            {lang.cart}
                        </h1>

                        <p className="mt-1 text-sm text-neutral-500">
                            {cart?.totalItems || 0} {lang.items}
                        </p>
                    </div>

                    <button
                        type="button"
                        disabled={busy}
                        onClick={clearCart}
                        className="inline-flex h-10 items-center gap-2 rounded-xl border border-red-200 bg-white px-4 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Trash2 className="h-4 w-4" />
                        {lang.clear}
                    </button>
                </div>

                <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_370px]">
                    <section className="space-y-4">
                        {products.map((p) => {
                            const canIncrease = p.sellOnNoStock || p.quantity < p.stock;
                            const isOutOfStock = !p.sellOnNoStock && p.stock <= 0;
                            const isUpdating = updatingItemId === String(p.id);

                            const productHref = p.slug
                                ? `/${locale}/product/${p.slug}`
                                : productListHref;

                            return (
                                <div
                                    key={String(p.id)}
                                    className={[
                                        "group overflow-hidden rounded-[26px] border border-orange-100 bg-white/95 p-3 shadow-sm backdrop-blur transition duration-300 hover:border-orange-200 hover:shadow-[0_18px_45px_rgba(15,42,94,0.08)] md:p-4",
                                        isUpdating ? "opacity-70" : "",
                                    ].join(" ")}
                                >
                                    <div className="flex gap-3 md:gap-4">
                                        <Link
                                            href={productHref}
                                            className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-orange-100 bg-orange-50 md:h-30 md:w-30"
                                        >
                                            {p.image ? (
                                                <Image
                                                    src={imgUrl(p.image)}
                                                    alt={p.name}
                                                    fill
                                                    className="object-cover transition duration-500 group-hover:scale-105"
                                                    sizes="120px"
                                                    unoptimized
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-neutral-400">
                                                    {lang.noImage}
                                                </div>
                                            )}
                                        </Link>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex gap-3">
                                                <div className="min-w-0 flex-1">
                                                    <Link
                                                        href={productHref}
                                                        className="line-clamp-1 text-sm font-bold text-neutral-950 transition hover:text-[#1a4b8f] md:text-base"
                                                    >
                                                        {p.name}
                                                    </Link>

                                                    {p.summary ? (
                                                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-neutral-500">
                                                            {p.summary}
                                                        </p>
                                                    ) : null}

                                                    <div className="mt-2 flex flex-wrap items-center gap-2">
                                                        {p.hasDiscount ? (
                                                            <span className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-500">
                                                                {lang.sale}
                                                            </span>
                                                        ) : null}

                                                        {!p.sellOnNoStock ? (
                                                            <span
                                                                className={[
                                                                    "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                                                                    isOutOfStock
                                                                        ? "bg-red-50 text-red-500"
                                                                        : "bg-orange-50 text-neutral-500",
                                                                ].join(" ")}
                                                            >
                                                                {isOutOfStock
                                                                    ? lang.outOfStock
                                                                    : `${lang.stock}: ${p.stock}`}
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                </div>

                                                <button
                                                    type="button"
                                                    disabled={busy}
                                                    onClick={() => removeItem(p.id)}
                                                    className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-50 text-neutral-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60 md:flex"
                                                    aria-label={lang.remove}
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>

                                            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                                <div>
                                                    <div className="inline-flex items-center overflow-hidden rounded-xl border border-orange-100 bg-white shadow-sm">
                                                        <button
                                                            type="button"
                                                            disabled={isUpdating || p.quantity <= 1}
                                                            onClick={() =>
                                                                handleQtyUpdate(
                                                                    p.id,
                                                                    p.quantity - 1
                                                                )
                                                            }
                                                            className="flex h-9 w-9 items-center justify-center text-neutral-700 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-40"
                                                        >
                                                            <Minus className="h-4 w-4" />
                                                        </button>

                                                        <span className="min-w-10 text-center text-sm font-bold text-neutral-950">
                                                            {isUpdating ? "..." : p.quantity}
                                                        </span>

                                                        <button
                                                            type="button"
                                                            disabled={isUpdating || !canIncrease}
                                                            onClick={() =>
                                                                handleQtyUpdate(
                                                                    p.id,
                                                                    p.quantity + 1
                                                                )
                                                            }
                                                            className="flex h-9 w-9 items-center justify-center text-neutral-700 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-40"
                                                            title={!canIncrease ? lang.maxStock : ""}
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                        </button>
                                                    </div>

                                                    {!canIncrease && !p.sellOnNoStock ? (
                                                        <p className="mt-1 text-[11px] font-medium text-red-500">
                                                            {lang.maxStock}
                                                        </p>
                                                    ) : null}
                                                </div>

                                                <div className="text-right">
                                                    {p.hasDiscount ? (
                                                        <p className="text-xs text-neutral-400">
                                                            <span className="line-through">
                                                                {money(p.price)}
                                                            </span>{" "}
                                                            <span className="font-semibold text-red-500">
                                                                {money(p.finalPrice)}
                                                            </span>{" "}
                                                            × {p.quantity}
                                                        </p>
                                                    ) : (
                                                        <p className="text-xs text-neutral-400">
                                                            {money(p.finalPrice)} × {p.quantity}
                                                        </p>
                                                    )}

                                                    <p className="text-lg font-bold text-[#1a4b8f]">
                                                        {money(p.lineTotal)}
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                disabled={busy}
                                                onClick={() => removeItem(p.id)}
                                                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60 md:hidden"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                                {lang.remove}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </section>

                    <aside className="h-fit rounded-[28px] border border-orange-100 bg-white/95 p-5 shadow-[0_18px_45px_rgba(15,42,94,0.08)] backdrop-blur lg:sticky lg:top-24">
                        <h2 className="text-lg font-bold text-neutral-950">
                            {lang.summary}
                        </h2>

                        <div className="mt-5 space-y-4 text-sm">
                            <div className="flex justify-between gap-4 text-neutral-600">
                                <span>{lang.subtotal}</span>

                                <span className="font-semibold text-neutral-900">
                                    {money(cart?.subTotal || 0)}
                                </span>
                            </div>

                            <div className="h-px bg-orange-100" />

                            <div className="flex justify-between gap-4 text-base">
                                <span className="font-bold text-neutral-950">
                                    {lang.total}
                                </span>

                                <span className="font-bold text-[#1a4b8f]">
                                    {money(cart?.totalAmount || 0)}
                                </span>
                            </div>
                        </div>

                        <Link
                            href={`/${locale}/checkout`}
                            className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1a4b8f] text-sm font-bold text-white shadow-lg shadow-[#1a4b8f]/20 transition hover:bg-[#0f2a5e]"
                        >
                            {lang.checkout}
                            <ArrowRight className="h-4 w-4" />
                        </Link>

                        <Link
                            href={productListHref}
                            className="mt-3 flex h-11 w-full items-center justify-center rounded-xl border border-orange-200 bg-white text-sm font-semibold text-neutral-700 transition hover:bg-orange-50"
                        >
                            {lang.continue}
                        </Link>

                        <div className="mt-5 space-y-3 rounded-2xl bg-orange-50/70 p-4">
                            <TrustItem
                                icon={<ShieldCheck className="h-4 w-4" />}
                                text={lang.secure}
                            />
                            <TrustItem
                                icon={<Truck className="h-4 w-4" />}
                                text={lang.delivery}
                            />
                            <TrustItem
                                icon={<PackageCheck className="h-4 w-4" />}
                                text={lang.support}
                            />
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}

function TrustItem({ icon, text }) {
    return (
        <div className="flex items-center gap-2.5 text-sm font-medium text-neutral-700">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#1a4b8f] shadow-sm">
                {icon}
            </span>
            <span>{text}</span>
        </div>
    );
}