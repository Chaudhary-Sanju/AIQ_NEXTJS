import { notFound } from "next/navigation";
import HeroSlider from "@/components/clientComponents/HeroSlider";
import { getDictionary, locales } from "@/i18n/getDictionary";
import MarqueeBar from "@/components/clientComponents/MarqueeBar";
import ProductTypeSection from "@/components/clientComponents/ProductTypeSection";
import PerfectServicesSection from "@/components/clientComponents/PerfectServicesSection";
import ServiceRequestForm from "@/components/clientComponents/ServiceRequestForm";

export default async function Home({ params }) {
  const { locale } = await params;

  if (!locales.includes(locale)) notFound();

  const dict = await getDictionary(locale);

  return (
    <>
      <MarqueeBar locale={locale} />

      <HeroSlider locale={locale} autoPlay interval={4000} />

      <ProductTypeSection locale={locale} type="featuredProduct" limit={6} />

      <div id="perfect-services">
        <PerfectServicesSection locale={locale} />
      </div>

      <ProductTypeSection locale={locale} type="trendingProduct" limit={6} />

      <ServiceRequestForm locale={locale} />
    </>
  );
}
