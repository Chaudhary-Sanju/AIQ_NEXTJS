import { notFound } from "next/navigation";
import DeliveryHero from "@/components/clientComponents/DeliveryHero";
import HeroSlider from "@/components/clientComponents/HeroSlider";
import { getDictionary, locales } from "@/i18n/getDictionary";

export default async function Home({ params }) {
  const { locale } = await params;

  if (!locales.includes(locale)) notFound();

  const dict = await getDictionary(locale);

  return (
    <>
      <HeroSlider
        slides={[
          { id: "1", image: "/banners/accounting.jpeg", alt: "Accounting", href: `/${locale}/products` },
          { id: "2", image: "/banners/singapore.png", alt: "Singapore", href: `/${locale}/services` },
          { id: "3", image: "/banners/kaunas.jpg", alt: "Kaunas" },
        ]}
        autoPlay
        interval={4000}
      />

      {/* Normal page content */}
      <main className="p-6">
        <h1 className="text-3xl font-bold">Home</h1>
        <p>Locale routing is working</p>
      </main>

      <DeliveryHero locale={locale} dict={dict} />
    </>
  );
}
