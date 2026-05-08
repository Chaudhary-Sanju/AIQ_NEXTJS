import CartPage from "@/components/pageComponents/CartPage";

export default async function Page({ params }) {
    const { locale } = await params;
    return <CartPage locale={locale} />;
}