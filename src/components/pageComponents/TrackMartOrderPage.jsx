"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
    ArrowRight,
    CheckCircle2,
    Loader2,
    PackageCheck,
    Search,
    ShoppingBag,
    ShieldCheck,
    Phone,
    Mail,
    MessageCircle,
    Truck,
    CreditCard,
    MapPin,
    ReceiptText,
} from "lucide-react";
import { toast } from "sonner";
import http from "@/http";
import { imgUrl } from "@/lib";

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
        steps: ["Order Placed", "Confirmed", "Processing", "Shipped", "Delivered"],
        items: "Items",
        delivery: "Delivery",
        activity: "Order Activity",
        payment: "Payment",
        method: "Method",
        total: "Total",
        address: "Address",
        district: "District",
        zone: "Zone",
        estimate: "Estimate",
        deliveryCharge: "Delivery Charge",
        subtotal: "Subtotal",
        discount: "Discount",
        grandTotal: "Grand Total",
        qty: "Qty",
        noImage: "No Image",
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
        steps: ["Order Placed", "Confirmed", "Processing", "Shipped", "Delivered"],
        items: "Items",
        delivery: "Delivery",
        activity: "Order Activity",
        payment: "Payment",
        method: "Method",
        total: "Total",
        address: "Address",
        district: "District",
        zone: "Zone",
        estimate: "Estimate",
        deliveryCharge: "Delivery Charge",
        subtotal: "Subtotal",
        discount: "Discount",
        grandTotal: "Grand Total",
        qty: "Qty",
        noImage: "No Image",
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
        steps: ["已下单", "已确认", "处理中", "已发货", "已送达"],
        items: "商品",
        delivery: "配送",
        activity: "订单动态",
        payment: "付款",
        method: "方式",
        total: "总计",
        address: "地址",
        district: "地区",
        zone: "区域",
        estimate: "预计",
        deliveryCharge: "配送费",
        subtotal: "小计",
        discount: "折扣",
        grandTotal: "总额",
        qty: "数量",
        noImage: "无图片",
    },
};

export default function TrackMartOrderPage({ locale = "en" }) {
    const t = content[locale] || content.en;
    const searchParams = useSearchParams();

    const [orderId, setOrderId] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const trackByOrderId = async (value) => {
        const cleanOrderId = value.trim();

        if (!cleanOrderId) {
            toast.error(t.required);
            return;
        }

        try {
            setLoading(true);
            setResult(null);

            const res = await http.get(`/frontend/order/track/${cleanOrderId}`);
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

    const handleTrack = async (e) => {
        e.preventDefault();
        await trackByOrderId(orderId);
    };

    useEffect(() => {
        const orderNumber = searchParams?.get("orderNumber") || "";
        if (!orderNumber) return;

        setOrderId(orderNumber);
        trackByOrderId(orderNumber);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    const timeline =
        result?.timeline?.length > 0
            ? result.timeline
            : t.steps.map((step, index) => ({
                label: step,
                active: result ? index <= 2 : false,
            }));

    return (
        <main className="bg-white">
            <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-blue-50">
                <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />
                <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />

                <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
                    <div className="flex flex-col justify-center">
                        <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#1a4b8f] shadow-sm">
                            <ShoppingBag className="h-4 w-4" />
                            {t.badge}
                        </div>

                        <h1 className="max-w-3xl text-[34px] font-bold leading-[1.08] tracking-tight text-neutral-950 sm:text-5xl lg:text-[58px]">
                            {t.title}
                        </h1>

                        <p className="mt-5 max-w-2xl text-[15px] leading-8 text-neutral-600 sm:text-base lg:text-[17px]">
                            {t.desc}
                        </p>

                        <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
                            <HeroPoint icon={<ShoppingBag className="h-4 w-4" />} text="Order" />
                            <HeroPoint icon={<PackageCheck className="h-4 w-4" />} text="Processing" />
                            <HeroPoint icon={<Truck className="h-4 w-4" />} text="Delivery" />
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -left-4 -top-4 hidden h-28 w-28 rounded-3xl bg-[#1a4b8f]/10 sm:block" />
                        <div className="absolute -bottom-4 -right-4 hidden h-32 w-32 rounded-3xl bg-orange-300/30 sm:block" />

                        <div className="relative overflow-hidden rounded-[32px] bg-white p-2 shadow-[0_24px_70px_rgba(15,42,94,0.16)] ring-1 ring-black/5">
                            <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#1a4b8f] via-[#0f2a5e] to-[#13295b] p-6 text-white sm:p-8">
                                <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-white/10 blur-2xl" />
                                <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-orange-300/20 blur-2xl" />

                                <div className="relative">
                                    <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
                                        <PackageCheck className="h-8 w-8" />
                                    </div>

                                    <h2 className="text-3xl font-bold sm:text-4xl">
                                        HKMandu Mart
                                    </h2>

                                    <p className="mt-4 max-w-md text-sm leading-7 text-white/75">
                                        Track product order, payment, delivery, and activity updates in one simple place.
                                    </p>

                                    <div className="mt-8 space-y-3">
                                        {t.steps.slice(0, 4).map((step) => (
                                            <div
                                                key={step}
                                                className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 text-sm font-semibold backdrop-blur"
                                            >
                                                <CheckCircle2 className="h-4 w-4 shrink-0 text-orange-200" />
                                                <span>{step}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="absolute -bottom-5 left-4 hidden rounded-2xl bg-white p-4 shadow-xl ring-1 ring-black/5 sm:block">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-[#1a4b8f]">
                                    <ShieldCheck className="h-6 w-6" />
                                </div>

                                <div>
                                    <p className="text-sm font-bold text-neutral-950">
                                        Order Support
                                    </p>
                                    <p className="text-xs text-neutral-500">
                                        Mart tracking updates
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative overflow-hidden bg-white">
                <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="rounded-[32px] border border-orange-100 bg-white/95 p-5 shadow-[0_18px_45px_rgba(15,42,94,0.08)] backdrop-blur sm:p-8">
                        <form onSubmit={handleTrack} className="grid gap-3 sm:grid-cols-[1fr_auto]">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />

                                <input
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                    placeholder={t.placeholder}
                                    className="h-14 w-full rounded-2xl border border-orange-100 bg-white pl-12 pr-4 text-sm font-semibold text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-[#1a4b8f] focus:ring-4 focus:ring-[#1a4b8f]/10"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#1a4b8f] px-7 text-sm font-bold text-white shadow-lg shadow-[#1a4b8f]/20 transition hover:bg-[#0f2a5e] disabled:cursor-not-allowed disabled:opacity-60"
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
                </div>
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
    return `HK$ ${num.toLocaleString("en-HK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

function dateFormat(date) {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
}

function dateTimeFormat(date) {
    if (!date) return "-";
    return new Date(date).toLocaleString();
}

function getProductImage(item) {
    const image =
        item?.productID?.images?.[0] ||
        item?.productID?.image?.[0] ||
        item?.productID?.thumbnail ||
        null;

    return image;
}

function TrackingResult({ t, order, orderId, timeline, locale }) {
    const assigned = order?.deliveryAssigned;

    return (
        <div className="mt-8 space-y-6">
            <div className="rounded-[32px] border border-orange-100 bg-white p-5 shadow-sm sm:p-8">
                <div className="grid gap-5 md:grid-cols-3">
                    <InfoCard
                        icon={<ReceiptText className="h-5 w-5" />}
                        label={t.orderId}
                        value={order?.orderNumber || orderId}
                    />
                    <InfoCard
                        icon={<PackageCheck className="h-5 w-5" />}
                        label={t.status}
                        value={order?.status || "-"}
                    />
                    <InfoCard
                        icon={<CreditCard className="h-5 w-5" />}
                        label={t.date}
                        value={dateFormat(order?.orderDate || order?.createdAt)}
                    />
                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-3">
                    <InfoCard
                        icon={<CreditCard className="h-5 w-5" />}
                        label={t.payment}
                        value={order?.paymentStatus || "-"}
                    />
                    <InfoCard
                        icon={<ShieldCheck className="h-5 w-5" />}
                        label={t.method}
                        value={order?.paymentMethod || "-"}
                    />
                    <InfoCard
                        icon={<ShoppingBag className="h-5 w-5" />}
                        label={t.total}
                        value={money(order?.total)}
                    />
                </div>

                <Timeline items={timeline} />
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-[32px] border border-orange-100 bg-white p-5 shadow-sm sm:p-8">
                    <h3 className="text-xl font-bold text-neutral-950">{t.items}</h3>

                    <div className="mt-5 space-y-4">
                        {(order?.items || []).map((item) => {
                            const productName =
                                pick(item?.productID?.name, locale) || item?.product || "Product";

                            const image = getProductImage(item);

                            return (
                                <div
                                    key={item?._id}
                                    className="flex gap-4 rounded-2xl border border-orange-100 bg-orange-50/50 p-4"
                                >
                                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-orange-100 bg-white">
                                        {image ? (
                                            <Image
                                                src={imgUrl(image)}
                                                alt={productName}
                                                fill
                                                sizes="64px"
                                                className="object-cover"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold text-neutral-400">
                                                {t.noImage}
                                            </div>
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-bold text-neutral-950">
                                            {productName}
                                        </p>

                                        <p className="mt-1 text-xs font-semibold text-neutral-500">
                                            {t.qty}: {item?.qty || 0} × {money(item?.price)}
                                        </p>

                                        <p className="mt-2 text-sm font-bold text-[#1a4b8f]">
                                            {money(item?.total)}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="rounded-[32px] border border-orange-100 bg-white p-5 shadow-sm sm:p-8">
                    <h3 className="text-xl font-bold text-neutral-950">{t.delivery}</h3>

                    <div className="mt-5 space-y-4">
                        <InfoRow label={t.address} value={order?.address} />
                        <InfoRow label="Landmark" value={order?.landmark} />
                        <InfoRow label={t.district} value={order?.cityDistrict} />
                        <InfoRow label={t.zone} value={order?.deliveryZone?.name} />
                        <InfoRow
                            label={t.estimate}
                            value={`${order?.deliveryZone?.estimatedDeliveryDays?.min || "-"} - ${order?.deliveryZone?.estimatedDeliveryDays?.max || "-"
                                } days`}
                        />
                        <InfoRow
                            label="Assigned By"
                            value={assigned?.deliverBy || "-"}
                        />
                        <InfoRow label={t.deliveryCharge} value={money(order?.deliveryCharge)} />
                        <InfoRow label={t.subtotal} value={money(order?.subtotal)} />
                        <InfoRow label={t.discount} value={money(order?.discountAmount)} />
                        <InfoRow label={t.grandTotal} value={money(order?.total)} strong />
                    </div>
                </div>
            </div>

            {order?.customTimeline?.length > 0 && (
                <div className="rounded-[32px] border border-orange-100 bg-white p-5 shadow-sm sm:p-8">
                    <h3 className="text-xl font-bold text-neutral-950">
                        {t.activity}
                    </h3>

                    <div className="mt-5 space-y-4">
                        {order.customTimeline.map((item, index) => (
                            <div
                                key={`${item?.task}-${index}`}
                                className="rounded-2xl border border-orange-100 bg-orange-50/50 p-4"
                            >
                                <p className="text-sm font-bold text-neutral-950">
                                    {item?.task}
                                </p>

                                <p className="mt-1 text-xs font-medium text-neutral-500">
                                    {item?.taskSection} • {dateTimeFormat(item?.when)}
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

function HeroPoint({ icon, text }) {
    return (
        <div className="flex items-center gap-2 rounded-2xl border border-orange-100 bg-white/80 px-4 py-3 text-sm font-bold text-neutral-700 shadow-sm">
            <span className="text-[#1a4b8f]">{icon}</span>
            {text}
        </div>
    );
}

function InfoRow({ label, value, strong = false }) {
    return (
        <div className="flex items-start justify-between gap-4 border-b border-orange-100 pb-3 last:border-0 last:pb-0">
            <p className="text-sm font-medium text-neutral-500">{label}</p>

            <p
                className={[
                    "text-right text-sm",
                    strong ? "font-bold text-neutral-950" : "font-semibold text-neutral-800",
                ].join(" ")}
            >
                {value || "-"}
            </p>
        </div>
    );
}

function InfoCard({ label, value, icon }) {
    return (
        <div className="rounded-3xl border border-orange-100 bg-orange-50/50 p-5">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#1a4b8f] shadow-sm">
                {icon}
            </div>

            <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">
                {label}
            </p>

            <p className="mt-2 break-words text-lg font-bold capitalize text-neutral-950">
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
                                    ? "border-[#1a4b8f] bg-[#1a4b8f] text-white"
                                    : "border-orange-100 bg-white text-neutral-300",
                            ].join(" ")}
                        >
                            <CheckCircle2 className="h-5 w-5" />
                        </div>

                        {index !== items.length - 1 && (
                            <div
                                className={[
                                    "mt-2 h-8 w-0.5",
                                    item.active ? "bg-[#1a4b8f]" : "bg-orange-100",
                                ].join(" ")}
                            />
                        )}
                    </div>

                    <div className="pt-1">
                        <p
                            className={[
                                "text-sm font-bold",
                                item.active ? "text-neutral-950" : "text-neutral-400",
                            ].join(" ")}
                        >
                            {item.label || item.title}
                        </p>

                        {item.date && (
                            <p className="mt-1 text-xs font-medium text-neutral-500">
                                {item.date}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

function HelpBox({ title, desc }) {
    return (
        <div className="mt-8 overflow-hidden rounded-[32px] bg-gradient-to-br from-[#1a4b8f] via-[#0f2a5e] to-[#13295b] p-6 text-white shadow-[0_18px_45px_rgba(15,42,94,0.18)] sm:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                    <h3 className="text-2xl font-bold">{title}</h3>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-white/70">
                        {desc}
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-2 md:w-auto">
                    <SupportIcon icon={<Phone className="h-4 w-4" />} />
                    <SupportIcon icon={<Mail className="h-4 w-4" />} />
                    <SupportIcon icon={<MessageCircle className="h-4 w-4" />} />
                </div>
            </div>
        </div>
    );
}

function SupportIcon({ icon }) {
    return (
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-orange-100 backdrop-blur">
            {icon}
        </span>
    );
}