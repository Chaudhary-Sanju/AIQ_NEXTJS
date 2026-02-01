"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import http from "@/http";
import { imgUrl } from "@/lib";

const BRAND_TITLES = {
    en: "Brands",
    ne: "ब्रान्डहरू",
    zh: "品牌",
};

export default function Brands({
    locale = "en",
    limit = 4,
    className = "my-8",
}) {
    const title = BRAND_TITLES[locale] || BRAND_TITLES.en;

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function load() {
            setLoading(true);
            try {
                const res = await http.get("/frontend/brand");
                const rows = Array.isArray(res?.data?.data) ? res.data.data : [];

                const mapped = rows
                    .filter((b) => b?.status === true)
                    .map((b) => ({
                        id: b?._id,
                        name: typeof b?.name === "string" ? b.name : "",
                        slug: b?.slug,
                        image: Array.isArray(b?.image) ? b.image[0] : b?.image,
                        href: `/${locale}/brand/${b?.slug}`, // change if your route is different
                    }))
                    .filter((b) => b.name && b.image);

                if (mounted) setItems(mapped);
            } catch (e) {
                if (mounted) setItems([]);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        load();
        return () => {
            mounted = false;
        };
    }, [locale]);

    const shown = useMemo(() => items.slice(0, limit), [items, limit]);

    return (
        <section className={["w-full", className].join(" ")}>
            <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
                <h2 className="text-3xl font-extrabold text-slate-900">{title}</h2>

                {loading && shown.length === 0 ? (
                    <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
                        {Array.from({ length: limit }).map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-[4/3] w-full rounded-md bg-slate-200" />
                                <div className="mt-3 mx-auto h-6 w-2/3 rounded bg-slate-200" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
                        {shown.map((b) => (
                            <Link key={b.id} href={b.href} className="group block">
                                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-white transition">
                                    <Image
                                        src={imgUrl(b.image)}
                                        alt={b.name}
                                        fill
                                        className="object-contain p-3 transition group-hover:scale-[1.02]"
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                        unoptimized
                                    />
                                </div>

                                <div className="mt-3 text-center">
                                    <p className="text-xl font-extrabold tracking-tight text-slate-900">
                                        {b.name}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
