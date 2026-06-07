import { notFound } from "next/navigation";
import { locales } from "@/i18n/getDictionary";
import RestaurantCartPageView from "@/components/pageComponents/restaurant/RestaurantCartPageView";

export default async function Page({ params }) {
  const { locale } = await params;

  if (!locales.includes(locale)) notFound();

  return <RestaurantCartPageView locale={locale} />;
}