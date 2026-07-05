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
import { useCart } from "@/contexts/CartContext";
import { INPUT_LIMITS } from "@/constants/inputLimits";

const LOCALES = ["en", "ne", "zh"];
const LABELS = { en: "EN", zh: "粵", ne: "NP" };
const FLAGS = { en: "/flags/gb.jpg", zh: "/flags/hk.jpg", ne: "/flags/np.png" };

const YELLOW_BORDER = "#facc15";

const EXPRESS_LINKS = [
    {
        key: "doorToDoor",
        label: "Door to Door (HK Only)",
        href: "/ai-express/door-to-door#pickup-form",
    },
    {
        key: "hkToNepal",
        label: "HK to Kathmandu",
        href: "/ai-express/hk-to-kathmandu#pickup-form",
    },
    {
        key: "nepalToHk",
        label: "Kathmandu to HK",
        href: "/ai-express/kathmandu-to-hk#pickup-form",
    },
];

const SERVICES = [
    {
        key: "software",
        label: "Software Development",
        href: "/services/software-development",
    },
    {
        key: "accounting",
        label: "Accounting & Finance",
        href: "/services/accounting-finance",
    },
    {
        key: "businessServices",
        label: "Company Register & F&B License",
        href: "/services/business-services",
    },
    {
        key: "travelImmigration",
        label: "Travel & Immigration",
        href: "/services/travel-immigration",
    },
    {
        key: "constructionRepairServices",
        label: "Construction & Repair Services",
        href: "/services/construction-repair-services",
    },
];

export default function Navbar({ locale = "en", dict = {} }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);
    const [groceryOpen, setGroceryOpen] = useState(false);
    const [expressOpen, setExpressOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const [desktopSearch, setDesktopSearch] = useState("");
    const [mobileSearch, setMobileSearch] = useState("");

    const desktopServicesRef = useRef(null);
    const desktopGroceryRef = useRef(null);
    const desktopExpressRef = useRef(null);
    const mobileDrawerRef = useRef(null);
    const profileRef = useRef(null);

    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();

    const { totalItems, fetchCart } = useCart();

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

    const closeMenus = () => {
        setMobileOpen(false);
        setServicesOpen(false);
        setGroceryOpen(false);
        setExpressOpen(false);
        setProfileOpen(false);
    };

    const groceryMainHref = () => `/${locale}/product?page=1&limit=10`;
    const bulkPurchaseHref = () => `/${locale}/bulk-purchase?page=1&limit=10`;
    const bbqDeliveryHref = () => `/${locale}/product?category=bbq&page=1&limit=10`;
    const nepaliProductHref = () => `/${locale}/product?category=madeinnepal&page=1&limit=10`;

    const scrollToPerfectServices = () => {
        closeMenus();
        const homePath = `/${locale}`;
        if (pathname !== homePath) {
            router.push(`${homePath}#perfect-services`);
            return;
        }
        const el = document.getElementById("perfect-services");
        if (el) {
            setTimeout(() => {
                const header = document.querySelector("header");
                let headerHeight = 0;
                if (header) {
                    const style = getComputedStyle(header);
                    if (style.position === "sticky" || style.position === "fixed") {
                        headerHeight = header.getBoundingClientRect().height;
                    }
                }
                const originalMargin = el.style.scrollMarginTop;
                el.style.scrollMarginTop = `${headerHeight + 12}px`;
                el.scrollIntoView({ behavior: "smooth", block: "start" });
                setTimeout(() => {
                    el.style.scrollMarginTop = originalMargin;
                }, 500);
            }, 50);
        }
    };

    const mobilePrimaryLinks = useMemo(
        () => [
            {
                label: t("nav.organicMart", "A Grocery"),
                href: groceryMainHref(),
                icon: Package,
                type: "grocery",
            },
            {
                label: t("nav.aiExpress", "A Express"),
                href: l("/ai-express"),
                icon: Sparkles,
                type: "express",
            },
            {
                label: t("nav.servicesTitle", "R Services"),
                icon: Grid3x3,
                type: "scroll",
            },
        ],
        [locale, dict]
    );

    // User authentication sync
    useEffect(() => {
        const token = fromStorage("hkmandu");
        if (!isLoggedIn && token) {
            http.get("frontend/auth/details")
                .then((res) => {
                    const u = res.data?.user ?? res.data;
                    if (u) {
                        dispatch(setUser(u));
                        fetchCart();
                    }
                })
                .catch(() => {
                    clearStorage("hkmandu");
                    dispatch(clearUser());
                });
        }
    }, [dispatch, isLoggedIn, fetchCart]);

    // Close dropdowns on escape or outside click
    useEffect(() => {
        function onKeyDown(e) {
            if (e.key === "Escape") closeMenus();
        }
        function onPointerDown(e) {
            const inDesktopServices = desktopServicesRef.current?.contains(e.target);
            const inDesktopGrocery = desktopGroceryRef.current?.contains(e.target);
            const inDesktopExpress = desktopExpressRef.current?.contains(e.target);
            const inMobileDrawer = mobileDrawerRef.current?.contains(e.target);
            const inProfile = profileRef.current?.contains(e.target);
            if (inDesktopServices || inDesktopGrocery || inDesktopExpress || inMobileDrawer || inProfile) return;
            setServicesOpen(false);
            setGroceryOpen(false);
            setExpressOpen(false);
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
        closeMenus();
    };

    const handleLogout = () => {
        clearStorage("hkmandu");
        dispatch(clearUser());
        closeMenus();
        router.replace(l("/"));
        router.refresh();
    };

    const handleSearchSubmit = (e, keyword) => {
        e.preventDefault();
        const value = keyword.trim();
        closeMenus();
        const query = new URLSearchParams();
        query.set("page", "1");
        query.set("limit", "10");
        if (value) query.set("search", value);
        router.push(`/${locale}/product?${query.toString()}`);
    };

    return (
        <header
            className="w-full bg-orange-50"
            style={{
                boxShadow: "0 1px 0 #e5e7eb, 0 4px 16px -4px rgba(26,75,143,0.07)",
            }}
        >
            {/* Top bar (desktop) */}
            <div
                className="hidden lg:block"
                style={{ background: "linear-gradient(90deg, #0f2a5e 0%, #1a4b8f 100%)" }}
            >
                <div className="mx-auto w-full max-w-none px-4 lg:w-[80vw] lg:px-6">
                    <div className="flex h-9 items-center justify-between" style={{ fontSize: "13.3px", letterSpacing: "0.01em" }}>
                        <div className="flex items-center gap-4 text-white/80">
                            <span className="inline-flex items-center gap-1.5">
                                <Mail className="h-4 w-3 opacity-70" />
                                contact@hkmandu.com
                            </span>
                            <span className="h-3 w-px bg-white/20" />
                            <span className="inline-flex items-center gap-1.5">
                                <Phone className="h-4 w-3 opacity-70" />
                                +852-1111-1111 &nbsp;|&nbsp; +977-9812345678
                            </span>
                        </div>
                        <div className="flex items-center gap-1 text-white/70">
                            {[
                                { key: "nav.terms", fallback: "Terms & Conditions", href: l("/terms") },
                                { key: "nav.privacy", fallback: "Privacy Policy", href: l("/privacy-policy") },
                            ].map((item, i, arr) => (
                                <span key={item.href} className="inline-flex items-center">
                                    <Link
                                        href={item.href}
                                        className="rounded px-2 py-0.5 transition-colors duration-150 hover:text-white"
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

            {/* Main desktop navbar */}
            <div className="hidden bg-orange-50 lg:block">
                <div className="mx-auto w-full max-w-none px-3 lg:w-[80vw] lg:px-4 xl:px-6">
                    <div className="grid h-[80px] grid-cols-[78px_minmax(220px,1fr)_minmax(280px,auto)_auto] items-center gap-3 xl:grid-cols-[105px_minmax(300px,1.25fr)_minmax(330px,1fr)_auto] xl:gap-5 2xl:grid-cols-[105px_minmax(380px,1.45fr)_minmax(380px,1fr)_auto]">
                        {/* Logo */}
                        <Link href={l("/")} className="group flex flex-col items-center justify-center leading-none">
                            <Image
                                src="/logo.png"
                                alt={t("nav.logo", "HkMandu")}
                                width={48}
                                height={48}
                                className="h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105 xl:h-11"
                            />
                            <span
                                className="mt-1 text-[10px] font-bold uppercase tracking-widest xl:text-[12px]"
                                style={{ color: "#1a4b8f", letterSpacing: "0.14em" }}
                            >
                                HkMandu
                            </span>
                        </Link>

                        {/* Search */}
                        <form className="w-full" onSubmit={(e) => handleSearchSubmit(e, desktopSearch)}>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={desktopSearch}
                                    onChange={(e) => setDesktopSearch(e.target.value)}
                                    placeholder={t("nav.searchPlaceholder", "Search for an item")}
                                    maxLength={INPUT_LIMITS.search}
                                    className="h-10 w-full border bg-orange-50 pl-3 pr-10 text-sm text-neutral-800 outline-none transition-all duration-200 focus:bg-orange-50 xl:h-11 xl:pl-4 xl:pr-12"
                                    style={{ borderRadius: "6px", borderColor: "#fed7aa", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.04)" }}
                                />
                                <button
                                    type="submit"
                                    aria-label={t("nav.searchAria", "Search")}
                                    className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center rounded-r-md transition-colors duration-150 hover:text-white xl:h-11 xl:w-11"
                                    style={{ color: "#1a4b8f", borderRadius: "0 6px 6px 0" }}
                                >
                                    <Search className="h-4 w-4" />
                                </button>
                            </div>
                        </form>

                        {/* Desktop navigation pills */}
                        <nav className="flex min-w-0 w-full items-center justify-between gap-2 whitespace-nowrap">
                            {/* Express dropdown */}
                            <div className="relative shrink-0" ref={desktopExpressRef}>
                                <div className="flex items-center overflow-hidden rounded-full border bg-orange-50" style={{ borderColor: YELLOW_BORDER }}>
                                    <Link
                                        href={l("/ai-express")}
                                        onClick={() => setExpressOpen(false)}
                                        className="px-3 py-2 text-[13px] font-semibold text-neutral-700 transition-colors duration-150 hover:text-[#1a4b8f] xl:text-[14px]"
                                        style={{ letterSpacing: "0.01em" }}
                                    >
                                        {t("nav.aiExpress", "A Express")}
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => { setExpressOpen(v => !v); setGroceryOpen(false); setServicesOpen(false); setProfileOpen(false); }}
                                        className="inline-flex items-center border-l px-2 py-2 text-[13px] font-semibold transition-colors duration-150 xl:text-[14px]"
                                        style={{ borderColor: YELLOW_BORDER, color: expressOpen ? "#1a4b8f" : "#404040" }}
                                        aria-label="Toggle express menu"
                                    >
                                        <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200" style={{ transform: expressOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
                                    </button>
                                </div>
                                {expressOpen && (
                                    <div className="absolute left-1/2 top-full z-30 mt-3 w-56 -translate-x-1/2 bg-orange-50 p-1.5" style={{ borderRadius: "10px", border: `1px solid ${YELLOW_BORDER}`, boxShadow: "0 8px 32px -4px rgba(26,75,143,0.14), 0 2px 8px -2px rgba(0,0,0,0.06)" }}>
                                        {EXPRESS_LINKS.map(item => (
                                            <Link key={item.key} href={l(item.href)} onClick={() => setExpressOpen(false)} className="flex items-center rounded-[7px] px-3.5 py-2.5 text-sm text-neutral-700 transition-colors duration-100 hover:bg-yellow-50 hover:text-[#1a4b8f]" style={{ fontWeight: 450 }}>
                                                {t(`nav.express.${item.key}`, item.label)}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Grocery dropdown with multi-language items */}
                            <div className="relative shrink-0" ref={desktopGroceryRef}>
                                <div
                                    className="flex items-center overflow-hidden rounded-full border bg-orange-50"
                                    style={{ borderColor: YELLOW_BORDER }}
                                >
                                    <Link
                                        href={groceryMainHref()}
                                        onClick={() => setGroceryOpen(false)}
                                        className="px-3 py-2 text-[13px] font-semibold text-neutral-700 transition-colors duration-150 hover:text-[#1a4b8f] xl:text-[14px]"
                                        style={{ letterSpacing: "0.01em" }}
                                    >
                                        {t("nav.organicMart", "A Grocery")}
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setGroceryOpen((v) => !v);
                                            setServicesOpen(false);
                                            setExpressOpen(false);
                                            setProfileOpen(false);
                                        }}
                                        className="inline-flex items-center border-l px-2 py-2 text-[13px] font-semibold transition-colors duration-150 xl:text-[14px]"
                                        style={{
                                            borderColor: YELLOW_BORDER,
                                            color: groceryOpen ? "#1a4b8f" : "#404040",
                                        }}
                                        aria-label="Toggle grocery menu"
                                    >
                                        <ChevronDown
                                            className="h-3.5 w-3.5 transition-transform duration-200"
                                            style={{
                                                transform: groceryOpen ? "rotate(180deg)" : "rotate(0deg)",
                                            }}
                                        />
                                    </button>
                                </div>

                                {groceryOpen && (
                                    <div
                                        className="absolute left-1/2 top-full z-30 mt-3 w-64 -translate-x-1/2 bg-orange-50 p-1.5"
                                        style={{
                                            borderRadius: "10px",
                                            border: `1px solid ${YELLOW_BORDER}`,
                                            boxShadow:
                                                "0 8px 32px -4px rgba(26,75,143,0.14), 0 2px 8px -2px rgba(0,0,0,0.06)",
                                        }}
                                    >
                                        {/* Bulk Purchase (Free Delivery) */}
                                        <Link
                                            href={bulkPurchaseHref()}
                                            onClick={() => {
                                                setGroceryOpen(false);
                                                setExpressOpen(false);
                                                setServicesOpen(false);
                                            }}
                                            className="flex items-center rounded-[7px] px-3.5 py-2.5 text-sm font-semibold text-neutral-700 transition-colors duration-100 hover:bg-yellow-50 hover:text-[#1a4b8f]"
                                        >
                                            {t("nav.bulkPurchase", "Bulk Purchase (Free Delivery)")}
                                        </Link>

                                        <div className="my-1 border-t border-yellow-200" />

                                        {/* BBQ & Delivery Services */}
                                        <Link
                                            href={bbqDeliveryHref()}
                                            onClick={() => {
                                                setGroceryOpen(false);
                                                setExpressOpen(false);
                                                setServicesOpen(false);
                                            }}
                                            className="flex items-center rounded-[7px] px-3.5 py-2.5 text-sm font-semibold text-neutral-700 transition-colors duration-100 hover:bg-yellow-50 hover:text-[#1a4b8f]"
                                        >
                                            {t("nav.bbqDelivery", "BBQ & Delivery Services")}
                                        </Link>

                                        <div className="my-1 border-t border-yellow-200" />

                                        {/* Nepali Product (Made In Nepal) */}
                                        <Link
                                            href={nepaliProductHref()}
                                            onClick={() => {
                                                setGroceryOpen(false);
                                                setExpressOpen(false);
                                                setServicesOpen(false);
                                            }}
                                            className="flex items-center rounded-[7px] px-3.5 py-2.5 text-sm font-semibold text-neutral-700 transition-colors duration-100 hover:bg-yellow-50 hover:text-[#1a4b8f]"
                                        >
                                            {t("nav.nepaliProduct", "Nepali Product (Made In Nepal)")}
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Services dropdown */}
                            <div className="relative shrink-0" ref={desktopServicesRef}>
                                <div className="flex items-center overflow-hidden rounded-full border bg-orange-50" style={{ borderColor: YELLOW_BORDER }}>
                                    <button
                                        type="button"
                                        onClick={scrollToPerfectServices}
                                        className="px-3 py-2 text-[13px] font-semibold transition-colors duration-150 hover:text-[#1a4b8f] xl:text-[14px]"
                                        style={{ color: "#404040", letterSpacing: "0.01em" }}
                                    >
                                        {t("nav.servicesTitle", "R Services")}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setServicesOpen(v => !v); setGroceryOpen(false); setExpressOpen(false); setProfileOpen(false); }}
                                        className="inline-flex items-center border-l px-2 py-2 text-[13px] font-semibold transition-colors duration-150 xl:text-[14px]"
                                        style={{ borderColor: YELLOW_BORDER, color: servicesOpen ? "#1a4b8f" : "#404040" }}
                                        aria-label="Toggle services menu"
                                    >
                                        <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200" style={{ transform: servicesOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
                                    </button>
                                </div>
                                {servicesOpen && (
                                    <div className="absolute left-1/2 top-full z-30 mt-3 w-72 -translate-x-1/2 bg-orange-50 p-1.5" style={{ borderRadius: "10px", border: `1px solid ${YELLOW_BORDER}`, boxShadow: "0 8px 32px -4px rgba(26,75,143,0.14), 0 2px 8px -2px rgba(0,0,0,0.06)" }}>
                                        {SERVICES.map(service => (
                                            <Link key={service.key} href={l(service.href)} onClick={() => setServicesOpen(false)} className="flex items-center rounded-[7px] px-3.5 py-2.5 text-sm text-neutral-700 transition-colors duration-100 hover:bg-yellow-50 hover:text-[#1a4b8f]" style={{ fontWeight: 450 }}>
                                                {t(`nav.services.${service.key}`, service.label)}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </nav>

                        {/* Cart / Auth / Language */}
                        <div className="flex min-w-max items-center justify-end gap-1 whitespace-nowrap xl:gap-2">
                            <Link href={l("/cart")} aria-label={t("nav.cartAria", "Cart")} className="relative inline-flex items-center gap-1 rounded-md px-2 py-2 text-[13px] font-medium text-neutral-700 transition-colors duration-150 hover:bg-orange-100 hover:text-[#1a4b8f] xl:gap-1.5 xl:px-3 xl:text-sm">
                                <ShoppingCart className="h-4 w-4" />
                                <span>{t("nav.cart", "Cart")}</span>
                                {totalItems > 0 && (
                                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#5b4fd4] px-1 text-[10px] font-bold text-white">
                                        {totalItems > 99 ? "99+" : totalItems}
                                    </span>
                                )}
                            </Link>

                            <button
                                type="button"
                                onClick={() => switchLocale(locale === "en" ? "zh" : locale === "zh" ? "ne" : "en")}
                                aria-label={t("nav.changeLanguageAria", "Change language")}
                                className="inline-flex items-center gap-1 rounded-md px-2 py-2 text-[13px] font-medium text-neutral-700 transition-colors duration-150 hover:bg-orange-100 xl:gap-1.5 xl:px-3 xl:text-sm"
                            >
                                <span className="relative h-4 w-6 overflow-hidden" style={{ borderRadius: "3px", boxShadow: "0 0 0 1px rgba(0,0,0,0.12)" }}>
                                    <Image src={FLAGS[locale] || FLAGS.en} alt={LABELS[locale] || "EN"} fill className="object-cover" sizes="24px" />
                                </span>
                                <span>{LABELS[locale] || "EN"}</span>
                            </button>

                            {!isLoggedIn ? (
                                <Link href={l("/auth/login")} className="inline-flex h-9 items-center gap-1.5 px-3 text-[13px] font-semibold text-white transition-all duration-150 xl:gap-2 xl:px-3.5 xl:text-sm" style={{ borderRadius: "7px", background: "linear-gradient(135deg, #1a4b8f 0%, #0f2a5e 100%)", boxShadow: "0 2px 8px rgba(26,75,143,0.30)", letterSpacing: "0.01em" }}>
                                    <LogIn className="h-3.5 w-3.5" />
                                    {t("nav.login", "Login")}
                                </Link>
                            ) : (
                                <div className="relative" ref={profileRef}>
                                    <button
                                        type="button"
                                        onClick={() => { setProfileOpen(v => !v); setServicesOpen(false); setGroceryOpen(false); setExpressOpen(false); }}
                                        className="inline-flex h-9 items-center gap-1.5 px-3 text-[13px] font-semibold text-white transition-all duration-150 xl:gap-2 xl:px-3.5 xl:text-sm"
                                        style={{ borderRadius: "7px", background: "linear-gradient(135deg, #1a4b8f 0%, #0f2a5e 100%)", boxShadow: "0 2px 8px rgba(26,75,143,0.30)", letterSpacing: "0.01em" }}
                                    >
                                        <User className="h-3.5 w-3.5" />
                                        <span className="max-w-[90px] truncate xl:max-w-[120px]">{displayName || t("nav.account", "My Account")}</span>
                                        <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200" style={{ transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
                                    </button>
                                    {profileOpen && (
                                        <div className="absolute right-0 z-40 mt-3 w-52 bg-orange-50 p-1.5" style={{ borderRadius: "10px", border: "1px solid #fed7aa", boxShadow: "0 8px 32px -4px rgba(26,75,143,0.14), 0 2px 8px -2px rgba(0,0,0,0.06)" }}>
                                            <Link href={l("/dashboard")} onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 rounded-[7px] px-3.5 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-orange-100 hover:text-[#1a4b8f]">
                                                <LayoutDashboard className="h-4 w-4" />
                                                {t("nav.dashboard", "Dashboard")}
                                            </Link>
                                            <Link href={`/${locale}/dashboard/security`} onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 rounded-[7px] px-3.5 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-orange-100 hover:text-[#1a4b8f]">
                                                <Settings className="h-4 w-4" />
                                                {t("nav.settings", "Settings")}
                                            </Link>
                                            <div className="my-1 border-t border-orange-200" />
                                            <button type="button" onClick={handleLogout} className="flex w-full items-center gap-2.5 rounded-[7px] px-3.5 py-2.5 text-left text-sm font-medium text-red-500 transition-colors hover:bg-red-50">
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

            {/* Mobile navbar */}
            <div className="bg-orange-50 lg:hidden">
                <div className="px-3 pb-2.5 pt-3">
                    <div className="flex items-center gap-2">
                        <Link href={l("/")} className="flex w-[58px] shrink-0 flex-col items-center justify-center leading-none">
                            <Image src="/logo.png" alt={t("nav.logo", "HkMandu")} width={38} height={38} className="h-9 w-auto object-contain" />
                            <span className="mt-0.5 font-bold uppercase tracking-widest" style={{ fontSize: "9px", color: "#1a4b8f", letterSpacing: "0.15em" }}>HkMandu</span>
                        </Link>

                        <form className="min-w-0 flex-1" onSubmit={(e) => handleSearchSubmit(e, mobileSearch)}>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={mobileSearch}
                                    onChange={(e) => setMobileSearch(e.target.value)}
                                    placeholder={t("nav.searchPlaceholder", "Search for an item")}
                                    maxLength={INPUT_LIMITS.search}
                                    className="h-10 w-full border bg-orange-50 pl-3.5 pr-10 text-sm text-neutral-800 outline-none focus:bg-orange-50"
                                    style={{ borderRadius: "6px", borderColor: "#fed7aa" }}
                                />
                                <button type="submit" aria-label={t("nav.searchAria", "Search")} className="absolute right-2.5 top-1/2 -translate-y-1/2" style={{ color: "#1a4b8f" }}>
                                    <Search className="h-4 w-4" />
                                </button>
                            </div>
                        </form>

                        <Link href={l("/cart")} className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center text-neutral-700" aria-label={t("nav.cartAria", "Cart")}>
                            <ShoppingCart className="h-5 w-5" />
                            {totalItems > 0 && (
                                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#5b4fd4] px-1 text-[9px] font-bold text-white">
                                    {totalItems > 99 ? "99+" : totalItems}
                                </span>
                            )}
                        </Link>

                        <button
                            type="button"
                            onClick={() => { setMobileOpen(v => !v); setServicesOpen(false); setGroceryOpen(false); setExpressOpen(false); }}
                            className="inline-flex h-10 w-10 shrink-0 items-center justify-center text-neutral-700"
                            aria-label={t("nav.openMenuAria", "Open menu")}
                        >
                            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile primary links (3 icons) */}
                <div className="border-y bg-orange-50" style={{ borderColor: "#fed7aa" }}>
                    <div className="grid grid-cols-3">
                        {mobilePrimaryLinks.map((item, idx) => {
                            const Icon = item.icon;
                            if (item.type === "scroll") {
                                return (
                                    <button key={item.label} type="button" onClick={scrollToPerfectServices} className="flex min-h-[72px] flex-col items-center justify-center gap-1.5 px-2 text-center transition-colors duration-150 hover:bg-orange-100" style={{ borderRight: idx !== 2 ? "1px solid #fed7aa" : "none" }}>
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: "rgba(26,75,143,0.09)" }}>
                                            <Icon className="h-4 w-4" style={{ color: "#1a4b8f" }} />
                                        </span>
                                        <span className="text-[12px] font-semibold" style={{ color: "#1a2f5e", letterSpacing: "0.01em" }}>{item.label}</span>
                                    </button>
                                );
                            }
                            return (
                                <Link key={item.label} href={item.href} onClick={() => closeMenus()} className="flex min-h-[72px] flex-col items-center justify-center gap-1.5 px-2 text-center transition-colors duration-150 hover:bg-orange-100" style={{ borderRight: idx !== 2 ? "1px solid #fed7aa" : "none" }}>
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: "rgba(26,75,143,0.09)" }}>
                                        <Icon className="h-4 w-4" style={{ color: "#1a4b8f" }} />
                                    </span>
                                    <span className="text-[12px] font-semibold" style={{ color: "#1a2f5e", letterSpacing: "0.01em" }}>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Mobile drawer */}
                {mobileOpen && (
                    <div ref={mobileDrawerRef} className="border-b bg-orange-50 px-3 py-4" style={{ borderColor: "#fed7aa" }}>
                        <div className="space-y-2">
                            {/* Express section */}
                            <div className="overflow-hidden rounded-xl border bg-orange-50" style={{ borderColor: "#fed7aa" }}>
                                <div className="flex items-center justify-between">
                                    <Link href={l("/ai-express")} onClick={() => { setMobileOpen(false); setExpressOpen(false); }} className="flex-1 px-4 py-3.5 text-sm font-semibold" style={{ color: "#1a2f5e" }}>
                                        {t("nav.aiExpress", "A Express")}
                                    </Link>
                                    <button type="button" onClick={() => { setExpressOpen(v => !v); setGroceryOpen(false); setServicesOpen(false); }} className="px-4 py-3.5" aria-label="Toggle express menu">
                                        <ChevronDown className="h-4 w-4 transition-transform duration-200" style={{ transform: expressOpen ? "rotate(180deg)" : "rotate(0deg)", color: "#1a4b8f" }} />
                                    </button>
                                </div>
                                {expressOpen && (
                                    <div className="border-t px-2 pb-2" style={{ borderColor: "#fed7aa" }}>
                                        {EXPRESS_LINKS.map(item => (
                                            <Link key={item.key} href={l(item.href)} onClick={() => { setExpressOpen(false); setMobileOpen(false); }} className="block rounded-lg px-3.5 py-2.5 text-sm transition-colors hover:bg-orange-100" style={{ color: "#374166", fontWeight: 450 }}>
                                                {t(`nav.express.${item.key}`, item.label)}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Grocery section with multi-language items */}
                            <div
                                className="overflow-hidden rounded-xl border bg-orange-50"
                                style={{
                                    borderColor: "#fed7aa",
                                }}
                            >
                                <div className="flex items-center justify-between">
                                    <Link
                                        href={groceryMainHref()}
                                        onClick={() => {
                                            setMobileOpen(false);
                                            setGroceryOpen(false);
                                        }}
                                        className="flex-1 px-4 py-3.5 text-sm font-semibold"
                                        style={{ color: "#1a2f5e" }}
                                    >
                                        {t("nav.organicMart", "A Grocery")}
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setGroceryOpen((v) => !v);
                                            setServicesOpen(false);
                                            setExpressOpen(false);
                                        }}
                                        className="px-4 py-3.5"
                                        aria-label="Toggle grocery menu"
                                    >
                                        <ChevronDown
                                            className="h-4 w-4 transition-transform duration-200"
                                            style={{
                                                transform: groceryOpen ? "rotate(180deg)" : "rotate(0deg)",
                                                color: "#1a4b8f",
                                            }}
                                        />
                                    </button>
                                </div>

                                {groceryOpen && (
                                    <div
                                        className="border-t px-2 pb-2"
                                        style={{ borderColor: "#fed7aa" }}
                                    >
                                        {/* Bulk Purchase (Free Delivery) */}
                                        <Link
                                            href={bulkPurchaseHref()}
                                            onClick={() => {
                                                setGroceryOpen(false);
                                                setExpressOpen(false);
                                                setServicesOpen(false);
                                                setMobileOpen(false);
                                            }}
                                            className="block rounded-lg px-3.5 py-2.5 text-sm font-semibold transition-colors hover:bg-orange-100"
                                            style={{ color: "#374166" }}
                                        >
                                            {t("nav.bulkPurchase", "Bulk Purchase (Free Delivery)")}
                                        </Link>

                                        <div className="my-1 border-t border-orange-200" />

                                        {/* BBQ & Delivery Services */}
                                        <Link
                                            href={bbqDeliveryHref()}
                                            onClick={() => {
                                                setGroceryOpen(false);
                                                setExpressOpen(false);
                                                setServicesOpen(false);
                                                setMobileOpen(false);
                                            }}
                                            className="block rounded-lg px-3.5 py-2.5 text-sm font-semibold transition-colors hover:bg-orange-100"
                                            style={{ color: "#374166" }}
                                        >
                                            {t("nav.bbqDelivery", "BBQ & Delivery Services")}
                                        </Link>

                                        <div className="my-1 border-t border-orange-200" />

                                        {/* Nepali Product (Made In Nepal) */}
                                        <Link
                                            href={nepaliProductHref()}
                                            onClick={() => {
                                                setGroceryOpen(false);
                                                setExpressOpen(false);
                                                setServicesOpen(false);
                                                setMobileOpen(false);
                                            }}
                                            className="block rounded-lg px-3.5 py-2.5 text-sm font-semibold transition-colors hover:bg-orange-100"
                                            style={{ color: "#374166" }}
                                        >
                                            {t("nav.nepaliProduct", "Nepali Product (Made In Nepal)")}
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Services section */}
                            <div className="overflow-hidden rounded-xl border bg-orange-50" style={{ borderColor: "#fed7aa" }}>
                                <button type="button" onClick={() => { setServicesOpen(v => !v); setGroceryOpen(false); setExpressOpen(false); }} className="flex w-full items-center justify-between px-4 py-3.5 text-sm font-semibold" style={{ color: "#1a2f5e" }}>
                                    <span>{t("nav.servicesTitle", "R Services")}</span>
                                    <ChevronDown className="h-4 w-4 transition-transform duration-200" style={{ transform: servicesOpen ? "rotate(180deg)" : "rotate(0deg)", color: "#1a4b8f" }} />
                                </button>
                                {servicesOpen && (
                                    <div className="border-t px-2 pb-2" style={{ borderColor: "#fed7aa" }}>
                                        {SERVICES.map(service => (
                                            <Link key={service.key} href={l(service.href)} onClick={() => { setServicesOpen(false); setMobileOpen(false); }} className="block rounded-lg px-3.5 py-2.5 text-sm transition-colors hover:bg-orange-100" style={{ color: "#374166", fontWeight: 450 }}>
                                                {t(`nav.services.${service.key}`, service.label)}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Auth / settings section */}
                            <div className="overflow-hidden rounded-xl border bg-orange-50" style={{ borderColor: "#fed7aa" }}>
                                {!isLoggedIn ? (
                                    <Link href={l("/auth/login")} onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold transition-colors hover:bg-orange-100" style={{ color: "#1a4b8f" }}>
                                        <LogIn className="h-4 w-4" />
                                        {t("nav.login", "Login")}
                                    </Link>
                                ) : (
                                    <>
                                        <Link href={l("/dashboard")} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 border-b px-4 py-3.5 text-sm font-medium transition-colors hover:bg-orange-100" style={{ borderColor: "#fed7aa", color: "#1a2f5e" }}>
                                            <LayoutDashboard className="h-4 w-4" style={{ color: "#1a4b8f" }} />
                                            {t("nav.dashboard", "Dashboard")}
                                        </Link>
                                        <Link href={`/${locale}/dashboard/security`} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 border-b px-4 py-3.5 text-sm font-medium transition-colors hover:bg-orange-100" style={{ borderColor: "#fed7aa", color: "#1a2f5e" }}>
                                            <Settings className="h-4 w-4" style={{ color: "#1a4b8f" }} />
                                            {t("nav.settings", "Settings")}
                                        </Link>
                                        <button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-sm font-medium transition-colors hover:bg-red-50" style={{ color: "#dc2626" }}>
                                            <LogOut className="h-4 w-4" />
                                            {t("nav.logout", "Logout")}
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Language picker */}
                            <div className="flex items-center justify-between rounded-xl border bg-orange-50 px-4 py-3.5" style={{ borderColor: "#fed7aa" }}>
                                <span className="text-sm font-semibold" style={{ color: "#1a2f5e" }}>{t("nav.language", "Language")}</span>
                                <div className="flex items-center gap-1.5">
                                    {LOCALES.map(lc => (
                                        <button key={lc} type="button" onClick={() => switchLocale(lc)} className="rounded-md px-2.5 py-1 text-xs font-semibold transition-all duration-150" style={lc === locale ? { background: "linear-gradient(135deg, #1a4b8f, #0f2a5e)", color: "white", boxShadow: "0 2px 6px rgba(26,75,143,0.3)" } : { background: "#ffedd5", color: "#374166" }}>
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
