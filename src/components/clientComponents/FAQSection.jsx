"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Minus } from "lucide-react";
import http from "@/http";

function FAQItem({ question, answer, isOpen, onClick }) {
    return (
        <div className="group overflow-hidden rounded-xl border border-[#dddddd] bg-white transition-all duration-200 hover:border-[#cfcfcf] hover:shadow-[0_4px_18px_rgba(0,0,0,0.04)]">
            <button
                type="button"
                onClick={onClick}
                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left md:px-7 md:py-6"
            >
                <span className="text-[18px] font-semibold leading-snug tracking-[-0.02em] text-black md:text-[20px]">
                    {question}
                </span>

                <span className="shrink-0 text-[#4a4a4a] transition-transform duration-200 group-hover:scale-105">
                    {isOpen ? (
                        <Minus className="h-6 w-6 md:h-7 md:w-7 stroke-[2.2]" />
                    ) : (
                        <Plus className="h-6 w-6 md:h-7 md:w-7 stroke-[2.2]" />
                    )}
                </span>
            </button>

            <div
                className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
            >
                <div className="overflow-hidden">
                    <div className="px-5 pb-5 md:px-7 md:pb-7">
                        <p className="max-w-4xl text-[15px] leading-7 text-[#444] md:text-[16px]">
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
        <section className="w-full bg-white py-14 md:py-20">
            <div className="mx-auto max-w-6xl px-4 md:px-6">
                <div className="mb-8 md:mb-10">
                    <div className="flex items-start justify-between gap-4">

                        {/* LEFT SIDE */}
                        <div className="flex items-start gap-3 md:gap-4">
                            <span className="mt-0.5 text-[30px] font-bold leading-none text-red-600 md:mt-1 md:text-[42px]">
                                ?
                            </span>

                            <div>
                                <h2 className="text-[28px] font-bold leading-tight tracking-[-0.03em] text-black md:text-[52px]">
                                    {t.title || "Frequently asked questions"}
                                </h2>

                                <p className="mt-2 text-sm text-[#666] md:text-base">
                                    {t.subtitle || "Quick answers to the most common questions."}
                                </p>

                                {!loading && faqs.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={handleToggleAll}
                                        className="mt-4 flex w-full items-center justify-center md:hidden rounded-xl border border-[#d9d9d9] bg-[#f9f9f9] px-4 py-3 text-sm font-semibold text-black transition hover:bg-[#f0f0f0]"
                                    >
                                        <span className="flex items-center gap-2">
                                            {allOpen ? "Collapse all" : "See all"}
                                            <span className="text-lg">{allOpen ? "−" : "+"}</span>
                                        </span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {!loading && faqs.length > 0 && (
                            <button
                                type="button"
                                onClick={handleToggleAll}
                                className="mt-1 hidden md:inline-flex rounded-full border border-[#d9d9d9] bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-[#f0f0f0]"
                            >
                                <span className="flex items-center gap-2">
                                    {allOpen ? "Collapse all" : "See all"}
                                    <span className="text-lg">{allOpen ? "−" : "+"}</span>
                                </span>
                            </button>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    {loading &&
                        Array.from({ length: 5 }).map((_, idx) => (
                            <div
                                key={idx}
                                className="rounded-xl border border-[#dddddd] bg-white px-5 py-6 md:px-7"
                            >
                                <div className="h-6 w-2/3 animate-pulse rounded bg-zinc-200" />
                                <div className="mt-4 h-4 w-1/2 animate-pulse rounded bg-zinc-100" />
                            </div>
                        ))}

                    {!loading &&
                        faqs.map((item, idx) => (
                            <FAQItem
                                key={idx}
                                question={item?.question?.[lang] || item?.question?.en || ""}
                                answer={item?.answer?.[lang] || item?.answer?.en || ""}
                                isOpen={openIndexes.includes(idx)}
                                onClick={() => toggleItem(idx)}
                            />
                        ))}

                    {!loading && faqs.length === 0 && (
                        <div className="rounded-xl border border-dashed border-[#d9d9d9] bg-white px-5 py-6 text-sm text-zinc-500">
                            {t.empty || "No FAQs available right now."}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}