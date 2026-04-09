import { notFound } from "next/navigation";
import { getDictionary, locales } from "@/i18n/getDictionary";
import SoftwareDetailClient from "@/components/clientComponents/SoftwareDetailClient";
import SimilarSoftware from "@/components/clientComponents/SimilarSoftware";

async function getSoftwareBySlug(slug) {
    const base = process.env.NEXT_PUBLIC_API_URL;
    const url = `${base}/frontend/software/${encodeURIComponent(slug)}`;

    const res = await fetch(url, { cache: "no-store" }); // or { next: { revalidate: 60 } }
    if (!res.ok) return null;

    const data = await res.json();
    return data?.data ?? data; // supports {data: {...}} or direct object
}

export async function generateMetadata({ params }) {
    const { locale, slug } = await params;

    const item = await getSoftwareBySlug(slug);

    const title =
        item?.name?.[locale] ?? item?.name?.en ?? item?.slug ?? "Software";

    const summary =
        item?.summary?.[locale] ?? item?.summary?.en ?? "Software details";

    return {
        title: `${title} | HkMandu Software`,
        description: summary,
        icons: { icon: "/default.ico" },
        openGraph: {
            title: `${title} | HkMandu Software`,
            description: summary,
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: `${title} | HkMandu Software`,
            description: summary,
        },
    };
}

export default async function Page({ params }) {
    const { locale, slug } = await params;

    if (!locales.includes(locale)) notFound();

    const dict = await getDictionary(locale);

    const item = await getSoftwareBySlug(slug);
    if (!item) notFound();

    return <>
        <SoftwareDetailClient locale={locale} dict={dict} item={item} />
        <SimilarSoftware
            slug={item?.slug}
            locale={locale}
        />
    </>
}