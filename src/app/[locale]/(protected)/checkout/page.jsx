import { notFound } from "next/navigation";
import { getDictionary, locales } from "@/i18n/getDictionary";
import CheckoutPage from "@/components/pageComponents/CheckoutPage";

export default async function Page({ params }) {
    const { locale } = await params;

    if (!locales.includes(locale)) notFound();

    const dict = await getDictionary(locale);

    return <CheckoutPage locale={locale} dict={dict} />;
}