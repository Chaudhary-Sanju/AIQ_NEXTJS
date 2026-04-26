"use client";

import { useState } from "react";
import {
    ArrowRight,
    CheckCircle2,
    Loader2,
    PackageCheck,
    Search,
    ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";
import http from "@/http";

const content = {
    en: {
        badge: "Mart Order Tracking",
        title: "Track your mart order.",
        desc: "Enter your HKMandu order ID to check your product order status.",
        placeholder: "Enter order ID",
        button: "Track Order",
        tracking: "Tracking...",
        required: "Please enter your order ID.",
        notFound: "Order tracking result not found.",
        orderId: "Order ID",
        status: "Current Status",
        date: "Order Date",
        helpTitle: "Need help with your order?",
        helpDesc: "Contact HKMandu by phone, email, or WhatsApp for order support.",
        steps: ["Order Placed", "Confirmed", "Processing", "Out for Delivery", "Delivered"],
    },
    ne: {
        badge: "Mart Order Tracking",
        title: "आफ्नो mart order track गर्नुहोस्।",
        desc: "Product order status हेर्न HKMandu order ID राख्नुहोस्।",
        placeholder: "Order ID राख्नुहोस्",
        button: "Order Track गर्नुहोस्",
        tracking: "Tracking...",
        required: "कृपया order ID राख्नुहोस्।",
        notFound: "Order tracking result भेटिएन।",
        orderId: "Order ID",
        status: "हालको Status",
        date: "Order Date",
        helpTitle: "Order मा सहयोग चाहिन्छ?",
        helpDesc: "Order support का लागि HKMandu लाई phone, email वा WhatsApp गर्नुहोस्।",
        steps: ["Order Placed", "Confirmed", "Processing", "Out for Delivery", "Delivered"],
    },
    zh: {
        badge: "商城订单追踪",
        title: "追踪您的商城订单。",
        desc: "输入 HKMandu 订单 ID 查看商品订单状态。",
        placeholder: "输入订单 ID",
        button: "追踪订单",
        tracking: "查询中...",
        required: "请输入订单 ID。",
        notFound: "未找到订单追踪结果。",
        orderId: "订单 ID",
        status: "当前状态",
        date: "订单日期",
        helpTitle: "需要订单帮助？",
        helpDesc: "请通过电话、电子邮件或 WhatsApp 联系 HKMandu。",
        steps: ["已下单", "已确认", "处理中", "派送中", "已送达"],
    },
};

export default function TrackMartOrderPage({ locale = "en" }) {
    const t = content[locale] || content.en;

    const [orderId, setOrderId] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleTrack = async (e) => {
        e.preventDefault();

        if (!orderId.trim()) {
            toast.error(t.required);
            return;
        }

        try {
            setLoading(true);
            setResult(null);

            const res = await http.get(`/frontend/order/track/${orderId}`);
            const data = res?.data?.data;

            if (!data) {
                toast.error(t.notFound);
                return;
            }

            setResult(data);
        } catch (error) {
            toast.error(error?.response?.data?.message || t.notFound);
        } finally {
            setLoading(false);
        }
    };

    const timeline =
        result?.timeline?.length > 0
            ? result.timeline
            : t.steps.map((step, index) => ({
                label: step,
                active: result ? index <= 2 : false,
            }));

    return (
        <main className="bg-[#f8f8fb]">
            <section className="relative overflow-hidden bg-white">
                <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-[#4b63ff]/10 blur-3xl" />
                <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#ff7a1a]/10 blur-3xl" />

                <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
                    <div>
                        <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-[#4b63ff]/20 bg-[#4b63ff]/5 px-4 py-2 text-sm font-semibold text-[#4b63ff]">
                            <ShoppingBag className="h-4 w-4" />
                            {t.badge}
                        </div>

                        <h1 className="text-4xl font-black tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl">
                            {t.title}
                        </h1>

                        <p className="mt-6 max-w-2xl text-base leading-8 text-neutral-600 sm:text-lg">
                            {t.desc}
                        </p>
                    </div>

                    <div className="rounded-[2rem] border border-neutral-200 bg-white p-4 shadow-2xl shadow-neutral-200/70">
                        <div className="rounded-[1.5rem] bg-gradient-to-br from-[#4b63ff] to-[#26348f] p-6 text-white sm:p-8">
                            <PackageCheck className="mb-10 h-12 w-12" />
                            <h2 className="text-3xl font-black sm:text-4xl">
                                HKMandu Mart
                            </h2>
                            <p className="mt-4 text-sm leading-7 text-white/80">
                                Track your product order status in one simple place.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
                <div className="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm sm:p-8">
                    <form onSubmit={handleTrack} className="grid gap-3 sm:grid-cols-[1fr_auto]">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                            <input
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                placeholder={t.placeholder}
                                className="h-14 w-full rounded-2xl border border-neutral-200 bg-white pl-12 pr-4 text-sm font-semibold outline-none transition focus:border-[#4b63ff] focus:ring-4 focus:ring-[#4b63ff]/10"
                            />
                        </div>

                        <button
                            disabled={loading}
                            className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#4b63ff] px-7 text-sm font-black text-white shadow-lg shadow-[#4b63ff]/20 transition hover:bg-[#394feb] disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    {t.tracking}
                                </>
                            ) : (
                                <>
                                    {t.button}
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {result && (
                    <TrackingResult
                        t={t}
                        order={result}
                        orderId={orderId}
                        timeline={timeline}
                        locale={locale}
                    />
                )}

                <HelpBox title={t.helpTitle} desc={t.helpDesc} />
            </section>
        </main>
    );
}

function pick(obj, locale = "en") {
    if (!obj || typeof obj !== "object") return "";
    return obj?.[locale] || obj?.en || obj?.ne || obj?.zh || "";
}

function money(n) {
    const num = Number(n);
    if (Number.isNaN(num)) return "-";
    return `Rs. ${num}`;
}

function dateFormat(date) {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
}

function TrackingResult({ t, order, orderId, timeline, locale }) {
    return (
        <div className="mt-8 space-y-6">
            <div className="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm sm:p-8">
                <div className="grid gap-5 md:grid-cols-3">
                    <InfoCard label={t.orderId} value={order?.orderNumber || orderId} />
                    <InfoCard label={t.status} value={order?.status || "-"} />
                    <InfoCard label={t.date} value={dateFormat(order?.orderDate)} />
                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-3">
                    <InfoCard label="Payment" value={order?.paymentStatus || "-"} />
                    <InfoCard label="Method" value={order?.paymentMethod || "-"} />
                    <InfoCard label="Total" value={money(order?.total)} />
                </div>

                <Timeline items={timeline} />
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm sm:p-8">
                    <h3 className="text-xl font-black text-neutral-950">Items</h3>

                    <div className="mt-5 space-y-4">
                        {(order?.items || []).map((item) => (
                            <div
                                key={item?._id}
                                className="flex gap-4 rounded-2xl border border-neutral-200 bg-[#f8f8fb] p-4"
                            >
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-black text-neutral-950">
                                        {pick(item?.productID?.name, locale) || item?.product}
                                    </p>

                                    <p className="mt-1 text-xs font-semibold text-neutral-500">
                                        Qty: {item?.qty} × {money(item?.price)}
                                    </p>

                                    <p className="mt-2 text-sm font-black text-[#4b63ff]">
                                        {money(item?.total)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm sm:p-8">
                    <h3 className="text-xl font-black text-neutral-950">Delivery</h3>

                    <div className="mt-5 space-y-4">
                        <InfoRow label="Address" value={order?.address} />
                        <InfoRow label="District" value={order?.cityDistrict} />
                        <InfoRow label="Zone" value={order?.deliveryZone?.name} />
                        <InfoRow
                            label="Estimate"
                            value={`${order?.deliveryZone?.estimatedDeliveryDays?.min || "-"} - ${order?.deliveryZone?.estimatedDeliveryDays?.max || "-"
                                } days`}
                        />
                        <InfoRow label="Delivery Charge" value={money(order?.deliveryCharge)} />
                        <InfoRow label="Subtotal" value={money(order?.subtotal)} />
                        <InfoRow label="Discount" value={money(order?.discountAmount)} />
                        <InfoRow label="Grand Total" value={money(order?.total)} strong />
                    </div>
                </div>
            </div>

            {order?.customTimeline?.length > 0 && (
                <div className="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm sm:p-8">
                    <h3 className="text-xl font-black text-neutral-950">Order Activity</h3>

                    <div className="mt-5 space-y-4">
                        {order.customTimeline.map((item, index) => (
                            <div
                                key={`${item?.task}-${index}`}
                                className="rounded-2xl border border-neutral-200 bg-[#f8f8fb] p-4"
                            >
                                <p className="text-sm font-black text-neutral-950">
                                    {item?.task}
                                </p>

                                <p className="mt-1 text-xs font-medium text-neutral-500">
                                    {item?.taskSection} • {dateFormat(item?.when)}
                                </p>

                                {item?.doneBy?.name && (
                                    <p className="mt-1 text-xs font-medium text-neutral-500">
                                        By {item.doneBy.name}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function InfoRow({ label, value, strong = false }) {
    return (
        <div className="flex items-start justify-between gap-4 border-b border-neutral-100 pb-3 last:border-0 last:pb-0">
            <p className="text-sm font-medium text-neutral-500">{label}</p>

            <p
                className={[
                    "text-right text-sm",
                    strong ? "font-black text-neutral-950" : "font-bold text-neutral-800",
                ].join(" ")}
            >
                {value || "-"}
            </p>
        </div>
    );
}

function InfoCard({ label, value }) {
    return (
        <div className="rounded-3xl border border-neutral-200 bg-[#f8f8fb] p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">
                {label}
            </p>
            <p className="mt-2 break-words text-lg font-black text-neutral-950">
                {value}
            </p>
        </div>
    );
}

function Timeline({ items }) {
    return (
        <div className="mt-8 space-y-5">
            {items.map((item, index) => (
                <div key={`${item.label}-${index}`} className="flex gap-4">
                    <div className="flex flex-col items-center">
                        <div
                            className={[
                                "flex h-9 w-9 items-center justify-center rounded-full border-2",
                                item.active
                                    ? "border-[#4b63ff] bg-[#4b63ff] text-white"
                                    : "border-neutral-200 bg-white text-neutral-300",
                            ].join(" ")}
                        >
                            <CheckCircle2 className="h-5 w-5" />
                        </div>
                        {index !== items.length - 1 && (
                            <div className={["mt-2 h-8 w-0.5", item.active ? "bg-[#4b63ff]" : "bg-neutral-200"].join(" ")} />
                        )}
                    </div>

                    <div className="pt-1">
                        <p className={["text-sm font-black", item.active ? "text-neutral-950" : "text-neutral-400"].join(" ")}>
                            {item.label || item.title}
                        </p>
                        {item.date && <p className="mt-1 text-xs font-medium text-neutral-500">{item.date}</p>}
                    </div>
                </div>
            ))}
        </div>
    );
}

function HelpBox({ title, desc }) {
    return (
        <div className="mt-8 rounded-[2rem] bg-neutral-950 p-6 text-white sm:p-8">
            <h3 className="text-2xl font-black">{title}</h3>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-white/70">{desc}</p>
        </div>
    );
}