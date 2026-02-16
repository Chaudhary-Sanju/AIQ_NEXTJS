"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import http from "@/http";

export default function AddCourierOrder() {
    const router = useRouter();

    const DELIVERY_TYPES = ["Door2Door", "Door2Branch", "Branch2Door", "Branch2Branch"];
    const HANDLING_TYPES = ["fragile", "nonFragile"];

    const PAYMENT_METHODS = ["Pay on Pickup", "Cash on Delivery"];
    const PAYMENT_STATUSES = ["Pending", "Partially Paid", "Paid"];

    const PHONE_REGEX =
        /^((\+977-?\d{10})|(\d{10})|(\+852-?[569]\d{7})|([569]\d{7}))$/;

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // locations
    const [pickupOptions, setPickupOptions] = useState([]); // [{en,ne,zh}]
    const [dropOptions, setDropOptions] = useState([]); // [{en,ne,zh}]
    const [loadingLocations, setLoadingLocations] = useState(true);

    // cost calc
    const [costLoading, setCostLoading] = useState(false);
    const [costInfo, setCostInfo] = useState(null);
    const [isCostManual, setIsCostManual] = useState(false);

    const lang = "en";
    const labelOf = (locObj) => locObj?.[lang] || locObj?.en || "";

    const [formData, setFormData] = useState({
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

        // payment fields
        paymentMethod: "Cash on Delivery",
        paymentStatus: "Pending",
        partiallyPaidAmount: "",

        remark: "",
        deliveryEta: "",
    });

    // Deduplicate helper
    const uniqueByEn = (arr) => {
        const map = new Map();
        for (const item of arr || []) {
            const en = item?.en?.trim();
            if (en && !map.has(en.toLowerCase())) map.set(en.toLowerCase(), item);
        }
        return Array.from(map.values());
    };

    // Fetch pickup & drop lists
    useEffect(() => {
        const run = async () => {
            setLoadingLocations(true);
            try {
                const [pickRes, dropRes] = await Promise.all([
                    http.get("/cms/courierCost/getAllPickupLocation"),
                    http.get("/cms/courierCost/getAllDropLocation"),
                ]);

                const pick = (pickRes?.data?.result || []).map((x) => x.locations).filter(Boolean);
                const drop = (dropRes?.data?.result || []).map((x) => x.locations).filter(Boolean);

                setPickupOptions(uniqueByEn(pick));
                setDropOptions(uniqueByEn(drop));
            } catch (e) {
                setErrors((prev) => ({
                    ...prev,
                    general: "Failed to load pickup/drop locations.",
                }));
            } finally {
                setLoadingLocations(false);
            }
        };

        run();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => {
            const next = { ...prev, [name]: value };

            // If user edits estimatedCost manually -> lock auto updates
            if (name === "estimatedCost") setIsCostManual(true);

            // Payment status behavior
            if (name === "paymentStatus") {
                if (value === "Paid") next.partiallyPaidAmount = "";
                if (value !== "Partially Paid") next.partiallyPaidAmount = "";
            }

            return next;
        });

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
        if (!isCostManual) {
            setFormData((prev) => ({ ...prev, estimatedCost: "" }));
        }

        if (!from || !to || from.toLowerCase() === to.toLowerCase()) return;

        const fetchCost = async () => {
            setCostLoading(true);
            try {
                const res = await http.get("/cms/courierCost/find", {
                    params: { from: from.toLowerCase(), to: to.toLowerCase() },
                });

                setCostInfo(res?.data?.data || null);
            } catch (e) {
                setCostInfo(null);
                setErrors((prev) => ({
                    ...prev,
                    general:
                        "No cost rule found for selected pickup/drop location. Please enter estimated cost manually.",
                }));
            } finally {
                setCostLoading(false);
            }
        };

        fetchCost();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.pickUpLocation, formData.dropLocation]);

    // Auto-fill estimatedCost when we can compute, unless user manually overridden
    useEffect(() => {
        if (isCostManual) return;
        if (computedCost == null) return;
        setFormData((prev) => ({ ...prev, estimatedCost: String(computedCost) }));
    }, [computedCost, isCostManual]);

    const validateForm = () => {
        const newErrors = {};

        // Sender
        if (!formData.senderName.trim()) newErrors.senderName = "senderName is required.";
        if (formData.senderEmail?.trim() && !isValidEmail(formData.senderEmail.trim())) {
            newErrors.senderEmail = "Email must be a valid email address.";
        }
        if (!formData.senderContact.trim()) newErrors.senderContact = "senderContact is required.";
        else if (!PHONE_REGEX.test(formData.senderContact.trim()))
            newErrors.senderContact = "Phone must be a valid Nepal (+977) or Hong Kong (+852) number.";

        // Pickup/Drop
        if (!formData.pickUpLocation.trim()) newErrors.pickUpLocation = "pickUpLocation is required.";
        if (!formData.dropLocation.trim()) newErrors.dropLocation = "dropLocation is required.";
        if (!formData.dropLandmark.trim()) newErrors.dropLandmark = "dropLandmark is required.";

        // Time
        if (!formData.pickUpTimeOrDate) newErrors.pickUpTimeOrDate = "pickUpTimeOrDate is required.";

        // KG
        if (formData.packageSize === "") newErrors.packageSize = "packageSize is required.";
        else if (Number.isNaN(Number(formData.packageSize)))
            newErrors.packageSize = "packageSize must be a number (wt in KG).";
        else if (Number(formData.packageSize) <= 0)
            newErrors.packageSize = "packageSize must be greater than 0.";

        // Cost
        if (formData.estimatedCost === "") newErrors.estimatedCost = "estimatedCost is required.";
        else if (Number.isNaN(Number(formData.estimatedCost)))
            newErrors.estimatedCost = "estimatedCost must be a number.";
        else if (Number(formData.estimatedCost) < 0) newErrors.estimatedCost = "estimatedCost must be >= 0.";

        // Receiver
        if (!formData.recieverName.trim()) newErrors.recieverName = "recieverName is required.";
        if (formData.recieverEmail?.trim() && !isValidEmail(formData.recieverEmail.trim())) {
            newErrors.recieverEmail = "Email must be a valid email address.";
        }
        if (!formData.recieverContact.trim()) newErrors.recieverContact = "recieverContact is required.";
        else if (!PHONE_REGEX.test(formData.recieverContact.trim()))
            newErrors.recieverContact = "Phone must be a valid Nepal (+977) or Hong Kong (+852) number.";

        // Payment validation
        if (!formData.paymentMethod) newErrors.paymentMethod = "paymentMethod is required.";
        if (!formData.paymentStatus) newErrors.paymentStatus = "paymentStatus is required.";

        if (formData.paymentStatus === "Partially Paid") {
            if (formData.partiallyPaidAmount === "")
                newErrors.partiallyPaidAmount = "partiallyPaidAmount is required when Partially Paid.";
            else if (Number.isNaN(Number(formData.partiallyPaidAmount)))
                newErrors.partiallyPaidAmount = "partiallyPaidAmount must be a number.";
            else if (Number(formData.partiallyPaidAmount) <= 0)
                newErrors.partiallyPaidAmount = "partiallyPaidAmount must be greater than 0.";
        }

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

                pickUpLocation: formData.pickUpLocation.trim(),
                pickupLandmark: formData.pickupLandmark.trim() || "",

                packageDescription: formData.packageDescription.trim() || "",
                deliveryType: formData.deliveryType,
                senderInstruction: formData.senderInstruction.trim() || "",
                Handling: formData.Handling,

                pickUpTimeOrDate: new Date(formData.pickUpTimeOrDate).toISOString(),

                estimatedCost: Number(formData.estimatedCost),
                packageSize: Number(formData.packageSize),

                recieverName: formData.recieverName.trim(),
                recieverEmail: formData.recieverEmail.trim() || "",
                recieverContact: formData.recieverContact.trim(),

                dropLocation: formData.dropLocation.trim(),
                dropLandmark: formData.dropLandmark.trim(),

                // payment
                paymentMethod: formData.paymentMethod,
                paymentStatus: formData.paymentStatus,
                partiallyPaidAmount:
                    formData.paymentStatus === "Partially Paid"
                        ? Number(formData.partiallyPaidAmount)
                        : null,

                remark: formData.remark?.trim() || "",
                deliveryEta: formData.deliveryEta?.trim() || "",
            };

            await http.post("/cms/courier", submitData);

            // Next.js navigation
            router.push("/courier");
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
                setErrors({ general: data?.message || "Something went wrong" });
            }
        } finally {
            setLoading(false);
        }
    };

    const resetCostOverride = () => {
        setIsCostManual(false);
        if (computedCost != null) {
            setFormData((prev) => ({ ...prev, estimatedCost: String(computedCost) }));
        }
    };

    const resetForm = () => {
        setIsCostManual(false);
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
            paymentStatus: "Pending",
            partiallyPaidAmount: "",

            remark: "",
            deliveryEta: "",
        });
        setErrors({});
    };

    const isPartialPaid = formData.paymentStatus === "Partially Paid";

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Add Courier Order</h1>
                    <p className="text-gray-600 mt-1">
                        Pickup/Drop dropdown + auto cost estimation + payment fields
                    </p>
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
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sender Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Sender Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="senderName"
                                        value={formData.senderName}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.senderName ? "border-red-300 bg-red-50" : "border-gray-300"
                                            }`}
                                    />
                                    {errors.senderName && (
                                        <p className="text-red-600 text-sm mt-1">{errors.senderName}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Sender Email (optional)
                                    </label>
                                    <input
                                        type="email"
                                        name="senderEmail"
                                        value={formData.senderEmail}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.senderEmail ? "border-red-300 bg-red-50" : "border-gray-300"
                                            }`}
                                    />
                                    {errors.senderEmail && (
                                        <p className="text-red-600 text-sm mt-1">{errors.senderEmail}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Sender Contact *
                                    </label>
                                    <input
                                        type="text"
                                        name="senderContact"
                                        value={formData.senderContact}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.senderContact ? "border-red-300 bg-red-50" : "border-gray-300"
                                            }`}
                                        placeholder="9800000000 or +977-9800000000"
                                    />
                                    {errors.senderContact && (
                                        <p className="text-red-600 text-sm mt-1">{errors.senderContact}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Pickup & Package */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pickup & Package</h3>

                            {loadingLocations ? (
                                <div className="text-sm text-gray-600">Loading pickup/drop locations...</div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Pickup Location *
                                        </label>
                                        <select
                                            name="pickUpLocation"
                                            value={formData.pickUpLocation}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.pickUpLocation ? "border-red-300 bg-red-50" : "border-gray-300"
                                                }`}
                                        >
                                            <option value="">Select pickup location</option>
                                            {pickupOptions.map((loc) => (
                                                <option key={loc.en} value={loc.en}>
                                                    {labelOf(loc)}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.pickUpLocation && (
                                            <p className="text-red-600 text-sm mt-1">{errors.pickUpLocation}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Pickup Landmark (optional)
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
                                            Package Description (optional)
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
                                            Delivery Type *
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
                                            Handling *
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
                                            Pickup Time/Date *
                                        </label>
                                        <input
                                            type="datetime-local"
                                            name="pickUpTimeOrDate"
                                            value={formData.pickUpTimeOrDate}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.pickUpTimeOrDate ? "border-red-300 bg-red-50" : "border-gray-300"
                                                }`}
                                        />
                                        {errors.pickUpTimeOrDate && (
                                            <p className="text-red-600 text-sm mt-1">{errors.pickUpTimeOrDate}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Package Size (KG) *
                                        </label>
                                        <input
                                            type="number"
                                            name="packageSize"
                                            value={formData.packageSize}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.packageSize ? "border-red-300 bg-red-50" : "border-gray-300"
                                                }`}
                                            placeholder="5"
                                        />
                                        {errors.packageSize && (
                                            <p className="text-red-600 text-sm mt-1">{errors.packageSize}</p>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Sender Instruction (optional)
                                        </label>
                                        <input
                                            type="text"
                                            name="senderInstruction"
                                            value={formData.senderInstruction}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            placeholder="Pack in waterproof bag"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Receiver & Drop */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Receiver & Drop</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Receiver Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="recieverName"
                                        value={formData.recieverName}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.recieverName ? "border-red-300 bg-red-50" : "border-gray-300"
                                            }`}
                                    />
                                    {errors.recieverName && (
                                        <p className="text-red-600 text-sm mt-1">{errors.recieverName}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Receiver Email (optional)
                                    </label>
                                    <input
                                        type="email"
                                        name="recieverEmail"
                                        value={formData.recieverEmail}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.recieverEmail ? "border-red-300 bg-red-50" : "border-gray-300"
                                            }`}
                                    />
                                    {errors.recieverEmail && (
                                        <p className="text-red-600 text-sm mt-1">{errors.recieverEmail}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Receiver Contact *
                                    </label>
                                    <input
                                        type="text"
                                        name="recieverContact"
                                        value={formData.recieverContact}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.recieverContact ? "border-red-300 bg-red-50" : "border-gray-300"
                                            }`}
                                    />
                                    {errors.recieverContact && (
                                        <p className="text-red-600 text-sm mt-1">{errors.recieverContact}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Drop Location *
                                    </label>
                                    <select
                                        name="dropLocation"
                                        value={formData.dropLocation}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.dropLocation ? "border-red-300 bg-red-50" : "border-gray-300"
                                            }`}
                                    >
                                        <option value="">Select drop location</option>
                                        {dropOptions.map((loc) => (
                                            <option key={loc.en} value={loc.en}>
                                                {labelOf(loc)}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.dropLocation && (
                                        <p className="text-red-600 text-sm mt-1">{errors.dropLocation}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Drop Landmark *
                                    </label>
                                    <input
                                        type="text"
                                        name="dropLandmark"
                                        value={formData.dropLandmark}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.dropLandmark ? "border-red-300 bg-red-50" : "border-gray-300"
                                            }`}
                                    />
                                    {errors.dropLandmark && (
                                        <p className="text-red-600 text-sm mt-1">{errors.dropLandmark}</p>
                                    )}
                                </div>

                                {/* Estimated Cost */}
                                <div className="md:col-span-2">
                                    <div className="flex items-center justify-between gap-3 mb-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Estimated Cost (NPR) *
                                        </label>

                                        <div className="flex items-center gap-2 text-sm">
                                            {costLoading ? (
                                                <span className="text-gray-500">Fetching rate...</span>
                                            ) : costInfo ? (
                                                <span className="text-green-700">
                                                    Rate loaded ({formData.Handling === "fragile" ? "Fragile" : "Non-fragile"})
                                                </span>
                                            ) : (
                                                <span className="text-gray-500">Select pickup + drop to auto-calc</span>
                                            )}

                                            {isCostManual && (
                                                <button
                                                    type="button"
                                                    onClick={resetCostOverride}
                                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                                >
                                                    Use Auto
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <input
                                        type="number"
                                        name="estimatedCost"
                                        value={formData.estimatedCost}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.estimatedCost ? "border-red-300 bg-red-50" : "border-gray-300"
                                            }`}
                                        placeholder="Auto-filled, but you can override"
                                    />
                                    {errors.estimatedCost && (
                                        <p className="text-red-600 text-sm mt-1">{errors.estimatedCost}</p>
                                    )}

                                    {costInfo && computedCost != null && !isCostManual && (
                                        <p className="text-sm text-gray-500 mt-2">
                                            Auto estimate: {computedCost} NPR (KG: {formData.packageSize || 0})
                                        </p>
                                    )}
                                    {isCostManual && (
                                        <p className="text-sm text-orange-600 mt-2">
                                            Manual override enabled. Click “Use Auto” to revert.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Payment */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Payment Method *
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
                                    {errors.paymentMethod && (
                                        <p className="text-red-600 text-sm mt-1">{errors.paymentMethod}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Payment Status *
                                    </label>
                                    <select
                                        name="paymentStatus"
                                        value={formData.paymentStatus}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.paymentStatus ? "border-red-300 bg-red-50" : "border-gray-300"
                                            }`}
                                    >
                                        {PAYMENT_STATUSES.map((s) => (
                                            <option key={s} value={s}>
                                                {s}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.paymentStatus && (
                                        <p className="text-red-600 text-sm mt-1">{errors.paymentStatus}</p>
                                    )}
                                </div>

                                {isPartialPaid && (
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Partially Paid Amount (NPR) *
                                        </label>
                                        <input
                                            type="number"
                                            name="partiallyPaidAmount"
                                            value={formData.partiallyPaidAmount}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.partiallyPaidAmount ? "border-red-300 bg-red-50" : "border-gray-300"
                                                }`}
                                            placeholder="100"
                                        />
                                        {errors.partiallyPaidAmount && (
                                            <p className="text-red-600 text-sm mt-1">{errors.partiallyPaidAmount}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="border-t pt-6">
                            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    disabled={loading}
                                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
                                >
                                    Reset
                                </button>

                                <Link
                                    href="/courier"
                                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors text-center"
                                >
                                    Cancel
                                </Link>

                                <button
                                    type="submit"
                                    disabled={loading || loadingLocations}
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        "Create Courier Order"
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                    <p className="text-sm text-blue-800">
                        • Pickup/Drop are loaded from CourierCost APIs • Estimated cost is auto-calculated from
                        rate + KG + handling • Payment fields added (Pending/Partially Paid/Paid)
                    </p>
                </div>
            </div>
        </div>
    );
}
