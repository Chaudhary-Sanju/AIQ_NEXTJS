"use client";

import Link from "next/link";
import {
    ArrowRight,
    Clock,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    ShieldCheck,
    Smartphone,
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
        },
        {
            icon: MessageCircle,
            title: t.whatsapp,
            value: CONTACT.phone,
            href: `https://wa.me/${CONTACT.whatsapp}`,
            button: t.whatsapp,
        },
        {
            icon: Mail,
            title: t.email,
            value: CONTACT.email,
            href: `mailto:${CONTACT.email}`,
            button: t.email,
        },
    ];

    return (
        <main className="bg-[#f8f8fb]">
            <section className="relative overflow-hidden bg-white">
                <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-[#4b63ff]/10 blur-3xl" />
                <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#ff7a1a]/10 blur-3xl" />

                <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
                    <div className="flex flex-col justify-center">
                        <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-[#4b63ff]/20 bg-[#4b63ff]/5 px-4 py-2 text-sm font-semibold text-[#4b63ff]">
                            <Smartphone className="h-4 w-4" />
                            {t.badge}
                        </div>

                        <h1 className="max-w-3xl text-4xl font-black tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl">
                            {t.title}
                        </h1>

                        <p className="mt-6 max-w-2xl text-base leading-8 text-neutral-600 sm:text-lg">
                            {t.desc}
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <a
                                href={`tel:${CONTACT.phone}`}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#4b63ff] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#4b63ff]/20 transition hover:bg-[#394feb]"
                            >
                                <Phone className="h-4 w-4" />
                                {t.call}
                            </a>

                            <a
                                href={`https://wa.me/${CONTACT.whatsapp}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-6 py-3 text-sm font-bold text-neutral-900 transition hover:border-neutral-300 hover:bg-neutral-50"
                            >
                                <MessageCircle className="h-4 w-4" />
                                {t.whatsapp}
                            </a>
                        </div>
                    </div>

                    <div className="rounded-[2rem] border border-neutral-200 bg-white p-4 shadow-2xl shadow-neutral-200/70">
                        <div className="rounded-[1.5rem] bg-gradient-to-br from-[#4b63ff] to-[#26348f] p-6 text-white sm:p-8">
                            <ShieldCheck className="mb-10 h-12 w-12" />

                            <h2 className="text-3xl font-black sm:text-4xl">
                                Hong Kong ↔ Nepal
                            </h2>

                            <p className="mt-4 text-sm leading-7 text-white/80">
                                Call, WhatsApp, or email HKMandu for fast support.
                            </p>

                            <div className="mt-10 grid gap-3">
                                {t.quickItems.map((item) => (
                                    <div
                                        key={item}
                                        className="rounded-2xl bg-white/10 p-4 text-sm font-semibold backdrop-blur"
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto grid max-w-7xl gap-5 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
                {contactCards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <a
                            key={card.title}
                            href={card.href}
                            target={card.title === t.whatsapp ? "_blank" : undefined}
                            rel={card.title === t.whatsapp ? "noreferrer" : undefined}
                            className="group rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4b63ff]/10 text-[#4b63ff] transition group-hover:bg-[#4b63ff] group-hover:text-white">
                                <Icon className="h-7 w-7" />
                            </div>

                            <h3 className="text-xl font-black text-neutral-950">
                                {card.title}
                            </h3>

                            <p className="mt-2 text-sm font-semibold text-neutral-600">
                                {card.value}
                            </p>

                            <div className="mt-6 inline-flex items-center gap-2 text-sm font-black text-[#4b63ff]">
                                {card.button}
                                <ArrowRight className="h-4 w-4" />
                            </div>
                        </a>
                    );
                })}
            </section>

            <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-16 sm:px-6 md:grid-cols-2 lg:px-8">
                <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ff7a1a]/10 text-[#ff7a1a]">
                        <MapPin className="h-7 w-7" />
                    </div>

                    <h3 className="text-xl font-black text-neutral-950">
                        {t.location}
                    </h3>

                    <p className="mt-2 text-sm font-semibold text-neutral-600">
                        {CONTACT.location}
                    </p>
                </div>

                <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ff7a1a]/10 text-[#ff7a1a]">
                        <Clock className="h-7 w-7" />
                    </div>

                    <h3 className="text-xl font-black text-neutral-950">{t.support}</h3>

                    <p className="mt-2 text-sm font-semibold text-neutral-600">
                        {t.supportValue}
                    </p>
                </div>
            </section>

            <section className="px-4 pb-16 sm:px-6 lg:px-8">
                <div className="mx-auto grid max-w-7xl gap-6 rounded-[2rem] bg-neutral-950 p-8 text-white sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
                    <div>
                        <h2 className="text-3xl font-black">{t.ctaTitle}</h2>

                        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70">
                            {t.ctaDesc}
                        </p>
                    </div>

                    <Link
                        href={`/${locale}/#perfect-services`}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-black text-neutral-950 transition hover:bg-neutral-100"
                    >
                        {t.ctaButton}
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </section>
        </main>
    );
}