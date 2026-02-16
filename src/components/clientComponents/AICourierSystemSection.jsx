import {
    Sparkles,
    Zap,
    MapPin,
    Timer,
    Globe2,
    BadgeCheck,
} from "lucide-react";

function FeatureIcon({ idx }) {
    const icons = [Sparkles, Zap, MapPin, Timer, Globe2, BadgeCheck];
    const Icon = icons[idx] || Sparkles;

    return (
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-zinc-100 shadow-sm px-4">
            <Icon className="h-7 w-7 text-zinc-700" />
        </div>
    );
}

function FeatureCard({ idx, title, desc }) {
    return (
        <div className="flex gap-4 rounded-xl border border-zinc-100 bg-white p-4 shadow-sm">
            <FeatureIcon idx={idx} />
            <div>
                <h3 className="text-sm font-semibold text-zinc-900">
                    {title}
                </h3>
                <p className="mt-1 text-xs leading-5 text-zinc-600">
                    {desc}
                </p>
            </div>
        </div>
    );
}

export default function AICourierSystemSection({ dict }) {
    const t = dict.aiCourier;

    return (
        <section className="w-full">
            <div className="mx-auto max-w-5xl px-4 py-10">
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-xl font-extrabold text-zinc-900 sm:text-2xl">
                        {t.title}
                    </h2>
                    <p className="mt-2 text-sm text-zinc-500">
                        {t.subtitle}
                    </p>
                </div>

                {/* Cards */}
                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {t.cards.map((card, idx) => (
                        <FeatureCard
                            key={idx}
                            idx={idx}
                            title={card.title}
                            desc={card.desc}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
