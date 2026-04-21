import { notFound } from "next/navigation";
import { getDictionary, locales } from "@/i18n/getDictionary";
import ProductsPageView from "@/components/pageComponents/ProductsPageView";

export default async function Page({ params, searchParams }) {
    const { locale } = await params;

    if (!locales.includes(locale)) notFound();

    const dict = await getDictionary(locale);
    const resolvedSearchParams = await searchParams;

    return (
        <ProductsPageView
            locale={locale}
            dict={dict}
            searchParams={resolvedSearchParams}
        />
    );
}