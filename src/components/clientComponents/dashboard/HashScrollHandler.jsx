"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

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

        // If user clicked hash link from another page, first go home with same hash.
        if (pathname !== homePath) {
            router.replace(`${homePath}#${id}`, {
                scroll: false,
            });
            return;
        }

        let attempts = 0;
        let timeoutId;

        const tryScroll = () => {
            attempts += 1;

            const didScroll = scrollToHashTarget(id, attempts === 1 ? "auto" : "smooth");

            // Retry because home page sections/images/API content may render after route change.
            if (!didScroll && attempts < 12) {
                timeoutId = window.setTimeout(tryScroll, 120);
                return;
            }

            // One final smooth correction after layout settles.
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