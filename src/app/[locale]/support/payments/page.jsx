import { notFound } from "next/navigation";
import { getDictionary, locales } from "@/i18n/getDictionary";
import PaymentsPage from "@/components/pageComponents/PaymentsPage";

export async function generateMetadata() {
    return {
        title: "Payments Policy | HKMandu",
        description:
            "Read HKMandu payment policy for product orders, courier requests, and professional services.",
    };
}

export default async function Page({ params }) {
    const { locale } = await params;

    if (!locales.includes(locale)) notFound();

    const dict = await getDictionary(locale);

    return <PaymentsPage locale={locale} dict={dict} />;
}