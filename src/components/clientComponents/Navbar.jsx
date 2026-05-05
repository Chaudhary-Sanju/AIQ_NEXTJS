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

const LOCALES = ["en", "ne", "zh"];
const LABELS = { en: "EN", zh: "粵", ne: "NP" };
const FLAGS = { en: "/flags/gb.jpg", zh: "/flags/hk.jpg", ne: "/flags/np.png" };

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
        key: "homeOfficeServices",
        label: "Home & Office Services",
        href: "/services/home-office-services",
    },
];

export default function Navbar({ locale = "en", dict = {} }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [desktopSearch, setDesktopSearch] = useState("");
    const [mobileSearch, setMobileSearch] = useState("");

    const desktopServicesRef = useRef(null);
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
        setProfileOpen(false);
    };

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

                el.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });

                setTimeout(() => {
                    el.style.scrollMarginTop = originalMargin;
                }, 500);
            }, 50);
        }
    };

    const mobilePrimaryLinks = useMemo(
        () => [
            {
                label: t("nav.organicMart", "Organic Mart"),
                href: l("/"),
                icon: Package,
                type: "link",
            },
            {
                label: t("nav.aiExpress", "AI Express"),
                href: l("/ai-express"),
                icon: Sparkles,
                type: "link",
            },
            {
                label: t("nav.servicesTitle", "Perfect Services"),
                icon: Grid3x3,
                type: "scroll",
            },
        ],
        [locale, dict]
    );

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

    useEffect(() => {
        function onKeyDown(e) {
            if (e.key === "Escape") {
                closeMenus();
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
            className="w-full bg-white"
            style={{
                boxShadow:
                    "0 1px 0 #e5e7eb, 0 4px 16px -4px rgba(26,75,143,0.07)",
            }}
        >
            {/* Top contact bar: desktop only */}
            <div
                className="hidden xl:block"
                style={{
                    background:
                        "linear-gradient(90deg, #0f2a5e 0%, #1a4b8f 100%)",
                }}
            >
                <div className="mx-auto max-w-7xl px-4 lg:px-6">
                    <div
                        className="flex h-9 items-center justify-between"
                        style={{ fontSize: "11px", letterSpacing: "0.03em" }}
                    >
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
                                {
                                    key: "nav.terms",
                                    fallback: "Terms & Conditions",
                                    href: l("/terms"),
                                },
                                {
                                    key: "nav.privacy",
                                    fallback: "Privacy Policy",
                                    href: l("/privacy-policy"),
                                },
                            ].map((item, i, arr) => (
                                <span key={item.href} className="inline-flex items-center">
                                    <Link
                                        href={item.href}
                                        className="rounded px-2 py-0.5 transition-colors duration-150 hover:text-white"
                                        style={{ letterSpacing: "0.04em" }}
                                    >
                                        {t(item.key, item.fallback)}
                                    </Link>

                                    {i < arr.length - 1 && (
                                        <span className="text-white/25">|</span>
                                    )}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main desktop navbar */}
            <div className="hidden bg-blue-50 xl:block">
                <div className="mx-auto max-w-7xl px-4 lg:px-6">
                    <div className="grid h-[96px] grid-cols-[105px_minmax(280px,430px)_minmax(360px,1fr)_auto] items-center gap-4">
                        <Link
                            href={l("/")}
                            className="group flex flex-col items-center justify-center leading-none"
                        >
                            <Image
                                src="/logo.png"
                                alt={t("nav.logo", "HkMandu")}
                                width={48}
                                height={48}
                                className="h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
                            />

                            <span
                                className="mt-1 text-[12px] font-bold uppercase tracking-widest"
                                style={{
                                    color: "#1a4b8f",
                                    letterSpacing: "0.16em",
                                }}
                            >
                                HkMandu
                            </span>
                        </Link>

                        <form
                            className="w-full"
                            onSubmit={(e) => handleSearchSubmit(e, desktopSearch)}
                        >
                            <div className="relative">
                                <input
                                    type="text"
                                    value={desktopSearch}
                                    onChange={(e) => setDesktopSearch(e.target.value)}
                                    placeholder={t("nav.searchPlaceholder", "Search for an item")}
                                    className="h-11 w-full border bg-[#f8f9fc] pl-4 pr-12 text-sm text-neutral-800 outline-none transition-all duration-200 focus:bg-white"
                                    style={{
                                        borderRadius: "6px",
                                        borderColor: "#dde1ea",
                                        boxShadow: "inset 0 1px 2px rgba(0,0,0,0.04)",
                                    }}
                                />

                                <button
                                    type="submit"
                                    aria-label={t("nav.searchAria", "Search")}
                                    className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center rounded-r-md transition-colors duration-150 hover:text-white"
                                    style={{
                                        color: "#1a4b8f",
                                        borderRadius: "0 6px 6px 0",
                                    }}
                                >
                                    <Search className="h-4 w-4" />
                                </button>
                            </div>
                        </form>

                        <nav className="flex min-w-0 items-center justify-center gap-1 whitespace-nowrap">
                            {[
                                {
                                    href: l("/ai-express"),
                                    label: t("nav.aiExpress", "AI Express"),
                                },
                                {
                                    href: l("/"),
                                    label: t("nav.organicMart", "Organic Mart"),
                                },
                            ].map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="relative px-3 py-2 text-[14px] font-semibold text-neutral-700 transition-colors duration-150 hover:text-[#1a4b8f]"
                                    style={{ letterSpacing: "0.01em" }}
                                >
                                    {item.label}
                                </Link>
                            ))}

                            <span className="select-none px-1 text-neutral-300">|</span>

                            <div className="relative" ref={desktopServicesRef}>
                                <div className="flex items-center">
                                    <button
                                        type="button"
                                        onClick={scrollToPerfectServices}
                                        className="inline-flex items-center gap-1 px-3 py-2 text-[14px] font-semibold transition-colors duration-150 hover:text-[#1a4b8f]"
                                        style={{
                                            color: "#404040",
                                            letterSpacing: "0.01em",
                                        }}
                                    >
                                        {t("nav.servicesTitle", "Perfect Services")}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setServicesOpen((v) => !v);
                                            setProfileOpen(false);
                                        }}
                                        className="inline-flex items-center px-1 py-2 text-[14px] font-semibold transition-colors duration-150"
                                        style={{
                                            color: servicesOpen ? "#1a4b8f" : "#404040",
                                        }}
                                        aria-label="Toggle services menu"
                                    >
                                        <ChevronDown
                                            className="h-3.5 w-3.5 transition-transform duration-200"
                                            style={{
                                                transform: servicesOpen
                                                    ? "rotate(180deg)"
                                                    : "rotate(0deg)",
                                            }}
                                        />
                                    </button>
                                </div>

                                {servicesOpen && (
                                    <div
                                        className="absolute left-1/2 top-full z-30 mt-3 w-72 -translate-x-1/2 bg-white p-1.5"
                                        style={{
                                            borderRadius: "10px",
                                            border: "1px solid #e8ecf4",
                                            boxShadow:
                                                "0 8px 32px -4px rgba(26,75,143,0.14), 0 2px 8px -2px rgba(0,0,0,0.06)",
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

                        <div className="flex min-w-max items-center gap-2 whitespace-nowrap">
                            <Link
                                href={l("/cart")}
                                aria-label={t("nav.cartAria", "Cart")}
                                className="relative inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-neutral-700 transition-colors duration-150 hover:bg-[#f0f4fb] hover:text-[#1a4b8f]"
                            >
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
                                onClick={() =>
                                    switchLocale(
                                        locale === "en" ? "zh" : locale === "zh" ? "ne" : "en"
                                    )
                                }
                                aria-label={t("nav.changeLanguageAria", "Change language")}
                                className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-neutral-700 transition-colors duration-150 hover:bg-[#f0f4fb]"
                            >
                                <span
                                    className="relative h-4 w-6 overflow-hidden"
                                    style={{
                                        borderRadius: "3px",
                                        boxShadow: "0 0 0 1px rgba(0,0,0,0.12)",
                                    }}
                                >
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

                            {!isLoggedIn ? (
                                <Link
                                    href={l("/auth/login")}
                                    className="inline-flex h-9 items-center gap-2 px-3.5 text-sm font-semibold text-white transition-all duration-150"
                                    style={{
                                        borderRadius: "7px",
                                        background:
                                            "linear-gradient(135deg, #1a4b8f 0%, #0f2a5e 100%)",
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
                                        onClick={() => {
                                            setProfileOpen((v) => !v);
                                            setServicesOpen(false);
                                        }}
                                        className="inline-flex h-9 items-center gap-2 px-3.5 text-sm font-semibold text-white transition-all duration-150"
                                        style={{
                                            borderRadius: "7px",
                                            background:
                                                "linear-gradient(135deg, #1a4b8f 0%, #0f2a5e 100%)",
                                            boxShadow: "0 2px 8px rgba(26,75,143,0.30)",
                                            letterSpacing: "0.01em",
                                        }}
                                    >
                                        <User className="h-3.5 w-3.5" />
                                        <span className="max-w-[120px] truncate">
                                            {displayName || t("nav.account", "My Account")}
                                        </span>

                                        <ChevronDown
                                            className="h-3.5 w-3.5 transition-transform duration-200"
                                            style={{
                                                transform: profileOpen
                                                    ? "rotate(180deg)"
                                                    : "rotate(0deg)",
                                            }}
                                        />
                                    </button>

                                    {profileOpen && (
                                        <div
                                            className="absolute right-0 z-40 mt-3 w-52 bg-white p-1.5"
                                            style={{
                                                borderRadius: "10px",
                                                border: "1px solid #e8ecf4",
                                                boxShadow:
                                                    "0 8px 32px -4px rgba(26,75,143,0.14), 0 2px 8px -2px rgba(0,0,0,0.06)",
                                            }}
                                        >
                                            <Link
                                                href={l("/dashboard")}
                                                onClick={() => setProfileOpen(false)}
                                                className="flex items-center gap-2.5 rounded-[7px] px-3.5 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-[#f0f4fb] hover:text-[#1a4b8f]"
                                            >
                                                <LayoutDashboard className="h-4 w-4" />
                                                {t("nav.dashboard", "Dashboard")}
                                            </Link>

                                            <Link
                                                href={`/${locale}/dashboard/security`}
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

            {/* Mobile + tablet navbar */}
            <div className="xl:hidden">
                <div className="px-3 pb-2.5 pt-3">
                    <div className="flex items-center gap-2">
                        <Link
                            href={l("/")}
                            className="flex w-[58px] shrink-0 flex-col items-center justify-center leading-none"
                        >
                            <Image
                                src="/logo.png"
                                alt={t("nav.logo", "HkMandu")}
                                width={38}
                                height={38}
                                className="h-9 w-auto object-contain"
                            />

                            <span
                                className="mt-0.5 font-bold uppercase tracking-widest"
                                style={{
                                    fontSize: "9px",
                                    color: "#1a4b8f",
                                    letterSpacing: "0.15em",
                                }}
                            >
                                HkMandu
                            </span>
                        </Link>

                        <form
                            className="min-w-0 flex-1"
                            onSubmit={(e) => handleSearchSubmit(e, mobileSearch)}
                        >
                            <div className="relative">
                                <input
                                    type="text"
                                    value={mobileSearch}
                                    onChange={(e) => setMobileSearch(e.target.value)}
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

                        <Link
                            href={l("/cart")}
                            className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center text-neutral-700"
                            aria-label={t("nav.cartAria", "Cart")}
                        >
                            <ShoppingCart className="h-5 w-5" />

                            {totalItems > 0 && (
                                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#5b4fd4] px-1 text-[9px] font-bold text-white">
                                    {totalItems > 99 ? "99+" : totalItems}
                                </span>
                            )}
                        </Link>

                        <button
                            type="button"
                            onClick={() => {
                                setMobileOpen((v) => !v);
                                setServicesOpen(false);
                            }}
                            className="inline-flex h-10 w-10 shrink-0 items-center justify-center text-neutral-700"
                            aria-label={t("nav.openMenuAria", "Open menu")}
                        >
                            {mobileOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>

                <div
                    className="border-y"
                    style={{
                        background:
                            "linear-gradient(90deg, #f0f4fb 0%, #f8f9fc 100%)",
                        borderColor: "#e4eaf5",
                    }}
                >
                    <div className="grid grid-cols-3">
                        {mobilePrimaryLinks.map((item, idx) => {
                            const Icon = item.icon;

                            if (item.type === "scroll") {
                                return (
                                    <button
                                        key={item.label}
                                        type="button"
                                        onClick={scrollToPerfectServices}
                                        className="flex min-h-[72px] flex-col items-center justify-center gap-1.5 px-2 text-center transition-colors duration-150 hover:bg-[#e4eaf5]"
                                        style={{
                                            borderRight:
                                                idx !== 2 ? "1px solid #dde6f5" : "none",
                                        }}
                                    >
                                        <span
                                            className="flex h-8 w-8 items-center justify-center rounded-full"
                                            style={{ background: "rgba(26,75,143,0.09)" }}
                                        >
                                            <Icon
                                                className="h-4 w-4"
                                                style={{ color: "#1a4b8f" }}
                                            />
                                        </span>

                                        <span
                                            className="text-[12px] font-semibold"
                                            style={{
                                                color: "#1a2f5e",
                                                letterSpacing: "0.01em",
                                            }}
                                        >
                                            {item.label}
                                        </span>
                                    </button>
                                );
                            }

                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="flex min-h-[72px] flex-col items-center justify-center gap-1.5 px-2 text-center transition-colors duration-150 hover:bg-[#e4eaf5]"
                                    style={{
                                        borderRight:
                                            idx !== 2 ? "1px solid #dde6f5" : "none",
                                    }}
                                >
                                    <span
                                        className="flex h-8 w-8 items-center justify-center rounded-full"
                                        style={{ background: "rgba(26,75,143,0.09)" }}
                                    >
                                        <Icon
                                            className="h-4 w-4"
                                            style={{ color: "#1a4b8f" }}
                                        />
                                    </span>

                                    <span
                                        className="text-[12px] font-semibold"
                                        style={{
                                            color: "#1a2f5e",
                                            letterSpacing: "0.01em",
                                        }}
                                    >
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

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
                            <div
                                className="overflow-hidden rounded-xl border"
                                style={{
                                    borderColor: "#dde6f5",
                                    background: "white",
                                }}
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
                                        style={{
                                            transform: servicesOpen
                                                ? "rotate(180deg)"
                                                : "rotate(0deg)",
                                            color: "#1a4b8f",
                                        }}
                                    />
                                </button>

                                {servicesOpen && (
                                    <div
                                        className="border-t px-2 pb-2"
                                        style={{ borderColor: "#eef1f9" }}
                                    >
                                        {SERVICES.map((service) => (
                                            <Link
                                                key={service.key}
                                                href={l(service.href)}
                                                onClick={() => {
                                                    setServicesOpen(false);
                                                    setMobileOpen(false);
                                                }}
                                                className="block rounded-lg px-3.5 py-2.5 text-sm transition-colors hover:bg-[#f0f4fb]"
                                                style={{
                                                    color: "#374166",
                                                    fontWeight: 450,
                                                }}
                                            >
                                                {t(`nav.services.${service.key}`, service.label)}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div
                                className="overflow-hidden rounded-xl border"
                                style={{
                                    borderColor: "#dde6f5",
                                    background: "white",
                                }}
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
                                            href={l("/dashboard")}
                                            onClick={() => setMobileOpen(false)}
                                            className="flex items-center gap-3 border-b px-4 py-3.5 text-sm font-medium transition-colors hover:bg-[#f0f4fb]"
                                            style={{
                                                borderColor: "#eef1f9",
                                                color: "#1a2f5e",
                                            }}
                                        >
                                            <LayoutDashboard
                                                className="h-4 w-4"
                                                style={{ color: "#1a4b8f" }}
                                            />
                                            {t("nav.dashboard", "Dashboard")}
                                        </Link>

                                        <Link
                                            href={`/${locale}/dashboard/security`}
                                            onClick={() => setMobileOpen(false)}
                                            className="flex items-center gap-3 border-b px-4 py-3.5 text-sm font-medium transition-colors hover:bg-[#f0f4fb]"
                                            style={{
                                                borderColor: "#eef1f9",
                                                color: "#1a2f5e",
                                            }}
                                        >
                                            <Settings
                                                className="h-4 w-4"
                                                style={{ color: "#1a4b8f" }}
                                            />
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

                            <div
                                className="flex items-center justify-between rounded-xl border px-4 py-3.5"
                                style={{
                                    borderColor: "#dde6f5",
                                    background: "white",
                                }}
                            >
                                <span
                                    className="text-sm font-semibold"
                                    style={{ color: "#1a2f5e" }}
                                >
                                    {t("nav.language", "Language")}
                                </span>

                                <div className="flex items-center gap-1.5">
                                    {LOCALES.map((lc) => (
                                        <button
                                            key={lc}
                                            type="button"
                                            onClick={() => switchLocale(lc)}
                                            className="rounded-md px-2.5 py-1 text-xs font-semibold transition-all duration-150"
                                            style={
                                                lc === locale
                                                    ? {
                                                        background:
                                                            "linear-gradient(135deg, #1a4b8f, #0f2a5e)",
                                                        color: "white",
                                                        boxShadow:
                                                            "0 2px 6px rgba(26,75,143,0.3)",
                                                    }
                                                    : {
                                                        background: "#eef1f9",
                                                        color: "#374166",
                                                    }
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

            <div className="h-1 bg-[#c21f85]" />
        </header>
    );
}