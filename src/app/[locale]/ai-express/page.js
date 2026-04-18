import { notFound } from "next/navigation";
import DeliveryHero from "@/components/clientComponents/DeliveryHero";
import { getDictionary, locales } from "@/i18n/getDictionary";
import AboutSection from "@/components/clientComponents/AiExpressAboutSection";
import OurCoverageSection from "@/components/clientComponents/OurCoverageSection";
import AiExpressPickupForm from "@/components/clientComponents/AiExpressPickupForm";
import FAQSection from "@/components/clientComponents/FAQSection";

export async function generateMetadata() {
    return {
        title: "AI Courier Service | Hong Kong ↔ Nepal Fast & Secure Delivery",

        description:
            "AI-powered international courier platform connecting Hong Kong and Nepal with real-time tracking, secure cross-border logistics, and fast delivery services.",

        icons: {
            icon: "/default.ico",
        },

        category: "logistics",
        generator: "Next.js",

        keywords: [
            "AI courier",
            "Hong Kong Nepal shipping",
            "international delivery",
            "cross-border logistics",
            "parcel tracking",
            "Hong Kong courier service",
            "Nepal courier service"
        ],

        authors: [
            { name: "YALAKOM Team" }
        ],

        creator: "YALAKOM",
        publisher: "YALAKOM",

        openGraph: {
            title: "AI Courier Service | Hong Kong ↔ Nepal Fast & Secure Delivery",
            description:
                "AI-powered international courier platform connecting Hong Kong and Nepal with real-time tracking, secure cross-border logistics, and fast delivery services.",
            locale: "en_HK",
            type: "website",
            images: [
                {
                    url: "/default-og.png",
                    width: 1200,
                    height: 630,
                    alt: "AI Courier Hong Kong Nepal"
                }
            ]
        },

        twitter: {
            card: "summary_large_image",
            title: "AI Courier Service | Hong Kong ↔ Nepal Fast & Secure Delivery",
            description:
                "AI-powered international courier platform connecting Hong Kong and Nepal with real-time tracking, secure cross-border logistics, and fast delivery services.",
            images: ["/default-og.png"]
        }
    };
}

export default async function Page({ params }) {
    const { locale } = await params;

    if (!locales.includes(locale)) notFound();

    const dict = await getDictionary(locale);

    return (
        <>
            <DeliveryHero
                locale={locale}
                dict={dict}
                links={{
                    whatsapp: "https://wa.me/852XXXXXXXX",
                    trackOrder: "/track-order",
                }}
            />

            <AboutSection dict={dict} />

            <AiExpressPickupForm locale={locale} />

            <OurCoverageSection dict={dict} mapSrc="/coverage-map.png" />

            <FAQSection
                locale={locale}
                page="ai-express"
                dict={dict}
            />

        </>
    );
}
