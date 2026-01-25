"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Menu, X, Search, User, ShoppingCart, LogOut, LogIn } from "lucide-react";

import { useSelector, useDispatch } from "react-redux";
import { setUser, clearUser } from "@/store/userSlice";
import http from "@/http";
import { fromStorage, clearStorage } from "@/lib";

const LOCALES = ["en", "ne", "zh"];
const LABELS = { en: "EN", zh: "粵", ne: "NP" };
const FLAGS = { en: "/flags/gb.jpg", zh: "/flags/hk.jpg", ne: "/flags/np.png" };

export default function Navbar({ locale = "en", dict = {} }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);

    const servicesRef = useRef(null);
    const router = useRouter();
    const pathname = usePathname();

    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.value);
    const isLoggedIn = user && Object.keys(user).length > 0;

    // safe translate helper: t("nav.account", "My Account")
    const t = (key, fallback) => {
        const parts = key.split(".");
        let cur = dict;
        for (const p of parts) cur = cur?.[p];
        return cur ?? fallback;
    };

    // Prefix any internal route with locale
    const l = (path) => `/${locale}${path}`;

    // Hydrate user if cookie exists but redux empty (after refresh)
    useEffect(() => {
        const token = fromStorage("yalakhom");
        if (!isLoggedIn && token) {
            http
                .get("frontend/auth/details")
                .then((res) => {
                    const u = res.data?.user ?? res.data;
                    if (u) dispatch(setUser(u));
                })
                .catch(() => {
                    // token invalid -> clear token + user
                    clearStorage("yalakhom");
                    dispatch(clearUser());
                });
        }
    }, [isLoggedIn, dispatch]);

    // Logout handler
    const handleLogout = async () => {
        // optional: if you have backend logout endpoint call it here
        // await http.post("frontend/auth/logout").catch(() => {});

        clearStorage("yalakhom"); // remove JWT cookie
        dispatch(clearUser());
        setMobileOpen(false);
        setServicesOpen(false);

        router.replace(l("/"));
        router.refresh();
    };

    // Switch locale but keep the same path after the locale segment
    const switchLocale = (nextLocale) => {
        if (!pathname) return;

        const segments = pathname.split("/"); // ["", "en", "products", ...]
        if (LOCALES.includes(segments[1])) {
            segments[1] = nextLocale;
            router.push(segments.join("/"));
        } else {
            router.push(`/${nextLocale}${pathname}`);
        }

        setMobileOpen(false);
        setServicesOpen(false);
    };

    // Cycle locale button (en -> ne -> zh -> en)
    const nextLocaleInCycle = () => {
        const idx = LOCALES.indexOf(locale);
        const nextIdx = idx === -1 ? 0 : (idx + 1) % LOCALES.length;
        return LOCALES[nextIdx];
    };

    // Close dropdown on outside click / ESC
    useEffect(() => {
        function onKeyDown(e) {
            if (e.key === "Escape") setServicesOpen(false);
        }
        function onClickOutside(e) {
            if (!servicesRef.current) return;
            if (!servicesRef.current.contains(e.target)) setServicesOpen(false);
        }
        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("mousedown", onClickOutside);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.removeEventListener("mousedown", onClickOutside);
        };
    }, []);

    const displayName = user?.name;

    return (
        <header className="w-full">
            {/* Top Bar */}
            <div className="bg-gradient-to-r from-[#5f57ff] to-[#2b2458]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 items-center justify-between gap-3">
                        {/* Left: Logo + Services */}
                        <div className="flex items-center gap-3 sm:gap-6">
                            <Link href={l("/")} className="flex items-center">
                                <span className="text-2xl sm:text-3xl font-semibold tracking-wide text-white">
                                    {t("nav.logo", "YALAKOM")}
                                </span>
                            </Link>

                            {/* Services dropdown */}
                            <div className="relative hidden md:block" ref={servicesRef}>
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-1.5 text-white/95 hover:text-white text-sm font-medium"
                                    onClick={() => setServicesOpen((v) => !v)}
                                    aria-haspopup="menu"
                                    aria-expanded={servicesOpen}
                                >
                                    {t("nav.servicesTitle", "Perfect Services")}
                                    <ChevronDown className="h-4 w-4" />
                                </button>

                                {servicesOpen && (
                                    <div
                                        className="absolute left-0 mt-2 w-56 overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/5"
                                        role="menu"
                                    >
                                        <Link
                                            href={l("/services/design")}
                                            className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                            role="menuitem"
                                            onClick={() => setServicesOpen(false)}
                                        >
                                            {t("nav.services.design", "Design")}
                                        </Link>
                                        <Link
                                            href={l("/services/development")}
                                            className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                            role="menuitem"
                                            onClick={() => setServicesOpen(false)}
                                        >
                                            {t("nav.services.development", "Development")}
                                        </Link>
                                        <Link
                                            href={l("/services/marketing")}
                                            className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                            role="menuitem"
                                            onClick={() => setServicesOpen(false)}
                                        >
                                            {t("nav.services.marketing", "Marketing")}
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Center: Search (desktop/tablet) */}
                        <div className="hidden flex-1 md:flex justify-center px-2">
                            <form className="w-full max-w-xl">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder={t("nav.searchPlaceholder", "Search for Products")}
                                        className="w-full rounded-lg bg-white/90 px-4 py-2.5 pr-11 text-sm text-slate-800 placeholder:text-slate-500 outline-none ring-1 ring-white/30 focus:bg-white focus:ring-2 focus:ring-white/70"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-[#5f57ff] hover:bg-slate-100"
                                        aria-label={t("nav.searchAria", "Search")}
                                    >
                                        <Search className="h-5 w-5" />
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            {/* Account area */}
                            {!isLoggedIn ? (
                                <div className="hidden sm:flex items-center justify-center">
                                    <Link
                                        href={l("/auth/login")}
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-2 text-sm font-medium text-white hover:bg-white/20"
                                    >
                                        <LogIn className="h-4 w-4" />
                                        {t("nav.login", "Login")}
                                    </Link>
                                </div>


                            ) : (
                                <div className="hidden sm:flex items-center gap-2">
                                    <Link
                                        href={l("/secure")}
                                        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-white/95 hover:bg-white/10"
                                    >
                                        <User className="h-5 w-5" />
                                        <div className="leading-tight">
                                            <div className="text-[10px] opacity-90">
                                                {t("nav.hello", "Hello,")} {displayName}
                                            </div>
                                            <div className="text-xs font-medium">{t("nav.account", "My Account")}</div>
                                        </div>
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white/95 hover:bg-white/10"
                                        title={t("nav.logout", "Logout")}
                                    >
                                        <LogOut className="h-4 w-4" />
                                        {t("nav.logout", "Logout")}
                                    </button>
                                </div>
                            )}

                            {/* Cart */}
                            <Link
                                href={l("/cart")}
                                className="inline-flex items-center justify-center rounded-lg p-2 text-white/95 hover:bg-white/10"
                                aria-label={t("nav.cartAria", "Cart")}
                            >
                                <ShoppingCart className="h-5 w-5" />
                            </Link>

                            {/* Language (desktop) */}
                            <div className="hidden sm:flex items-center gap-2">
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-white/95 hover:bg-white/10"
                                    onClick={() => switchLocale(nextLocaleInCycle())}
                                    aria-label={t("nav.changeLanguageAria", "Change language")}
                                    title={t("nav.changeLanguageTitle", "Change language")}
                                >
                                    <span className="relative h-4 w-6 overflow-hidden rounded-sm">
                                        <Image
                                            src={FLAGS[locale] || FLAGS.en}
                                            alt={LABELS[locale] || "EN"}
                                            fill
                                            className="object-cover"
                                            sizes="24px"
                                        />
                                    </span>
                                    <span className="text-xs font-semibold">{LABELS[locale] || "EN"}</span>
                                </button>

                                <div className="hidden md:flex items-center gap-1">
                                    {LOCALES.map((lc) => (
                                        <button
                                            key={lc}
                                            onClick={() => switchLocale(lc)}
                                            className={`rounded-md px-2 py-1 text-[11px] font-semibold ${lc === locale ? "bg-white/20 text-white" : "text-white/90 hover:bg-white/10"
                                                }`}
                                            type="button"
                                        >
                                            {LABELS[lc]}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Mobile menu toggle */}
                            <button
                                type="button"
                                className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-white/95 hover:bg-white/10"
                                onClick={() => setMobileOpen((v) => !v)}
                                aria-label={t("nav.openMenuAria", "Open menu")}
                            >
                                {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile: Search + Menu Panel */}
                <div className={`md:hidden ${mobileOpen ? "block" : "hidden"}`}>
                    <div className="mx-auto max-w-7xl px-4 pb-4">
                        {/* Search */}
                        <form className="pt-2">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder={t("nav.searchPlaceholder", "Search for Products")}
                                    className="w-full rounded-lg bg-white/90 px-4 py-2.5 pr-11 text-sm text-slate-800 placeholder:text-slate-500 outline-none ring-1 ring-white/30 focus:bg-white focus:ring-2 focus:ring-white/70"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-[#5f57ff] hover:bg-slate-100"
                                    aria-label={t("nav.searchAria", "Search")}
                                >
                                    <Search className="h-5 w-5" />
                                </button>
                            </div>
                        </form>

                        {/* Mobile links */}
                        <div className="mt-3 space-y-2 rounded-xl bg-white/10 p-3 ring-1 ring-white/10">
                            <button
                                type="button"
                                className="w-full inline-flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-white hover:bg-white/10"
                                onClick={() => setServicesOpen((v) => !v)}
                            >
                                {t("nav.servicesTitle", "Perfect Services")}
                                <ChevronDown className="h-4 w-4" />
                            </button>

                            {servicesOpen && (
                                <div className="space-y-1 px-1 pb-2">
                                    <Link
                                        href={l("/services/design")}
                                        className="block rounded-lg px-3 py-2 text-sm text-white/95 hover:bg-white/10"
                                        onClick={() => {
                                            setMobileOpen(false);
                                            setServicesOpen(false);
                                        }}
                                    >
                                        {t("nav.services.design", "Design")}
                                    </Link>
                                    <Link
                                        href={l("/services/development")}
                                        className="block rounded-lg px-3 py-2 text-sm text-white/95 hover:bg-white/10"
                                        onClick={() => {
                                            setMobileOpen(false);
                                            setServicesOpen(false);
                                        }}
                                    >
                                        {t("nav.services.development", "Development")}
                                    </Link>
                                    <Link
                                        href={l("/services/marketing")}
                                        className="block rounded-lg px-3 py-2 text-sm text-white/95 hover:bg-white/10"
                                        onClick={() => {
                                            setMobileOpen(false);
                                            setServicesOpen(false);
                                        }}
                                    >
                                        {t("nav.services.marketing", "Marketing")}
                                    </Link>
                                </div>
                            )}

                            {/* Mobile auth/account */}
                            {!isLoggedIn ? (
                                <div className="flex gap-2">
                                    <Link
                                        href={l("/auth/login")}
                                        onClick={() => setMobileOpen(false)}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/15"
                                    >
                                        <LogIn className="h-4 w-4" />
                                        {t("nav.login", "Login")}
                                    </Link>
                                </div>

                            ) : (
                                <div className="space-y-2">
                                    <Link
                                        href={l("/secure")}
                                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white hover:bg-white/10"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        <User className="h-5 w-5" />
                                        {t("nav.hello", "Hello,")} {displayName} — {t("nav.account", "My Account")}
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/15"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        {t("nav.logout", "Logout")}
                                    </button>
                                </div>
                            )}

                            {/* Mobile language buttons */}
                            <div className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-white/95 bg-white/10">
                                <span className="flex items-center gap-2">
                                    <span className="relative h-4 w-6 overflow-hidden rounded-sm">
                                        <Image
                                            src={FLAGS[locale] || FLAGS.en}
                                            alt={LABELS[locale] || "EN"}
                                            fill
                                            className="object-cover"
                                            sizes="24px"
                                        />
                                    </span>
                                    {t("nav.language", "Language")}
                                </span>
                                <div className="flex gap-1">
                                    {LOCALES.map((lc) => (
                                        <button
                                            key={lc}
                                            onClick={() => switchLocale(lc)}
                                            className={`rounded-md px-2 py-1 text-[11px] font-semibold ${lc === locale ? "bg-white/20 text-white" : "text-white/90 hover:bg-white/10"
                                                }`}
                                            type="button"
                                        >
                                            {LABELS[lc]}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom white strip */}
            {/* <div className="h-8 bg-white" /> */}
        </header>
    );
}
