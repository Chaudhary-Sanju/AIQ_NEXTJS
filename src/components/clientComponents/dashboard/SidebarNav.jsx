"use client";

import React, { useMemo } from "react";
import { tGet } from "./utils";

export default function SidebarNav({ dict, active, onChange }) {
    const items = useMemo(
        () => [
            { key: "profile", label: tGet(dict, "dashboard.tabs.profile", "Profile") },
            { key: "orders", label: tGet(dict, "dashboard.tabs.orders", "Orders") },
            { key: "addresses", label: tGet(dict, "dashboard.tabs.addresses", "Addresses") },
            { key: "security", label: tGet(dict, "dashboard.tabs.security", "Security") },
        ],
        [dict]
    );

    return (
        <div className="bg-white rounded-2xl shadow-sm p-3">
            {items.map((item) => (
                <button
                    key={item.key}
                    onClick={() => onChange(item.key)}
                    className={`w-full text-left px-4 py-3 rounded-xl font-medium transition
            ${active === item.key ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50 text-gray-800"}`}
                >
                    {item.label}
                </button>
            ))}
        </div>
    );
}
