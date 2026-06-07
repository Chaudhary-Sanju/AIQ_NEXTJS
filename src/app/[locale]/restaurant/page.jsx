import { notFound } from "next/navigation";
import { locales } from "@/i18n/getDictionary";
import RestaurantPageView from "@/components/pageComponents/restaurant/RestaurantPageView";

export default async function Page({ params }) {
  const { locale } = await params;

  if (!locales.includes(locale)) notFound();

  return <RestaurantPageView locale={locale} />;
}