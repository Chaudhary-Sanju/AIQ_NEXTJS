"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Heart } from "lucide-react";
import { imgUrl } from "@/lib";

function pickLocaleField(obj, locale) {
    if (!obj) return "";
    return obj?.[locale] ?? obj?.en ?? Object.values(obj)[0] ?? "";
}

function money(n) {
    const x = Number(n);
    if (Number.isNaN(x)) return n ?? "";
    return x.toString();
}

export default function SoftwareDetailClient({ locale = "en", dict = {}, item }) {
    const title = (pickLocaleField(item?.name, locale) || item?.slug || "").toUpperCase();
    const summary = pickLocaleField(item?.summary, locale);

    const images = Array.isArray(item?.images) ? item.images : [];
    const [active, setActive] = useState(0);
    const [liked, setLiked] = useState(false);

    const cover = useMemo(() => {
        if (!images.length) return null;
        return imgUrl(images[Math.min(active, images.length - 1)]);
    }, [images, active]);

    const price = item?.price;
    const discounted = item?.discounted_price;

    const priceNum = Number(price);
    const discountedNum = Number(discounted);

    const hasDiscount =
        discounted !== undefined &&
        discounted !== null &&
        String(discounted) !== "" &&
        !Number.isNaN(discountedNum) &&
        !Number.isNaN(priceNum) &&
        discountedNum < priceNum;

    const discountPercent = useMemo(() => {
        if (!hasDiscount) return null;
        const pct = Math.round(((priceNum - discountedNum) / priceNum) * 100);
        return Number.isFinite(pct) ? pct : null;
    }, [hasDiscount, priceNum, discountedNum]);

    const t = {
        back: locale === "ne" ? "फिर्ता" : locale === "zh" ? "返回" : "Back",
        price: locale === "ne" ? "मूल्य" : locale === "zh" ? "价格" : "Price",
        mrp: locale === "ne" ? "एमआरपी" : locale === "zh" ? "标价" : "MRP",
        about: locale === "ne" ? "यस वस्तु बारे" : locale === "zh" ? "关于此项目" : "About this item",
        buy: locale === "ne" ? "अहिले किन्नुहोस्" : locale === "zh" ? "立即购买" : "BUY NOW",
        available: locale === "ne" ? "उपलब्ध" : locale === "zh" ? "可用" : "Available",
        unavailable: locale === "ne" ? "अनुपलब्ध" : locale === "zh" ? "不可用" : "Unavailable",
        noImage: locale === "ne" ? "छवि छैन" : locale === "zh" ? "无图片" : "No image",
        noDesc:
            locale === "ne"
                ? "विवरण उपलब्ध छैन।"
                : locale === "zh"
                    ? "暂无描述。"
                    : "No description available.",
        taxNote:
            locale === "ne"
                ? "कर सहित एमआरपी"
                : locale === "zh"
                    ? "含税建议零售价"
                    : "MRP incl. of all taxes",
    };

    return (
        <section className="mx-auto w-full max-w-6xl px-4 pb-14 pt-8">
            {/* Back */}
            <div className="mb-5">
                <Link
                    href={`/${locale}/services/software/listSoftware`}
                    className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 hover:bg-zinc-50"
                >
                    <ChevronLeft className="h-4 w-4" />
                    {t.back}
                </Link>
            </div>

            {/* Top Layout */}
            <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
                <div className="grid grid-cols-1 gap-6 p-5 lg:grid-cols-12 lg:gap-8">
                    {/* Big Image */}
                    <div className="lg:col-span-6">
                        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-zinc-100">
                            {cover ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={cover} alt={title} className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full items-center justify-center text-sm text-zinc-500">
                                    {t.noImage}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Thumbnails */}
                    {/* Thumbnails */}
                    <div className="order-last lg:order-none lg:col-span-1">
                        {images.length > 1 ? (
                            <>
                                {/* Mobile: horizontal rail */}
                                <div className="flex gap-3 overflow-x-auto pb-1 lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                    {images.map((fn, idx) => {
                                        const thumb = imgUrl(fn);
                                        const isActive = idx === active;
                                        return (
                                            <button
                                                key={fn + idx}
                                                type="button"
                                                onClick={() => setActive(idx)}
                                                className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border bg-white transition ${isActive ? "border-zinc-900" : "border-zinc-200 hover:border-zinc-300"
                                                    }`}
                                                aria-label={`Image ${idx + 1}`}
                                            >
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={thumb} alt="" className="h-full w-full object-cover" />
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Desktop: vertical rail with fixed height */}
                                <div className="hidden lg:block">
                                    <div className="max-h-[520px] overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                        <div className="flex flex-col gap-3">
                                            {images.map((fn, idx) => {
                                                const thumb = imgUrl(fn);
                                                const isActive = idx === active;
                                                return (
                                                    <button
                                                        key={fn + idx}
                                                        type="button"
                                                        onClick={() => setActive(idx)}
                                                        className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border bg-white transition ${isActive ? "border-zinc-900" : "border-zinc-200 hover:border-zinc-300"
                                                            }`}
                                                        aria-label={`Image ${idx + 1}`}
                                                    >
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img src={thumb} alt="" className="h-full w-full object-cover" />
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="hidden lg:block" />
                        )}
                    </div>

                    {/* Info */}
                    <div className="lg:col-span-5">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h1 className="text-lg font-semibold tracking-wide text-zinc-900 sm:text-xl">
                                    {title}
                                </h1>

                                {/* status chip (optional small like reference) */}
                                <div className="mt-2">
                                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600">
                                        {item?.status ? t.available : t.unavailable}
                                    </span>
                                </div>
                            </div>

                            {/* Heart */}
                            <button
                                type="button"
                                onClick={() => setLiked((v) => !v)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white hover:bg-zinc-50"
                                aria-label="Favorite"
                            >
                                <Heart className={`h-5 w-5 ${liked ? "fill-red-500 text-red-500" : "text-zinc-700"}`} />
                            </button>
                        </div>

                        {/* Price block */}
                        <div className="mt-4">
                            <div className="flex items-end gap-3">
                                <div className="text-2xl font-semibold text-zinc-900">
                                    ${hasDiscount ? money(discounted) : money(price)}
                                </div>

                                {hasDiscount ? (
                                    <div className="flex items-center gap-2 pb-1">
                                        <span className="text-sm text-zinc-500 line-through">${money(price)}</span>
                                        {discountPercent !== null ? (
                                            <span className="text-sm font-medium text-red-500">
                                                -{discountPercent}%
                                            </span>
                                        ) : null}
                                    </div>
                                ) : null}
                            </div>

                            <p className="mt-1 text-xs text-zinc-500">{t.taxNote}</p>
                        </div>

                        {/* Short description (like reference paragraph on right) */}
                        <div className="mt-4 max-w-md text-sm leading-6 text-zinc-700">
                            {summary ? (
                                <p>{summary}</p>
                            ) : (
                                <p className="text-zinc-600">{t.noDesc}</p>
                            )}
                        </div>

                        {/* CTA */}
                        <div className="mt-6">
                            <button
                                type="button"
                                className="h-11 w-full max-w-sm rounded-lg bg-indigo-600 px-5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
                            >
                                {t.buy}
                            </button>
                        </div>
                    </div>
                </div>

                {/* About this item */}
                <div className="border-t border-zinc-200 px-5 py-6">
                    <h2 className="text-base font-semibold text-zinc-900">{t.about}</h2>

                    <div className="mt-2 text-sm leading-6 text-zinc-700">
                        {item?.description ? (
                            <div
                                className="prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: item.description }}
                            />
                        ) : (
                            <p>{t.noDesc}</p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}