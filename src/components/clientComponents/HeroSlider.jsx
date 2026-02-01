"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { imgUrl } from "@/lib";
import http from "@/http";

function withLocale(locale, href) {
    if (!href) return undefined;

    // absolute urls keep as is
    if (/^https?:\/\//i.test(href)) return href;

    const path = href.startsWith("/") ? href : `/${href}`;

    // already has locale prefix
    if (/^\/(en|zh|ne)(\/|$)/i.test(path)) return path;

    return `/${locale}${path}`;
}

export default function HeroSlider({
    // If slides passed, it will use them; if not, it will fetch from API.
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
    const [loading, setLoading] = useState(false);

    // Decide which slides to use
    const finalSlides = useMemo(() => {
        const src = Array.isArray(slides) ? slides : apiSlides;
        return (src || []).filter(Boolean);
    }, [slides, apiSlides]);

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
        if (count === 0) return 0;
        return (i + count) % count;
    };

    const goTo = (i) => setIndex(clampIndex(i));
    const prev = () => goTo(index - 1);
    const next = () => goTo(index + 1);

    // Reset index when slides change
    useEffect(() => {
        setIndex(0);
    }, [count]);

    // Fetch sliders ONLY if slides prop not provided
    useEffect(() => {
        let mounted = true;

        async function fetchSliders() {
            if (Array.isArray(slides)) return; // external slides already provided

            setLoading(true);
            try {
                const res = await http.get("/frontend/slider");
                const rows = Array.isArray(res?.data?.data) ? res.data.data : [];

                const mapped = rows
                    .filter((s) => s?.status === true)
                    .sort((a, b) => (a?.index ?? 0) - (b?.index ?? 0))
                    .map((s) => ({
                        id: s?._id,
                        image: s?.image, // filename from API
                        alt: s?.title ?? "Banner",
                        href: withLocale(locale, s?.href),
                    }));

                if (mounted) setApiSlides(mapped);
            } catch (e) {
                // toast is already handled by your http interceptor
                if (mounted) setApiSlides([]);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        fetchSliders();
        return () => {
            mounted = false;
        };
    }, [slides, locale]);

    // autoplay
    useEffect(() => {
        if (!autoPlay || paused || count <= 1) return;
        const id = setInterval(() => setIndex((p) => clampIndex(p + 1)), interval);
        return () => clearInterval(id);
    }, [autoPlay, paused, interval, count]);

    // keyboard
    useEffect(() => {
        function onKey(e) {
            if (count <= 1) return;
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [count, index]);

    // drag / swipe helpers
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

    if (loading && count === 0) {
        return (
            <div className={`w-full ${heightClass} rounded-xl bg-slate-100 animate-pulse ${className}`} />
        );
    }

    if (!count) {
        return (
            <div className={`w-full rounded-xl border p-4 text-slate-600 ${className}`}>
                No slides provided.
            </div>
        );
    }

    return (
        <div
            className={["relative w-full overflow-hidden shadow-sm", className].join(" ")}
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
                        transition: "transform 450ms ease",
                    }}
                >
                    {finalSlides.map((s, i) => (
                        <div key={s.id ?? i} className="relative h-full w-full shrink-0">
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

                            {s.overlay ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    {typeof s.overlay === "function" ? s.overlay() : s.overlay}
                                </div>
                            ) : null}
                        </div>
                    ))}
                </div>

                {showArrows && count > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={prev}
                            aria-label="Previous"
                            className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow ring-1 ring-black/5 hover:bg-white"
                        >
                            <ChevronLeft className="h-5 w-5 text-slate-700" />
                        </button>

                        <button
                            type="button"
                            onClick={next}
                            aria-label="Next"
                            className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow ring-1 ring-black/5 hover:bg-white"
                        >
                            <ChevronRight className="h-5 w-5 text-slate-700" />
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
                                "h-2.5 w-2.5 rounded-full transition",
                                i === index ? "bg-[#5f57ff]" : "bg-white/70 ring-1 ring-black/10",
                            ].join(" ")}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
