"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function HashScrollHandler() {
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const handleHashScroll = () => {
            if (typeof window === "undefined") return;

            const hash = window.location.hash;
            if (!hash) return;

            const id = hash.replace("#", "");
            const segments = pathname.split("/");
            const locale = segments[1] || "en";
            const homePath = `/${locale}`;

            if (pathname !== homePath) {
                router.replace(`${homePath}#${id}`);
                return;
            }

            const scrollToElement = () => {
                const el = document.getElementById(id);
                if (!el) return;

                const header = document.querySelector("header");
                let headerHeight = 0;
                if (header) {
                    const style = getComputedStyle(header);
                    if (style.position === "sticky" || style.position === "fixed") {
                        headerHeight = header.getBoundingClientRect().height;
                    }
                }

                const originalMargin = el.style.scrollMarginTop;
                el.style.scrollMarginTop = `${headerHeight + 12}px`;
                el.scrollIntoView({ behavior: "smooth", block: "start" });

                setTimeout(() => {
                    el.style.scrollMarginTop = originalMargin;
                }, 500);
            };

            setTimeout(scrollToElement, 100);
        };

        const timer = setTimeout(handleHashScroll, 150);
        return () => clearTimeout(timer);
    }, [pathname, router]);

    return null;
}