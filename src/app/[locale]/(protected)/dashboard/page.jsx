import { redirect, notFound } from "next/navigation";
import { locales } from "@/i18n/getDictionary";

export default async function DashboardPage({ params }) {
    const { locale } = await params;

    if (!locales.includes(locale)) notFound();

    redirect(`/${locale}/dashboard/orders`);
}