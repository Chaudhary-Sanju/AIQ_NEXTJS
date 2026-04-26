import { notFound } from "next/navigation";
import { getDictionary, locales } from "@/i18n/getDictionary";
import AboutUsPage from "@/components/pageComponents/AboutUsPage";

export async function generateMetadata({ params }) {
    const { locale } = await params;

    return {
        title: "About HKMandu | Hong Kong Nepal Services & Marketplace",
        description:
            "Learn about HKMandu, a Hong Kong and Nepal focused platform for products, services, courier, travel, business, and digital solutions.",
        icons: {
            icon: "/default.ico",
        },
    };
}

export default async function Page({ params }) {
    const { locale } = await params;

    if (!locales.includes(locale)) notFound();

    const dict = await getDictionary(locale);

    return <AboutUsPage locale={locale} dict={dict} />;
}