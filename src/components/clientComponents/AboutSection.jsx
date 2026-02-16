// components/AboutSection.jsx
import Image from "next/image";

export default function AboutSection({
    dict,
    imageSrc = "/about-courier.png", // change to your real image path
    className = "",
}) {
    const t = dict?.aiCourierAbout;

    return (
        <section className={`w-full ${className}`}>
            <div className="mx-auto max-w-6xl px-4 py-10">
                <div className="grid items-start gap-8 md:grid-cols-2">
                    {/* Left content */}
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900">
                            {t.title}
                        </h2>

                        <p className="mt-4 text-sm leading-6 text-zinc-700">
                            {t.p1}
                        </p>

                        <p className="mt-4 text-sm leading-6 text-zinc-700">
                            {t.p2}
                        </p>

                        <h3 className="mt-8 text-lg font-bold text-zinc-900">
                            {t.whyTitle}
                        </h3>

                        <ul className="mt-4 space-y-3 text-sm text-zinc-800">
                            {t.bullets?.map((item, idx) => (
                                <li key={idx} className="flex gap-3">
                                    <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right image */}
                    <div className="md:justify-self-end">
                        <div className="relative overflow-hidden rounded-2xl border-2 border-blue-500 shadow-sm">
                            <div className="relative h-[320px] w-full sm:h-[380px] md:h-[420px] md:w-[420px]">
                                <Image
                                    src={imageSrc}
                                    alt={t.imageAlt || "About image"}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 420px"
                                    priority={false}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
