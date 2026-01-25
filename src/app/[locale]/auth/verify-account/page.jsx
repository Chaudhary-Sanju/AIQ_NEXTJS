import VerifyAccount from "@/components/pageComponents/VerifyAccount";

// If you already load dictionaries in layout, you can pass dict down from there.
// Here is a simple page-level version:
import { getDictionary, locales } from "@/i18n/getDictionary";

export default async function Page({ params }) {
    const { locale } = await params;

    if (!locales.includes(locale)) notFound();

    const dict = await getDictionary(locale);

    return <VerifyAccount locale={locale} dict={dict} />;
}
