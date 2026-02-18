"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import http from "@/http";

const LOCALES = ["en", "ne", "zh"];

const tGet = (obj, path, fallback = "") => {
    try {
        return path.split(".").reduce((acc, k) => acc?.[k], obj) ?? fallback;
    } catch {
        return fallback;
    }
};

export default function AddCourierOrder({ dict }) {
    const router = useRouter();
    const params = useParams();

    const locale = LOCALES.includes(params?.locale) ? params.locale : "en";
    const l = (path) => `/${locale}${path.startsWith("/") ? path : `/${path}`}`;

    // ====== Translations (fallback safe) ======
    const T = {
        title: tGet(dict, "aiCourierCreate.title", "Add Courier Order"),
        subtitle: tGet(
            dict,
            "aiCourierCreate.subtitle",
            "Pickup/Drop dropdown + auto cost estimation + payment fields"
        ),

        sections: {
            sender: tGet(dict, "aiCourierCreate.sections.sender", "Sender Details"),
            pickup: tGet(dict, "aiCourierCreate.sections.pickup", "Pickup & Package"),
            receiver: tGet(dict, "aiCourierCreate.sections.receiver", "Receiver & Drop"),
            payment: tGet(dict, "aiCourierCreate.sections.payment", "Payment"),
        },

        fields: {
            senderName: tGet(dict, "aiCourierCreate.fields.senderName", "Sender Name"),
            senderEmail: tGet(dict, "aiCourierCreate.fields.senderEmail", "Sender Email (optional)"),
            senderContact: tGet(dict, "aiCourierCreate.fields.senderContact", "Sender Contact"),

            pickUpLocation: tGet(dict, "aiCourierCreate.fields.pickUpLocation", "Pickup Location"),
            pickupLandmark: tGet(dict, "aiCourierCreate.fields.pickupLandmark", "Pickup Landmark (optional)"),
            packageDescription: tGet(dict, "aiCourierCreate.fields.packageDescription", "Package Description (optional)"),
            deliveryType: tGet(dict, "aiCourierCreate.fields.deliveryType", "Delivery Type"),
            handling: tGet(dict, "aiCourierCreate.fields.handling", "Handling"),
            pickUpTimeOrDate: tGet(dict, "aiCourierCreate.fields.pickUpTimeOrDate", "Pickup Time/Date"),
            packageSize: tGet(dict, "aiCourierCreate.fields.packageSize", "Package Size (KG)"),
            senderInstruction: tGet(dict, "aiCourierCreate.fields.senderInstruction", "Sender Instruction (optional)"),

            recieverName: tGet(dict, "aiCourierCreate.fields.recieverName", "Receiver Name"),
            recieverEmail: tGet(dict, "aiCourierCreate.fields.recieverEmail", "Receiver Email (optional)"),
            recieverContact: tGet(dict, "aiCourierCreate.fields.recieverContact", "Receiver Contact"),
            dropLocation: tGet(dict, "aiCourierCreate.fields.dropLocation", "Drop Location"),
            dropLandmark: tGet(dict, "aiCourierCreate.fields.dropLandmark", "Drop Landmark"),

            estimatedCost: tGet(dict, "aiCourierCreate.fields.estimatedCost", "Estimated Cost"),
            paymentMethod: tGet(dict, "aiCourierCreate.fields.paymentMethod", "Payment Method"),
        },

        placeholders: {
            phone: tGet(dict, "aiCourierCreate.placeholders.phone", "9800000000 or +977-9800000000"),
            selectPickup: tGet(dict, "aiCourierCreate.placeholders.selectPickup", "Select pickup location"),
            selectDrop: tGet(dict, "aiCourierCreate.placeholders.selectDrop", "Select drop location"),
            kg: tGet(dict, "aiCourierCreate.placeholders.kg", "5"),
            instruction: tGet(dict, "aiCourierCreate.placeholders.instruction", "Pack in waterproof bag"),
            estimatedCost: tGet(
                dict,
                "aiCourierCreate.placeholders.estimatedCost",
                "This amount is auto-filled and subject to change upon staff confirmation."
            ),
        },

        buttons: {
            reset: tGet(dict, "aiCourierCreate.buttons.reset", "Reset"),
            placeOrder: tGet(dict, "aiCourierCreate.buttons.placeOrder", "Place Order"),
        },

        status: {
            loadingLocations: tGet(dict, "aiCourierCreate.status.loadingLocations", "Loading pickup/drop locations..."),
            fetchingRate: tGet(dict, "aiCourierCreate.status.fetchingRate", "Fetching rate..."),
            rateLoaded: tGet(dict, "aiCourierCreate.status.rateLoaded", "Rate loaded"),
            selectToAuto: tGet(dict, "aiCourierCreate.status.selectToAuto", "Select pickup + drop to auto-calc"),
            autoEstimate: tGet(dict, "aiCourierCreate.status.autoEstimate", "Auto estimate"),
        },

        errors: {
            loadFailed: tGet(dict, "aiCourierCreate.errors.loadFailed", "Failed to load pickup/drop locations."),
            costNotFound: tGet(
                dict,
                "aiCourierCreate.errors.costNotFound",
                "No cost rule found for selected pickup/drop location."
            ),
            generic: tGet(dict, "aiCourierCreate.errors.generic", "Something went wrong"),
        },
    };

    // ====== constants (keep same values backend expects) ======
    const DELIVERY_TYPES = ["Door2Door", "Door2Branch", "Branch2Door", "Branch2Branch"];
    const HANDLING_TYPES = ["fragile", "nonFragile"];
    const PAYMENT_METHODS = ["Pay on Pickup", "Cash on Delivery"];

    const PHONE_REGEX =
        /^((\+977-?\d{10})|(\d{10})|(\+852-?[569]\d{7})|([569]\d{7}))$/;

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [pickupOptions, setPickupOptions] = useState([]); // [{en,ne,zh}]
    const [dropOptions, setDropOptions] = useState([]); // [{en,ne,zh}]
    const [loadingLocations, setLoadingLocations] = useState(true);

    const [costLoading, setCostLoading] = useState(false);
    const [costInfo, setCostInfo] = useState(null);


    const pad2 = (n) => String(n).padStart(2, "0");

    // returns "YYYY-MM-DDTHH:mm" in local time (for datetime-local)
    const toLocalDateTimeValue = (date) => {
        const y = date.getFullYear();
        const m = pad2(date.getMonth() + 1);
        const d = pad2(date.getDate());
        const hh = pad2(date.getHours());
        const mm = pad2(date.getMinutes());
        return `${y}-${m}-${d}T${hh}:${mm}`;
    };

    const [minPickupDateTime, setMinPickupDateTime] = useState("");

    useEffect(() => {
        const now = new Date();
        const min = new Date(now.getTime() + 30 * 60 * 1000); // +30 min
        setMinPickupDateTime(toLocalDateTimeValue(min));
    }, []);



    // NOTE: keep form values for from/to as EN so your cost lookup always works
    const labelOf = (locObj) => locObj?.[locale] || locObj?.en || "";

    const [formData, setFormData] = useState({
        senderName: "",
        senderEmail: "",
        senderContact: "",

        pickUpLocation: "", // store EN label here (loc.en)
        pickupLandmark: "",

        packageDescription: "",
        deliveryType: "Branch2Branch",
        senderInstruction: "",
        Handling: "nonFragile",

        pickUpTimeOrDate: "",
        estimatedCost: "",
        packageSize: "",

        recieverName: "",
        recieverEmail: "",
        recieverContact: "",

        dropLocation: "", // store EN label here (loc.en)
        dropLandmark: "",

        paymentMethod: "Cash on Delivery",

        remark: "",
        deliveryEta: "",
    });

    const uniqueByEn = (arr) => {
        const map = new Map();
        for (const item of arr || []) {
            const en = item?.en?.trim();
            if (en && !map.has(en.toLowerCase())) map.set(en.toLowerCase(), item);
        }
        return Array.from(map.values());
    };

    // Fetch pickup & drop
    useEffect(() => {
        const run = async () => {
            setLoadingLocations(true);
            try {
                const [pickRes, dropRes] = await Promise.all([
                    http.get("/frontend/aiCourier/getAllPickupLocation"),
                    http.get("/frontend/aiCourier/getAllDropLocation"),
                ]);

                const pick = (pickRes?.data?.result || []).map((x) => x.locations).filter(Boolean);
                const drop = (dropRes?.data?.result || []).map((x) => x.locations).filter(Boolean);

                setPickupOptions(uniqueByEn(pick));
                setDropOptions(uniqueByEn(drop));
            } catch {
                setErrors((prev) => ({ ...prev, general: T.errors.loadFailed }));
            } finally {
                setLoadingLocations(false);
            }
        };

        run();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));

        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
        if (errors.general) setErrors((prev) => ({ ...prev, general: "" }));
    };

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // compute estimated cost from costInfo + packageSize + handling
    const computedCost = useMemo(() => {
        if (!costInfo) return null;

        const kg = Number(formData.packageSize);
        if (!kg || Number.isNaN(kg) || kg <= 0) return null;

        const isFragile = formData.Handling === "fragile";

        const basePerKg = isFragile
            ? Number(costInfo.fragileEstimatedCostPerKG)
            : Number(costInfo.nonFragileEstimatedCostPerKG);

        const additionalPerKg = isFragile
            ? Number(costInfo.perKgAdditionalFragileCost)
            : Number(costInfo.perKgAdditionalNonFragileCost);

        if ([basePerKg, additionalPerKg].some((n) => Number.isNaN(n))) return null;

        const total = basePerKg + Math.max(0, kg - 1) * additionalPerKg;
        return Math.round(total);
    }, [costInfo, formData.packageSize, formData.Handling]);

    // Fetch cost row when from/to changes
    useEffect(() => {
        const from = formData.pickUpLocation?.trim();
        const to = formData.dropLocation?.trim();

        setCostInfo(null);
        setFormData((prev) => ({ ...prev, estimatedCost: "" }));

        if (!from || !to || from.toLowerCase() === to.toLowerCase()) return;

        const fetchCost = async () => {
            setCostLoading(true);
            try {
                const res = await http.get("/frontend/aiCourier/find", {
                    params: { from: from.toLowerCase(), to: to.toLowerCase() },
                });
                setCostInfo(res?.data?.data || null);
            } catch {
                setCostInfo(null);
                setErrors((prev) => ({ ...prev, general: T.errors.costNotFound }));
            } finally {
                setCostLoading(false);
            }
        };

        fetchCost();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.pickUpLocation, formData.dropLocation]);

    // Auto-fill estimatedCost
    useEffect(() => {
        if (computedCost == null) return;
        setFormData((prev) => ({ ...prev, estimatedCost: String(computedCost) }));
    }, [computedCost]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.senderName.trim()) newErrors.senderName = "senderName is required.";
        if (formData.senderEmail?.trim() && !isValidEmail(formData.senderEmail.trim())) {
            newErrors.senderEmail = "Email must be a valid email address.";
        }
        if (!formData.senderContact.trim()) newErrors.senderContact = "senderContact is required.";
        else if (!PHONE_REGEX.test(formData.senderContact.trim()))
            newErrors.senderContact = "Phone must be a valid Nepal (+977) or Hong Kong (+852) number.";

        if (!formData.pickUpLocation.trim()) newErrors.pickUpLocation = "pickUpLocation is required.";
        if (!formData.dropLocation.trim()) newErrors.dropLocation = "dropLocation is required.";
        if (!formData.dropLandmark.trim()) newErrors.dropLandmark = "dropLandmark is required.";

        if (!formData.pickUpTimeOrDate) {
            newErrors.pickUpTimeOrDate = "pickUpTimeOrDate is required.";
        } else {
            const selected = new Date(formData.pickUpTimeOrDate);
            const minAllowed = new Date(Date.now() + 30 * 60 * 1000);

            if (Number.isNaN(selected.getTime())) {
                newErrors.pickUpTimeOrDate = "Invalid date/time.";
            } else if (selected < minAllowed) {
                newErrors.pickUpTimeOrDate = "Pickup time must be at least 30 minutes from now.";
            }
        }

        if (formData.packageSize === "") newErrors.packageSize = "packageSize is required.";
        else if (Number.isNaN(Number(formData.packageSize)))
            newErrors.packageSize = "packageSize must be a number (wt in KG).";
        else if (Number(formData.packageSize) <= 0)
            newErrors.packageSize = "packageSize must be greater than 0.";

        if (formData.estimatedCost === "") newErrors.estimatedCost = "estimatedCost is required.";
        else if (Number.isNaN(Number(formData.estimatedCost)))
            newErrors.estimatedCost = "estimatedCost must be a number.";

        if (!formData.recieverName.trim()) newErrors.recieverName = "recieverName is required.";
        if (formData.recieverEmail?.trim() && !isValidEmail(formData.recieverEmail.trim())) {
            newErrors.recieverEmail = "Email must be a valid email address.";
        }
        if (!formData.recieverContact.trim()) newErrors.recieverContact = "recieverContact is required.";
        else if (!PHONE_REGEX.test(formData.recieverContact.trim()))
            newErrors.recieverContact = "Phone must be a valid Nepal (+977) or Hong Kong (+852) number.";

        if (!formData.paymentMethod) newErrors.paymentMethod = "paymentMethod is required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        if (!validateForm()) return;

        setLoading(true);
        setErrors({});

        try {
            const submitData = {
                senderName: formData.senderName.trim(),
                senderEmail: formData.senderEmail.trim() || "",
                senderContact: formData.senderContact.trim(),

                pickUpLocation: formData.pickUpLocation.trim(), // EN
                pickupLandmark: formData.pickupLandmark?.trim() || "",

                packageDescription: formData.packageDescription?.trim() || "",
                deliveryType: formData.deliveryType,
                senderInstruction: formData.senderInstruction?.trim() || "",
                Handling: formData.Handling,

                pickUpTimeOrDate: new Date(formData.pickUpTimeOrDate).toISOString(),

                estimatedCost: Number(formData.estimatedCost),
                packageSize: Number(formData.packageSize),

                recieverName: formData.recieverName.trim(),
                recieverEmail: formData.recieverEmail.trim() || "",
                recieverContact: formData.recieverContact.trim(),

                dropLocation: formData.dropLocation.trim(), // EN
                dropLandmark: formData.dropLandmark.trim(),

                paymentMethod: formData.paymentMethod,

                remark: formData.remark?.trim() || "",
                deliveryEta: formData.deliveryEta?.trim() || "",
            };

            await http.post("/frontend/aiCourier/placeOrderByLoggedInUser", submitData);

            router.push(l("/"));
            router.refresh();
        } catch (err) {
            const status = err?.response?.status;
            const data = err?.response?.data;

            if (status === 422 || typeof data?.message === "object") {
                const fieldErrors = data?.message || {};
                const cleaned = {};
                for (const k in fieldErrors) cleaned[k] = String(fieldErrors[k]).replace(/"/g, "");
                setErrors(cleaned);
            } else {
                setErrors({ general: data?.message || T.errors.generic });
            }
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setCostInfo(null);
        setFormData({
            senderName: "",
            senderEmail: "",
            senderContact: "",
            pickUpLocation: "",
            pickupLandmark: "",
            packageDescription: "",
            deliveryType: "Branch2Branch",
            senderInstruction: "",
            Handling: "nonFragile",
            pickUpTimeOrDate: "",
            estimatedCost: "",
            packageSize: "",
            recieverName: "",
            recieverEmail: "",
            recieverContact: "",
            dropLocation: "",
            dropLandmark: "",
            paymentMethod: "Cash on Delivery",
            remark: "",
            deliveryEta: "",
        });
        setErrors({});
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">{T.title}</h1>
                    <p className="text-gray-600 mt-1">{T.subtitle}</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    {errors.general && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <span className="text-red-700">{errors.general}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Sender */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">{T.sections.sender}</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {T.fields.senderName} *
                                    </label>
                                    <input
                                        type="text"
                                        name="senderName"
                                        value={formData.senderName}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.senderName ? "border-red-300 bg-red-50" : "border-gray-300"
                                            }`}
                                    />
                                    {errors.senderName && <p className="text-red-600 text-sm mt-1">{errors.senderName}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {T.fields.senderEmail}
                                    </label>
                                    <input
                                        type="email"
                                        name="senderEmail"
                                        value={formData.senderEmail}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.senderEmail ? "border-red-300 bg-red-50" : "border-gray-300"
                                            }`}
                                    />
                                    {errors.senderEmail && <p className="text-red-600 text-sm mt-1">{errors.senderEmail}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {T.fields.senderContact} *
                                    </label>
                                    <input
                                        type="text"
                                        name="senderContact"
                                        value={formData.senderContact}
                                        onChange={handleChange}
                                        placeholder={T.placeholders.phone}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.senderContact ? "border-red-300 bg-red-50" : "border-gray-300"
                                            }`}
                                    />
                                    {errors.senderContact && <p className="text-red-600 text-sm mt-1">{errors.senderContact}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Pickup & Package */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">{T.sections.pickup}</h3>

                            {loadingLocations ? (
                                <div className="text-sm text-gray-600">{T.status.loadingLocations}</div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {T.fields.pickUpLocation} *
                                        </label>
                                        <select
                                            name="pickUpLocation"
                                            value={formData.pickUpLocation}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.pickUpLocation ? "border-red-300 bg-red-50" : "border-gray-300"
                                                }`}
                                        >
                                            <option value="">{T.placeholders.selectPickup}</option>
                                            {pickupOptions.map((loc) => (
                                                <option key={loc.en} value={loc.en}>
                                                    {labelOf(loc)}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.pickUpLocation && <p className="text-red-600 text-sm mt-1">{errors.pickUpLocation}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {T.fields.pickupLandmark}
                                        </label>
                                        <input
                                            type="text"
                                            name="pickupLandmark"
                                            value={formData.pickupLandmark}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {T.fields.packageDescription}
                                        </label>
                                        <input
                                            type="text"
                                            name="packageDescription"
                                            value={formData.packageDescription}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {T.fields.deliveryType} *
                                        </label>
                                        <select
                                            name="deliveryType"
                                            value={formData.deliveryType}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        >
                                            {DELIVERY_TYPES.map((t) => (
                                                <option key={t} value={t}>
                                                    {t}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {T.fields.handling} *
                                        </label>
                                        <select
                                            name="Handling"
                                            value={formData.Handling}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        >
                                            {HANDLING_TYPES.map((t) => (
                                                <option key={t} value={t}>
                                                    {t}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {T.fields.pickUpTimeOrDate} *
                                        </label>
                                        <input
                                            type="datetime-local"
                                            name="pickUpTimeOrDate"
                                            value={formData.pickUpTimeOrDate}
                                            onChange={handleChange}
                                            min={minPickupDateTime}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.pickUpTimeOrDate ? "border-red-300 bg-red-50" : "border-gray-300"
                                                }`}
                                        />

                                        {errors.pickUpTimeOrDate && <p className="text-red-600 text-sm mt-1">{errors.pickUpTimeOrDate}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {T.fields.packageSize} *
                                        </label>
                                        <input
                                            type="number"
                                            name="packageSize"
                                            value={formData.packageSize}
                                            onChange={handleChange}
                                            placeholder={T.placeholders.kg}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.packageSize ? "border-red-300 bg-red-50" : "border-gray-300"
                                                }`}
                                        />
                                        {errors.packageSize && <p className="text-red-600 text-sm mt-1">{errors.packageSize}</p>}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {T.fields.senderInstruction}
                                        </label>
                                        <input
                                            type="text"
                                            name="senderInstruction"
                                            value={formData.senderInstruction}
                                            onChange={handleChange}
                                            placeholder={T.placeholders.instruction}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Receiver & Drop */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">{T.sections.receiver}</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {T.fields.recieverName} *
                                    </label>
                                    <input
                                        type="text"
                                        name="recieverName"
                                        value={formData.recieverName}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.recieverName ? "border-red-300 bg-red-50" : "border-gray-300"
                                            }`}
                                    />
                                    {errors.recieverName && <p className="text-red-600 text-sm mt-1">{errors.recieverName}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {T.fields.recieverEmail}
                                    </label>
                                    <input
                                        type="email"
                                        name="recieverEmail"
                                        value={formData.recieverEmail}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.recieverEmail ? "border-red-300 bg-red-50" : "border-gray-300"
                                            }`}
                                    />
                                    {errors.recieverEmail && <p className="text-red-600 text-sm mt-1">{errors.recieverEmail}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {T.fields.recieverContact} *
                                    </label>
                                    <input
                                        type="text"
                                        name="recieverContact"
                                        value={formData.recieverContact}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.recieverContact ? "border-red-300 bg-red-50" : "border-gray-300"
                                            }`}
                                    />
                                    {errors.recieverContact && <p className="text-red-600 text-sm mt-1">{errors.recieverContact}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {T.fields.dropLocation} *
                                    </label>
                                    <select
                                        name="dropLocation"
                                        value={formData.dropLocation}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.dropLocation ? "border-red-300 bg-red-50" : "border-gray-300"
                                            }`}
                                    >
                                        <option value="">{T.placeholders.selectDrop}</option>
                                        {dropOptions.map((loc) => (
                                            <option key={loc.en} value={loc.en}>
                                                {labelOf(loc)}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.dropLocation && <p className="text-red-600 text-sm mt-1">{errors.dropLocation}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {T.fields.dropLandmark} *
                                    </label>
                                    <input
                                        type="text"
                                        name="dropLandmark"
                                        value={formData.dropLandmark}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.dropLandmark ? "border-red-300 bg-red-50" : "border-gray-300"
                                            }`}
                                    />
                                    {errors.dropLandmark && <p className="text-red-600 text-sm mt-1">{errors.dropLandmark}</p>}
                                </div>

                                {/* Estimated Cost */}
                                <div className="md:col-span-2">
                                    <div className="flex items-center justify-between gap-3 mb-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            {T.fields.estimatedCost} *
                                        </label>

                                        <div className="flex items-center gap-2 text-sm">
                                            {costLoading ? (
                                                <span className="text-gray-500">{T.status.fetchingRate}</span>
                                            ) : costInfo ? (
                                                <span className="text-green-700">
                                                    {T.status.rateLoaded} ({formData.Handling === "fragile" ? "Fragile" : "Non-fragile"})
                                                </span>
                                            ) : (
                                                <span className="text-gray-500">{T.status.selectToAuto}</span>
                                            )}
                                        </div>
                                    </div>

                                    <input
                                        type="number"
                                        name="estimatedCost"
                                        value={formData.estimatedCost}
                                        onChange={handleChange}
                                        disabled
                                        placeholder={T.placeholders.estimatedCost}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.estimatedCost ? "border-red-300 bg-red-50" : "border-gray-300"
                                            }`}
                                    />

                                    {costInfo && computedCost != null && (
                                        <p className="text-sm text-gray-500 mt-2">
                                            {T.status.autoEstimate}: {computedCost} NPR (KG: {formData.packageSize || 0})
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Payment */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">{T.sections.payment}</h3>

                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {T.fields.paymentMethod} *
                                    </label>
                                    <select
                                        name="paymentMethod"
                                        value={formData.paymentMethod}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.paymentMethod ? "border-red-300 bg-red-50" : "border-gray-300"
                                            }`}
                                    >
                                        {PAYMENT_METHODS.map((m) => (
                                            <option key={m} value={m}>
                                                {m}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.paymentMethod && <p className="text-red-600 text-sm mt-1">{errors.paymentMethod}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-6">
                            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    disabled={loading}
                                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
                                >
                                    {T.buttons.reset}
                                </button>

                                <button
                                    type="submit"
                                    disabled={loading || loadingLocations}
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ...
                                        </>
                                    ) : (
                                        T.buttons.placeOrder
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                    <p className="text-sm text-blue-800">
                        • Pickup/Drop are loaded from APIs • Estimated cost is auto-calculated from rate + KG + handling.
                    </p>
                </div>
            </div>
        </div>
    );
}
