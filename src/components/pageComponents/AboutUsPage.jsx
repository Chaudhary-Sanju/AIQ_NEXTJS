"use client";

import Link from "next/link";
import {
    ArrowRight,
    CheckCircle2,
    Globe2,
    Handshake,
    HeartHandshake,
    PackageCheck,
    Plane,
    ShieldCheck,
    Sparkles,
    Store,
    Users,
    ShoppingBag,
    Truck,
    Languages,
} from "lucide-react";

const content = {
    en: {
        badge: "About HKMandu",
        title: "Connecting Hong Kong and Nepal through trusted everyday services.",
        desc: "HKMandu brings products, courier support, business services, travel guidance, home and office help, and digital solutions into one simple platform for Nepali communities in Hong Kong and Nepal.",
        primaryCta: "Explore Services",
        secondaryCta: "Shop Products",

        stats: [
            { value: "HK ↔ NP", label: "Cross-border focus" },
            { value: "24/7", label: "Online access" },
            { value: "3", label: "Languages" },
        ],

        sectionBadge: "Who we are",
        sectionTitle: "One platform for real everyday needs.",
        sectionDesc:
            "From sending parcels to buying products or requesting software, accounting, immigration, home, office, and business support, HKMandu helps users find reliable solutions faster.",

        cards: [
            {
                icon: PackageCheck,
                title: "Courier & Delivery",
                desc: "Parcel pickup, tracking, delivery, and cross-border support between Hong Kong and Nepal.",
            },
            {
                icon: Store,
                title: "Products & Marketplace",
                desc: "Browse useful products with multilingual information and a simple checkout experience.",
            },
            {
                icon: Handshake,
                title: "Professional Services",
                desc: "Request support for software, finance, business, travel, immigration, home, and office needs.",
            },
        ],

        missionTitle: "Our mission",
        mission:
            "To make Hong Kong and Nepal connected services simpler, faster, and more trustworthy for individuals, families, and businesses.",

        visionTitle: "Our vision",
        vision:
            "To become a reliable bridge between Hong Kong and Nepal where people can shop, send, request, and manage essential services with confidence.",

        valuesTitle: "What we believe in",
        values: [
            "Simple and clear user experience",
            "Trustworthy service handling",
            "Multilingual access for wider communities",
            "Practical solutions for real-life needs",
        ],

        whyTitle: "Why HKMandu?",
        whyDesc:
            "Instead of using many separate contacts and platforms, HKMandu gives users one place to access products, courier, services, and support designed around the Hong Kong and Nepal connection.",

        whyItems: [
            "Built for Hong Kong and Nepal communities",
            "Supports English, Nepali, and Chinese",
            "Combines products, courier, and services",
            "Designed for mobile-first users",
        ],

        ctaTitle: "Ready to get started?",
        ctaDesc:
            "Explore products, request a service, or connect with HKMandu for your next need.",
        ctaButton: "View Services",
    },

    ne: {
        badge: "HKMandu बारे",
        title: "Hong Kong र Nepal लाई दैनिक विश्वसनीय सेवाबाट जोड्दै।",
        desc: "HKMandu Hong Kong र Nepal मा रहेका नेपाली समुदायका लागि बनाइएको सरल प्लेटफर्म हो। यहाँ उत्पादन, कुरियर, व्यवसाय सेवा, यात्रा मार्गदर्शन, घर तथा अफिस सहयोग र डिजिटल समाधान एउटै ठाउँमा पाउन सकिन्छ।",
        primaryCta: "सेवाहरू हेर्नुहोस्",
        secondaryCta: "उत्पादनहरू हेर्नुहोस्",

        stats: [
            { value: "HK ↔ NP", label: "सीमापार सेवा" },
            { value: "24/7", label: "अनलाइन पहुँच" },
            { value: "3", label: "भाषा समर्थन" },
        ],

        sectionBadge: "हामी को हौं",
        sectionTitle: "दैनिक आवश्यकताका लागि एउटै प्लेटफर्म।",
        sectionDesc:
            "पार्सल पठाउनेदेखि उत्पादन किन्न, सफ्टवेयर, लेखा, व्यवसाय, यात्रा, अध्यागमन, घर तथा अफिस सेवासम्म HKMandu ले प्रयोगकर्तालाई भरपर्दो समाधानसँग जोड्छ।",

        cards: [
            {
                icon: PackageCheck,
                title: "कुरियर र डेलिभरी",
                desc: "Hong Kong र Nepal बीच पार्सल, पिकअप, ट्र्याकिङ र डेलिभरी सहयोग।",
            },
            {
                icon: Store,
                title: "उत्पादन र मार्केटप्लेस",
                desc: "बहुभाषिक जानकारीसहित उपयोगी उत्पादनहरू सजिलै ब्राउज र अर्डर गर्न सकिन्छ।",
            },
            {
                icon: Handshake,
                title: "व्यावसायिक सेवाहरू",
                desc: "सफ्टवेयर, वित्त, व्यवसाय, यात्रा, अध्यागमन, घर र अफिस सेवाका लागि अनुरोध गर्न सकिन्छ।",
            },
        ],

        missionTitle: "हाम्रो उद्देश्य",
        mission:
            "व्यक्ति, परिवार र व्यवसायका लागि Hong Kong र Nepal सम्बन्धी सेवाहरू सरल, छिटो र विश्वसनीय बनाउनु।",

        visionTitle: "हाम्रो दृष्टि",
        vision:
            "Hong Kong र Nepal बीच किनमेल, पार्सल, सेवा अनुरोध र आवश्यक सहयोगका लागि भरपर्दो पुल बन्नु।",

        valuesTitle: "हाम्रो विश्वास",
        values: [
            "सरल र स्पष्ट प्रयोगकर्ता अनुभव",
            "विश्वसनीय सेवा व्यवस्थापन",
            "English, Nepali र Chinese भाषामा पहुँच",
            "वास्तविक आवश्यकताका लागि व्यावहारिक समाधान",
        ],

        whyTitle: "किन HKMandu?",
        whyDesc:
            "धेरै अलग-अलग सम्पर्क र प्लेटफर्म प्रयोग गर्नुको सट्टा HKMandu ले Hong Kong र Nepal केन्द्रित उत्पादन, सेवा र सहयोग एउटै ठाउँमा उपलब्ध गराउँछ।",

        whyItems: [
            "Hong Kong र Nepal समुदायका लागि बनाइएको",
            "English, Nepali र Chinese समर्थन",
            "उत्पादन, कुरियर र सेवा एउटै प्लेटफर्ममा",
            "मोबाइल प्रयोगकर्ताका लागि सहज डिजाइन",
        ],

        ctaTitle: "अब सुरु गर्ने?",
        ctaDesc:
            "उत्पादन हेर्नुहोस्, सेवा अनुरोध गर्नुहोस् वा आफ्नो आवश्यकताका लागि HKMandu सँग जोडिनुहोस्।",
        ctaButton: "सेवाहरू हेर्नुहोस्",
    },

    zh: {
        badge: "关于 HKMandu",
        title: "通过可信赖的日常服务连接香港与尼泊尔。",
        desc: "HKMandu 是一个为香港和尼泊尔社区打造的简单平台，将商品、快递、商务服务、旅游咨询、家居办公室支持和数字解决方案整合到一个地方。",
        primaryCta: "探索服务",
        secondaryCta: "浏览商品",

        stats: [
            { value: "HK ↔ NP", label: "跨境服务" },
            { value: "24/7", label: "在线访问" },
            { value: "3", label: "语言支持" },
        ],

        sectionBadge: "我们是谁",
        sectionTitle: "为日常需求打造的一站式平台。",
        sectionDesc:
            "从包裹递送、商品购买到软件、会计、商务、旅游、移民、家庭和办公室服务，HKMandu 帮助用户更快获得可靠支持。",

        cards: [
            {
                icon: PackageCheck,
                title: "快递与配送",
                desc: "支持香港与尼泊尔之间的包裹、取件、追踪和配送服务。",
            },
            {
                icon: Store,
                title: "商品与商城",
                desc: "浏览多语言商品信息，并轻松完成购买流程。",
            },
            {
                icon: Handshake,
                title: "专业服务",
                desc: "可申请软件、财务、商务、旅游、移民、家庭和办公室相关服务。",
            },
        ],

        missionTitle: "我们的使命",
        mission:
            "让香港与尼泊尔之间的服务对个人、家庭和企业来说更加简单、快速、可靠。",

        visionTitle: "我们的愿景",
        vision:
            "成为连接香港与尼泊尔的可信桥梁，让用户安心购物、寄送、申请和管理所需服务。",

        valuesTitle: "我们的理念",
        values: [
            "简单清晰的用户体验",
            "可靠的服务处理",
            "多语言社区支持",
            "面向真实需求的实用解决方案",
        ],

        whyTitle: "为什么选择 HKMandu？",
        whyDesc:
            "HKMandu 将香港与尼泊尔相关的商品、快递和服务整合到一个平台，减少用户在多个渠道之间来回寻找的麻烦。",

        whyItems: [
            "专为香港与尼泊尔社区打造",
            "支持英文、尼泊尔文和中文",
            "整合商品、快递和服务",
            "适合移动端用户体验",
        ],

        ctaTitle: "准备开始了吗？",
        ctaDesc: "浏览商品、申请服务，或联系 HKMandu 获取帮助。",
        ctaButton: "查看服务",
    },
};

export default function AboutUsPage({ locale = "en" }) {
    const t = content[locale] || content.en;

    return (
        <main className="bg-white">
            {/* Hero */}
            <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-blue-50">
                <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />
                <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />

                <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
                    <div className="flex flex-col justify-center">
                        <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#1a4b8f] shadow-sm">
                            <Sparkles className="h-4 w-4" />
                            {t.badge}
                        </div>

                        <h1 className="max-w-3xl text-[34px] font-bold leading-[1.08] tracking-tight text-neutral-950 sm:text-5xl lg:text-[58px]">
                            {t.title}
                        </h1>

                        <p className="mt-5 max-w-2xl text-[15px] leading-8 text-neutral-600 sm:text-base lg:text-[17px]">
                            {t.desc}
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Link
                                href={`/${locale}/#perfect-services`}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1a4b8f] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#1a4b8f]/20 transition hover:bg-[#0f2a5e]"
                            >
                                {t.primaryCta}
                                <ArrowRight className="h-4 w-4" />
                            </Link>

                            <Link
                                href={`/${locale}/product?page=1&limit=10`}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-orange-200 bg-white px-6 py-3 text-sm font-bold text-neutral-900 transition hover:bg-orange-50"
                            >
                                {t.secondaryCta}
                            </Link>
                        </div>

                        <div className="mt-8 grid max-w-2xl grid-cols-3 overflow-hidden rounded-3xl bg-white shadow-[0_18px_45px_rgba(15,42,94,0.10)] ring-1 ring-black/5">
                            {t.stats.map((item, index) => (
                                <div
                                    key={item.label}
                                    className={[
                                        "px-3 py-5 text-center",
                                        index !== t.stats.length - 1
                                            ? "border-r border-orange-100"
                                            : "",
                                    ].join(" ")}
                                >
                                    <div className="text-lg font-bold text-[#1a4b8f] sm:text-2xl">
                                        {item.value}
                                    </div>
                                    <div className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-neutral-500 sm:text-xs">
                                        {item.label}
                                    </div>
                                </div>
                            ))}
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
                                        <Globe2 className="h-8 w-8" />
                                    </div>

                                    <h2 className="text-3xl font-bold sm:text-4xl">
                                        Hong Kong ↔ Nepal
                                    </h2>

                                    <p className="mt-4 max-w-md text-sm leading-7 text-white/75">
                                        Products, courier, professional services, travel support,
                                        business help, and digital solutions in one connected
                                        platform.
                                    </p>

                                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                                        <MiniFeature
                                            icon={<Truck className="h-5 w-5" />}
                                            title="Courier"
                                        />
                                        <MiniFeature
                                            icon={<ShoppingBag className="h-5 w-5" />}
                                            title="Marketplace"
                                        />
                                        <MiniFeature
                                            icon={<Handshake className="h-5 w-5" />}
                                            title="Services"
                                        />
                                        <MiniFeature
                                            icon={<Languages className="h-5 w-5" />}
                                            title="Multilingual"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="absolute -bottom-5 left-4 hidden rounded-2xl bg-white p-4 shadow-xl ring-1 ring-black/5 sm:block">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                                    <ShieldCheck className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-neutral-950">
                                        Trusted Support
                                    </p>
                                    <p className="text-xs text-neutral-500">
                                        Built for real needs
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* What we do */}
            <section className="relative overflow-hidden bg-white py-14 sm:py-16 lg:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="mb-4 inline-flex rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#1a4b8f]">
                            {t.sectionBadge}
                        </div>

                        <h2 className="text-[30px] font-bold leading-tight tracking-tight text-neutral-950 sm:text-4xl">
                            {t.sectionTitle}
                        </h2>

                        <p className="mt-4 text-[15px] leading-7 text-neutral-600 sm:text-base">
                            {t.sectionDesc}
                        </p>
                    </div>

                    <div className="mt-10 grid gap-5 md:grid-cols-3">
                        {t.cards.map((card) => {
                            const Icon = card.icon;

                            return (
                                <div
                                    key={card.title}
                                    className="group rounded-[28px] border border-orange-100 bg-gradient-to-br from-white to-orange-50/50 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_18px_45px_rgba(15,42,94,0.10)]"
                                >
                                    <div className="mb-5 flex h-13 w-13 items-center justify-center rounded-2xl bg-[#1a4b8f]/10 text-[#1a4b8f] transition group-hover:scale-110 group-hover:bg-[#1a4b8f] group-hover:text-white">
                                        <Icon className="h-7 w-7" />
                                    </div>

                                    <h3 className="text-xl font-bold text-neutral-950">
                                        {card.title}
                                    </h3>

                                    <p className="mt-3 text-sm leading-7 text-neutral-600">
                                        {card.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Mission / Vision */}
            <section className="bg-gradient-to-br from-orange-50 via-white to-blue-50 py-14 sm:py-16">
                <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
                    <InfoPanel
                        icon={<HeartHandshake className="h-7 w-7" />}
                        title={t.missionTitle}
                        text={t.mission}
                        tone="blue"
                    />

                    <InfoPanel
                        icon={<Plane className="h-7 w-7" />}
                        title={t.visionTitle}
                        text={t.vision}
                        tone="orange"
                    />
                </div>
            </section>

            {/* Why + Values */}
            <section className="bg-white py-14 sm:py-16 lg:py-20">
                <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
                    <div className="relative overflow-hidden rounded-[30px] bg-neutral-950 p-6 text-white shadow-[0_20px_60px_rgba(0,0,0,0.16)] sm:p-8">
                        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-orange-400/20 blur-3xl" />

                        <Users className="mb-8 h-10 w-10 text-orange-300" />

                        <h2 className="text-3xl font-bold">{t.whyTitle}</h2>

                        <p className="mt-4 text-sm leading-7 text-white/70">
                            {t.whyDesc}
                        </p>
                    </div>

                    <div className="rounded-[30px] border border-orange-100 bg-white p-6 shadow-sm sm:p-8">
                        <h3 className="text-2xl font-bold text-neutral-950">
                            {t.valuesTitle}
                        </h3>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            {[...t.values, ...t.whyItems].map((item) => (
                                <div
                                    key={item}
                                    className="flex gap-3 rounded-2xl bg-orange-50/60 p-4"
                                >
                                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1a4b8f]" />
                                    <p className="text-sm font-medium leading-6 text-neutral-700">
                                        {item}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-white px-4 pb-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-gradient-to-br from-[#1a4b8f] via-[#0f2a5e] to-[#13295b] p-8 text-center text-white shadow-[0_24px_70px_rgba(15,42,94,0.20)] sm:p-12">
                    <h2 className="text-3xl font-bold sm:text-4xl">{t.ctaTitle}</h2>

                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/75">
                        {t.ctaDesc}
                    </p>

                    <Link
                        href={`/${locale}/#perfect-services`}
                        className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#1a4b8f] transition hover:bg-orange-50"
                    >
                        {t.ctaButton}
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </section>
        </main>
    );
}

function MiniFeature({ icon, title }) {
    return (
        <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-orange-200">
                {icon}
            </div>
            <span className="text-sm font-semibold text-white">{title}</span>
        </div>
    );
}

function InfoPanel({ icon, title, text, tone = "blue" }) {
    const isBlue = tone === "blue";

    return (
        <div className="rounded-[30px] border border-orange-100 bg-white p-6 shadow-sm sm:p-8">
            <div
                className={[
                    "mb-5 flex h-12 w-12 items-center justify-center rounded-2xl",
                    isBlue
                        ? "bg-[#1a4b8f]/10 text-[#1a4b8f]"
                        : "bg-orange-100 text-orange-600",
                ].join(" ")}
            >
                {icon}
            </div>

            <h3 className="text-2xl font-bold text-neutral-950">{title}</h3>

            <p className="mt-4 text-sm leading-7 text-neutral-600">{text}</p>
        </div>
    );
}