import { notFound } from "next/navigation";
import { getDictionary, locales } from "@/i18n/getDictionary";
import ContactUsPage from "@/components/pageComponents/ContactUsPage";

export async function generateMetadata() {
    return {
        title: "Contact HKMandu | Hong Kong Nepal Support",
        description:
            "Contact HKMandu for courier, products, services, business, travel, and digital support between Hong Kong and Nepal.",
        icons: {
            icon: "/default.ico",
        },
    };
}

export default async function Page({ params }) {
    const { locale } = await params;

    if (!locales.includes(locale)) notFound();

    const dict = await getDictionary(locale);

    return <ContactUsPage locale={locale} dict={dict} />;
}