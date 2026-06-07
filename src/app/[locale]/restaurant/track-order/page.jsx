import { notFound } from "next/navigation";
import { locales } from "@/i18n/getDictionary";
import RestaurantTrackOrderPageView from "@/components/pageComponents/restaurant/RestaurantTrackOrderPageView";

export default async function Page({ params }) {
  const { locale } = await params;

  if (!locales.includes(locale)) notFound();

  return <RestaurantTrackOrderPageView locale={locale} />;
}