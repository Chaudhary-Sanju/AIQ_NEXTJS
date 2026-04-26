import { notFound } from "next/navigation";
import { getDictionary, locales } from "@/i18n/getDictionary";
import PrivacyPolicyPage from "@/components/pageComponents/PrivacyPolicyPage";

export async function generateMetadata() {
    return {
        title: "Privacy Policy | HKMandu",
        description:
            "Read how HKMandu collects, uses, and protects your personal data across services between Hong Kong and Nepal.",
    };
}

export default async function Page({ params }) {
    const { locale } = await params;

    if (!locales.includes(locale)) notFound();

    const dict = await getDictionary(locale);

    return <PrivacyPolicyPage locale={locale} dict={dict} />;
}