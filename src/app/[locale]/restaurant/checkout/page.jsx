import { notFound } from "next/navigation";
import { locales } from "@/i18n/getDictionary";
import RestaurantCheckoutPageView from "@/components/pageComponents/restaurant/RestaurantCheckoutPageView";

export default async function Page({ params }) {
  const { locale } = await params;

  if (!locales.includes(locale)) notFound();

  return <RestaurantCheckoutPageView locale={locale} />;
}