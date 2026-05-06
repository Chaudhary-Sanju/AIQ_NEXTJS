"use client";

import { useEffect, useMemo, useState } from "react";
import {
    ChevronDown,
    HelpCircle,
    Loader2,
    MessageCircleQuestion,
} from "lucide-react";
import http from "@/http";

function FAQItem({ question, answer, isOpen, onClick, index }) {
    return (
        <div
            className={[
                "group overflow-hidden rounded-2xl border bg-white/90 shadow-sm backdrop-blur-sm transition-all duration-300",
                isOpen
                    ? "border-orange-200 shadow-[0_16px_40px_rgba(15,42,94,0.08)]"
                    : "border-orange-100 hover:border-orange-200 hover:shadow-[0_12px_30px_rgba(15,42,94,0.06)]",
            ].join(" ")}
        >
            <button
                type="button"
                onClick={onClick}
                className="flex w-full items-start justify-between gap-4 px-4 py-4 text-left sm:px-5 sm:py-5 md:px-6"
            >
                <div className="flex min-w-0 gap-3">
                    <span
                        className={[
                            "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
                            isOpen
                                ? "bg-[#1a4b8f] text-white"
                                : "bg-orange-50 text-[#1a4b8f] group-hover:bg-[#1a4b8f] group-hover:text-white",
                        ].join(" ")}
                    >
                        {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="pt-1 text-[15px] font-semibold leading-6 tracking-[-0.01em] text-neutral-900 sm:text-[16px] md:text-[18px]">
                        {question}
                    </span>
                </div>

                <span
                    className={[
                        "mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-50 text-[#1a4b8f] transition-all duration-300",
                        isOpen ? "rotate-180 bg-[#1a4b8f] text-white" : "",
                    ].join(" ")}
                >
                    <ChevronDown className="h-4 w-4 stroke-[2.4]" />
                </span>
            </button>

            <div
                className={[
                    "grid transition-all duration-300 ease-in-out",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                ].join(" ")}
            >
                <div className="overflow-hidden">
                    <div className="px-4 pb-5 pl-[60px] sm:px-5 sm:pb-6 sm:pl-[68px] md:px-6 md:pl-[76px]">
                        <p className="max-w-4xl text-[14px] leading-7 text-neutral-600 sm:text-[15px] md:text-base">
                            {answer}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function FAQSection({
    locale = "en",
    page = "ai-express",
    dict,
}) {
    const [faqs, setFaqs] = useState([]);
    const [openIndexes, setOpenIndexes] = useState([0]);
    const [loading, setLoading] = useState(true);

    const lang = useMemo(() => {
        const map = {
            en: "en",
            ne: "ne",
            zh: "zh",
        };

        return map[locale] || "en";
    }, [locale]);

    const t = dict?.aiFaq || {};

    useEffect(() => {
        let mounted = true;

        const fetchFaqs = async () => {
            try {
                setLoading(true);

                const res = await http.get(`/frontend/faqs/page/${page}`);
                const faqData = res?.data?.data?.faqs || [];

                if (mounted) {
                    setFaqs(faqData);
                    setOpenIndexes(faqData.length ? [0] : []);
                }
            } catch (error) {
                console.error("Failed to load FAQs:", error);

                if (mounted) {
                    setFaqs([]);
                    setOpenIndexes([]);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchFaqs();

        return () => {
            mounted = false;
        };
    }, [page]);

    const allOpen = faqs.length > 0 && openIndexes.length === faqs.length;

    const toggleItem = (idx) => {
        setOpenIndexes((prev) =>
            prev.includes(idx)
                ? prev.filter((item) => item !== idx)
                : [...prev, idx]
        );
    };

    const handleToggleAll = () => {
        if (allOpen) {
            setOpenIndexes([]);
        } else {
            setOpenIndexes(faqs.map((_, idx) => idx));
        }
    };

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-white via-orange-50 to-blue-50 py-12 md:py-16 lg:py-20">
            <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-orange-200/35 blur-3xl" />
            <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-blue-200/35 blur-3xl" />

            <div className="relative mx-auto max-w-6xl px-4 md:px-6">
                <div className="mb-8 flex flex-col gap-5 md:mb-10 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#1a4b8f] shadow-sm">
                            <HelpCircle className="h-4 w-4" />
                            {t.eyebrow || "Need help?"}
                        </div>

                        <h2 className="mt-4 text-[30px] font-bold leading-tight tracking-[-0.04em] text-neutral-950 sm:text-4xl md:text-[48px]">
                            {t.title || "Frequently asked questions"}
                        </h2>

                        <p className="mt-3 max-w-xl text-sm leading-7 text-neutral-600 sm:text-base">
                            {t.subtitle || "Quick answers to the most common questions."}
                        </p>
                    </div>

                    {!loading && faqs.length > 0 && (
                        <button
                            type="button"
                            onClick={handleToggleAll}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-orange-200 bg-white px-5 py-3 text-sm font-semibold text-neutral-900 shadow-sm transition hover:bg-orange-50 md:w-auto"
                        >
                            <MessageCircleQuestion className="h-4 w-4 text-[#1a4b8f]" />
                            {allOpen ? t.collapseAll || "Collapse all" : t.seeAll || "See all"}
                        </button>
                    )}
                </div>

                <div className="space-y-3 md:space-y-4">
                    {loading &&
                        Array.from({ length: 5 }).map((_, idx) => (
                            <div
                                key={idx}
                                className="rounded-2xl border border-orange-100 bg-white/80 px-4 py-5 shadow-sm sm:px-5 md:px-6"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 animate-pulse rounded-full bg-orange-100" />
                                    <div className="h-5 w-2/3 animate-pulse rounded bg-neutral-200" />
                                    <Loader2 className="ml-auto h-4 w-4 animate-spin text-neutral-300" />
                                </div>

                                <div className="ml-11 mt-4 h-4 w-1/2 animate-pulse rounded bg-neutral-100" />
                            </div>
                        ))}

                    {!loading &&
                        faqs.map((item, idx) => (
                            <FAQItem
                                key={idx}
                                index={idx}
                                question={item?.question?.[lang] || item?.question?.en || ""}
                                answer={item?.answer?.[lang] || item?.answer?.en || ""}
                                isOpen={openIndexes.includes(idx)}
                                onClick={() => toggleItem(idx)}
                            />
                        ))}

                    {!loading && faqs.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-orange-200 bg-white/80 px-5 py-8 text-center text-sm text-neutral-500 shadow-sm">
                            {t.empty || "No FAQs available right now."}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}