import { notFound } from "next/navigation";
import { getDictionary, locales } from "@/i18n/getDictionary";
import ShippingAndHandlingPage from "@/components/pageComponents/ShippingAndHandlingPage";

export async function generateMetadata() {
    return {
        title: "Shipping & Handling | HKMandu",
        description:
            "Read HKMandu shipping and handling policy for courier, delivery, parcels, and product orders between Hong Kong and Nepal.",
    };
}

export default async function Page({ params }) {
    const { locale } = await params;

    if (!locales.includes(locale)) notFound();

    const dict = await getDictionary(locale);

    return <ShippingAndHandlingPage locale={locale} dict={dict} />;
}