"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

function FAQItem({ question, answer, isOpen, onClick }) {
    return (
        <div className="rounded-xl border border-zinc-200 bg-white transition-all">
            <button
                onClick={onClick}
                className="flex w-full items-center justify-between p-5 text-left"
            >
                <span className="text-sm font-medium text-zinc-900">
                    {question}
                </span>

                {isOpen ? (
                    <Minus className="h-5 w-5 text-zinc-500" />
                ) : (
                    <Plus className="h-5 w-5 text-zinc-500" />
                )}
            </button>

            <div
                className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-40 px-5 pb-5 opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <p className="text-sm text-zinc-600">{answer}</p>
            </div>
        </div>
    );
}

export default function FAQSectionSoftware({ dict }) {
    const t = dict?.softwareFaq;
    const [openIndex, setOpenIndex] = useState(0); // first open by default

    return (
        <section className="w-full">
            <div className="mx-auto max-w-5xl px-4 pb-12 pt-2">
                <h2 className="text-4xl font-extrabold leading-tight text-zinc-900">
                    {t.title}
                </h2>

                <div className="mt-10 space-y-4">
                    {t.items.map((item, idx) => (
                        <FAQItem
                            key={idx}
                            question={item.q}
                            answer={item.a}
                            isOpen={openIndex === idx}
                            onClick={() =>
                                setOpenIndex(openIndex === idx ? null : idx)
                            }
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
