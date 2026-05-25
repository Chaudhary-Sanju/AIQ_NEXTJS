"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, ReceiptText } from "lucide-react";
import { useEffect, useState } from "react";
import http from "@/http";

export default function PayMeSuccessPage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();

    const locale = params?.locale || "en";
    const orderId = searchParams.get("orderId");
    const orderNumber = searchParams.get("orderNumber");

    const [checking, setChecking] = useState(Boolean(orderId));
    const [statusText, setStatusText] = useState(
        "We are confirming your PayMe payment."
    );

    useEffect(() => {
        if (!orderId) return;

        const checkStatus = async () => {
            try {
                const res = await http.get(`/frontend/payment/payme-status/${orderId}`);

                const paid = Boolean(res?.data?.paid || res?.data?.isPaid);
                const status = res?.data?.statusCode || res?.data?.status;

                if (paid) {
                    setStatusText("Payment confirmed successfully.");
                    setTimeout(() => {
                        router.push(`/${locale}/dashboard?tab=orders`);
                    }, 1500);
                    return;
                }

                setStatusText(
                    `Payment is still being processed${status ? ` (${status})` : ""}.`
                );
            } catch (err) {
                setStatusText(
                    err?.response?.data?.message ||
                    "Unable to confirm payment automatically."
                );
            } finally {
                setChecking(false);
            }
        };

        checkStatus();
    }, [orderId, locale, router]);

    return (
        <section className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 px-4 py-16">
            <div className="mx-auto flex max-w-md flex-col items-center rounded-[32px] border border-green-100 bg-white p-8 text-center shadow-xl">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
                    {checking ? (
                        <Loader2 className="h-10 w-10 animate-spin" />
                    ) : (
                        <CheckCircle2 className="h-10 w-10" />
                    )}
                </div>

                <h1 className="mt-6 text-2xl font-bold text-neutral-950">
                    PayMe payment received
                </h1>

                <p className="mt-3 text-sm leading-6 text-neutral-600">
                    {statusText}
                </p>

                {orderNumber && (
                    <div className="mt-5 rounded-2xl bg-neutral-50 px-4 py-3">
                        <p className="text-xs font-semibold text-neutral-500">
                            Order Number
                        </p>
                        <p className="mt-1 font-bold text-neutral-900">{orderNumber}</p>
                    </div>
                )}

                <div className="mt-8 grid w-full gap-3">
                    <Link
                        href={`/${locale}/dashboard?tab=orders`}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1a4b8f] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0f2a5e]"
                    >
                        <ReceiptText className="h-4 w-4" />
                        View Orders
                    </Link>

                    <Link
                        href={`/${locale}`}
                        className="inline-flex items-center justify-center rounded-2xl bg-neutral-100 px-5 py-3 text-sm font-bold text-neutral-700 transition hover:bg-neutral-200"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </section>
    );
}