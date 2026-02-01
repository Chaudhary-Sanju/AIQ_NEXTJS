"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import http from "@/http";

const getLocalized = (name, locale = "en") => {
    if (!name || typeof name !== "object") return "";
    return name?.[locale] || name?.en || name?.ne || name?.zh || "";
};

export default function CategoryNameBar({
    locale = "en",
    className = "",
    limit, // optional
}) {
    const [cats, setCats] = useState([]);
    const pathname = usePathname();

    useEffect(() => {
        let mounted = true;

        async function load() {
            try {
                const res = await http.get("/frontend/category");
                const rows = Array.isArray(res?.data?.data) ? res.data.data : [];

                const mapped = rows
                    .filter((c) => c?.status === true)
                    .map((c) => ({
                        id: c?._id,
                        name: getLocalized(c?.name, locale),
                        slug: c?.slug,
                        href: `/${locale}/category/${c?.slug}`, // adjust if your route differs
                    }))
                    .filter((c) => c.name && c.slug);

                if (mounted) setCats(mapped);
            } catch (e) {
                if (mounted) setCats([]);
            }
        }

        load();
        return () => {
            mounted = false;
        };
    }, [locale]);

    const shown = useMemo(() => {
        const arr = Array.isArray(cats) ? cats : [];
        return limit ? arr.slice(0, limit) : arr;
    }, [cats, limit]);

    return (
        <div className={["hidden lg:block w-full bg-white", className].join(" ")}>
            <div className="mx-auto max-w-7xl px-4 md:px-6">
                <div className="no-scrollbar flex items-center gap-8 overflow-x-auto py-3">
                    {shown.map((c) => {
                        const active = pathname?.includes(`/${c.slug}`);
                        return (
                            <Link
                                key={c.id}
                                href={c.href}
                                className={[
                                    "whitespace-nowrap text-sm font-medium transition",
                                    active
                                        ? "text-[#4f46e5]"
                                        : "text-slate-800 hover:text-[#4f46e5]",
                                ].join(" ")}
                            >
                                {c.name}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* hide scrollbar */}
            <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </div >
    );
}
