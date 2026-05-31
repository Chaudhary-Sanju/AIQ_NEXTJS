// components/clientComponents/ComingSoonBanner.jsx

export default function ComingSoonBanner({
    locale = "en",
    serviceType = "default",
    badge,
    title,
    description,
}) {
    const defaultContent = {
        en: {
            badge: "Coming Soon",
            title: "This service is launching soon",
            description:
                "We are preparing this service for you. Please check back soon.",
        },
        ne: {
            badge: "चाँडै आउँदैछ",
            title: "यो सेवा चाँडै सुरु हुँदैछ",
            description:
                "हामी यो सेवा तपाईंका लागि तयार गर्दैछौं। कृपया छिट्टै फेरि हेर्नुहोस्।",
        },
        zh: {
            badge: "即將推出",
            title: "此服務即將推出",
            description: "我們正在準備此服務，請稍後再查看。",
        },
    };

    const serviceContent = {
        "business-services": {
            en: {
                title: "Business service requests are launching soon",
                description:
                    "Company registration and F&B license support will be available here shortly.",
            },
            ne: {
                title: "बिजनेस सेवा अनुरोध चाँडै सुरु हुँदैछ",
                description:
                    "कम्पनी दर्ता र F&B लाइसेन्स सम्बन्धी सेवा छिट्टै यहाँ उपलब्ध हुनेछ।",
            },
            zh: {
                title: "商業服務申請即將開放",
                description: "公司註冊及餐飲牌照支援服務將很快在此提供。",
            },
        },
        "construction-repair-services": {
            en: {
                title: "Construction & repair services requests are launching soon",
                description:
                    "Construction, repair, maintenance, and office support services will be available here shortly.",
            },
            ne: {
                title: "निर्माण तथा मर्मत सेवा अनुरोध चाँडै सुरु हुँदैछ",
                description:
                    "निर्माण, मर्मत, मर्मतसम्भार तथा अफिस सहायता सेवा छिट्टै यहाँ उपलब्ध हुनेछ।",
            },
            zh: {
                title: "建築及維修服務申請即將開放",
                description: "建築、維修、保養及辦公室支援服務將很快在此提供。",
            },
        },
    };

    const fallback = defaultContent[locale] || defaultContent.en;
    const service = serviceContent[serviceType]?.[locale];

    const content = {
        badge: badge || fallback.badge,
        title: title || service?.title || fallback.title,
        description: description || service?.description || fallback.description,
    };

    return (
        <section className="relative w-full overflow-hidden border-y border-orange-100 bg-gradient-to-br from-orange-50 via-white to-red-50 px-6 py-14 text-center sm:px-10 sm:py-20 lg:px-16">
            {/* Background blobs */}
            <div className="pointer-events-none absolute -right-14 -top-14 h-56 w-56 rounded-full bg-orange-200/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-14 h-60 w-60 rounded-full bg-red-200/25 blur-3xl" />

            {/* Content */}
            <div className="relative z-10">
                <span className="inline-flex items-center gap-2 rounded-full border border-orange-300 bg-orange-100 px-4 py-1.5 text-sm font-medium text-orange-700">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-500" />
                    {content.badge}
                </span>

                <h2 className="mt-5 text-3xl font-medium tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                    {content.title}
                </h2>

                <div className="mx-auto my-5 h-0.5 w-10 rounded-full bg-gradient-to-r from-orange-400 to-red-400" />

                <p className="mx-auto max-w-2xl text-base leading-relaxed text-gray-500 sm:text-lg">
                    {content.description}
                </p>
            </div>
        </section>
    );
}