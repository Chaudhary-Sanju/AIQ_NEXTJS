"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const HOME_ONLY_HASHES = ["perfect-services"];

const getHeaderOffset = () => {
    if (typeof window === "undefined") return 0;

    const header =
        document.querySelector("header") ||
        document.querySelector("[data-site-header]") ||
        document.querySelector(".site-header");

    if (!header) return 0;

    const style = window.getComputedStyle(header);
    const isStickyOrFixed =
        style.position === "sticky" || style.position === "fixed";

    if (!isStickyOrFixed) return 0;

    return Math.ceil(header.getBoundingClientRect().height);
};

const scrollToHashTarget = (id, behavior = "smooth") => {
    if (typeof window === "undefined") return false;

    const el = document.getElementById(id);
    if (!el) return false;

    const headerOffset = getHeaderOffset();
    const extraGap = 12;

    const top =
        el.getBoundingClientRect().top +
        window.scrollY -
        headerOffset -
        extraGap;

    window.scrollTo({
        top: Math.max(top, 0),
        behavior,
    });

    return true;
};

export default function HashScrollHandler() {
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (typeof window === "undefined") return;

        const hash = window.location.hash;
        if (!hash) return;

        const id = decodeURIComponent(hash.replace("#", ""));
        if (!id) return;

        const segments = pathname.split("/");
        const locale = segments[1] || "en";
        const homePath = `/${locale}`;

        const isHomeOnlyHash = HOME_ONLY_HASHES.includes(id);

        /*
            Only homepage-only section hashes should redirect to home.
            Example:
            /en/about#perfect-services -> /en#perfect-services

            Other hashes should stay on their current page.
            Example:
            /en/ai-express/door-to-door#pickup-form should stay there.
        */
        if (isHomeOnlyHash && pathname !== homePath) {
            router.replace(`${homePath}#${id}`, {
                scroll: false,
            });
            return;
        }

        let attempts = 0;
        let timeoutId;

        const tryScroll = () => {
            attempts += 1;

            const didScroll = scrollToHashTarget(
                id,
                attempts === 1 ? "auto" : "smooth"
            );

            if (!didScroll && attempts < 12) {
                timeoutId = window.setTimeout(tryScroll, 120);
                return;
            }

            if (didScroll) {
                timeoutId = window.setTimeout(() => {
                    scrollToHashTarget(id, "smooth");
                }, 250);
            }
        };

        timeoutId = window.setTimeout(tryScroll, 80);

        return () => {
            if (timeoutId) window.clearTimeout(timeoutId);
        };
    }, [pathname, router]);

    return null;
}