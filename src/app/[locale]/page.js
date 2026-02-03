import { notFound } from "next/navigation";
import DeliveryHero from "@/components/clientComponents/DeliveryHero";
import HeroSlider from "@/components/clientComponents/HeroSlider";
import { getDictionary, locales } from "@/i18n/getDictionary";
import CategoriesRow from "@/components/clientComponents/CategoriesRow";
import CategoryNameBar from "@/components/clientComponents/CategoryNameBar";
import ProductTypeSection from "@/components/clientComponents/ProductTypeSection";
import LicenseHero from "@/components/clientComponents/LicenseHero";
import DealsHero from "@/components/clientComponents/DealsHero";
import CompanyRegisterHero from "@/components/clientComponents/CompanyRegisterHero";
import Brands from "@/components/clientComponents/BrandsRow";
import TravelHero from "@/components/clientComponents/TravelHero";
import ImageLinkBanner from "@/components/clientComponents/ImageLinkBanner";
import AirportHero from "@/components/clientComponents/AirportHero";
import TransportHero from "@/components/clientComponents/TransportHero";
import AccountingHero from "@/components/clientComponents/AccountingHero";
import VisaImmigrationHero from "@/components/clientComponents/VisaImmigrationHero";
import ImageLinkBigBanner from "@/components/clientComponents/ImageLinkBigBanner";
import OfficeMovingHero from "@/components/clientComponents/OfficeMovingHero";
import RepairInstallationSection from "@/components/clientComponents/RepairInstallationSection";

export default async function Home({ params }) {
  const { locale } = await params;

  if (!locales.includes(locale)) notFound();

  const dict = await getDictionary(locale);

  return (
    <>

      <CategoryNameBar locale={locale} />

      <HeroSlider locale={locale} autoPlay interval={4000} />

      <CategoriesRow locale={locale} limit={4} />

      <DeliveryHero locale={locale} dict={dict} />

      <ProductTypeSection locale={locale} type="featuredProduct" limit={5} />

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

      <RepairInstallationSection locale={locale} dict={dict} />
    </>
  );
}
