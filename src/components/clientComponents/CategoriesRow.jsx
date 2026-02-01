"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import http from "@/http";
import { imgUrl } from "@/lib";

const pickName = (nameObj, locale = "en") => {
    if (!nameObj || typeof nameObj !== "object") return "";
    return nameObj?.[locale] || nameObj?.en || nameObj?.ne || nameObj?.zh || "";
};

const CATEGORY_TITLES = {
    en: "Categories",
    ne: "श्रेणीहरू",
    zh: "分类",
};


export default function CategoriesRow({
    locale = "en",
    limit = 4,
    className = "my-8",
}) {
    const title = CATEGORY_TITLES[locale] || CATEGORY_TITLES.en;
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function load() {
            setLoading(true);
            try {
                const res = await http.get("/frontend/category");
                const rows = Array.isArray(res?.data?.data) ? res.data.data : [];

                const mapped = rows
                    .filter((c) => c?.status === true)
                    .map((c) => ({
                        id: c?._id,
                        name: pickName(c?.name, locale),
                        slug: c?.slug,
                        image: Array.isArray(c?.image) ? c.image[0] : c?.image,
                        href: `/${locale}/category/${c?.slug}`, // change route if yours is different
                    }))
                    .filter((c) => c.name && c.image);

                if (mounted) setItems(mapped);
            } catch (e) {
                // toast already handled by http interceptor
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
                                <div className="mt-3 h-6 w-2/3 mx-auto rounded bg-slate-200" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
                        {shown.map((c) => (
                            <Link key={c.id} href={c.href} className="group block">
                                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-slate-100 shadow-sm ring-1 ring-black/5 transition group-hover:shadow-md">
                                    <Image
                                        src={imgUrl(c.image)}
                                        alt={c.name}
                                        fill
                                        className="object-cover transition group-hover:scale-[1.02]"
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                        unoptimized
                                    />
                                </div>

                                <div className="mt-3 text-center">
                                    <p className="text-xl font-extrabold tracking-tight text-slate-900">
                                        {c.name}
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
