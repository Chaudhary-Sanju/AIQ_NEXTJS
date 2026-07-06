"use client";

import { useEffect, useState } from "react";
import { Check, Share2 } from "lucide-react";

const LABELS = {
    share: {
        en: "Share",
        ne: "शेयर",
        zh: "分享",
    },
    copied: {
        en: "Copied",
        ne: "कपी भयो",
        zh: "已复制",
    },
};

const getLabel = (key, locale = "en") => {
    return LABELS?.[key]?.[locale] || LABELS?.[key]?.en || key;
};

const getProductUrl = ({ locale = "en", slug = "" }) => {
    if (typeof window === "undefined") return `/${locale}/product/${slug}`;

    if (!slug) return window.location.href;

    return `${window.location.origin}/${locale}/product/${slug}`;
};

const copyToClipboard = async (value) => {
    if (!value || typeof window === "undefined") return false;

    try {
        if (navigator?.clipboard?.writeText) {
            await navigator.clipboard.writeText(value);
            return true;
        }
    } catch {
        // Fall through to the textarea fallback below.
    }

    try {
        const textarea = document.createElement("textarea");
        textarea.value = value;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        textarea.style.top = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const success = document.execCommand("copy");
        document.body.removeChild(textarea);
        return success;
    } catch {
        return false;
    }
};

export default function ProductShareButton({
    locale = "en",
    slug = "",
    title = "HKMandu product",
    summary = "",
    className = "",
}) {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!copied) return undefined;

        const timer = setTimeout(() => {
            setCopied(false);
        }, 1600);

        return () => clearTimeout(timer);
    }, [copied]);

    const shareLabel = getLabel("share", locale);
    const copiedLabel = getLabel("copied", locale);

    const handleShare = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        const url = getProductUrl({ locale, slug });
        const safeTitle = title || "HKMandu product";
        const text = summary
            ? `${safeTitle} - ${summary}`
            : "Check this product on HKMandu";

        if (typeof navigator !== "undefined" && navigator.share) {
            try {
                await navigator.share({
                    title: safeTitle,
                    text,
                    url,
                });
                return;
            } catch (error) {
                if (error?.name === "AbortError") return;
            }
        }

        const success = await copyToClipboard(url);
        setCopied(success);
    };

    return (
        <button
            type="button"
            onClick={handleShare}
            aria-label={copied ? copiedLabel : shareLabel}
            title={copied ? copiedLabel : shareLabel}
            className={[
                "inline-flex h-9 items-center justify-center gap-1.5 rounded-full border px-3 text-[11px] font-extrabold shadow-lg backdrop-blur transition duration-200 focus:outline-none focus:ring-4",
                copied
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 shadow-emerald-900/10 hover:bg-emerald-600 hover:text-white focus:ring-emerald-500/15"
                    : "border-white/80 bg-white/95 text-[#1a4b8f] shadow-black/10 hover:-translate-y-0.5 hover:bg-[#1a4b8f] hover:text-white focus:ring-[#1a4b8f]/15",
                className,
            ].join(" ")}
        >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
            <span>{copied ? copiedLabel : shareLabel}</span>
        </button>
    );
}
