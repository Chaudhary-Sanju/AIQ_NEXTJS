import { notFound } from "next/navigation";
import { getDictionary, locales } from "@/i18n/getDictionary";
import CookiesPolicyPage from "@/components/pageComponents/CookiesPolicyPage";

export async function generateMetadata() {
    return {
        title: "Cookies Policy | HKMandu",
        description:
            "Learn how HKMandu uses cookies to improve user experience, performance, and services.",
    };
}

export default async function Page({ params }) {
    const { locale } = await params;

    if (!locales.includes(locale)) notFound();

    const dict = await getDictionary(locale);

    return <CookiesPolicyPage locale={locale} dict={dict} />;
}