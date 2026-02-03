"use client";

import Image from "next/image";
import Link from "next/link";

const LOCALES = ["en", "ne", "zh"];

function withLocale(href, locale) {
    if (!href) return "#";

    // external link or hash → return as is
    if (/^https?:\/\//i.test(href) || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
        return href;
    }

    // ensure it starts with "/"
    const path = href.startsWith("/") ? href : `/${href}`;

    // if already has locale prefix (/en/..., /ne/..., /zh/...) keep as is
    const first = path.split("/")[1];
    if (LOCALES.includes(first)) return path;

    // prefix with locale
    return `/${locale}${path}`;
}

export default function ImageLinkBanner({
    locale = "en",
    href = "/",
    src,
    alt = "Banner",
    className = "",
    priority = false,
    fit = "fill", // "cover" | "contain"
}) {
    if (!src) return null;

    const fitClass = fit === "contain" ? "object-contain" : "object-fit";
    const finalHref = withLocale(href, locale);

    return (
        <Link
            href={finalHref}
            className={[
                "block w-full overflow-hidden",
                "bg-white",
                className,
            ].join(" ")}
        >
            <div className="relative w-full h-[110px] sm:h-[140px] md:h-[170px] lg:h-[200px]">
                <Image
                    src={src}
                    alt={alt}
                    fill
                    priority={priority}
                    className={[fitClass, fit === "contain" ? "p-3" : ""].join(" ")}
                    sizes="100vw"
                />
            </div>
        </Link>
    );
}
