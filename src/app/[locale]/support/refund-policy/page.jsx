import { notFound } from "next/navigation";
import { getDictionary, locales } from "@/i18n/getDictionary";
import RefundPolicyPage from "@/components/pageComponents/RefundPolicyPage";

export async function generateMetadata() {
    return {
        title: "Refund & Return Policy | HKMandu",
        description:
            "Read HKMandu's refund and return policy for marketplace products, restaurant orders, courier services, professional services, PaymentAsia, Stripe, and cash payments.",
    };
}

export default async function Page({ params }) {
    const { locale } = await params;

    if (!locales.includes(locale)) notFound();

    const dict = await getDictionary(locale);

    return <RefundPolicyPage locale={locale} dict={dict} />;
}
