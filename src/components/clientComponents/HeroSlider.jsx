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
    items = [],
    activeIndex = 0,
    locale,
    heightClass = "h-[124px] sm:h-[160px] lg:h-full",
}) {
    const validItems = Array.isArray(items)
        ? items.filter((item) => item?.image)
        : [];

    if (!validItems.length) {
        return (
            <div
                className={[
                    "w-full bg-neutral-100",
                    "rounded-2xl sm:rounded-xl",
                    heightClass,
                ].join(" ")}
            />
        );
    }

    return (
        <div
            className={[
                "relative w-full overflow-hidden bg-neutral-100",
                "rounded-2xl sm:rounded-xl",
                heightClass,
            ].join(" ")}
        >
            {validItems.map((item, i) => {
                const href = withLocale(locale, item?.href);
                const isActive = i === activeIndex % validItems.length;

                const imageCard = (
                    <div
                        className={[
                            "absolute inset-0 transition-opacity duration-700 ease-out",
                            isActive
                                ? "z-10 opacity-100"
                                : "z-0 opacity-0 pointer-events-none",
                        ].join(" ")}
                    >
                        <Image
                            src={imgUrl(item.image)}
                            alt={item?.title || "Promo"}
                            fill
                            className="object-cover transition-transform duration-700 ease-out hover:scale-105"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 320px"
                            unoptimized
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />

                        {item?.title && (
                            <div className="absolute inset-x-0 bottom-0 z-20 p-3">
                                <p className="line-clamp-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white sm:text-xs">
                                    {item.title}
                                </p>
                            </div>
                        )}
                    </div>
                );

                if (!href) {
                    return <div key={item?._id || i}>{imageCard}</div>;
                }

                const isExternal = /^https?:\/\//i.test(href);

                if (isExternal) {
                    return (
                        <a
                            key={item?._id || i}
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            title={item?.title || "Promo"}
                            className={[
                                "absolute inset-0 block",
                                isActive ? "z-20" : "z-0 pointer-events-none",
                            ].join(" ")}
                        >
                            {imageCard}
                        </a>
                    );
                }

                return (
                    <Link
                        key={item?._id || i}
                        href={href}
                        title={item?.title || "Promo"}
                        className={[
                            "absolute inset-0 block",
                            isActive ? "z-20" : "z-0 pointer-events-none",
                        ].join(" ")}
                    >
                        {imageCard}
                    </Link>
                );
            })}
        </div>
    );
}

export default function HeroSlider({
    slides,
    locale = "en",
    heightClass = "h-[230px] min-[390px]:h-[250px] sm:h-[320px] md:h-[380px] lg:h-[420px]",
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

    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);

    const trackRef = useRef(null);

    const drag = useRef({
        isDown: false,
        startX: 0,
        lastX: 0,
        deltaX: 0,
    });

    const finalSlides = useMemo(() => {
        const src = Array.isArray(slides) ? slides : apiSlides;
        return (src || []).filter(Boolean);
    }, [slides, apiSlides]);

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
                    }))
                    .filter((s) => s?.image);

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
                    ? data.left.filter(
                        (item) => item?.status === true && item?.image
                    )
                    : [];

                const rightCards = Array.isArray(data?.right)
                    ? data.right.filter(
                        (item) => item?.status === true && item?.image
                    )
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

    useEffect(() => {
        if (sideCards.left.length <= 1) return;

        const timer = setInterval(() => {
            setLeftSideIndex((prev) => (prev + 1) % sideCards.left.length);
        }, 3000);

        return () => clearInterval(timer);
    }, [sideCards.left.length]);

    useEffect(() => {
        if (sideCards.right.length <= 1) return;

        const timer = setInterval(() => {
            setRightSideIndex((prev) => (prev + 1) % sideCards.right.length);
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
    };

    const onPointerMove = (e) => {
        if (!drag.current.isDown || !trackRef.current) return;

        const x = e.clientX ?? e.touches?.[0]?.clientX ?? drag.current.lastX;

        drag.current.deltaX = x - drag.current.startX;
        drag.current.lastX = x;

        const pct = (drag.current.deltaX / trackRef.current.clientWidth) * 100;

        trackRef.current.style.transition = "none";
        trackRef.current.style.transform = `translateX(calc(${-index * 100
            }% + ${pct}%))`;
    };

    const onPointerUp = () => {
        if (!drag.current.isDown || !trackRef.current) return;

        drag.current.isDown = false;

        const thresholdPx = 50;
        const dx = drag.current.deltaX;

        trackRef.current.style.transition =
            "transform 450ms cubic-bezier(0.77,0,0.18,1)";
        trackRef.current.style.transform = `translateX(${-index * 100}%)`;

        if (dx > thresholdPx) prev();
        else if (dx < -thresholdPx) next();

        setTimeout(() => setPaused(false), 250);
    };

    if (loading && count === 0) {
        return (
            <section className={["w-full", className].join(" ")}>
                <div className="grid gap-3 sm:gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:grid-rows-2">
                    <div
                        className={[
                            "w-full animate-pulse bg-neutral-200 lg:row-span-2",
                            "rounded-none sm:rounded-xl",
                            heightClass,
                        ].join(" ")}
                    />

                    <div className="grid grid-cols-2 gap-3 px-3 sm:gap-4 sm:px-0 lg:contents">
                        <div className="h-[124px] w-full animate-pulse rounded-2xl bg-neutral-200 sm:h-[160px] sm:rounded-xl lg:h-full" />

                        <div className="h-[124px] w-full animate-pulse rounded-2xl bg-neutral-200 sm:h-[160px] sm:rounded-xl lg:h-full" />
                    </div>
                </div>
            </section>
        );
    }

    if (!count) {
        return (
            <section className={["w-full", className].join(" ")}>
                <div className="mx-3 rounded-2xl border border-neutral-200 bg-white p-4 text-sm text-neutral-400 sm:mx-0 sm:rounded-xl">
                    No slides provided.
                </div>
            </section>
        );
    }

    return (
        <section className={["w-full", className].join(" ")}>
            <div className="grid gap-3 sm:gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:grid-rows-2 lg:items-stretch">
                {/* Main Slider */}
                <div
                    className={[
                        "relative w-full min-w-0 overflow-hidden bg-neutral-100 lg:row-span-2",
                        "rounded-none sm:rounded-xl",
                    ].join(" ")}
                    style={{
                        boxShadow: "0 10px 30px rgba(15,23,42,0.12)",
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
                            {finalSlides.map((s, i) => {
                                const slideImage = (
                                    <Image
                                        src={imgUrl(s.image)}
                                        alt={s.alt ?? `Slide ${i + 1}`}
                                        fill
                                        priority={i === 0}
                                        className="object-cover"
                                        sizes="(max-width: 1024px) 100vw, calc(100vw - 360px)"
                                        draggable={false}
                                        unoptimized
                                    />
                                );

                                return (
                                    <div
                                        key={s.id ?? i}
                                        className="relative h-full w-full shrink-0 bg-neutral-100"
                                    >
                                        {s.href ? (
                                            <a
                                                href={s.href}
                                                className="block h-full w-full"
                                            >
                                                {slideImage}
                                            </a>
                                        ) : (
                                            slideImage
                                        )}

                                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />

                                        {s.overlay && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                {typeof s.overlay === "function"
                                                    ? s.overlay()
                                                    : s.overlay}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {showArrows && count > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={prev}
                                    aria-label="Previous"
                                    className="absolute left-3 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/25 text-white backdrop-blur-md transition hover:bg-[#c9a96e] sm:flex"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>

                                <button
                                    type="button"
                                    onClick={next}
                                    aria-label="Next"
                                    className="absolute right-3 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/25 text-white backdrop-blur-md transition hover:bg-[#c9a96e] sm:flex"
                                >
                                    <ChevronRight className="h-4 w-4" />
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
                                    className={[
                                        "h-1.5 rounded-full transition-all duration-300",
                                        i === index
                                            ? "w-7 bg-[#c9a96e]"
                                            : "w-1.5 bg-white/70",
                                    ].join(" ")}
                                />
                            ))}
                        </div>
                    )}

                    {count > 1 && (
                        <div className="absolute right-3 top-3 z-20 rounded-full border border-white/15 bg-black/35 px-2.5 py-1 text-[11px] font-semibold tracking-wider text-white backdrop-blur-md">
                            {String(index + 1).padStart(2, "0")}
                            <span className="mx-1 text-white/40">/</span>
                            <span className="text-white/60">
                                {String(count).padStart(2, "0")}
                            </span>
                        </div>
                    )}
                </div>

                {/* Side Cards */}
                <div className="grid grid-cols-2 gap-3 px-3 sm:gap-4 sm:px-0 lg:contents">
                    <div className="min-h-[124px] sm:min-h-[160px] lg:min-h-0">
                        {sideLoading ? (
                            <div className="h-[124px] w-full animate-pulse rounded-2xl bg-neutral-200 sm:h-[160px] sm:rounded-xl lg:h-full" />
                        ) : (
                            <SidePromoCard
                                items={sideCards.left}
                                activeIndex={leftSideIndex}
                                locale={locale}
                            />
                        )}
                    </div>

                    <div className="min-h-[124px] sm:min-h-[160px] lg:min-h-0">
                        {sideLoading ? (
                            <div className="h-[124px] w-full animate-pulse rounded-2xl bg-neutral-200 sm:h-[160px] sm:rounded-xl lg:h-full" />
                        ) : (
                            <SidePromoCard
                                items={sideCards.right}
                                activeIndex={rightSideIndex}
                                locale={locale}
                            />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}