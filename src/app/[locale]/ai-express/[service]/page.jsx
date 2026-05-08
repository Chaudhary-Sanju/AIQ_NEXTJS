import { notFound } from "next/navigation";
import DeliveryHero from "@/components/clientComponents/DeliveryHero";
import { getDictionary, locales } from "@/i18n/getDictionary";
import AboutSection from "@/components/clientComponents/AiExpressAboutSection";
import OurCoverageSection from "@/components/clientComponents/OurCoverageSection";
import AiExpressPickupForm from "@/components/clientComponents/AiExpressPickupForm";
import FAQSection from "@/components/clientComponents/FAQSection";

const SERVICES = {
    "door-to-door": {
        title: "Door to Door Courier Service | HkMandu AI Express",
        description:
            "Book door to door courier pickup and delivery with HkMandu AI Express.",
    },
    "hk-to-nepal": {
        title: "Hong Kong to Nepal Courier Service | HkMandu AI Express",
        description:
            "Send parcels from Hong Kong to Nepal with HkMandu AI Express pickup and delivery support.",
    },
    "nepal-to-hk": {
        title: "Nepal to Hong Kong Courier Service | HkMandu AI Express",
        description:
            "Send parcels from Nepal to Hong Kong with HkMandu AI Express courier support.",
    },
};

export async function generateMetadata({ params }) {
    const { service } = await params;

    const current = SERVICES[service];

    if (!current) {
        return {
            title: "AI Express | HkMandu",
            description: "AI Express courier service by HkMandu.",
        };
    }

    return {
        title: current.title,
        description: current.description,
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
            "Nepal courier service",
        ],
        authors: [{ name: "YALAKOM Team" }],
        creator: "YALAKOM",
        publisher: "YALAKOM",
        openGraph: {
            title: current.title,
            description: current.description,
            locale: "en_HK",
            type: "website",
            images: [
                {
                    url: "/default-og.png",
                    width: 1200,
                    height: 630,
                    alt: "AI Courier Hong Kong Nepal",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: current.title,
            description: current.description,
            images: ["/default-og.png"],
        },
    };
}

export default async function Page({ params }) {
    const { locale, service } = await params;

    if (!locales.includes(locale)) notFound();
    if (!SERVICES[service]) notFound();

    const dict = await getDictionary(locale);

    return (
        <>
            <DeliveryHero
                locale={locale}
                dict={dict}
                links={{
                    whatsapp: "https://wa.me/852XXXXXXXX",
                    trackOrder: "/support/track-courier",
                }}
            />

            <section id="pickup-form" className="scroll-mt-24">
                <AiExpressPickupForm locale={locale} serviceType={service} />
            </section>

            <AboutSection dict={dict} />

            <OurCoverageSection dict={dict} mapSrc="/coverage-map.png" />

            <FAQSection locale={locale} page="ai-express" dict={dict} />
        </>
    );
}