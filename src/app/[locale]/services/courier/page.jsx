import { notFound } from "next/navigation";
import DeliveryHero from "@/components/clientComponents/DeliveryHero";
import { getDictionary, locales } from "@/i18n/getDictionary";
import AICourierSystemSection from "@/components/clientComponents/AICourierSystemSection";
import AboutSection from "@/components/clientComponents/AboutSection";
import OurCoverageSection from "@/components/clientComponents/OurCoverageSection";
import FAQSectionAICourier from "@/components/clientComponents/FAQSectionAICourier";

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
                    getStarted: `/${locale}/courier/getStart`,
                    trackOrder: `/${locale}/track-order`
                }}
            />

            <AICourierSystemSection dict={dict} />

            <AboutSection dict={dict} imageSrc="/about-courier.png" />

            <OurCoverageSection dict={dict} mapSrc="/coverage-map.png" />

            <FAQSectionAICourier dict={dict} />

        </>
    );
}
