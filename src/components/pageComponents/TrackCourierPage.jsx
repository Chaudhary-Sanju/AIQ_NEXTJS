"use client";

import { useState } from "react";
import {
    ArrowRight,
    CheckCircle2,
    Loader2,
    MapPin,
    PackageCheck,
    Search,
    Truck,
} from "lucide-react";
import { toast } from "sonner";
import http from "@/http";

const content = {
    en: {
        badge: "Courier Tracking",
        title: "Track your courier shipment.",
        desc: "Enter your courier tracking number to check the latest shipment status between Hong Kong and Nepal.",
        placeholder: "Enter tracking number",
        button: "Track Courier",
        tracking: "Tracking...",
        required: "Please enter your tracking number.",
        notFound: "Courier tracking result not found.",
        trackingNo: "Tracking No.",
        status: "Current Status",
        route: "Route",
        helpTitle: "Need courier support?",
        helpDesc: "Contact HKMandu by phone, email, or WhatsApp for shipment support.",
        steps: ["Request Received", "Picked Up", "Processing", "In Transit", "Delivered"],
    },
    ne: {
        badge: "Courier Tracking",
        title: "आफ्नो courier shipment track गर्नुहोस्।",
        desc: "Hong Kong र Nepal बीच shipment status हेर्न tracking number राख्नुहोस्।",
        placeholder: "Tracking number राख्नुहोस्",
        button: "Courier Track गर्नुहोस्",
        tracking: "Tracking...",
        required: "कृपया tracking number राख्नुहोस्।",
        notFound: "Courier tracking result भेटिएन।",
        trackingNo: "Tracking No.",
        status: "हालको Status",
        route: "Route",
        helpTitle: "Courier support चाहिन्छ?",
        helpDesc: "Shipment support का लागि HKMandu लाई phone, email वा WhatsApp गर्नुहोस्।",
        steps: ["Request Received", "Picked Up", "Processing", "In Transit", "Delivered"],
    },
    zh: {
        badge: "快递追踪",
        title: "追踪您的快递包裹。",
        desc: "输入快递追踪号码，查看香港与尼泊尔之间的最新运输状态。",
        placeholder: "输入追踪号码",
        button: "追踪快递",
        tracking: "查询中...",
        required: "请输入追踪号码。",
        notFound: "未找到快递追踪结果。",
        trackingNo: "追踪号码",
        status: "当前状态",
        route: "路线",
        helpTitle: "需要快递帮助？",
        helpDesc: "请通过电话、电子邮件或 WhatsApp 联系 HKMandu。",
        steps: ["已收到请求", "已取件", "处理中", "运输中", "已送达"],
    },
};

export default function TrackCourierPage({ locale = "en" }) {
    const t = content[locale] || content.en;

    const [trackingNo, setTrackingNo] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleTrack = async (e) => {
        e.preventDefault();

        if (!trackingNo.trim()) {
            toast.error(t.required);
            return;
        }

        try {
            setLoading(true);
            setResult(null);

            const res = await http.get(`/frontend/aiCourier/track/${trackingNo}`);
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
                            <Truck className="h-4 w-4" />
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
                                Hong Kong ↔ Nepal
                            </h2>
                            <p className="mt-4 text-sm leading-7 text-white/80">
                                Track pickup, processing, transit, and delivery updates.
                            </p>

                            <div className="mt-8 rounded-2xl bg-white/10 p-4 backdrop-blur">
                                <div className="flex items-center gap-3">
                                    <MapPin className="h-6 w-6" />
                                    <p className="text-sm font-bold">Courier Shipment Tracking</p>
                                </div>
                            </div>
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
                                value={trackingNo}
                                onChange={(e) => setTrackingNo(e.target.value)}
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
                        courier={result}
                        trackingNo={trackingNo}
                        timeline={timeline}
                    />
                )}

                <HelpBox title={t.helpTitle} desc={t.helpDesc} />
            </section>
        </main>
    );
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

function dateTimeFormat(date) {
    if (!date) return "-";
    return new Date(date).toLocaleString();
}

function TrackingResult({ t, courier, trackingNo, timeline }) {
    return (
        <div className="mt-8 space-y-6">
            <div className="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm sm:p-8">
                <div className="grid gap-5 md:grid-cols-3">
                    <InfoCard
                        label={t.trackingNo}
                        value={courier?.trackingId || trackingNo}
                    />
                    <InfoCard label={t.status} value={courier?.status || "-"} />
                    <InfoCard
                        label={t.route}
                        value={`${courier?.pickUpLocation || "-"} → ${courier?.dropLocation || "-"
                            }`}
                    />
                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-3">
                    <InfoCard label="Payment" value={courier?.paymentStatus || "-"} />
                    <InfoCard label="Method" value={courier?.paymentMethod || "-"} />
                    <InfoCard label="Estimated Cost" value={money(courier?.estimatedCost)} />
                </div>

                <Timeline items={timeline} />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm sm:p-8">
                    <h3 className="text-xl font-black text-neutral-950">
                        Sender Details
                    </h3>

                    <div className="mt-5 space-y-4">
                        <InfoRow label="Name" value={courier?.senderName} />
                        <InfoRow label="Contact" value={courier?.senderContact} />
                        <InfoRow label="Pickup Location" value={courier?.pickUpLocation} />
                        <InfoRow
                            label="Pickup Date"
                            value={dateTimeFormat(courier?.pickUpTimeOrDate)}
                        />
                    </div>
                </div>

                <div className="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm sm:p-8">
                    <h3 className="text-xl font-black text-neutral-950">
                        Receiver Details
                    </h3>

                    <div className="mt-5 space-y-4">
                        <InfoRow label="Name" value={courier?.recieverName} />
                        <InfoRow label="Contact" value={courier?.recieverContact} />
                        <InfoRow label="Drop Location" value={courier?.dropLocation} />
                        <InfoRow label="Delivery Type" value={courier?.deliveryType} />
                    </div>
                </div>
            </div>

            <div className="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm sm:p-8">
                <h3 className="text-xl font-black text-neutral-950">
                    Package Details
                </h3>

                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <InfoBox label="Package Size" value={`${courier?.packageSize || "-"} KG`} />
                    <InfoBox label="Estimated Cost" value={money(courier?.estimatedCost)} />
                    <InfoBox label="Payment Status" value={courier?.paymentStatus || "-"} />
                    <InfoBox label="Created At" value={dateFormat(courier?.createdAt)} />
                </div>
            </div>

            {courier?.customTimeline?.length > 0 && (
                <div className="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm sm:p-8">
                    <h3 className="text-xl font-black text-neutral-950">
                        Courier Activity
                    </h3>

                    <div className="mt-5 space-y-4">
                        {courier.customTimeline.map((item, index) => (
                            <div
                                key={`${item?.action}-${index}`}
                                className="rounded-2xl border border-neutral-200 bg-[#f8f8fb] p-4"
                            >
                                <p className="text-sm font-black text-neutral-950">
                                    {item?.action}
                                </p>

                                <p className="mt-1 text-xs font-medium text-neutral-500">
                                    {dateTimeFormat(item?.when)}
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

function InfoBox({ label, value }) {
    return (
        <div className="rounded-2xl border border-neutral-200 bg-[#f8f8fb] p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">
                {label}
            </p>

            <p className="mt-2 break-words text-base font-black text-neutral-950">
                {value}
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
                            <div
                                className={[
                                    "mt-2 h-8 w-0.5",
                                    item.active ? "bg-[#4b63ff]" : "bg-neutral-200",
                                ].join(" ")}
                            />
                        )}
                    </div>

                    <div className="pt-1">
                        <p
                            className={[
                                "text-sm font-black",
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
        <div className="mt-8 rounded-[2rem] bg-neutral-950 p-6 text-white sm:p-8">
            <h3 className="text-2xl font-black">{title}</h3>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-white/70">{desc}</p>
        </div>
    );
}