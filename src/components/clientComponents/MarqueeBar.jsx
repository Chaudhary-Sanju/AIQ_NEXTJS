"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import http from "@/http/index"; // adjust path if different

export default function MarqueeBar({ locale = "en" }) {
    const [marquee, setMarquee] = useState(null);
    const [loading, setLoading] = useState(true);

    // If your app locale keys differ, map them here
    const lang = useMemo(() => {
        const map = { en: "en", ne: "ne", zh: "zh",};
        return map[locale] || "en";
    }, [locale]);

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            try {
                const res = await http.get("/frontend/frontMarquee");
                if (!mounted) return;
                setMarquee(res?.data?.data || null);
            } catch (e) {
                // optional: keep silent for marquee
                // console.error("Marquee fetch failed", e);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        load();
        return () => {
            mounted = false;
        };
    }, []);

    const text = useMemo(() => {
        if (!marquee?.text) return "";
        return (
            marquee.text?.[lang] ||
            marquee.text?.en ||
            marquee.text?.ne ||
            marquee.text?.zh ||
            ""
        );
    }, [marquee, lang]);

    if (loading || !marquee || marquee.status === false || !text) return null;

    const bg = marquee.bgColor || "#000000";
    const color = marquee.textColor || "#ffffff";

    const bar = (
        <div
            className="marquee-wrapper"
            style={{ backgroundColor: bg, color }}
            role="region"
            aria-label="Announcement"
        >
            <div className="marquee-track">
                <span className="marquee-item">{text}</span>
            </div>
        </div>
    );

    return marquee.href ? (
        <Link href={marquee.href} aria-label="Open announcement link">
            {bar}
        </Link>
    ) : (
        bar
    );
}