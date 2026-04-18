import { notFound } from "next/navigation";
import { getDictionary, locales } from "@/i18n/getDictionary";
import FAQSection from "@/components/clientComponents/FAQSection";
import DynamicPerfectServicesHeroSection from "@/components/clientComponents/DynamicPerfectServicesHeroSection";

export async function generateMetadata() {
    return {
        title: "HkMandu Software Service Service | Hong Kong ↔ Nepal Fast & Secure Delivery",

        description:
            "AI-powered international courier platform connecting Hong Kong and Nepal with real-time tracking, secure cross-border logistics, and fast delivery services.",

        icons: {
            icon: "/default.ico",
        },

        category: "logistics",
        generator: "Next.js",

        keywords: [
            "HkMandu Software Service",
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
            title: "HkMandu Software Service Service | Hong Kong ↔ Nepal Fast & Secure Delivery",
            description:
                "AI-powered international courier platform connecting Hong Kong and Nepal with real-time tracking, secure cross-border logistics, and fast delivery services.",
            locale: "en_HK",
            type: "website",
            images: [
                {
                    url: "/default-og.png",
                    width: 1200,
                    height: 630,
                    alt: "HkMandu Software Service Hong Kong Nepal"
                }
            ]
        },

        twitter: {
            card: "summary_large_image",
            title: "HkMandu Software Service Service | Hong Kong ↔ Nepal Fast & Secure Delivery",
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
            <DynamicPerfectServicesHeroSection
                locale={locale}
                dict={dict}
                serviceKey="businessServices"
                imageName="business.jpg"
            />

            <FAQSection
                locale={locale}
                page="software-development"
                dict={dict}
            />

        </>
    );
}
