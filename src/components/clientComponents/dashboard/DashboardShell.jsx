"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    ShieldCheck,
    Sparkles,
    UserRound,
    ShoppingBag,
    Star,
    LockKeyhole,
} from "lucide-react";

import SidebarNav from "./SidebarNav";
import ProfilePanel from "./ProfilePanel";
import OrdersPanel from "./OrdersPanel";
import ReviewPanel from "./ReviewPanel";
import SecurityPanel from "./SecurityPanel";
import { LOCALES, tGet } from "./utils";

const VALID_TABS = ["profile", "orders", "reviews", "security"];

export default function DashboardShell({ dict, tab }) {
    const params = useParams();
    const router = useRouter();

    const locale = LOCALES.includes(params?.locale) ? params.locale : "en";
    const active = VALID_TABS.includes(tab) ? tab : "orders";

    const handleChange = (key) => {
        router.push(`/${locale}/dashboard/${key}`);
    };

    const T = useMemo(
        () => ({
            title: tGet(dict, "dashboard.title", "Dashboard"),
            subtitle: tGet(
                dict,
                "dashboard.subtitle",
                "Manage your profile, orders, reviews, and account security in one place."
            ),
            badge: tGet(dict, "dashboard.badge", "My Account"),
            welcome: tGet(dict, "dashboard.welcome", "Welcome to your HKMandu dashboard"),
        }),
        [dict]
    );

    const quickStats = [
        {
            key: "profile",
            label: tGet(dict, "dashboard.tabs.profile", "Profile"),
            icon: UserRound,
        },
        {
            key: "orders",
            label: tGet(dict, "dashboard.tabs.orders", "Orders"),
            icon: ShoppingBag,
        },
        {
            key: "reviews",
            label: tGet(dict, "dashboard.tabs.reviews", "Reviews"),
            icon: Star,
        },
        {
            key: "security",
            label: tGet(dict, "dashboard.tabs.security", "Security"),
            icon: LockKeyhole,
        },
    ];

    return (
        <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-white to-blue-50">
            <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />
            <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                {/* Header */}
                <section className="mb-6 overflow-hidden rounded-[32px] border border-orange-100 bg-white/95 shadow-[0_18px_45px_rgba(15,42,94,0.08)] backdrop-blur">
                    <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center lg:p-8">
                        <div>
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#1a4b8f] shadow-sm">
                                <LayoutDashboard className="h-4 w-4" />
                                {T.badge}
                            </div>

                            <h1 className="text-[30px] font-bold leading-tight tracking-tight text-neutral-950 sm:text-4xl lg:text-[44px]">
                                {T.title}
                            </h1>

                            <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base">
                                {T.subtitle}
                            </p>
                        </div>

                        <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#1a4b8f] via-[#0f2a5e] to-[#13295b] p-5 text-white shadow-[0_18px_45px_rgba(15,42,94,0.16)] sm:p-6 lg:w-[340px]">
                            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                            <div className="pointer-events-none absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-orange-300/20 blur-2xl" />

                            <div className="relative">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
                                    <Sparkles className="h-6 w-6 text-orange-100" />
                                </div>

                                <h2 className="text-lg font-bold">
                                    {T.welcome}
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-white/70">
                                    Track orders, manage reviews, update your profile, and keep your account secure.
                                </p>

                                <div className="mt-5 flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold backdrop-blur">
                                    <ShieldCheck className="h-4 w-4 text-orange-100" />
                                    Secure customer area
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile quick tabs */}
                    <div className="border-t border-orange-100 bg-orange-50/40 px-4 py-3 sm:px-6 lg:hidden">
                        <div className="no-scrollbar flex gap-2 overflow-x-auto">
                            {quickStats.map((item) => {
                                const Icon = item.icon;
                                const isActive = active === item.key;

                                return (
                                    <button
                                        key={item.key}
                                        type="button"
                                        onClick={() => handleChange(item.key)}
                                        className={[
                                            "flex shrink-0 items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-bold transition",
                                            isActive
                                                ? "border-[#1a4b8f] bg-[#1a4b8f] text-white shadow-lg shadow-[#1a4b8f]/20"
                                                : "border-orange-100 bg-white text-neutral-700 hover:border-orange-200 hover:bg-orange-50",
                                        ].join(" ")}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {item.label}
                                    </button>
                                );
                            })}
                        </div>

                        <style jsx>{`
                            .no-scrollbar::-webkit-scrollbar {
                                display: none;
                            }

                            .no-scrollbar {
                                -ms-overflow-style: none;
                                scrollbar-width: none;
                            }
                        `}</style>
                    </div>
                </section>

                {/* Body */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    <aside className="hidden lg:col-span-3 lg:block">
                        <div className="sticky top-24">
                            <SidebarNav
                                dict={dict}
                                active={active}
                                onChange={handleChange}
                            />
                        </div>
                    </aside>

                    <main className="lg:col-span-9">
                        {active === "profile" && (
                            <ProfilePanel dict={dict} locale={locale} />
                        )}

                        {active === "orders" && (
                            <OrdersPanel dict={dict} locale={locale} />
                        )}

                        {active === "reviews" && (
                            <ReviewPanel dict={dict} locale={locale} />
                        )}

                        {active === "security" && (
                            <SecurityPanel dict={dict} locale={locale} />
                        )}
                    </main>
                </div>
            </div>
        </main>
    );
}