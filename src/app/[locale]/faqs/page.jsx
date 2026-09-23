import { notFound } from "next/navigation";
import FAQSection from "@/components/clientComponents/FAQSection";
import { getDictionary, locales } from "@/i18n/getDictionary";

const metadataByLocale = {
    en: {
        title: "Frequently Asked Questions | HKMandu",
        description: "Find answers to common questions about HKMandu delivery, tracking, pickup, shipping, and services.",
    },
    ne: {
        title: "बारम्बार सोधिने प्रश्नहरू | HKMandu",
        description: "HKMandu को डेलिभरी, ट्र्याकिङ, पिकअप, ढुवानी र सेवासम्बन्धी सामान्य प्रश्नहरूको उत्तर पाउनुहोस्।",
    },
    zh: {
        title: "常见问题 | HKMandu",
        description: "查看有关 HKMandu 配送、追踪、取件、运输和服务的常见问题解答。",
    },
};

export async function generateMetadata({ params }) {
    const { locale } = await params;
    return metadataByLocale[locale] || metadataByLocale.en;
}

export default async function FAQsPage({ params }) {
    const { locale } = await params;

    if (!locales.includes(locale)) notFound();

    const dict = await getDictionary(locale);

    return (
        <main>
            <FAQSection locale={locale} page="home" dict={dict} />
        </main>
    );
}
