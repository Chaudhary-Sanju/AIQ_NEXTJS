"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import SidebarNav from "./SidebarNav";
import ProfilePanel from "./ProfilePanel";
import OrdersPanel from "./OrdersPanel";
import AddressesPanel from "./AddressesPanel";
import SecurityPanel from "./SecurityPanel";
import { LOCALES, tGet } from "./utils";

const VALID_TABS = ["profile", "orders", "addresses", "security"];

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
            subtitle: tGet(dict, "dashboard.subtitle", "Manage your profile and orders"),
        }),
        [dict]
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {T.title}
                    </h1>
                    <p className="text-gray-600 mt-1">{T.subtitle}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <aside className="lg:col-span-3">
                        <SidebarNav dict={dict} active={active} onChange={handleChange} />
                    </aside>

                    <main className="lg:col-span-9">
                        {active === "profile" && <ProfilePanel dict={dict} locale={locale} />}
                        {active === "orders" && <OrdersPanel dict={dict} locale={locale} />}
                        {active === "addresses" && <AddressesPanel dict={dict} locale={locale} />}
                        {active === "security" && <SecurityPanel dict={dict} locale={locale} />}
                    </main>
                </div>
            </div>
        </div>
    );
}