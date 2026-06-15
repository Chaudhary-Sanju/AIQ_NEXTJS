import { redirect, notFound } from "next/navigation";
import { locales } from "@/i18n/getDictionary";

export async function generateMetadata() {
    return {
        title: "R Services | HkMandu",
        description:
            "Explore HkMandu professional services including software development, accounting, business services, travel, immigration, construction, and repair support.",
        icons: {
            icon: "/favicon.ico",
        },
    };
}

export default async function ServicesPage({ params }) {
    const { locale } = await params;

    if (!locales.includes(locale)) notFound();

    redirect(`/${locale}#perfect-services`);
}