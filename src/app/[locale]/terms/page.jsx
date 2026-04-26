import { notFound } from "next/navigation";
import { getDictionary, locales } from "@/i18n/getDictionary";
import TermsPage from "@/components/pageComponents/TermsPage";

export async function generateMetadata() {
    return {
        title: "Terms & Conditions | HKMandu",
        description:
            "Read HKMandu terms and conditions for using our platform, services, products, and courier support between Hong Kong and Nepal.",
    };
}

export default async function Page({ params }) {
    const { locale } = await params;

    if (!locales.includes(locale)) notFound();

    const dict = await getDictionary(locale);

    return <TermsPage locale={locale} dict={dict} />;
}