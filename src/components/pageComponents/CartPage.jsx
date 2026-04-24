"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";

import { imgUrl } from "@/lib";
import { useCart } from "@/contexts/CartContext";

const pick = (obj, locale = "en") => {
    if (!obj || typeof obj !== "object") return "";
    return obj?.[locale] || obj?.en || obj?.ne || obj?.zh || "";
};

const money = (n) => {
    const num = Number(n);
    if (Number.isNaN(num)) return "Rs. 0";
    return `Rs. ${num}`;
};

const t = {
    en: {
        cart: "Shopping Cart",
        empty: "Your cart is empty.",
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
    },
    ne: {
        cart: "शपिङ कार्ट",
        empty: "तपाईंको कार्ट खाली छ।",
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
    },
    zh: {
        cart: "购物车",
        empty: "您的购物车是空的。",
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
                name: pick(product?.name, locale) || "Product",
                summary: pick(product?.summary, locale),
                image: Array.isArray(product?.images) ? product.images[0] : null,

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

    const rawItems = Array.isArray(cart?.items) ? cart.items : [];
    const products = normalizeCartItems(rawItems, locale);

    if (loading) {
        return (
            <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
                <div className="mb-5 h-8 w-48 animate-pulse rounded bg-slate-200" />

                <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-32 animate-pulse rounded-2xl bg-slate-200"
                            />
                        ))}
                    </div>

                    <div className="h-64 animate-pulse rounded-2xl bg-slate-200" />
                </div>
            </main>
        );
    }

    if (!products.length) {
        return (
            <main className="mx-auto max-w-7xl px-4 py-12 md:px-6">
                <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#5b4fd4]/10">
                        <ShoppingBag className="h-8 w-8 text-[#5b4fd4]" />
                    </div>

                    <h1 className="text-2xl font-extrabold text-slate-950">
                        {lang.cart}
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">{lang.empty}</p>

                    <Link
                        href={`/${locale}/product`}
                        className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#5b4fd4] px-5 text-sm font-semibold text-white hover:bg-[#4b3fd0]"
                    >
                        {lang.continue}
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-950 md:text-3xl">
                        {lang.cart}
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        {cart?.totalItems || 0} {lang.items}
                    </p>
                </div>

                <button
                    type="button"
                    disabled={busy}
                    onClick={clearCart}
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <Trash2 className="h-4 w-4" />
                    {lang.clear}
                </button>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
                <section className="space-y-3">
                    {products.map((p) => {
                        const canIncrease = p.sellOnNoStock || p.quantity < p.stock;
                        const isOutOfStock = !p.sellOnNoStock && p.stock <= 0;

                        const productHref = p.slug
                            ? `/${locale}/product/${p.slug}`
                            : `/${locale}/product`;

                        return (
                            <div
                                key={String(p.id)}
                                className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm md:p-4"
                            >
                                <div className="flex gap-3 md:gap-4">
                                    <Link
                                        href={productHref}
                                        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 md:h-28 md:w-28"
                                    >
                                        {p.image ? (
                                            <Image
                                                src={imgUrl(p.image)}
                                                alt={p.name}
                                                fill
                                                className="object-cover"
                                                sizes="112px"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-slate-400">
                                                {lang.noImage}
                                            </div>
                                        )}
                                    </Link>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex gap-3">
                                            <div className="min-w-0 flex-1">
                                                <Link
                                                    href={productHref}
                                                    className="line-clamp-1 text-sm font-extrabold text-slate-950 md:text-base"
                                                >
                                                    {p.name}
                                                </Link>

                                                {p.summary ? (
                                                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                                                        {p.summary}
                                                    </p>
                                                ) : null}

                                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                                    {p.hasDiscount ? (
                                                        <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-bold text-red-500">
                                                            {lang.sale}
                                                        </span>
                                                    ) : null}

                                                    {!p.sellOnNoStock ? (
                                                        <span
                                                            className={[
                                                                "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                                                                isOutOfStock
                                                                    ? "bg-red-50 text-red-500"
                                                                    : "bg-slate-100 text-slate-500",
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
                                                className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60 md:flex"
                                                aria-label={lang.remove}
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                            <div>
                                                <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white">
                                                    <button
                                                        type="button"
                                                        disabled={busy || p.quantity <= 1}
                                                        onClick={() => updateQty(p.id, p.quantity - 1)}
                                                        className="flex h-9 w-9 items-center justify-center text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </button>

                                                    <span className="min-w-9 text-center text-sm font-bold">
                                                        {p.quantity}
                                                    </span>

                                                    <button
                                                        type="button"
                                                        disabled={busy || !canIncrease}
                                                        onClick={() => updateQty(p.id, p.quantity + 1)}
                                                        className="flex h-9 w-9 items-center justify-center text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
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
                                                    <p className="text-xs text-slate-400">
                                                        <span className="line-through">
                                                            {money(p.price)}
                                                        </span>{" "}
                                                        <span className="font-semibold text-red-500">
                                                            {money(p.finalPrice)}
                                                        </span>{" "}
                                                        × {p.quantity}
                                                    </p>
                                                ) : (
                                                    <p className="text-xs text-slate-400">
                                                        {money(p.finalPrice)} × {p.quantity}
                                                    </p>
                                                )}

                                                <p className="text-base font-extrabold text-[#5b4fd4]">
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

                <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
                    <h2 className="text-lg font-extrabold text-slate-950">
                        {lang.summary}
                    </h2>

                    <div className="mt-5 space-y-3 text-sm">
                        <div className="flex justify-between gap-4 text-slate-600">
                            <span>{lang.subtotal}</span>

                            <span className="font-semibold text-slate-900">
                                {money(cart?.subTotal || 0)}
                            </span>
                        </div>

                        <div className="h-px bg-slate-100" />

                        <div className="flex justify-between gap-4 text-base">
                            <span className="font-extrabold text-slate-950">
                                {lang.total}
                            </span>

                            <span className="font-extrabold text-[#5b4fd4]">
                                {money(cart?.totalAmount || 0)}
                            </span>
                        </div>
                    </div>

                    <Link
                        href={`/${locale}/checkout`}
                        className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-[#5b4fd4] text-sm font-bold text-white hover:bg-[#4b3fd0]"
                    >
                        {lang.checkout}
                    </Link>

                    <Link
                        href={`/${locale}/product`}
                        className="mt-3 flex h-11 w-full items-center justify-center rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        {lang.continue}
                    </Link>
                </aside>
            </div>
        </main>
    );
}