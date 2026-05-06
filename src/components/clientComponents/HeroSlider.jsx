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

function SidePromoCard({
    item,
    locale,
    heightClass = "h-[135px] sm:h-[170px] lg:h-full",
}) {
    if (!item?.image) return null;

    const href = withLocale(locale, item?.href);

    const content = (
        <div
            className={`group relative w-full ${heightClass} overflow-hidden bg-neutral-900`}
            style={{ borderRadius: "2px" }}
        >
            <Image
                src={imgUrl(item.image)}
                alt={item?.title || "Promo"}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 1024px) 50vw, 360px"
                unoptimized
            />

            {item?.title && (
                <div className="absolute inset-0 z-10 flex items-end bg-gradient-to-t from-black/75 via-black/15 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <p
                        className="truncate text-xs font-semibold uppercase tracking-widest"
                        style={{
                            color: "#c9a96e",
                            fontFamily: "'DM Serif Display', Georgia, serif",
                        }}
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
                <a
                    href={href}
                    className="block h-full w-full"
                    target="_blank"
                    rel="noreferrer"
                    title={item?.title || "Promo"}
                >
                    {content}
                </a>
            );
        }

        return (
            <Link
                href={href}
                className="block h-full w-full"
                title={item?.title || "Promo"}
            >
                {content}
            </Link>
        );
    }

    return content;
}

export default function HeroSlider({
    slides,
    locale = "en",
    heightClass = "h-[220px] sm:h-[280px] md:h-[340px] lg:h-[360px]",
    autoPlay = true,
    interval = 4500,
    showDots = true,
    showArrows = true,
    className = "",
}) {
    const [apiSlides, setApiSlides] = useState([]);

    const [sideCards, setSideCards] = useState({
        left: [],
        right: [],
    });

    const [leftSideIndex, setLeftSideIndex] = useState(0);
    const [rightSideIndex, setRightSideIndex] = useState(0);

    const [loading, setLoading] = useState(false);
    const [sideLoading, setSideLoading] = useState(false);

    const finalSlides = useMemo(() => {
        const src = Array.isArray(slides) ? slides : apiSlides;
        return (src || []).filter(Boolean);
    }, [slides, apiSlides]);

    const activeLeftCard = useMemo(() => {
        if (!sideCards.left.length) return null;
        return sideCards.left[leftSideIndex % sideCards.left.length];
    }, [sideCards.left, leftSideIndex]);

    const activeRightCard = useMemo(() => {
        if (!sideCards.right.length) return null;
        return sideCards.right[rightSideIndex % sideCards.right.length];
    }, [sideCards.right, rightSideIndex]);

    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);

    const trackRef = useRef(null);

    const drag = useRef({
        isDown: false,
        startX: 0,
        lastX: 0,
        deltaX: 0,
    });

    const count = finalSlides.length;

    const clampIndex = (i) => {
        return count === 0 ? 0 : (i + count) % count;
    };

    const goTo = (i) => {
        setIndex(clampIndex(i));
    };

    const prev = () => {
        goTo(index - 1);
    };

    const next = () => {
        goTo(index + 1);
    };

    useEffect(() => {
        setIndex(0);
    }, [count]);

    useEffect(() => {
        let mounted = true;

        async function fetchSliders() {
            if (Array.isArray(slides)) return;

            setLoading(true);

            try {
                const res = await http.get("/frontend/slider");

                const rows = Array.isArray(res?.data?.data)
                    ? res.data.data
                    : [];

                const mapped = rows
                    .filter((s) => s?.status === true)
                    .sort((a, b) => (a?.index ?? 0) - (b?.index ?? 0))
                    .map((s) => ({
                        id: s?._id,
                        image: s?.image,
                        alt: s?.title ?? "Banner",
                        href: withLocale(locale, s?.href),
                    }));

                if (mounted) {
                    setApiSlides(mapped);
                }
            } catch {
                if (mounted) {
                    setApiSlides([]);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        fetchSliders();

        return () => {
            mounted = false;
        };
    }, [slides, locale]);

    useEffect(() => {
        let mounted = true;

        async function fetchSideCards() {
            setSideLoading(true);

            try {
                const res = await http.get(
                    "/frontend/slider/slider-side-cards/latest"
                );

                const data = res?.data?.data || {};

                const leftCards = Array.isArray(data?.left)
                    ? data.left.filter((item) => item?.status === true)
                    : [];

                const rightCards = Array.isArray(data?.right)
                    ? data.right.filter((item) => item?.status === true)
                    : [];

                if (mounted) {
                    setSideCards({
                        left: leftCards,
                        right: rightCards,
                    });

                    setLeftSideIndex(0);
                    setRightSideIndex(0);
                }
            } catch {
                if (mounted) {
                    setSideCards({
                        left: [],
                        right: [],
                    });
                }
            } finally {
                if (mounted) {
                    setSideLoading(false);
                }
            }
        }

        fetchSideCards();

        return () => {
            mounted = false;
        };
    }, []);

    // Promo 1 changes every 3 seconds
    useEffect(() => {
        if (sideCards.left.length <= 1) return;

        const timer = setInterval(() => {
            setLeftSideIndex((prev) => {
                return (prev + 1) % sideCards.left.length;
            });
        }, 3000);

        return () => clearInterval(timer);
    }, [sideCards.left.length]);

    // Promo 2 changes every 4 seconds
    useEffect(() => {
        if (sideCards.right.length <= 1) return;

        const timer = setInterval(() => {
            setRightSideIndex((prev) => {
                return (prev + 1) % sideCards.right.length;
            });
        }, 4000);

        return () => clearInterval(timer);
    }, [sideCards.right.length]);

    useEffect(() => {
        if (!autoPlay || paused || count <= 1) return;

        const id = setInterval(() => {
            setIndex((p) => clampIndex(p + 1));
        }, interval);

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
        trackRef.current.style.transform = `translateX(calc(${
            -index * 100
        }% + ${pct}%))`;
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

    if (loading && count === 0) {
        return (
            <div
                className={`grid grid-cols-2 lg:grid-cols-[minmax(0,1fr)_320px] lg:grid-rows-2 gap-0 ${className}`}
            >
                <div
                    className={`col-span-2 lg:col-span-1 lg:row-span-2 w-full ${heightClass} bg-neutral-200 animate-pulse`}
                    style={{ borderRadius: "2px" }}
                />

                <div
                    className="h-[110px] sm:h-[140px] lg:h-full w-full bg-neutral-200 animate-pulse"
                    style={{ borderRadius: "2px" }}
                />

                <div
                    className="h-[110px] sm:h-[140px] lg:h-full w-full bg-neutral-200 animate-pulse"
                    style={{ borderRadius: "2px" }}
                />
            </div>
        );
    }

    if (!count) {
        return (
            <div
                className={`w-full border border-neutral-200 p-4 text-sm text-neutral-400 ${className}`}
            >
                No slides provided.
            </div>
        );
    }

    return (
        <>
            <style>
                {`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap');`}
            </style>

            <div
                className={`grid grid-cols-2 lg:grid-cols-[minmax(0,1fr)_320px] lg:grid-rows-2 gap-0 items-stretch ${className}`}
            >
                {/* Main Slider */}
                <div
                    className="relative col-span-2 lg:col-span-1 lg:row-span-2 w-full min-w-0 overflow-hidden"
                    style={{
                        borderRadius: "2px",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
                    }}
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                >
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
                            style={{
                                transform: `translateX(${-index * 100}%)`,
                                transition:
                                    "transform 450ms cubic-bezier(0.77,0,0.18,1)",
                            }}
                        >
                            {finalSlides.map((s, i) => (
                                <div
                                    key={s.id ?? i}
                                    className="relative h-full w-full shrink-0 bg-neutral-900"
                                >
                                    {s.href ? (
                                        <a
                                            href={s.href}
                                            className="block h-full w-full"
                                        >
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

                                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />

                                    {s.overlay && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            {typeof s.overlay === "function"
                                                ? s.overlay()
                                                : s.overlay}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {showArrows && count > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={prev}
                                    aria-label="Previous"
                                    className="absolute left-3 top-1/2 z-20 flex -translate-y-1/2 items-center justify-center transition-all duration-200"
                                    style={{
                                        width: 36,
                                        height: 36,
                                        background: "rgba(255,255,255,0.12)",
                                        backdropFilter: "blur(8px)",
                                        border: "1px solid rgba(255,255,255,0.22)",
                                        borderRadius: "2px",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background =
                                            "#c9a96e";
                                        e.currentTarget.style.borderColor =
                                            "#c9a96e";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background =
                                            "rgba(255,255,255,0.12)";
                                        e.currentTarget.style.borderColor =
                                            "rgba(255,255,255,0.22)";
                                    }}
                                >
                                    <ChevronLeft className="h-4 w-4 text-white" />
                                </button>

                                <button
                                    type="button"
                                    onClick={next}
                                    aria-label="Next"
                                    className="absolute right-3 top-1/2 z-20 flex -translate-y-1/2 items-center justify-center transition-all duration-200"
                                    style={{
                                        width: 36,
                                        height: 36,
                                        background: "rgba(255,255,255,0.12)",
                                        backdropFilter: "blur(8px)",
                                        border: "1px solid rgba(255,255,255,0.22)",
                                        borderRadius: "2px",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background =
                                            "#c9a96e";
                                        e.currentTarget.style.borderColor =
                                            "#c9a96e";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background =
                                            "rgba(255,255,255,0.12)";
                                        e.currentTarget.style.borderColor =
                                            "rgba(255,255,255,0.22)";
                                    }}
                                >
                                    <ChevronRight className="h-4 w-4 text-white" />
                                </button>
                            </>
                        )}
                    </div>

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
                                        background:
                                            i === index
                                                ? "#c9a96e"
                                                : "rgba(255,255,255,0.55)",
                                        border: "none",
                                        padding: 0,
                                        cursor: "pointer",
                                        boxShadow:
                                            i === index
                                                ? "0 0 8px rgba(201,169,110,0.6)"
                                                : "none",
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {count > 1 && (
                        <div
                            className="absolute right-3 top-3 z-20 flex items-center gap-1 px-2 py-0.5"
                            style={{
                                background: "rgba(0,0,0,0.35)",
                                backdropFilter: "blur(6px)",
                                borderRadius: "2px",
                                border: "1px solid rgba(255,255,255,0.12)",
                            }}
                        >
                            <span
                                className="text-xs font-semibold text-white"
                                style={{ letterSpacing: "0.05em" }}
                            >
                                {String(index + 1).padStart(2, "0")}
                            </span>

                            <span className="text-xs text-white/40">/</span>

                            <span className="text-xs text-white/50">
                                {String(count).padStart(2, "0")}
                            </span>
                        </div>
                    )}
                </div>

                {/* Promo Card 1 */}
                <div className="min-h-[110px] sm:min-h-[140px] lg:min-h-0">
                    {sideLoading ? (
                        <div
                            className="h-[110px] sm:h-[140px] lg:h-full w-full bg-neutral-200 animate-pulse"
                            style={{ borderRadius: "2px" }}
                        />
                    ) : (
                        <SidePromoCard
                            key={activeLeftCard?._id || leftSideIndex}
                            item={activeLeftCard}
                            locale={locale}
                        />
                    )}
                </div>

                {/* Promo Card 2 */}
                <div className="min-h-[110px] sm:min-h-[140px] lg:min-h-0">
                    {sideLoading ? (
                        <div
                            className="h-[110px] sm:h-[140px] lg:h-full w-full bg-neutral-200 animate-pulse"
                            style={{ borderRadius: "2px" }}
                        />
                    ) : (
                        <SidePromoCard
                            key={activeRightCard?._id || rightSideIndex}
                            item={activeRightCard}
                            locale={locale}
                        />
                    )}
                </div>
            </div>
        </>
    );
}