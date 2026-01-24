import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone } from "lucide-react";

export default function Footer({ locale = "en", dict = {} }) {
    const t = (key, fallback) => {
        const parts = key.split(".");
        let cur = dict;
        for (const p of parts) cur = cur?.[p];
        return cur ?? fallback;
    };

    const l = (path) => `/${locale}${path}`;

    const perfectServicesFallback = [
        "Accounting Packages",
        "Company Registration",
        "Visa and Immigration",
        "Travel and Tour Packages",
        "Repair and Installation",
        "Home/Office Moving",
        "Transport Booking",
        "Flight Ticketing",
        "All over HK Pickup and Drop",
    ];

    const customerServiceFallback = [
        "Track Order",
        "Track Courier",
        "Shipping and Handling",
        "Return and Exchanges",
        "Payments",
    ];

    const aboutUsFallback = ["About Us", "Contact Us", "Mart Brands", "Mart Category"];

    const perfectServices = t("footer.perfectServices.items", perfectServicesFallback);
    const customerService = t("footer.customerService.items", customerServiceFallback);
    const aboutUs = t("footer.aboutUs.items", aboutUsFallback);

    // Simple slug helper for list items -> /services/<slug>
    const slugify = (str) =>
        String(str)
            .toLowerCase()
            .trim()
            .replace(/&/g, "and")
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");

    return (
        <footer className="bg-[#2a2b68] text-white">
            <div className="mx-auto max-w-7xl px-4 md:px-6 pt-10">
                {/* MAIN GRID (matches screenshot columns) */}
                <div className="grid gap-10 lg:grid-cols-12">
                    {/* COL 1: DOWNLOAD APP (matches design) */}
                    <div className="lg:col-span-4">
                        <div className="flex flex-col items-center text-center">
                            {/* Title */}
                            <h3 className="text-lg font-semibold uppercase tracking-wide text-white">
                                {t("footer.download.title", "Download the App")}
                            </h3>

                            {/* Phone (linked) */}
                            <Link href={l("/app")} className="block">
                                <div className="relative mt-6 h-[360px] w-[220px] cursor-pointer">
                                    <Image
                                        src="/footer/phone.png"
                                        alt={t("footer.download.previewAlt", "App Preview")}
                                        fill
                                        className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
                                        priority
                                    />
                                </div>
                            </Link>

                            {/* Description */}
                            <p className="mt-6 max-w-[280px] text-white/80 leading-relaxed">
                                {t("footer.download.descLine1", "Download our mobile app")} <br />
                                {t("footer.download.descLine2", "to manage everything")} <br />
                                {t("footer.download.descLine3", "on the go.")}
                            </p>

                            {/* Store badges (linked) */}
                            <div className="mt-6 flex items-center justify-center gap-4">
                                <Link href="https://play.google.com" target="_blank" rel="noreferrer">
                                    <Image
                                        src="/footer/google-play.png"
                                        alt={t("footer.download.googlePlayAlt", "Google Play")}
                                        width={150}
                                        height={46}
                                        className="h-[46px] w-auto cursor-pointer"
                                    />
                                </Link>

                                <Link href="https://www.apple.com/app-store/" target="_blank" rel="noreferrer">
                                    <Image
                                        src="/footer/app-store.png"
                                        alt={t("footer.download.appStoreAlt", "App Store")}
                                        width={150}
                                        height={46}
                                        className="h-[46px] w-auto cursor-pointer"
                                    />
                                </Link>
                            </div>

                            {/* App Code button (linked) */}
                            <Link href={l("/app-code")} className="mt-6">
                                <button className="inline-flex items-center gap-2 rounded-md border border-white/30 px-6 py-2 text-sm text-white hover:bg-white/10 transition">
                                    {t("footer.download.appCodeBtn", "App Code")}
                                    <span aria-hidden>›</span>
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* COL 2: PERFECT SERVICES + CUSTOMER SERVICE (bottom) */}
                    <div className="lg:col-span-3">
                        <h3 className="text-lg font-semibold uppercase tracking-wide">
                            {t("footer.perfectServices.title", "Perfect Services")}
                        </h3>

                        <ul className="mt-6 space-y-2 text-white/85">
                            {perfectServices.map((item) => (
                                <li key={item} className="flex items-start gap-3">
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                                    <Link
                                        className="hover:text-white"
                                        href={l(`/services/${slugify(item)}`)}
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Bottom section in same column (matches screenshot) */}
                        {/* <h3 className="mt-10 text-lg font-semibold uppercase tracking-wide">
                            {t("footer.customerService.title", "Customer Service")}
                        </h3>

                        <ul className="mt-6 space-y-2 text-white/85">
                            {customerService.map((item) => (
                                <li key={item} className="flex items-start gap-3">
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                                    <Link
                                        className="hover:text-white"
                                        href={l(`/support/${slugify(item)}`)}
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul> */}
                    </div>

                    {/* COL 3: CUSTOMER SERVICE (top 4) + PAYMENT + ABOUT US (bottom) */}
                    <div className="lg:col-span-3">
                        <h3 className="text-lg font-semibold uppercase tracking-wide">
                            {t("footer.customerService.title", "Customer Service")}
                        </h3>

                        <ul className="mt-6 space-y-2 text-white/85">
                            {customerService.slice(0, 4).map((item) => (
                                <li key={item} className="flex items-start gap-3">
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                                    <Link
                                        className="hover:text-white"
                                        href={l(`/support/${slugify(item)}`)}
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <h3 className="mt-10 text-lg font-semibold uppercase tracking-wide">
                            {t("footer.payment.title", "Payment")}
                        </h3>

                        {/* Payment logo (linked optional) */}
                        <Link href="https://razorpay.com" target="_blank" rel="noreferrer">
                            <div className="mt-5 inline-flex cursor-pointer rounded-md bg-white px-4 py-2">
                                <Image
                                    src="/footer/razorpay.png"
                                    alt={t("footer.payment.razorpayAlt", "Razorpay")}
                                    width={120}
                                    height={30}
                                />
                            </div>
                        </Link>

                        {/* Bottom section in same column (matches screenshot) */}
                        <h3 className="mt-10 text-lg font-semibold uppercase tracking-wide">
                            {t("footer.aboutUs.title", "About Us")}
                        </h3>

                        <ul className="mt-6 space-y-2 text-white/85">
                            {aboutUs.map((item) => (
                                <li key={item} className="flex items-start gap-3">
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                                    <Link className="hover:text-white" href={l(`/${slugify(item)}`)}>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* COL 4: SOCIAL + SUPPORT + (bottom) LINKS */}
                    <div className="lg:col-span-2 flex flex-col">
                        {/* Social icons top-right row (linked) */}
                        <div className="flex justify-start lg:justify-end gap-3">
                            <Link href="https://instagram.com" target="_blank" rel="noreferrer">
                                <IconBtn icon={<Instagram size={18} />} />
                            </Link>
                            <Link href="https://twitter.com" target="_blank" rel="noreferrer">
                                <IconBtn icon={<Twitter size={18} />} />
                            </Link>
                            <Link href="https://facebook.com" target="_blank" rel="noreferrer">
                                <IconBtn icon={<Facebook size={18} />} />
                            </Link>
                            <Link href="https://youtube.com" target="_blank" rel="noreferrer">
                                <IconBtn icon={<Youtube size={18} />} />
                            </Link>
                        </div>

                        <h3 className="mt-6 inline-block text-lg font-semibold uppercase tracking-wide lg:text-left">
                            {t("footer.support.title", "Customer Support")}
                        </h3>

                        <div className="mt-5 space-y-6 text-white/85">
                            <div className="flex gap-3 lg:justify-end">
                                <Mail size={18} className="shrink-0" />
                                <div className="text-sm">
                                    <div className="text-white font-medium">
                                        {t("footer.support.emailLabel", "Email Us:")}
                                    </div>

                                    <div>
                                        <Link
                                            href={`mailto:${t("footer.support.email", "support@exechub.com")}`}
                                            className="hover:text-white"
                                        >
                                            {t("footer.support.email", "support@exechub.com")}
                                        </Link>
                                    </div>

                                    <div className="mt-2 text-white/75 leading-snug">
                                        {t("footer.support.emailNote", "We will get back to within 24 hrs.")}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 lg:justify-end">
                                <Phone size={18} className="shrink-0" />
                                <div className="text-sm">
                                    <div className="text-white font-medium">
                                        {t("footer.support.callLabel", "Call Us:")}
                                    </div>
                                    <div className="text-white/75">
                                        {t("footer.support.callNote", "Available from 8am – 5pm HK")}
                                    </div>

                                    <div>
                                        <Link href="tel:+85211111111" className="hover:text-white">
                                            {t("footer.support.phone", "+852-1111-1111")}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom right links */}
                        <div className="mt-10 text-white/85 space-y-2">
                            <Link className="block hover:text-white" href={l("/terms")}>
                                {t("footer.links.terms", "Terms & Conditions")}
                            </Link>
                            <Link className="block hover:text-white" href={l("/privacy")}>
                                {t("footer.links.privacy", "Privacy Policy")}
                            </Link>
                            <Link className="block hover:text-white" href={l("/faqs")}>
                                {t("footer.links.faqs", "FAQs")}
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Divider + Bottom copyright */}
                <div className="mt-12 border-t border-white/20 py-6 text-center text-sm text-white/70">
                    {t("footer.bottom", "© 2026 Easehub Private Limited.")}
                </div>
            </div>
        </footer>
    );
}

function IconBtn({ icon }) {
    return (
        <div className="h-9 w-9 flex items-center justify-center rounded-md border border-white/20 bg-white/10 hover:bg-white/20 transition cursor-pointer">
            {icon}
        </div>
    );
}
