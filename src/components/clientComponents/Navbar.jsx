"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
    ChevronDown,
    Menu,
    X,
    Search,
    User,
    ShoppingCart,
    LogOut,
    LogIn,
    Mail,
    Phone,
    Grid3x3,
    Package,
    Sparkles,
    Settings,
    LayoutDashboard,
} from "lucide-react";

import { useSelector, useDispatch } from "react-redux";
import { setUser, clearUser } from "@/store/userSlice";
import http from "@/http";
import { fromStorage, clearStorage } from "@/lib";

const LOCALES = ["en", "ne", "zh"];
const LABELS = { en: "EN", zh: "粵", ne: "NP" };
const FLAGS = { en: "/flags/gb.jpg", zh: "/flags/hk.jpg", ne: "/flags/np.png" };

const SERVICES = [
    { key: "accounting", label: "Accouting", href: "/services/" },
    { key: "software", label: "Software", href: "/services/software" },
    { key: "license", label: "F&B License", href: "/services/license" },
    { key: "copmanyReg", label: "Company Register", href: "/services/copmanyReg" },
    { key: "tourAndTravel", label: "Tour and Travel", href: "/services/tourAndTravel" },
    { key: "flightTicket", label: "Flight Ticket", href: "/services/flightTicket" },
    { key: "bookTransport", label: "Book Transport", href: "/services/bookTransport" },
    { key: "visaAndImmigration", label: "Visa and Immigration", href: "/services/visaAndImmigration" },
    { key: "homeAndOffice", label: "Home and Office Moving", href: "/services/homeAndOffice" },
    { key: "repairAndInstall", label: "Repair and Installation", href: "/services/repairAndInstall" },
];

export default function Navbar({ locale = "en", dict = {} }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const desktopServicesRef = useRef(null);
    const mobileDrawerRef = useRef(null);
    const profileRef = useRef(null);

    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();

    const user = useSelector((state) => state.user.value);
    const isLoggedIn = user && Object.keys(user).length > 0;
    const displayName = user?.name;

    const t = (key, fallback) => {
        const parts = key.split(".");
        let cur = dict;
        for (const p of parts) cur = cur?.[p];
        return cur ?? fallback;
    };

    const l = (path) => `/${locale}${path}`;

    const mobilePrimaryLinks = useMemo(
        () => [
            { label: t("nav.organicMart", "Organic Mart"), href: l("/organic-mart"), icon: Package },
            { label: t("nav.aiExpress", "AI Express"), href: l("/ai-express"), icon: Sparkles },
            { label: t("nav.servicesTitle", "Perfect Services"), href: l("/services"), icon: Grid3x3 },
        ],
        [locale, dict]
    );

    useEffect(() => {
        const token = fromStorage("hkmandu");
        if (!isLoggedIn && token) {
            http
                .get("frontend/auth/details")
                .then((res) => {
                    const u = res.data?.user ?? res.data;
                    if (u) dispatch(setUser(u));
                })
                .catch(() => {
                    clearStorage("hkmandu");
                    dispatch(clearUser());
                });
        }
    }, [dispatch, isLoggedIn]);

    useEffect(() => {
        function onKeyDown(e) {
            if (e.key === "Escape") {
                setServicesOpen(false);
                setMobileOpen(false);
                setProfileOpen(false);
            }
        }
        function onPointerDown(e) {
            const inDesktopDropdown = desktopServicesRef.current?.contains(e.target);
            const inMobileDrawer = mobileDrawerRef.current?.contains(e.target);
            const inProfile = profileRef.current?.contains(e.target);
            if (inDesktopDropdown || inMobileDrawer || inProfile) return;
            setServicesOpen(false);
            setProfileOpen(false);
        }
        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("pointerdown", onPointerDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.removeEventListener("pointerdown", onPointerDown);
        };
    }, []);

    const switchLocale = (nextLocale) => {
        if (!pathname) return;
        const segments = pathname.split("/");
        if (LOCALES.includes(segments[1])) {
            segments[1] = nextLocale;
            router.push(segments.join("/"));
        } else {
            router.push(`/${nextLocale}${pathname}`);
        }
        setMobileOpen(false);
        setServicesOpen(false);
        setProfileOpen(false);
    };

    const handleLogout = () => {
        clearStorage("hkmandu");
        dispatch(clearUser());
        setMobileOpen(false);
        setServicesOpen(false);
        setProfileOpen(false);
        router.replace(l("/"));
        router.refresh();
    };

    return (
        <header className="w-full bg-white" style={{ boxShadow: "0 1px 0 #e5e7eb, 0 4px 16px -4px rgba(26,75,143,0.07)" }}>

            {/* ── Top bar ── */}
            <div className="hidden md:block" style={{ background: "linear-gradient(90deg, #0f2a5e 0%, #1a4b8f 100%)" }}>
                <div className="mx-auto max-w-7xl px-4 lg:px-6">
                    <div className="flex h-9 items-center justify-between" style={{ fontSize: "11px", letterSpacing: "0.03em" }}>

                        <div className="flex items-center gap-4 text-white/80">
                            <span className="inline-flex items-center gap-1.5">
                                <Mail className="h-3 w-3 opacity-70" />
                                contact@hkmandu.com
                            </span>
                            <span className="h-3 w-px bg-white/20" />
                            <span className="inline-flex items-center gap-1.5">
                                <Phone className="h-3 w-3 opacity-70" />
                                +852-1111-1111 &nbsp;|&nbsp; +977-9812345678
                            </span>
                        </div>

                        <div className="flex items-center gap-1 text-white/70">
                            {[
                                { key: "nav.terms", fallback: "Terms & Conditions", href: l("/terms") },
                                { key: "nav.privacy", fallback: "Privacy Policy", href: l("/privacy-policy") },
                                { key: "nav.faqs", fallback: "FAQs", href: l("/faqs") },
                            ].map((item, i, arr) => (
                                <span key={item.href} className="inline-flex items-center">
                                    <Link
                                        href={item.href}
                                        className="hover:text-white transition-colors duration-150 px-2 py-0.5 rounded"
                                        style={{ letterSpacing: "0.04em" }}
                                    >
                                        {t(item.key, item.fallback)}
                                    </Link>
                                    {i < arr.length - 1 && <span className="text-white/25">|</span>}
                                </span>
                            ))}
                        </div>

                    </div>
                </div>
            </div>

            {/* ── Desktop main nav ── */}
            <div className="hidden md:block">
                <div className="mx-auto max-w-7xl px-4 lg:px-6">
                    <div className="grid h-[96px] grid-cols-[96px_minmax(260px,340px)_1fr_auto] items-center gap-5 lg:grid-cols-[104px_minmax(300px,380px)_1fr_auto]">

                        {/* Logo */}
                        <Link href={l("/")} className="group flex flex-col items-center justify-center leading-none">
                            <Image
                                src="/logo.png"
                                alt={t("nav.logo", "HkMandu")}
                                width={48}
                                height={48}
                                className="h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
                            />
                            <span
                                className="mt-1 text-[12px] font-bold tracking-widest uppercase"
                                style={{ color: "#1a4b8f", letterSpacing: "0.16em" }}
                            >
                                HkMandu
                            </span>
                        </Link>

                        {/* Search */}
                        <form className="w-full">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder={t("nav.searchPlaceholder", "Search for an item")}
                                    className="h-11 w-full border bg-[#f8f9fc] pl-4 pr-12 text-sm text-neutral-800 outline-none transition-all duration-200 focus:bg-white"
                                    style={{
                                        borderRadius: "6px",
                                        borderColor: "#dde1ea",
                                        boxShadow: "inset 0 1px 2px rgba(0,0,0,0.04)",
                                    }}
                                    onFocus={e => {
                                        e.target.style.borderColor = "#1a4b8f";
                                        e.target.style.boxShadow = "0 0 0 3px rgba(26,75,143,0.10), inset 0 1px 2px rgba(0,0,0,0.04)";
                                    }}
                                    onBlur={e => {
                                        e.target.style.borderColor = "#dde1ea";
                                        e.target.style.boxShadow = "inset 0 1px 2px rgba(0,0,0,0.04)";
                                    }}
                                />
                                <button
                                    type="submit"
                                    aria-label={t("nav.searchAria", "Search")}
                                    className="absolute right-0 top-0 h-11 w-11 flex items-center justify-center rounded-r-md transition-colors duration-150 hover:bg-[#1a4b8f] hover:text-white"
                                    style={{ color: "#1a4b8f", borderRadius: "0 6px 6px 0" }}
                                >
                                    <Search className="h-4 w-4" />
                                </button>
                            </div>
                        </form>

                        {/* Center nav */}
                        <nav className="flex min-w-0 items-center justify-center gap-1 whitespace-nowrap">
                            {[
                                { href: l("/ai-express"), label: t("nav.aiExpress", "AI Express") },
                                { href: l("/"), label: t("nav.organicMart", "Organic Mart") },
                            ].map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="relative px-4 py-2 text-[14px] font-semibold text-neutral-700 transition-colors duration-150 hover:text-[#1a4b8f]"
                                    style={{ letterSpacing: "0.01em" }}
                                >
                                    {item.label}
                                    <span
                                        className="absolute bottom-0 left-4 right-4 h-[2px] scale-x-0 rounded-full bg-[#1a4b8f] transition-transform duration-200 origin-center group-hover:scale-x-100"
                                        style={{ transition: "transform 0.2s" }}
                                    />
                                </Link>
                            ))}

                            <span className="text-neutral-300 px-1 select-none">|</span>

                            {/* Services dropdown */}
                            <div className="relative" ref={desktopServicesRef}>
                                <button
                                    type="button"
                                    onClick={() => { setServicesOpen((v) => !v); setProfileOpen(false); }}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 text-[14px] font-semibold transition-colors duration-150"
                                    style={{
                                        color: servicesOpen ? "#1a4b8f" : "#404040",
                                        letterSpacing: "0.01em",
                                    }}
                                >
                                    {t("nav.servicesTitle", "Perfect Services")}
                                    <ChevronDown
                                        className="h-3.5 w-3.5 transition-transform duration-200"
                                        style={{ transform: servicesOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                                    />
                                </button>

                                {servicesOpen && (
                                    <div
                                        className="absolute left-1/2 top-full z-30 mt-3 w-72 -translate-x-1/2 bg-white p-1.5"
                                        style={{
                                            borderRadius: "10px",
                                            border: "1px solid #e8ecf4",
                                            boxShadow: "0 8px 32px -4px rgba(26,75,143,0.14), 0 2px 8px -2px rgba(0,0,0,0.06)",
                                        }}
                                    >
                                        {SERVICES.map((service) => (
                                            <Link
                                                key={service.key}
                                                href={l(service.href)}
                                                onClick={() => setServicesOpen(false)}
                                                className="flex items-center rounded-[7px] px-3.5 py-2.5 text-sm text-neutral-700 transition-colors duration-100 hover:bg-[#f0f4fb] hover:text-[#1a4b8f]"
                                                style={{ fontWeight: 450 }}
                                            >
                                                {t(`nav.services.${service.key}`, service.label)}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </nav>

                        {/* Right actions */}
                        <div className="flex items-center gap-2 whitespace-nowrap">

                            {/* Cart */}
                            <Link
                                href={l("/cart")}
                                aria-label={t("nav.cartAria", "Cart")}
                                className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-neutral-700 transition-colors duration-150 hover:bg-[#f0f4fb] hover:text-[#1a4b8f]"
                            >
                                <ShoppingCart className="h-4 w-4" />
                                <span>{t("nav.cart", "Cart")}</span>
                            </Link>

                            {/* Language switcher */}
                            <button
                                type="button"
                                onClick={() => switchLocale(locale === "en" ? "zh" : locale === "zh" ? "ne" : "en")}
                                aria-label={t("nav.changeLanguageAria", "Change language")}
                                className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-neutral-700 transition-colors duration-150 hover:bg-[#f0f4fb]"
                            >
                                <span className="relative h-4 w-6 overflow-hidden" style={{ borderRadius: "3px", boxShadow: "0 0 0 1px rgba(0,0,0,0.12)" }}>
                                    <Image
                                        src={FLAGS[locale] || FLAGS.en}
                                        alt={LABELS[locale] || "EN"}
                                        fill
                                        className="object-cover"
                                        sizes="24px"
                                    />
                                </span>
                                <span>{LABELS[locale] || "EN"}</span>
                            </button>

                            {/* Profile / Login */}
                            {!isLoggedIn ? (
                                <Link
                                    href={l("/auth/login")}
                                    className="inline-flex h-9 items-center gap-2 px-3.5 text-sm font-semibold text-white transition-all duration-150"
                                    style={{
                                        borderRadius: "7px",
                                        background: "linear-gradient(135deg, #1a4b8f 0%, #0f2a5e 100%)",
                                        boxShadow: "0 2px 8px rgba(26,75,143,0.30)",
                                        letterSpacing: "0.01em",
                                    }}
                                >
                                    <LogIn className="h-3.5 w-3.5" />
                                    {t("nav.login", "Login")}
                                </Link>
                            ) : (
                                <div className="relative" ref={profileRef}>
                                    <button
                                        type="button"
                                        onClick={() => { setProfileOpen((v) => !v); setServicesOpen(false); }}
                                        className="inline-flex h-9 items-center gap-2 px-3.5 text-sm font-semibold text-white transition-all duration-150"
                                        style={{
                                            borderRadius: "7px",
                                            background: "linear-gradient(135deg, #1a4b8f 0%, #0f2a5e 100%)",
                                            boxShadow: "0 2px 8px rgba(26,75,143,0.30)",
                                            letterSpacing: "0.01em",
                                        }}
                                    >
                                        <User className="h-3.5 w-3.5" />
                                        <span>{displayName || t("nav.account", "My Account")}</span>
                                        <ChevronDown
                                            className="h-3.5 w-3.5 transition-transform duration-200"
                                            style={{ transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                                        />
                                    </button>

                                    {profileOpen && (
                                        <div
                                            className="absolute right-0 z-40 mt-3 w-52 bg-white p-1.5"
                                            style={{
                                                borderRadius: "10px",
                                                border: "1px solid #e8ecf4",
                                                boxShadow: "0 8px 32px -4px rgba(26,75,143,0.14), 0 2px 8px -2px rgba(0,0,0,0.06)",
                                            }}
                                        >
                                            <Link
                                                href={l("/secure")}
                                                onClick={() => setProfileOpen(false)}
                                                className="flex items-center gap-2.5 rounded-[7px] px-3.5 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-[#f0f4fb] hover:text-[#1a4b8f]"
                                            >
                                                <LayoutDashboard className="h-4 w-4" />
                                                {t("nav.dashboard", "Dashboard")}
                                            </Link>
                                            <Link
                                                href={l("/settings")}
                                                onClick={() => setProfileOpen(false)}
                                                className="flex items-center gap-2.5 rounded-[7px] px-3.5 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-[#f0f4fb] hover:text-[#1a4b8f]"
                                            >
                                                <Settings className="h-4 w-4" />
                                                {t("nav.settings", "Settings")}
                                            </Link>
                                            <div className="my-1 border-t border-neutral-100" />
                                            <button
                                                type="button"
                                                onClick={handleLogout}
                                                className="flex w-full items-center gap-2.5 rounded-[7px] px-3.5 py-2.5 text-left text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                {t("nav.logout", "Logout")}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Mobile ── */}
            <div className="md:hidden">
                <div className="px-3 pt-3 pb-2.5">
                    <div className="flex items-center gap-2">

                        {/* Logo */}
                        <Link href={l("/")} className="flex w-[58px] shrink-0 flex-col items-center justify-center leading-none">
                            <Image
                                src="/logo.png"
                                alt={t("nav.logo", "HkMandu")}
                                width={38}
                                height={38}
                                className="h-9 w-auto object-contain"
                            />
                            <span
                                className="mt-0.5 font-bold uppercase tracking-widest"
                                style={{ fontSize: "9px", color: "#1a4b8f", letterSpacing: "0.15em" }}
                            >
                                HkMandu
                            </span>
                        </Link>

                        {/* Search */}
                        <form className="flex-1">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder={t("nav.searchPlaceholder", "Search for an item")}
                                    className="h-10 w-full border bg-[#f8f9fc] pl-3.5 pr-10 text-sm text-neutral-800 outline-none"
                                    style={{
                                        borderRadius: "6px",
                                        borderColor: "#dde1ea",
                                    }}
                                />
                                <button
                                    type="submit"
                                    aria-label={t("nav.searchAria", "Search")}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2"
                                    style={{ color: "#1a4b8f" }}
                                >
                                    <Search className="h-4 w-4" />
                                </button>
                            </div>
                        </form>

                        {/* Cart */}
                        <Link
                            href={l("/cart")}
                            className="inline-flex h-10 w-10 shrink-0 items-center justify-center text-neutral-700"
                            aria-label={t("nav.cartAria", "Cart")}
                        >
                            <ShoppingCart className="h-5 w-5" />
                        </Link>

                        {/* Hamburger */}
                        <button
                            type="button"
                            onClick={() => { setMobileOpen((v) => !v); setServicesOpen(false); }}
                            className="inline-flex h-10 w-10 shrink-0 items-center justify-center text-neutral-700"
                            aria-label={t("nav.openMenuAria", "Open menu")}
                        >
                            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile quick-nav bar */}
                <div
                    className="border-t border-b"
                    style={{
                        background: "linear-gradient(90deg, #f0f4fb 0%, #f8f9fc 100%)",
                        borderColor: "#e4eaf5",
                    }}
                >
                    <div className="grid grid-cols-3">
                        {mobilePrimaryLinks.map((item, idx) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="flex min-h-[72px] flex-col items-center justify-center gap-1.5 px-2 text-center transition-colors duration-150 hover:bg-[#e4eaf5]"
                                    style={{
                                        borderRight: idx !== 2 ? "1px solid #dde6f5" : "none",
                                    }}
                                >
                                    <span
                                        className="flex h-8 w-8 items-center justify-center rounded-full"
                                        style={{ background: "rgba(26,75,143,0.09)" }}
                                    >
                                        <Icon className="h-4 w-4" style={{ color: "#1a4b8f" }} />
                                    </span>
                                    <span
                                        className="text-[12px] font-semibold"
                                        style={{ color: "#1a2f5e", letterSpacing: "0.01em" }}
                                    >
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Mobile drawer */}
                {mobileOpen && (
                    <div
                        ref={mobileDrawerRef}
                        className="border-b px-3 py-4"
                        style={{
                            background: "#f8f9fc",
                            borderColor: "#e4eaf5",
                        }}
                    >
                        <div className="space-y-2">

                            {/* Services accordion */}
                            <div
                                className="overflow-hidden rounded-xl border"
                                style={{ borderColor: "#dde6f5", background: "white" }}
                            >
                                <button
                                    type="button"
                                    onClick={() => setServicesOpen((v) => !v)}
                                    className="flex w-full items-center justify-between px-4 py-3.5 text-sm font-semibold"
                                    style={{ color: "#1a2f5e" }}
                                >
                                    <span>{t("nav.servicesTitle", "Perfect Services")}</span>
                                    <ChevronDown
                                        className="h-4 w-4 transition-transform duration-200"
                                        style={{ transform: servicesOpen ? "rotate(180deg)" : "rotate(0deg)", color: "#1a4b8f" }}
                                    />
                                </button>

                                {servicesOpen && (
                                    <div className="border-t px-2 pb-2" style={{ borderColor: "#eef1f9" }}>
                                        {SERVICES.map((service) => (
                                            <Link
                                                key={service.key}
                                                href={l(service.href)}
                                                onClick={() => { setServicesOpen(false); setMobileOpen(false); }}
                                                className="block rounded-lg px-3.5 py-2.5 text-sm transition-colors hover:bg-[#f0f4fb]"
                                                style={{ color: "#374166", fontWeight: 450 }}
                                            >
                                                {t(`nav.services.${service.key}`, service.label)}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Account section */}
                            <div
                                className="overflow-hidden rounded-xl border"
                                style={{ borderColor: "#dde6f5", background: "white" }}
                            >
                                {!isLoggedIn ? (
                                    <Link
                                        href={l("/auth/login")}
                                        onClick={() => setMobileOpen(false)}
                                        className="flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold"
                                        style={{ color: "#1a4b8f" }}
                                    >
                                        <LogIn className="h-4 w-4" />
                                        {t("nav.login", "Login")}
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={l("/secure")}
                                            onClick={() => setMobileOpen(false)}
                                            className="flex items-center gap-3 border-b px-4 py-3.5 text-sm font-medium transition-colors hover:bg-[#f0f4fb]"
                                            style={{ borderColor: "#eef1f9", color: "#1a2f5e" }}
                                        >
                                            <LayoutDashboard className="h-4 w-4" style={{ color: "#1a4b8f" }} />
                                            {t("nav.dashboard", "Dashboard")}
                                        </Link>
                                        <Link
                                            href={l("/settings")}
                                            onClick={() => setMobileOpen(false)}
                                            className="flex items-center gap-3 border-b px-4 py-3.5 text-sm font-medium transition-colors hover:bg-[#f0f4fb]"
                                            style={{ borderColor: "#eef1f9", color: "#1a2f5e" }}
                                        >
                                            <Settings className="h-4 w-4" style={{ color: "#1a4b8f" }} />
                                            {t("nav.settings", "Settings")}
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-sm font-medium transition-colors hover:bg-red-50"
                                            style={{ color: "#dc2626" }}
                                        >
                                            <LogOut className="h-4 w-4" />
                                            {t("nav.logout", "Logout")}
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Language switcher */}
                            <div
                                className="flex items-center justify-between rounded-xl border px-4 py-3.5"
                                style={{ borderColor: "#dde6f5", background: "white" }}
                            >
                                <span className="text-sm font-semibold" style={{ color: "#1a2f5e" }}>
                                    {t("nav.language", "Language")}
                                </span>
                                <div className="flex items-center gap-1.5">
                                    {LOCALES.map((lc) => (
                                        <button
                                            key={lc}
                                            type="button"
                                            onClick={() => switchLocale(lc)}
                                            className="rounded-md px-2.5 py-1 text-xs font-semibold transition-all duration-150"
                                            style={lc === locale
                                                ? { background: "linear-gradient(135deg, #1a4b8f, #0f2a5e)", color: "white", boxShadow: "0 2px 6px rgba(26,75,143,0.3)" }
                                                : { background: "#eef1f9", color: "#374166" }
                                            }
                                        >
                                            {LABELS[lc]}
                                        </button>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}