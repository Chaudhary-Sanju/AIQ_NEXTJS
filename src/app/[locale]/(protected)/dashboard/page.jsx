import { notFound } from "next/navigation";
import { getDictionary, locales } from "@/i18n/getDictionary";
import DashboardShell from "@/components/clientComponents/dashboard/DashboardShell";

export default async function DashboardPage({ params }) {
    const { locale } = await params;
    if (!locales.includes(locale)) notFound();

    const dict = await getDictionary(locale);
    return <DashboardShell dict={dict} />;
}
