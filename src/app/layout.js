import HashScrollHandler from "@/components/clientComponents/dashboard/HashScrollHandler";
import "./globals.css";
import Providers from "./providers";
import { CartProvider } from "@/contexts/CartContext";
import Script from "next/script";

export async function generateMetadata() {
    return {
        metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://hkmandu.com"),

        title: "HkMandu (AIQ) – E-Commerce, Courier (HK↔Nepal) & Services Platform",
        description: "HkMandu (AIQ) is an all-in-one platform combining Food Mart e-commerce, courier booking & tracking (Hong Kong ↔ Nepal), and a services marketplace (immigration, company registration, licensing, travel, moving, repairs). Available on web and mobile with multilingual support.",
        icons: {
            icon: "/favicon.ico",
        },
        category: "saas",
        generator: "Next.js",

        keywords: [
            "HkMandu",
            "AIQ platform",
            "Food Mart",
            "online grocery store",
            "ecommerce",
            "courier booking",
            "courier tracking",
            "Hong Kong Nepal courier",
            "HK to Nepal delivery",
            "Nepal to HK delivery",
            "services marketplace",
            "visa and immigration",
            "company registration",
            "F&B licensing",
            "travel and tour",
            "moving services",
            "repair services",
            "transport booking",
            "admin CMS dashboard",
            "multilingual app",
            "English Nepali Cantonese",
        ],

        authors: [{ name: "HkMandu Team", url: "https://hkmandu.com" }],
        creator: "HkMandu",
        publisher: "HkMandu",
        openGraph: {
            title: "HkMandu (AIQ) – E-Commerce, Courier (HK↔Nepal) & Services Platform",
            description: "HkMandu (AIQ) is an all-in-one platform combining Food Mart e-commerce, courier booking & tracking (Hong Kong ↔ Nepal), and a services marketplace (immigration, company registration, licensing, travel, moving, repairs). Available on web and mobile with multilingual support.",
            locale: "en_NP",
            type: "website",
            images: [
                '/default-og.png'
            ]
        }
    };
}

export default function RootLayout({ children }) {
    return (
        <html suppressHydrationWarning>
            <head>
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
                />

                {/* <meta name="google-site-verification" content="dFiRWQVmiz3oPKLqPqhUdrvzqpn-iaqM_6f-pJOFeVc" /> */}

                <title>HkMandu (AIQ) – E-Commerce, Courier (HK↔Nepal) & Services Platform</title>
            </head>
            <body>

                <Providers>
                    <CartProvider>
                        <HashScrollHandler />
                        {children}
                    </CartProvider>
                </Providers>

                <Script id="tawk-to" strategy="afterInteractive">
                    {`
                            var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
                            (function () {
                                var s1 = document.createElement("script");
                                var s0 = document.getElementsByTagName("script")[0];

                                s1.async = true;
                                s1.src = "https://embed.tawk.to/5e8203f635bcbb0c9aabe475/1jp1f0aah";
                                s1.charset = "UTF-8";

                                s0.parentNode.insertBefore(s1, s0);
                            })();
                        `}
                </Script>
            </body>
        </html>
    );
}
