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

      <PerfectServicesSection locale={locale} />

      <ProductTypeSection locale={locale} type="trendingProduct" limit={6} />

      <ServiceRequestForm locale={locale} />
      
      
      {/* <CategoriesRow locale={locale} limit={4} />

      <DeliveryHero
        locale={locale}
        dict={dict}
        links={{
          getStarted: `/${locale}/services/courier`,
          trackOrder: `/${locale}/track-order`
        }}
      />

      <AccountingHero locale={locale} dict={dict} />

      <ProductTypeSection locale={locale} type="trendingProduct" limit={5} />

      <LicenseHero locale={locale} dict={dict} />

      <ProductTypeSection locale={locale} type="hotProduct" limit={5} />

      <DealsHero locale={locale} dict={dict} />

      <CompanyRegisterHero locale={locale} dict={dict} />

      <Brands locale={locale} limit={4} />

      <TravelHero locale={locale} dict={dict} />

      <ImageLinkBanner
        locale={locale}
        src="/banners/baby-offer.png"
        href="/deals"
        alt="Flat Rs.100 off"
        className="my-6"
      />

      <AirportHero locale={locale} dict={dict} />

      <ImageLinkBanner
        locale={locale}
        src="/banners/seasonal-saving.png"
        href="/deals"
        alt="Flat Rs.100 off"
        className="my-6"
      />

      <TransportHero locale={locale} dict={dict} />

      <ProductTypeSection locale={locale} type="mostSearchedProduct" limit={5} />

      <VisaImmigrationHero locale={locale} dict={dict} />

      <ImageLinkBigBanner
        locale={locale}
        src="/banners/sale.png"
        href="/deals"
        alt="Flat Rs.100 off"
        className="my-0"
      />

      <OfficeMovingHero locale={locale} dict={dict} />

      <ImageLinkBigBanner
        locale={locale}
        src="/banners/discount.png"
        href="/deals"
        alt="Flat Rs.100 off"
        className="my-0"
      />

      <RepairInstallationSection locale={locale} dict={dict} /> */}
    </>
  );
}
