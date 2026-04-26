"use client";

import Link from "next/link";

export default function Footer({ locale = "en", dict = {} }) {
    const t = (key, fallback) => {
        const parts = key.split(".");
        let cur = dict;
        for (const p of parts) cur = cur?.[p];
        return cur ?? fallback;
    };

    const l = (path) => `/${locale}${path}`;

    const slugify = (str) =>
        String(str)
            .toLowerCase()
            .trim()
            .replace(/&/g, "and")
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");

    const customerService = t("footer.customerService.items", [
        "Track Order",
        "Track Courier",
        "Shipping and Handling",
        "Payments",
    ]);

    const quickLinks = t("footer.quickLinks.items", [
        "About Us",
        "Contact Us",
        "Terms & Conditions",
        "Privacy Policy",
    ]);

    return (
        <footer className="bg-[#2a2b68] text-white font-sans">
            <div className="mx-auto max-w-7xl px-6 lg:px-10 pt-16">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 pb-14">

                    {/* COL 1 — Brand */}
                    <div>
                        <p className="text-sm text-white/50 leading-relaxed max-w-[230px] mb-7">
                            {t(
                                "footer.download.desc",
                                "Bridging Hong Kong and Kathmandu — your trusted platform for cross-border commerce and services."
                            )}
                        </p>

                        {/* App store buttons */}
                        <div className="flex flex-col gap-2.5 mb-8">
                            <Link
                                href="https://play.google.com"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-[10px] border border-white/15 bg-white/5 hover:bg-white/10 transition-colors w-fit"
                            >
                                <GooglePlayIcon />
                                <div>
                                    <span className="block text-[10px] text-white/45 leading-none mb-1">
                                        Get it on
                                    </span>
                                    <span className="block text-[13px] font-medium leading-none">
                                        Google Play
                                    </span>
                                </div>
                            </Link>

                            <Link
                                href="https://www.apple.com/app-store/"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-[10px] border border-white/15 bg-white/5 hover:bg-white/10 transition-colors w-fit"
                            >
                                <AppleIcon />
                                <div>
                                    <span className="block text-[10px] text-white/45 leading-none mb-1">
                                        Download on the
                                    </span>
                                    <span className="block text-[13px] font-medium leading-none">
                                        App Store
                                    </span>
                                </div>
                            </Link>
                        </div>

                        {/* Payment */}
                        <p className="text-[11px] uppercase tracking-[1.5px] text-white/30 mb-3">
                            {t("footer.payment.title", "Accepted Payments")}
                        </p>
                        <Link
                            href="https://stripe.com"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center px-3.5 py-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 transition-colors"
                        >
                            <StripeWordmark />
                        </Link>
                    </div>

                    {/* COL 2 — Customer Service */}
                    <div>
                        <p className="text-[12px] font-semibold uppercase tracking-[1.5px] text-white/30 mb-6">
                            {t("footer.customerService.title", "Customer Service")}
                        </p>
                        <ul className="space-y-3.5">
                            {customerService.map((item) => (
                                <li key={item}>
                                    <Link
                                        href={l(`/support/${slugify(item)}`)}
                                        className="text-sm font-light text-white/65 hover:text-white transition-colors relative group"
                                    >
                                        {item}
                                        <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-white/40 transition-all duration-200 group-hover:w-full" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* COL 3 — Quick Links */}
                    <div>
                        <p className="text-[12px] font-semibold uppercase tracking-[1.5px] text-white/30 mb-6">
                            {t("footer.quickLinks.title", "Quick Links")}
                        </p>
                        <ul className="space-y-3.5">
                            {quickLinks.map((item) => {
                                const slug = slugify(item);
                                let href = "/";
                                if (slug === "about-us") href = l("/about");
                                else if (slug === "contact-us") href = l("/contact");
                                else if (slug === "terms-and-conditions") href = l("/terms");
                                else if (slug === "privacy-policy") href = l("/privacy-policy");

                                return (
                                    <li key={item}>
                                        <Link
                                            href={href}
                                            className="text-sm font-light text-white/65 hover:text-white transition-colors relative group"
                                        >
                                            {item}
                                            <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-white/40 transition-all duration-200 group-hover:w-full" />
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* COL 4 — Contact & Socials */}
                    <div>
                        {/* Social icons */}
                        <div className="flex gap-2 mb-8">
                            {[
                                { href: "https://instagram.com", icon: <InstagramIcon /> },
                                { href: "https://twitter.com", icon: <XIcon /> },
                                { href: "https://facebook.com", icon: <FacebookIcon /> },
                                { href: "https://youtube.com", icon: <YoutubeIcon /> },
                            ].map(({ href, icon }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-[34px] h-[34px] flex items-center justify-center rounded-lg border border-white/15 bg-white/5 hover:bg-white/15 hover:border-white/30 transition-all"
                                >
                                    {icon}
                                </Link>
                            ))}
                        </div>

                        <p className="text-[11px] uppercase tracking-[1.5px] text-white/30 mb-6">
                            {t("footer.support.title", "Get in Touch")}
                        </p>

                        {/* Email */}
                        <div className="flex gap-3.5 mb-6">
                            <div className="w-[34px] h-[34px] shrink-0 flex items-center justify-center rounded-lg bg-white/8">
                                <MailIcon />
                            </div>
                            <div>
                                <p className="text-[11px] uppercase tracking-[1px] text-white/35 mb-1">
                                    {t("footer.support.emailLabel", "Email")}
                                </p>
                                <Link
                                    href={`mailto:${t("footer.support.email", "support@hkmandu.com")}`}
                                    className="text-sm text-white/80 hover:text-white transition-colors block"
                                >
                                    {t("footer.support.email", "support@hkmandu.com")}
                                </Link>
                                <p className="text-xs text-white/30 mt-1">
                                    {t("footer.support.emailNote", "Reply within 24 hours")}
                                </p>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="flex gap-3.5">
                            <div className="w-[34px] h-[34px] shrink-0 flex items-center justify-center rounded-lg bg-white/8">
                                <PhoneIcon />
                            </div>
                            <div>
                                <p className="text-[11px] uppercase tracking-[1px] text-white/35 mb-1">
                                    {t("footer.support.callLabel", "Phone")}
                                </p>
                                <Link
                                    href={`tel:${t("footer.support.phoneRaw", "+85211111111")}`}
                                    className="text-sm text-white/80 hover:text-white transition-colors block"
                                >
                                    {t("footer.support.phone", "+852-1111-1111")}
                                </Link>
                                <p className="text-xs text-white/30 mt-1">
                                    {t("footer.support.callNote", "Mon–Fri, 8am–5pm HKT")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/10">
                <div className="mx-auto max-w-7xl px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-xs text-white/30">
                        {t("footer.bottom", "© 2026 HkMandu. All rights reserved.")}
                    </span>
                    <div className="flex gap-5">
                        {[
                            { label: "Privacy", href: l("/privacy-policy") },
                            { label: "Terms", href: l("/terms") },
                            { label: "Cookies", href: l("/cookies") },
                        ].map(({ label, href }) => (
                            <Link
                                key={label}
                                href={href}
                                className="text-xs text-white/30 hover:text-white/65 transition-colors"
                            >
                                {label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

/* ─── SVG Icons ─────────────────────────────────────────────────────────── */

function GooglePlayIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.18 1.24L13.64 12 3.18 22.76A2 2 0 0 1 2 21V3a2 2 0 0 1 1.18-1.76z" fill="rgba(255,255,255,0.8)" />
            <path d="M20.94 9.06L17.76 7.28 14.79 12l2.97 4.72 3.18-1.78A2 2 0 0 0 22 13v-2a2 2 0 0 0-1.06-1.94z" fill="rgba(255,255,255,0.8)" />
            <path d="M3.18 1.24l11.22 6.3 3.36-.26L5.93.53A2 2 0 0 0 3.18 1.24z" fill="rgba(255,255,255,0.55)" />
            <path d="M3.18 22.76l11.22-6.3 3.36.34-11.83 6.75a2 2 0 0 1-2.75-.79z" fill="rgba(255,255,255,0.55)" />
        </svg>
    );
}

function AppleIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="rgba(255,255,255,0.8)" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.05 0c.07 1.32-.37 2.62-1.14 3.56-.77.94-1.93 1.62-3.09 1.52-.1-1.27.39-2.58 1.12-3.5C13.68.6 14.93-.02 16.05 0zm4.18 18.08c-.62 1.37-1.38 2.61-2.44 3.74-.73.78-1.46 1.17-2.18 1.18-.73.01-1.38-.2-2.11-.42-.79-.24-1.54-.46-2.38-.44-.87.02-1.64.25-2.43.5-.73.22-1.39.42-2.1.4-.78-.02-1.56-.46-2.34-1.32C2.14 20.2 1 17.87 1 15.5c0-4.12 2.67-6.3 5.25-6.33 1.13-.02 2.16.36 3.04.68.65.24 1.21.45 1.7.45.44 0 1.01-.21 1.7-.46.96-.35 2.08-.76 3.36-.66 1.34.11 2.65.59 3.6 1.66-1.19.69-2.23 1.84-2.23 3.67 0 1.99 1.23 3.16 2.81 3.57z" />
        </svg>
    );
}

function StripeWordmark() {
    return (
        <svg width="44" height="20" viewBox="0 0 60 25" xmlns="http://www.w3.org/2000/svg">
            <text x="0" y="19" fontFamily="Georgia, serif" fontSize="18" fontWeight="600" fill="rgba(255,255,255,0.8)">
                stripe
            </text>
        </svg>
    );
}

function InstagramIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="rgba(255,255,255,0.7)">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
    );
}

function XIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="rgba(255,255,255,0.7)">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.259 5.629 5.905-5.629Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

function FacebookIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="rgba(255,255,255,0.7)">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
    );
}

function YoutubeIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="rgba(255,255,255,0.7)">
            <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
        </svg>
    );
}

function MailIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="rgba(255,255,255,0.6)">
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
    );
}

function PhoneIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="rgba(255,255,255,0.6)">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
        </svg>
    );
}