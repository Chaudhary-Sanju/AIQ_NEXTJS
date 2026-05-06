"use client";

import React, { useMemo } from "react";
import {
    UserRound,
    ShoppingBag,
    Star,
    LockKeyhole,
    ChevronRight,
    BadgeCheck,
} from "lucide-react";
import { tGet } from "./utils";

export default function SidebarNav({ dict, active, onChange }) {
    const items = useMemo(
        () => [
            {
                key: "profile",
                label: tGet(dict, "dashboard.tabs.profile", "Profile"),
                desc: tGet(dict, "dashboard.tabsDesc.profile", "Personal details"),
                icon: UserRound,
            },
            {
                key: "orders",
                label: tGet(dict, "dashboard.tabs.orders", "Orders"),
                desc: tGet(dict, "dashboard.tabsDesc.orders", "Track purchases"),
                icon: ShoppingBag,
            },
            {
                key: "reviews",
                label: tGet(dict, "dashboard.tabs.reviews", "Reviews"),
                desc: tGet(dict, "dashboard.tabsDesc.reviews", "Manage feedback"),
                icon: Star,
            },
            {
                key: "security",
                label: tGet(dict, "dashboard.tabs.security", "Security"),
                desc: tGet(dict, "dashboard.tabsDesc.security", "Password settings"),
                icon: LockKeyhole,
            },
        ],
        [dict]
    );

    return (
        <nav className="overflow-hidden rounded-[28px] border border-orange-100 bg-white/95 p-3 shadow-[0_18px_45px_rgba(15,42,94,0.08)] backdrop-blur">
            <div className="mb-3 rounded-2xl bg-gradient-to-br from-orange-50 to-blue-50 p-4">
                <div className="flex items-center gap-2 text-sm font-bold text-neutral-950">
                    <BadgeCheck className="h-4 w-4 text-[#1a4b8f]" />
                    Account Menu
                </div>

                <p className="mt-1 text-xs leading-5 text-neutral-500">
                    Manage everything from your customer dashboard.
                </p>
            </div>

            <div className="space-y-2">
                {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = active === item.key;

                    return (
                        <button
                            key={item.key}
                            type="button"
                            onClick={() => onChange(item.key)}
                            className={[
                                "group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition",
                                isActive
                                    ? "bg-[#1a4b8f] text-white shadow-lg shadow-[#1a4b8f]/20"
                                    : "text-neutral-700 hover:bg-orange-50",
                            ].join(" ")}
                        >
                            <span
                                className={[
                                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition",
                                    isActive
                                        ? "bg-white/15 text-white"
                                        : "bg-orange-50 text-[#1a4b8f] group-hover:bg-white",
                                ].join(" ")}
                            >
                                <Icon className="h-5 w-5" />
                            </span>

                            <span className="min-w-0 flex-1">
                                <span className="block text-sm font-bold">
                                    {item.label}
                                </span>

                                <span
                                    className={[
                                        "mt-0.5 block text-xs",
                                        isActive ? "text-white/70" : "text-neutral-500",
                                    ].join(" ")}
                                >
                                    {item.desc}
                                </span>
                            </span>

                            <ChevronRight
                                className={[
                                    "h-4 w-4 shrink-0 transition",
                                    isActive
                                        ? "text-white"
                                        : "text-neutral-300 group-hover:translate-x-0.5 group-hover:text-[#1a4b8f]",
                                ].join(" ")}
                            />
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}