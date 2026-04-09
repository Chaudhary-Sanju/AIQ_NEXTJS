"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { imgUrl } from "@/lib";
import http from "@/http";

function withLocale(locale, href) {
    if (!href) return undefined;
    if (/^https?:\/\//i.test(href)) return href;
    const path = href.startsWith("/") ? href : `/${href}`;
    if (/^\/(en|zh|ne)(\/|$)/i.test(path)) return path;
    return `/${locale}${path}`;
}

function SidePromoCard({ item, locale, heightClass = "h-[220px] sm:h-[260px] md:h-[320px]" }) {
    if (!item?.image) return null;

    const href = withLocale(locale, item?.href);

    const content = (
        <div
            className={`relative w-full ${heightClass} overflow-hidden bg-neutral-900 group`}
            style={{ borderRadius: "2px" }}
        >
            <Image
                src={imgUrl(item.image)}
                alt={item?.title || "Promo"}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
                sizes="280px"
                unoptimized
            />
            {/* Corner accent */}
            <span
                className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 z-10 pointer-events-none"
                style={{ borderColor: "#c9a96e" }}
            />
            <span
                className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 z-10 pointer-events-none"
                style={{ borderColor: "#c9a96e" }}
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
            {item?.title && (
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                    <p
                        className="text-xs font-semibold uppercase tracking-widest truncate"
                        style={{ color: "#c9a96e", fontFamily: "'DM Serif Display', Georgia, serif" }}
                    >
                        {item.title}
                    </p>
                </div>
            )}
        </div>
    );

    if (href) {
        const isExternal = /^https?:\/\//i.test(href);
        if (isExternal) {
            return (
                <a href={href} className="block w-full" target="_blank" rel="noreferrer">
                    {content}
                </a>
            );
        }
        return (
            <Link href={href} className="block w-full">
                {content}
            </Link>
        );
    }

    return content;
}

export default function HeroSlider({
    slides,
    locale = "en",
    heightClass = "h-[220px] sm:h-[260px] md:h-[320px]",
    autoPlay = true,
    interval = 4500,
    showDots = true,
    showArrows = true,
    className = "",
}) {
    const [apiSlides, setApiSlides] = useState([]);
    const [sideCards, setSideCards] = useState({ left: null, right: null });
    const [loading, setLoading] = useState(false);
    const [sideLoading, setSideLoading] = useState(false);

    const finalSlides = useMemo(() => {
        const src = Array.isArray(slides) ? slides : apiSlides;
        return (src || []).filter(Boolean);
    }, [slides, apiSlides]);

    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);

    const trackRef = useRef(null);
    const drag = useRef({ isDown: false, startX: 0, lastX: 0, deltaX: 0 });

    const count = finalSlides.length;
    const clampIndex = (i) => (count === 0 ? 0 : (i + count) % count);
    const goTo = (i) => setIndex(clampIndex(i));
    const prev = () => goTo(index - 1);
    const next = () => goTo(index + 1);

    useEffect(() => { setIndex(0); }, [count]);

    useEffect(() => {
        let mounted = true;
        async function fetchSliders() {
            if (Array.isArray(slides)) return;
            setLoading(true);
            try {
                const res = await http.get("/frontend/slider");
                const rows = Array.isArray(res?.data?.data) ? res.data.data : [];
                const mapped = rows
                    .filter((s) => s?.status === true)
                    .sort((a, b) => (a?.index ?? 0) - (b?.index ?? 0))
                    .map((s) => ({ id: s?._id, image: s?.image, alt: s?.title ?? "Banner", href: withLocale(locale, s?.href) }));
                if (mounted) setApiSlides(mapped);
            } catch (e) {
                if (mounted) setApiSlides([]);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        fetchSliders();
        return () => { mounted = false; };
    }, [slides, locale]);

    useEffect(() => {
        let mounted = true;
        async function fetchSideCards() {
            setSideLoading(true);
            try {
                const res = await http.get("/frontend/slider/slider-side-cards/latest");
                const data = res?.data?.data || {};
                const leftCard = data?.left?.status ? data.left : null;
                const rightCard = data?.right?.status ? data.right : null;
                if (mounted) setSideCards({ left: leftCard, right: rightCard });
            } catch (e) {
                if (mounted) setSideCards({ left: null, right: null });
            } finally {
                if (mounted) setSideLoading(false);
            }
        }
        fetchSideCards();
        return () => { mounted = false; };
    }, []);

    useEffect(() => {
        if (!autoPlay || paused || count <= 1) return;
        const id = setInterval(() => setIndex((p) => clampIndex(p + 1)), interval);
        return () => clearInterval(id);
    }, [autoPlay, paused, interval, count]);

    useEffect(() => {
        function onKey(e) {
            if (count <= 1) return;
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [count, index]);

    const onPointerDown = (e) => {
        if (count <= 1) return;
        setPaused(true);
        drag.current.isDown = true;
        drag.current.startX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
        drag.current.lastX = drag.current.startX;
        drag.current.deltaX = 0;
        if (e.preventDefault) e.preventDefault();
    };

    const onPointerMove = (e) => {
        if (!drag.current.isDown || !trackRef.current) return;
        const x = e.clientX ?? e.touches?.[0]?.clientX ?? drag.current.lastX;
        drag.current.deltaX = x - drag.current.startX;
        drag.current.lastX = x;
        const pct = (drag.current.deltaX / trackRef.current.clientWidth) * 100;
        trackRef.current.style.transition = "none";
        trackRef.current.style.transform = `translateX(calc(${-index * 100}% + ${pct}%))`;
    };

    const onPointerUp = () => {
        if (!drag.current.isDown || !trackRef.current) return;
        drag.current.isDown = false;
        const thresholdPx = 50;
        const dx = drag.current.deltaX;
        trackRef.current.style.transition = "transform 450ms ease";
        trackRef.current.style.transform = `translateX(${-index * 100}%)`;
        if (dx > thresholdPx) prev();
        else if (dx < -thresholdPx) next();
        setTimeout(() => setPaused(false), 250);
    };

    // ─── Skeleton ────────────────────────────────────────────────────────────
    if (loading && count === 0) {
        return (
            <div className={`grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)_220px] gap-3 ${className}`}>
                <div className={`hidden lg:block ${heightClass} bg-neutral-200 animate-pulse`} style={{ borderRadius: "2px" }} />
                <div className={`w-full ${heightClass} bg-neutral-200 animate-pulse`} style={{ borderRadius: "2px" }} />
                <div className={`hidden lg:block ${heightClass} bg-neutral-200 animate-pulse`} style={{ borderRadius: "2px" }} />
            </div>
        );
    }

    if (!count) {
        return (
            <div className={`w-full border border-neutral-200 p-4 text-neutral-400 text-sm ${className}`}>
                No slides provided.
            </div>
        );
    }

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <>
            {/* Google Font - DM Serif Display */}
            <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap');`}</style>

            <div
                className={`grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)_220px] gap-3 items-stretch ${className}`}
            >
                {/* Left Side Card */}
                <div className="hidden lg:block">
                    {sideLoading ? (
                        <div
                            className={`w-[calc(100%+0.75rem)] ${heightClass} bg-neutral-200 animate-pulse`}
                            style={{ borderRadius: "2px" }}
                        />
                    ) : (
                        <div className="w-[calc(100%+0.75rem)]">
                            <SidePromoCard item={sideCards.left} locale={locale} heightClass={heightClass} />
                        </div>
                    )}
                </div>

                {/* Main Slider */}
                <div
                    className="relative w-full min-w-0 overflow-hidden"
                    style={{ borderRadius: "2px", boxShadow: "0 8px 32px rgba(0,0,0,0.14)" }}
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                >
                    {/* Slide Track */}
                    <div
                        className={`relative w-full ${heightClass} select-none`}
                        onMouseDown={onPointerDown}
                        onMouseMove={onPointerMove}
                        onMouseUp={onPointerUp}
                        onMouseLeave={onPointerUp}
                        onTouchStart={onPointerDown}
                        onTouchMove={onPointerMove}
                        onTouchEnd={onPointerUp}
                    >
                        <div
                            ref={trackRef}
                            className="flex h-full w-full"
                            style={{ transform: `translateX(${-index * 100}%)`, transition: "transform 450ms cubic-bezier(0.77,0,0.18,1)" }}
                        >
                            {finalSlides.map((s, i) => (
                                <div key={s.id ?? i} className="relative h-full w-full shrink-0 bg-neutral-900">
                                    {s.href ? (
                                        <a href={s.href} className="block h-full w-full">
                                            <Image
                                                src={imgUrl(s.image)}
                                                alt={s.alt ?? `Slide ${i + 1}`}
                                                fill
                                                priority={i === 0}
                                                className="object-cover"
                                                sizes="100vw"
                                                draggable={false}
                                                unoptimized
                                            />
                                        </a>
                                    ) : (
                                        <Image
                                            src={imgUrl(s.image)}
                                            alt={s.alt ?? `Slide ${i + 1}`}
                                            fill
                                            priority={i === 0}
                                            className="object-cover"
                                            sizes="100vw"
                                            draggable={false}
                                            unoptimized
                                        />
                                    )}

                                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

                                    {s.overlay && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            {typeof s.overlay === "function" ? s.overlay() : s.overlay}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Arrow Buttons */}
                        {showArrows && count > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={prev}
                                    aria-label="Previous"
                                    className="absolute left-3 top-1/2 z-20 -translate-y-1/2 flex items-center justify-center transition-all duration-200"
                                    style={{
                                        width: 36,
                                        height: 36,
                                        background: "rgba(255,255,255,0.12)",
                                        backdropFilter: "blur(8px)",
                                        border: "1px solid rgba(255,255,255,0.22)",
                                        borderRadius: "2px",
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = "#c9a96e";
                                        e.currentTarget.style.borderColor = "#c9a96e";
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)";
                                    }}
                                >
                                    <ChevronLeft className="h-4 w-4 text-white" />
                                </button>

                                <button
                                    type="button"
                                    onClick={next}
                                    aria-label="Next"
                                    className="absolute right-3 top-1/2 z-20 -translate-y-1/2 flex items-center justify-center transition-all duration-200"
                                    style={{
                                        width: 36,
                                        height: 36,
                                        background: "rgba(255,255,255,0.12)",
                                        backdropFilter: "blur(8px)",
                                        border: "1px solid rgba(255,255,255,0.22)",
                                        borderRadius: "2px",
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = "#c9a96e";
                                        e.currentTarget.style.borderColor = "#c9a96e";
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)";
                                    }}
                                >
                                    <ChevronRight className="h-4 w-4 text-white" />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Dot Indicators */}
                    {showDots && count > 1 && (
                        <div className="absolute bottom-3 left-0 right-0 z-20 flex items-center justify-center gap-2">
                            {finalSlides.map((_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    aria-label={`Go to slide ${i + 1}`}
                                    onClick={() => goTo(i)}
                                    className="transition-all duration-300"
                                    style={{
                                        width: i === index ? 24 : 7,
                                        height: 7,
                                        borderRadius: "2px",
                                        background: i === index ? "#c9a96e" : "rgba(255,255,255,0.55)",
                                        border: "none",
                                        padding: 0,
                                        cursor: "pointer",
                                        boxShadow: i === index ? "0 0 8px rgba(201,169,110,0.6)" : "none",
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {/* Slide counter — top right */}
                    {count > 1 && (
                        <div
                            className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2 py-0.5"
                            style={{
                                background: "rgba(0,0,0,0.35)",
                                backdropFilter: "blur(6px)",
                                borderRadius: "2px",
                                border: "1px solid rgba(255,255,255,0.12)",
                            }}
                        >
                            <span className="text-white text-xs font-semibold" style={{ letterSpacing: "0.05em" }}>
                                {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="text-white/40 text-xs">/</span>
                            <span className="text-white/50 text-xs">{String(count).padStart(2, "0")}</span>
                        </div>
                    )}
                </div>

                {/* Right Side Card */}
                <div className="hidden lg:block">
                    {sideLoading ? (
                        <div
                            className={`-ml-3 w-[calc(100%+0.75rem)] ${heightClass} bg-neutral-200 animate-pulse`}
                            style={{ borderRadius: "2px" }}
                        />
                    ) : (
                        <div className="-ml-3 w-[calc(100%+0.75rem)]">
                            <SidePromoCard item={sideCards.right} locale={locale} heightClass={heightClass} />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}