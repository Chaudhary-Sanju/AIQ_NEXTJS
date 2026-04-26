import { notFound } from "next/navigation";
import { getDictionary, locales } from "@/i18n/getDictionary";
import TrackMartOrderPage from "@/components/pageComponents/TrackMartOrderPage";

export async function generateMetadata() {
    return {
        title: "Track Mart Order | HKMandu",
        description: "Track your HKMandu marketplace product order.",
    };
}

export default async function Page({ params }) {
    const { locale } = await params;

    if (!locales.includes(locale)) notFound();

    const dict = await getDictionary(locale);

    return <TrackMartOrderPage locale={locale} dict={dict} />;
}