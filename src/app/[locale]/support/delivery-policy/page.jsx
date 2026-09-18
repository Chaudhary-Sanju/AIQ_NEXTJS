import { notFound } from "next/navigation";
import { getDictionary, locales } from "@/i18n/getDictionary";
import DeliveryPolicyPage from "@/components/pageComponents/DeliveryPolicyPage";

export async function generateMetadata() {
    return {
        title: "Delivery Policy | HKMandu",
        description:
            "Read HKMandu's delivery policy covering order preparation, vendor and courier handoff, delivery contact, proof of delivery, failed delivery, customer support, and delivery-related data use.",
    };
}

export default async function Page({ params }) {
    const { locale } = await params;

    if (!locales.includes(locale)) notFound();

    const dict = await getDictionary(locale);

    return <DeliveryPolicyPage locale={locale} dict={dict} />;
}
