import BulkPurchasePageView from "@/components/pageComponents/BulkPurchasePageView";

export default async function BulkPurchasePage({ params }) {
    const { locale } = await params;

    return <BulkPurchasePageView locale={locale} />;
}