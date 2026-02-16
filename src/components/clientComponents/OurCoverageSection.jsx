// components/OurCoverageSection.jsx
import Image from "next/image";

export default function OurCoverageSection({
    dict,
    mapSrc = "/coverage-map.png",
    className = "",
}) {
    const t = dict?.coverage;

    return (
        <section className={`w-full ${className}`}>
            <div className="mx-auto max-w-6xl px-4 py-10">
                <h2 className="text-center text-3xl font-extrabold tracking-tight text-zinc-800">
                    {t.title}
                </h2>

                {/* Map area */}
                <div className="relative mx-auto mt-8 aspect-[16/7] w-full max-w-5xl">
                    {/* Map image */}
                    <div className="absolute inset-0 overflow-hidden rounded-2xl">
                        <Image
                            src={mapSrc}
                            alt="Coverage map"
                            fill
                            className="object-contain"
                            sizes="(max-width: 1024px) 100vw, 900px"
                            priority={false}
                        />
                    </div>
                </div>

                {/* Subtitle */}
                <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-6 text-zinc-600">
                    {t.subtitle}
                </p>
            </div>
        </section>
    );
}
