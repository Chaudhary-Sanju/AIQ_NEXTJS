import { notFound } from "next/navigation";
import { getDictionary, locales } from "@/i18n/getDictionary";
import DashboardShell from "@/components/clientComponents/dashboard/DashboardShell";

const VALID_TABS = ["profile", "orders", "addresses", "security"];

export default async function DashboardTabPage({ params }) {
    const { locale, tab } = await params;

    if (!locales.includes(locale)) notFound();
    if (!VALID_TABS.includes(tab)) notFound();

    const dict = await getDictionary(locale);

    return <DashboardShell dict={dict} tab={tab} />;
}