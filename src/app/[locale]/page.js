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

      <LicenseHero locale={locale} dict={dict} />

      <ProductTypeSection locale={locale} type="trendingProduct" limit={5} />

      <DealsHero locale={locale} dict={dict} />

      <ProductTypeSection locale={locale} type="hotProduct" limit={5} />

      <CompanyRegisterHero locale={locale} dict={dict} />

      <ProductTypeSection locale={locale} type="mostSearchedProduct" limit={5} />

      <Brands locale={locale} limit={4} />

      <TravelHero locale={locale} dict={dict} />

    </>
  );
}
