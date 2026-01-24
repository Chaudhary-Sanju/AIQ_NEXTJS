import "../globals.css";
import Navbar from "@/components/clientComponents/Navbar";
import { notFound } from "next/navigation";
import { Raleway } from "next/font/google";
import { getDictionary, locales } from "@/i18n/getDictionary";
import Footer from "@/components/clientComponents/Footer";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-raleway",
  display: "swap",
});

export async function generateMetadata() {
  return {
    title: "Yalakhom (AIQ) – E-Commerce, Courier (HK↔Nepal) & Services Platform",
    description: "Yalakhom (AIQ) is an all-in-one platform combining Food Mart e-commerce, courier booking & tracking (Hong Kong ↔ Nepal), and a services marketplace (immigration, company registration, licensing, travel, moving, repairs). Available on web and mobile with multilingual support.",
    icons: {
      icon: '/default.ico'
    },
    category: "saas",
    generator: "Next.js",

    keywords: [
      "Yalakhom",
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

    authors: [{ name: "Yalakhom Team", url: "https://yalakhom.com" }],
    creator: "Yalakhom",
    publisher: "Yalakhom",
    openGraph: {
      title: "Yalakhom (AIQ) – E-Commerce, Courier (HK↔Nepal) & Services Platform",
      description: "Yalakhom (AIQ) is an all-in-one platform combining Food Mart e-commerce, courier booking & tracking (Hong Kong ↔ Nepal), and a services marketplace (immigration, company registration, licensing, travel, moving, repairs). Available on web and mobile with multilingual support.",
      locale: "en_NP",
      type: "website",
      images: [
        '/default-og.png'
      ]
    }
  };
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  if (!locales.includes(locale)) notFound();

  const dict = await getDictionary(locale);

  return (
    <html lang={locale} className={raleway.variable}>
      <head>

        <link
          rel="icon"
          href={
            '/default.ico'
          }
          type="image/x-icon"
        />

        {/* <meta name="google-site-verification" content="dFiRWQVmiz3oPKLqPqhUdrvzqpn-iaqM_6f-pJOFeVc" /> */}

        <title>Yalakhom (AIQ) – E-Commerce, Courier (HK↔Nepal) & Services Platform</title>
      </head>
      <body>
        <Navbar locale={locale} dict={dict} />
        {children}
        <Footer locale={locale} dict={dict} />
      </body>
    </html>
  );
}
