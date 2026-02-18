"use client";

import React from "react";
import { tGet } from "./utils";

export default function AddressesPanel({ dict }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900">
                {tGet(dict, "dashboard.tabs.addresses", "Addresses")}
            </h2>
            <p className="text-gray-600 mt-2">
                {tGet(dict, "dashboard.addresses.coming", "Coming next: saved pickup/drop addresses.")}
            </p>
        </div>
    );
}
