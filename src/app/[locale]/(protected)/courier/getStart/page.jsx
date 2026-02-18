import { getDictionary, locales } from "@/i18n/getDictionary";
import AddCourierOrder from "@/components/pageComponents/AICourierCreateOrder";
import { notFound } from "next/navigation";

export default async function getStartPage({ params }) {
    const { locale } = await params;

    if (!locales.includes(locale)) notFound();

    const dict = await getDictionary(locale);

    // Optional: get user to show on page
    // const user = await requireAuth(locale, `/${locale}/courier/getStart`);

    return (
        <>
            <AddCourierOrder dict={dict} />
        </>
    );
}
