import AICourierSystemSection from "@/components/clientComponents/AICourierSystemSection";
import { requireAuth } from "@/lib/requireAuth";

import { notFound } from "next/navigation";
import { getDictionary, locales } from "@/i18n/getDictionary";
import AddCourierOrder from "@/components/pageComponents/AICourierCreateOrder";

export default async function getStartPage({ params }) {
    const { locale } = await params;

    if (!locales.includes(locale)) notFound();

    const dict = await getDictionary(locale);

    // Optional: get user to show on page
    // const user = await requireAuth(locale, `/${locale}/courier/getStart`);

    return (
        <>
            <div className="p-6">
                <h1 className="text-2xl font-semibold">Get start courier Secure Page</h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum libero minima quibusdam eaque cupiditate amet temporibus! Perferendis fuga ipsa fugit vero sed pariatur, aperiam deleniti, tempora autem illum cum veniam.</p>
                {/* <p className="mt-2">Welcome, {user?.name ?? "User"} 👋</p> */}
            </div>

            <AddCourierOrder dict={dict} />
        </>
    );
}
