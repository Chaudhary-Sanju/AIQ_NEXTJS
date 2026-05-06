"use client";

import Link from "next/link";
import {
    ArrowRight,
    CheckCircle2,
    Clock,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    ShieldCheck,
    Smartphone,
    Sparkles,
} from "lucide-react";

const CONTACT = {
    phone: "+852-00000000",
    whatsapp: "+85200000000",
    email: "support@hkmandu.com",
    location: "Hong Kong ↔ Nepal",
};

const content = {
    en: {
        badge: "Contact HKMandu",
        title: "Talk to us directly.",
        desc: "For courier, product orders, service requests, travel, business, or digital support, you can call, email, or message us on WhatsApp.",
        call: "Call Now",
        whatsapp: "WhatsApp",
        email: "Email Us",
        location: "Service Area",
        support: "Support Hours",
        supportValue: "Online support available",
        quickTitle: "What can we help with?",
        quickItems: [
            "Courier and delivery support",
            "Product order questions",
            "Software and business services",
            "Travel and immigration inquiries",
            "Home and office service requests",
        ],
        ctaTitle: "Need to explore our services first?",
        ctaDesc: "View all HKMandu services and choose the one that matches your need.",
        ctaButton: "Explore Services",
    },
    ne: {
        badge: "HKMandu सम्पर्क",
        title: "हामीसँग सिधै कुरा गर्नुहोस्।",
        desc: "कुरियर, उत्पादन अर्डर, सेवा अनुरोध, यात्रा, व्यवसाय वा डिजिटल सहयोगका लागि हामीलाई कल, इमेल वा WhatsApp गर्न सक्नुहुन्छ।",
        call: "अहिले कल गर्नुहोस्",
        whatsapp: "WhatsApp",
        email: "इमेल गर्नुहोस्",
        location: "सेवा क्षेत्र",
        support: "सहयोग समय",
        supportValue: "अनलाइन सहयोग उपलब्ध",
        quickTitle: "हामी के मा सहयोग गर्न सक्छौं?",
        quickItems: [
            "कुरियर र डेलिभरी सहयोग",
            "उत्पादन अर्डर सम्बन्धी प्रश्न",
            "सफ्टवेयर र व्यवसाय सेवा",
            "यात्रा र अध्यागमन सोधपुछ",
            "घर र अफिस सेवा अनुरोध",
        ],
        ctaTitle: "पहिले सेवाहरू हेर्न चाहनुहुन्छ?",
        ctaDesc: "HKMandu का सबै सेवाहरू हेर्नुहोस् र आफ्नो आवश्यकता अनुसार सेवा छान्नुहोस्।",
        ctaButton: "सेवाहरू हेर्नुहोस्",
    },
    zh: {
        badge: "联系 HKMandu",
        title: "直接与我们联系。",
        desc: "如需快递、商品订单、服务申请、旅游、商务或数字支持，您可以电话、邮件或 WhatsApp 联系我们。",
        call: "立即致电",
        whatsapp: "WhatsApp",
        email: "发送邮件",
        location: "服务区域",
        support: "支持时间",
        supportValue: "提供在线支持",
        quickTitle: "我们可以帮助什么？",
        quickItems: [
            "快递与配送支持",
            "商品订单问题",
            "软件与商务服务",
            "旅游与移民咨询",
            "家庭与办公室服务申请",
        ],
        ctaTitle: "想先查看我们的服务？",
        ctaDesc: "浏览 HKMandu 的所有服务，选择适合您需求的服务。",
        ctaButton: "查看服务",
    },
};

export default function ContactUsPage({ locale = "en" }) {
    const t = content[locale] || content.en;

    const contactCards = [
        {
            icon: Phone,
            title: t.call,
            value: CONTACT.phone,
            href: `tel:${CONTACT.phone}`,
            button: t.call,
            tone: "blue",
        },
        {
            icon: MessageCircle,
            title: t.whatsapp,
            value: CONTACT.phone,
            href: `https://wa.me/${CONTACT.whatsapp}`,
            button: t.whatsapp,
            tone: "orange",
        },
        {
            icon: Mail,
            title: t.email,
            value: CONTACT.email,
            href: `mailto:${CONTACT.email}`,
            button: t.email,
            tone: "blue",
        },
    ];

    return (
        <main className="bg-white">
            {/* Hero */}
            <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-blue-50">
                <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />
                <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />

                <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
                    <div className="flex flex-col justify-center">
                        <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#1a4b8f] shadow-sm">
                            <Smartphone className="h-4 w-4" />
                            {t.badge}
                        </div>

                        <h1 className="max-w-3xl text-[34px] font-bold leading-[1.08] tracking-tight text-neutral-950 sm:text-5xl lg:text-[58px]">
                            {t.title}
                        </h1>

                        <p className="mt-5 max-w-2xl text-[15px] leading-8 text-neutral-600 sm:text-base lg:text-[17px]">
                            {t.desc}
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <a
                                href={`tel:${CONTACT.phone}`}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1a4b8f] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#1a4b8f]/20 transition hover:bg-[#0f2a5e]"
                            >
                                <Phone className="h-4 w-4" />
                                {t.call}
                            </a>

                            <a
                                href={`https://wa.me/${CONTACT.whatsapp}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-orange-200 bg-white px-6 py-3 text-sm font-bold text-neutral-900 transition hover:bg-orange-50"
                            >
                                <MessageCircle className="h-4 w-4" />
                                {t.whatsapp}
                            </a>
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
                                        <ShieldCheck className="h-8 w-8" />
                                    </div>

                                    <h2 className="text-3xl font-bold sm:text-4xl">
                                        Hong Kong ↔ Nepal
                                    </h2>

                                    <p className="mt-4 max-w-md text-sm leading-7 text-white/75">
                                        Call, WhatsApp, or email HKMandu for fast support
                                        across products, courier, and services.
                                    </p>

                                    <div className="mt-8 grid gap-3">
                                        {t.quickItems.map((item) => (
                                            <div
                                                key={item}
                                                className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 text-sm font-semibold backdrop-blur"
                                            >
                                                <CheckCircle2 className="h-4 w-4 shrink-0 text-orange-200" />
                                                <span>{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="absolute -bottom-5 left-4 hidden rounded-2xl bg-white p-4 shadow-xl ring-1 ring-black/5 sm:block">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-[#1a4b8f]">
                                    <Sparkles className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-neutral-950">
                                        Fast Response
                                    </p>
                                    <p className="text-xs text-neutral-500">
                                        Support for real needs
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Cards */}
            <section className="bg-white py-14 sm:py-16">
                <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
                    {contactCards.map((card) => {
                        const Icon = card.icon;
                        const isOrange = card.tone === "orange";

                        return (
                            <a
                                key={card.title}
                                href={card.href}
                                target={card.title === t.whatsapp ? "_blank" : undefined}
                                rel={card.title === t.whatsapp ? "noreferrer" : undefined}
                                className="group rounded-[28px] border border-orange-100 bg-gradient-to-br from-white to-orange-50/50 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_18px_45px_rgba(15,42,94,0.10)]"
                            >
                                <div
                                    className={[
                                        "mb-5 flex h-14 w-14 items-center justify-center rounded-2xl transition group-hover:scale-110 group-hover:text-white",
                                        isOrange
                                            ? "bg-orange-100 text-orange-600 group-hover:bg-orange-500"
                                            : "bg-[#1a4b8f]/10 text-[#1a4b8f] group-hover:bg-[#1a4b8f]",
                                    ].join(" ")}
                                >
                                    <Icon className="h-7 w-7" />
                                </div>

                                <h3 className="text-xl font-bold text-neutral-950">
                                    {card.title}
                                </h3>

                                <p className="mt-2 break-words text-sm font-semibold text-neutral-600">
                                    {card.value}
                                </p>

                                <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#1a4b8f]">
                                    {card.button}
                                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                                </div>
                            </a>
                        );
                    })}
                </div>
            </section>

            {/* Service Area / Hours */}
            <section className="bg-gradient-to-br from-orange-50 via-white to-blue-50 py-14 sm:py-16">
                <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
                    <InfoCard
                        icon={<MapPin className="h-7 w-7" />}
                        title={t.location}
                        value={CONTACT.location}
                    />

                    <InfoCard
                        icon={<Clock className="h-7 w-7" />}
                        title={t.support}
                        value={t.supportValue}
                        orange
                    />
                </div>
            </section>

            {/* CTA */}
            <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto grid max-w-7xl gap-6 overflow-hidden rounded-[32px] bg-gradient-to-br from-[#1a4b8f] via-[#0f2a5e] to-[#13295b] p-8 text-white shadow-[0_24px_70px_rgba(15,42,94,0.20)] sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
                    <div>
                        <h2 className="text-3xl font-bold">{t.ctaTitle}</h2>

                        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70">
                            {t.ctaDesc}
                        </p>
                    </div>

                    <Link
                        href={`/${locale}/#perfect-services`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#1a4b8f] transition hover:bg-orange-50"
                    >
                        {t.ctaButton}
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </section>
        </main>
    );
}

function InfoCard({ icon, title, value, orange = false }) {
    return (
        <div className="rounded-[28px] border border-orange-100 bg-white p-6 shadow-sm sm:p-8">
            <div
                className={[
                    "mb-5 flex h-14 w-14 items-center justify-center rounded-2xl",
                    orange
                        ? "bg-orange-100 text-orange-600"
                        : "bg-[#1a4b8f]/10 text-[#1a4b8f]",
                ].join(" ")}
            >
                {icon}
            </div>

            <h3 className="text-xl font-bold text-neutral-950">{title}</h3>

            <p className="mt-2 text-sm font-semibold text-neutral-600">{value}</p>
        </div>
    );
}