"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { AlertTriangle, ShoppingCart } from "lucide-react";

export default function PaymentFailPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const locale = params?.locale || "en";
    const orderNumber = searchParams.get("orderNumber");
    const provider = searchParams.get("provider") || "online payment";
    const orderType = searchParams.get("orderType") || searchParams.get("type") || "mart";
    const checkoutHref = orderType === "food" || orderType === "restaurant" ? `/${locale}/restaurant/cart` : `/${locale}/checkout`;

    return (
        <section className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 px-4 py-16">
            <div className="mx-auto flex max-w-md flex-col items-center rounded-[32px] border border-red-100 bg-white p-8 text-center shadow-xl">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <AlertTriangle className="h-10 w-10" />
                </div>

                <h1 className="mt-6 text-2xl font-bold text-neutral-950">Payment was not completed</h1>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">{provider}</p>
                <p className="mt-3 text-sm leading-6 text-neutral-600">Your payment may have been cancelled, failed, or expired. You can return to checkout and try again.</p>

                {orderNumber && (
                    <div className="mt-5 rounded-2xl bg-neutral-50 px-4 py-3">
                        <p className="text-xs font-semibold text-neutral-500">Order Number</p>
                        <p className="mt-1 font-bold text-neutral-900">{orderNumber}</p>
                    </div>
                )}

                <div className="mt-8 grid w-full gap-3">
                    <Link href={checkoutHref} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1a4b8f] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0f2a5e]">
                        <ShoppingCart className="h-4 w-4" />
                        Back to Checkout
                    </Link>
                    <Link href={`/${locale}`} className="inline-flex items-center justify-center rounded-2xl bg-neutral-100 px-5 py-3 text-sm font-bold text-neutral-700 transition hover:bg-neutral-200">
                        Back to Home
                    </Link>
                </div>
            </div>
        </section>
    );
}
