import { notFound } from "next/navigation";
import { getDictionary, locales } from "@/i18n/getDictionary";
import TrackCourierPage from "@/components/pageComponents/TrackCourierPage";

export async function generateMetadata() {
    return {
        title: "Track Courier | HKMandu",
        description: "Track your HKMandu courier shipment between Hong Kong and Nepal.",
    };
}

export default async function Page({ params }) {
    const { locale } = await params;

    if (!locales.includes(locale)) notFound();

    const dict = await getDictionary(locale);

    return <TrackCourierPage locale={locale} dict={dict} />;
}