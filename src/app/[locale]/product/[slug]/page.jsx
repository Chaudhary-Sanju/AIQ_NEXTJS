import { notFound } from "next/navigation";
import { getDictionary, locales } from "@/i18n/getDictionary";
import ProductDetailsView from "@/components/pageComponents/ProductDetailsView";

export default async function Page({ params }) {
    const { locale, slug } = await params;

    if (!locales.includes(locale)) notFound();

    const dict = await getDictionary(locale);

    return (
        <ProductDetailsView
            locale={locale}
            slug={slug}
            dict={dict}
        />
    );
}