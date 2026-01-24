"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales } from "@/i18n/getDictionary";

const labels = {
    en: "EN",
    ne: "NE",
    zh: "粵",
};

export default function LanguageSwitcher({ locale }) {
    const router = useRouter();
    const pathname = usePathname();

    function switchTo(nextLocale) {
        // pathname looks like /en/...
        const segments = pathname.split("/");
        segments[1] = nextLocale; // replace locale segment
        router.push(segments.join("/") || `/${nextLocale}`);
    }

    return (
        <div className="flex items-center gap-2">
            {locales.map((l) => (
                <button
                    key={l}
                    onClick={() => switchTo(l)}
                    className={`rounded-md px-2 py-1 text-xs font-semibold ${l === locale ? "bg-white/20 text-white" : "text-white/90 hover:bg-white/10"
                        }`}
                >
                    {labels[l]}
                </button>
            ))}
        </div>
    );
}
