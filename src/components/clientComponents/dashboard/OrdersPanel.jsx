"use client";

import React, { Fragment, useEffect, useMemo, useState } from "react";
import {
    AlertCircle,
    BadgeCheck,
    ChevronLeft,
    ChevronRight,
    Eye,
    Loader2,
    PackageCheck,
    RefreshCw,
    Search,
    ShoppingBag,
    SlidersHorizontal,
    Star,
    X,
} from "lucide-react";
import http from "@/http";
import OrderDrawer from "./OrderDrawer";
import { tGet } from "./utils";

const STATUS = [
    "all",
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
];

const SORT_OPTIONS = [
    { label: "Newest First", sortBy: "createdAt", sortOrder: "desc" },
    { label: "Oldest First", sortBy: "createdAt", sortOrder: "asc" },
    { label: "Highest Total", sortBy: "total", sortOrder: "desc" },
    { label: "Lowest Total", sortBy: "total", sortOrder: "asc" },
];

const safeStr = (v) => (v == null ? "" : String(v));
const lower = (v) => safeStr(v).toLowerCase();

function getOrderKey(o) {
    return o?.orderNumber || o?._id || o?.id;
}

function formatDateTime(v) {
    if (!v) return "";
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return safeStr(v);
    return d.toLocaleString();
}

function money(value) {
    return `HK$ ${Number(value || 0).toLocaleString("en-HK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

function parseProductNameString(value) {
    if (!value || typeof value !== "string") return null;

    const result = {};
    const enMatch = value.match(/en\s*:\s*['"`]([^'"`]*)['"`]/);
    const neMatch = value.match(/ne\s*:\s*['"`]([^'"`]*)['"`]/);
    const zhMatch = value.match(/zh\s*:\s*['"`]([^'"`]*)['"`]/);

    if (enMatch?.[1]) result.en = enMatch[1].trim();
    if (neMatch?.[1]) result.ne = neMatch[1].trim();
    if (zhMatch?.[1]) result.zh = zhMatch[1].trim();

    return Object.keys(result).length ? result : null;
}

function productName(product, locale = "en") {
    if (!product) return "";

    if (typeof product === "string") {
        const parsed = parseProductNameString(product);

        if (parsed) {
            return parsed?.[locale] || parsed?.en || parsed?.ne || parsed?.zh || "Product";
        }

        return product;
    }

    const name = product?.name;

    if (typeof name === "string") {
        const parsed = parseProductNameString(name);

        if (parsed) {
            return parsed?.[locale] || parsed?.en || parsed?.ne || parsed?.zh || "Product";
        }

        return name;
    }

    return name?.[locale] || name?.en || name?.ne || name?.zh || "Product";
}

function ReviewModal({ open, onClose, reviewTarget, onSubmitted }) {
    const existingReview = reviewTarget?.existingReview || null;
    const isEdit = !!existingReview?._id;

    const [rating, setRating] = useState(5);
    const [review, setReview] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [err, setErr] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (open) {
            setRating(existingReview?.rating || 5);
            setReview(existingReview?.review || "");
            setErr("");
            setSuccess("");
        }
    }, [open, existingReview]);

    if (!open) return null;

    const submitReview = async (e) => {
        e.preventDefault();

        setSubmitting(true);
        setErr("");
        setSuccess("");

        try {
            if (isEdit) {
                await http.patch(`/frontend/martReview/my/${existingReview._id}`, {
                    rating,
                    review,
                });

                setSuccess("Review updated successfully. Waiting for approval again.");
            } else {
                await http.post("/frontend/martReview/", {
                    product_id: reviewTarget?.productID,
                    order_id: reviewTarget?.orderId,
                    rating,
                    review,
                });

                setSuccess("Review submitted successfully. Waiting for approval.");
            }

            await onSubmitted?.();

            setTimeout(() => {
                onClose();
            }, 800);
        } catch (error) {
            setErr(error?.response?.data?.message || "Unable to submit review.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
            <div className="w-full max-w-lg overflow-hidden rounded-[28px] border border-orange-100 bg-white shadow-[0_24px_70px_rgba(15,42,94,0.20)]">
                <div className="flex items-start justify-between border-b border-orange-100 bg-gradient-to-br from-white to-orange-50/60 px-6 py-5">
                    <div>
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#1a4b8f]">
                            <Star className="h-3.5 w-3.5" />
                            Product Review
                        </div>

                        <h3 className="text-xl font-bold text-neutral-950">
                            {isEdit ? "Update Review" : "Add Review"}
                        </h3>

                        <p className="mt-1 text-sm text-neutral-500">
                            {reviewTarget?.product || "Product"}
                        </p>

                        {isEdit && (
                            <span
                                className={[
                                    "mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold",
                                    existingReview?.approved
                                        ? "bg-green-100 text-green-700"
                                        : "bg-yellow-100 text-yellow-700",
                                ].join(" ")}
                            >
                                {existingReview?.approved ? "Approved" : "Waiting for approval"}
                            </span>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-neutral-400 transition hover:bg-orange-50 hover:text-neutral-700"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={submitReview} className="space-y-5 px-6 py-5">
                    {err && <AlertBox type="error" text={err} />}
                    {success && <AlertBox type="success" text={success} />}

                    <div>
                        <label className="mb-2 block text-sm font-bold text-neutral-800">
                            Rating
                        </label>

                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className={[
                                        "h-11 w-11 rounded-2xl border text-lg font-bold transition",
                                        rating >= star
                                            ? "border-yellow-300 bg-yellow-50 text-yellow-500"
                                            : "border-orange-100 bg-white text-neutral-300 hover:bg-orange-50",
                                    ].join(" ")}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-bold text-neutral-800">
                            Review
                        </label>

                        <textarea
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            required
                            minLength={3}
                            rows={5}
                            placeholder="Write your experience about this product..."
                            className="w-full resize-none rounded-2xl border border-orange-100 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-[#1a4b8f] focus:ring-4 focus:ring-[#1a4b8f]/10"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-2xl border border-orange-200 bg-white px-5 py-3 text-sm font-bold text-neutral-700 transition hover:bg-orange-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center gap-2 rounded-2xl bg-[#1a4b8f] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#1a4b8f]/20 transition hover:bg-[#0f2a5e] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                            {submitting
                                ? isEdit
                                    ? "Updating..."
                                    : "Submitting..."
                                : isEdit
                                    ? "Update Review"
                                    : "Submit Review"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function OrdersPanel({ dict, locale = "en" }) {
    const T = useMemo(
        () => ({
            title: tGet(dict, "dashboard.orders.title", "My Orders"),
            search: tGet(dict, "dashboard.orders.search", "Search by order number / address"),
            empty: tGet(dict, "dashboard.orders.empty", "No orders found."),
            view: tGet(dict, "dashboard.orders.view", "View"),
            refresh: tGet(dict, "dashboard.orders.refresh", "Refresh"),
            loading: tGet(dict, "common.loading", "Loading..."),
            error: tGet(dict, "common.error", "Something went wrong."),
            all: tGet(dict, "dashboard.orders.statusAll", "All"),
            table: {
                order: tGet(dict, "dashboard.orders.table.order", "Order"),
                route: tGet(dict, "dashboard.orders.table.route", "Delivery Address"),
                cost: tGet(dict, "dashboard.orders.table.cost", "Total"),
                status: tGet(dict, "dashboard.orders.table.status", "Status"),
                action: tGet(dict, "dashboard.orders.table.action", "Action"),
            },
            statusText: {
                pending: tGet(dict, "dashboard.orders.statuses.pending", "Pending"),
                confirmed: tGet(dict, "dashboard.orders.statuses.confirmed", "Confirmed"),
                processing: tGet(dict, "dashboard.orders.statuses.processing", "Processing"),
                shipped: tGet(dict, "dashboard.orders.statuses.shipped", "Shipped"),
                delivered: tGet(dict, "dashboard.orders.statuses.delivered", "Delivered"),
                cancelled: tGet(dict, "dashboard.orders.statuses.cancelled", "Cancelled"),
            },
        }),
        [dict]
    );

    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const [orders, setOrders] = useState([]);

    const [q, setQ] = useState("");
    const [debouncedQ, setDebouncedQ] = useState("");
    const [status, setStatus] = useState("all");
    const [sort, setSort] = useState(SORT_OPTIONS[0]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);

    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 5,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
    });

    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [reviewTarget, setReviewTarget] = useState(null);

    const [reviewMap, setReviewMap] = useState({});
    const [reviewLoadingMap, setReviewLoadingMap] = useState({});

    const getReviewKey = (orderId, productId) => `${orderId}_${productId}`;

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQ(q.trim());
            setPage(1);
        }, 400);

        return () => clearTimeout(timer);
    }, [q]);

    const loadOrderProductReviews = async (orderList = []) => {
        const deliveredOrders = orderList.filter(
            (order) => lower(order?.status) === "delivered"
        );

        if (!deliveredOrders.length) {
            setReviewMap({});
            setReviewLoadingMap({});
            return;
        }

        const loadingMap = {};

        deliveredOrders.forEach((order) => {
            (order?.items || []).forEach((item) => {
                const orderId = order?._id;
                const productId = item?.productID?._id || item?.productID;

                if (!orderId || !productId) return;

                loadingMap[getReviewKey(orderId, productId)] = true;
            });
        });

        setReviewLoadingMap(loadingMap);

        const resultMap = {};

        await Promise.all(
            deliveredOrders.map(async (order) => {
                try {
                    const res = await http.get("/frontend/martReview/my/order-reviews", {
                        params: { order_id: order?._id },
                    });

                    const reviews = Array.isArray(res?.data?.data)
                        ? res.data.data
                        : [];

                    reviews.forEach((review) => {
                        const productId = review?.product_id?._id || review?.product_id;
                        if (!productId) return;

                        resultMap[getReviewKey(order?._id, productId)] = review;
                    });
                } catch {
                    // keep empty
                }
            })
        );

        setReviewMap(resultMap);
        setReviewLoadingMap({});
    };

    const loadOrders = async () => {
        setLoading(true);
        setErr("");

        try {
            const params = {
                page,
                limit,
                search: debouncedQ,
                sortBy: sort.sortBy,
                sortOrder: sort.sortOrder,
            };

            if (status !== "all") params.status = status;

            const res = await http.get("/frontend/order/my-orders", { params });

            const orderList = Array.isArray(res?.data?.data) ? res.data.data : [];

            setOrders(orderList);

            setPagination(
                res?.data?.pagination || {
                    total: 0,
                    page,
                    limit,
                    totalPages: 1,
                    hasNextPage: false,
                    hasPrevPage: false,
                }
            );

            await loadOrderProductReviews(orderList);
        } catch (error) {
            setErr(error?.response?.data?.message || T.error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, limit, debouncedQ, status, sort]);

    const openReviewModal = (order, item) => {
        const productID = item?.productID?._id || item?.productID;
        const key = getReviewKey(order?._id, productID);
        const existingReview = reviewMap[key] || null;

        const translatedProductName =
            productName(existingReview?.product_id, locale) ||
            productName(item?.product, locale) ||
            "Product";

        setReviewTarget({
            orderId: order?._id,
            orderNumber: order?.orderNumber,
            productID,
            product: translatedProductName,
            existingReview,
        });

        setReviewModalOpen(true);
    };

    const statusPill = (sRaw) => {
        const s = lower(sRaw).replaceAll(" ", "_") || "pending";

        const base =
            "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold capitalize";

        if (s === "delivered") return `${base} bg-green-100 text-green-700`;
        if (s === "cancelled") return `${base} bg-red-100 text-red-700`;
        if (s === "shipped") return `${base} bg-blue-100 text-blue-700`;
        if (s === "processing") return `${base} bg-cyan-100 text-cyan-700`;
        if (s === "confirmed") return `${base} bg-indigo-100 text-indigo-700`;

        return `${base} bg-orange-100 text-orange-700`;
    };

    const statusLabel = (sRaw) => {
        const s = lower(sRaw).replaceAll(" ", "_") || "pending";
        return T.statusText[s] || safeStr(sRaw || "Pending");
    };

    return (
        <>
            <section className="overflow-hidden rounded-[28px] border border-orange-100 bg-white/95 shadow-[0_18px_45px_rgba(15,42,94,0.08)] backdrop-blur">
                <div className="border-b border-orange-100 bg-gradient-to-br from-white to-orange-50/60 px-5 py-6 sm:px-6">
                    <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#1a4b8f]">
                                <ShoppingBag className="h-4 w-4" />
                                Orders
                            </div>

                            <h2 className="text-2xl font-bold tracking-tight text-neutral-950">
                                {T.title}
                            </h2>

                            <p className="mt-1 text-sm leading-6 text-neutral-500">
                                Track purchases, delivery progress, payments, and product reviews.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={loadOrders}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-orange-200 bg-white px-4 text-sm font-bold text-[#1a4b8f] transition hover:bg-orange-50"
                        >
                            <RefreshCw className="h-4 w-4" />
                            {T.refresh}
                        </button>
                    </div>

                    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_190px]">
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder={T.search}
                                className="h-12 w-full rounded-2xl border border-orange-100 bg-white pl-11 pr-4 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-[#1a4b8f] focus:ring-4 focus:ring-[#1a4b8f]/10"
                            />
                        </div>

                        <select
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value);
                                setPage(1);
                            }}
                            className="h-12 rounded-2xl border border-orange-100 bg-white px-4 text-sm text-neutral-900 outline-none transition focus:border-[#1a4b8f] focus:ring-4 focus:ring-[#1a4b8f]/10"
                        >
                            <option value="all">{T.all}</option>
                            {STATUS.filter((s) => s !== "all").map((s) => (
                                <option key={s} value={s}>
                                    {statusLabel(s)}
                                </option>
                            ))}
                        </select>

                        <div className="relative">
                            <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

                            <select
                                value={`${sort.sortBy}-${sort.sortOrder}`}
                                onChange={(e) => {
                                    const selected = SORT_OPTIONS.find(
                                        (item) =>
                                            `${item.sortBy}-${item.sortOrder}` ===
                                            e.target.value
                                    );

                                    setSort(selected || SORT_OPTIONS[0]);
                                    setPage(1);
                                }}
                                className="h-12 w-full appearance-none rounded-2xl border border-orange-100 bg-white pl-11 pr-4 text-sm text-neutral-900 outline-none transition focus:border-[#1a4b8f] focus:ring-4 focus:ring-[#1a4b8f]/10"
                            >
                                {SORT_OPTIONS.map((item) => (
                                    <option
                                        key={`${item.sortBy}-${item.sortOrder}`}
                                        value={`${item.sortBy}-${item.sortOrder}`}
                                    >
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {err && (
                    <div className="mx-5 mt-5 sm:mx-6">
                        <AlertBox type="error" text={err} />
                    </div>
                )}

                {loading ? (
                    <OrdersSkeleton text={T.loading} />
                ) : orders.length === 0 ? (
                    <EmptyState text={T.empty} />
                ) : (
                    <>
                        <div className="hidden overflow-x-auto lg:block">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b border-orange-100 bg-orange-50/40 text-left text-xs font-bold uppercase tracking-wider text-neutral-500">
                                        <th className="px-6 py-4">{T.table.order}</th>
                                        <th className="px-6 py-4">{T.table.route}</th>
                                        <th className="px-6 py-4">{T.table.cost}</th>
                                        <th className="px-6 py-4">{T.table.status}</th>
                                        <th className="px-6 py-4 text-right">{T.table.action}</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-orange-100">
                                    {orders.map((o) => (
                                        <Fragment key={getOrderKey(o)}>
                                            <OrderTableRow
                                                order={o}
                                                T={T}
                                                money={money}
                                                formatDateTime={formatDateTime}
                                                statusPill={statusPill}
                                                statusLabel={statusLabel}
                                                onView={() => setSelectedOrderId(o?._id)}
                                            />

                                            {lower(o?.status) === "delivered" && (
                                                <ReviewTableRow
                                                    order={o}
                                                    locale={locale}
                                                    reviewMap={reviewMap}
                                                    reviewLoadingMap={reviewLoadingMap}
                                                    getReviewKey={getReviewKey}
                                                    openReviewModal={openReviewModal}
                                                />
                                            )}
                                        </Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="space-y-4 p-5 lg:hidden">
                            {orders.map((o) => (
                                <OrderMobileCard
                                    key={getOrderKey(o)}
                                    order={o}
                                    T={T}
                                    locale={locale}
                                    money={money}
                                    formatDateTime={formatDateTime}
                                    statusPill={statusPill}
                                    statusLabel={statusLabel}
                                    onView={() => setSelectedOrderId(o?._id)}
                                    reviewMap={reviewMap}
                                    reviewLoadingMap={reviewLoadingMap}
                                    getReviewKey={getReviewKey}
                                    openReviewModal={openReviewModal}
                                />
                            ))}
                        </div>

                        <Pagination
                            pagination={pagination}
                            limit={limit}
                            setLimit={setLimit}
                            setPage={setPage}
                            label="orders"
                        />
                    </>
                )}
            </section>

            <OrderDrawer
                dict={dict}
                locale={locale}
                orderId={selectedOrderId}
                onClose={() => setSelectedOrderId(null)}
            />

            <ReviewModal
                open={reviewModalOpen}
                reviewTarget={reviewTarget}
                onClose={() => {
                    setReviewModalOpen(false);
                    setReviewTarget(null);
                }}
                onSubmitted={loadOrders}
            />
        </>
    );
}

function OrderTableRow({
    order,
    T,
    money,
    formatDateTime,
    statusPill,
    statusLabel,
    onView,
}) {
    return (
        <tr className="text-sm transition hover:bg-orange-50/30">
            <td className="px-6 py-4">
                <div className="font-bold text-neutral-950">
                    {order?.orderNumber || order?._id}
                </div>

                <div className="mt-1 text-xs text-neutral-500">
                    {formatDateTime(order?.createdAt || order?.orderDate)}
                </div>

                <div className="mt-1 text-xs text-neutral-500">
                    {order?.items?.length || 0} item(s)
                </div>
            </td>

            <td className="px-6 py-4">
                <div className="font-semibold text-neutral-950">
                    {order?.cityDistrict || order?.deliveryZone?.name || "-"}
                </div>

                <div className="mt-1 max-w-[230px] text-xs leading-5 text-neutral-500">
                    {order?.address || "-"}
                </div>

                {order?.deliveryZone?.estimatedDeliveryDays && (
                    <div className="mt-1 text-xs text-neutral-500">
                        Delivery: {order.deliveryZone.estimatedDeliveryDays.min}-
                        {order.deliveryZone.estimatedDeliveryDays.max} days
                    </div>
                )}
            </td>

            <td className="px-6 py-4">
                <div className="font-bold text-[#1a4b8f]">
                    {money(order?.total)}
                </div>

                <div className="mt-1 text-xs text-neutral-500">
                    Subtotal: {money(order?.subtotal)}
                </div>

                <div className="text-xs text-neutral-500">
                    Delivery: {money(order?.deliveryCharge)}
                </div>

                {Number(order?.discountAmount || 0) > 0 && (
                    <div className="mt-1 text-xs font-bold text-green-600">
                        Coupon {order?.appliedCoupon?.code || ""}: -{" "}
                        {money(order?.discountAmount)}
                    </div>
                )}
            </td>

            <td className="px-6 py-4">
                <span className={statusPill(order?.status)}>
                    {statusLabel(order?.status)}
                </span>

                <div className="mt-2 text-xs text-neutral-500">
                    Payment: {order?.paymentStatus || "-"}
                </div>

                <div className="mt-1 text-xs capitalize text-neutral-500">
                    Method: {order?.paymentMethod || "-"}
                </div>
            </td>

            <td className="px-6 py-4 text-right">
                <button
                    type="button"
                    onClick={onView}
                    className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-white px-4 py-2 text-sm font-bold text-[#1a4b8f] transition hover:bg-orange-50"
                >
                    <Eye className="h-4 w-4" />
                    {T.view}
                </button>
            </td>
        </tr>
    );
}

function ReviewTableRow({
    order,
    locale,
    reviewMap,
    reviewLoadingMap,
    getReviewKey,
    openReviewModal,
}) {
    return (
        <tr>
            <td colSpan={5} className="bg-orange-50/30 px-6 py-5">
                <div className="mb-4 flex items-center gap-2">
                    <Star className="h-4 w-4 text-[#1a4b8f]" />
                    <p className="text-sm font-bold text-neutral-950">
                        Review delivered products
                    </p>
                </div>

                <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white">
                    {(order?.items || []).map((item, index) => {
                        const productId = item?.productID?._id || item?.productID;
                        const reviewKey = getReviewKey(order?._id, productId);
                        const existingReview = reviewMap[reviewKey];
                        const isReviewLoading = reviewLoadingMap[reviewKey];

                        const displayProductName =
                            productName(existingReview?.product_id, locale) ||
                            productName(item?.product, locale) ||
                            "Product";

                        return (
                            <ReviewProductRow
                                key={`${productId || index}-${index}`}
                                item={item}
                                displayProductName={displayProductName}
                                existingReview={existingReview}
                                isReviewLoading={isReviewLoading}
                                productId={productId}
                                onClick={() => openReviewModal(order, item)}
                            />
                        );
                    })}
                </div>
            </td>
        </tr>
    );
}

function ReviewProductRow({
    item,
    displayProductName,
    existingReview,
    isReviewLoading,
    productId,
    onClick,
}) {
    return (
        <div className="border-b border-orange-100 p-4 last:border-b-0">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-bold text-neutral-950">
                            {displayProductName}
                        </p>

                        {existingReview && (
                            <span
                                className={[
                                    "rounded-full px-2.5 py-1 text-xs font-bold",
                                    existingReview?.approved
                                        ? "bg-green-100 text-green-700"
                                        : "bg-yellow-100 text-yellow-700",
                                ].join(" ")}
                            >
                                {existingReview?.approved ? "Approved" : "Pending"}
                            </span>
                        )}
                    </div>

                    <p className="mt-1 text-xs text-neutral-500">
                        Qty: {item?.qty || 1} · {money(item?.price)}
                    </p>

                    {isReviewLoading ? (
                        <div className="mt-2 text-xs text-neutral-400">
                            Checking review...
                        </div>
                    ) : existingReview ? (
                        <div className="mt-3">
                            <div className="flex items-center gap-1 text-sm text-yellow-500">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span key={star}>
                                        {existingReview?.rating >= star ? "★" : "☆"}
                                    </span>
                                ))}
                            </div>

                            <p className="mt-1 text-sm leading-6 text-neutral-700">
                                {existingReview?.review}
                            </p>

                            <p className="mt-1 text-xs text-neutral-500">
                                Status:{" "}
                                <span
                                    className={
                                        existingReview?.approved
                                            ? "font-bold text-green-600"
                                            : "font-bold text-yellow-600"
                                    }
                                >
                                    {existingReview?.approved
                                        ? "Approved by admin"
                                        : "Waiting for admin approval"}
                                </span>
                            </p>
                        </div>
                    ) : (
                        <p className="mt-2 text-xs text-neutral-500">
                            You have not reviewed this product yet.
                        </p>
                    )}
                </div>

                <button
                    type="button"
                    disabled={!productId}
                    onClick={onClick}
                    className="inline-flex h-10 items-center justify-center rounded-xl bg-[#1a4b8f] px-4 text-xs font-bold text-white transition hover:bg-[#0f2a5e] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {existingReview ? "Update Review" : "Add Review"}
                </button>
            </div>
        </div>
    );
}

function OrderMobileCard({
    order,
    T,
    locale,
    money,
    formatDateTime,
    statusPill,
    statusLabel,
    onView,
    reviewMap,
    reviewLoadingMap,
    getReviewKey,
    openReviewModal,
}) {
    return (
        <article className="rounded-[24px] border border-orange-100 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-bold text-neutral-950">
                        {order?.orderNumber || order?._id}
                    </p>

                    <p className="mt-1 text-xs text-neutral-500">
                        {formatDateTime(order?.createdAt || order?.orderDate)}
                    </p>
                </div>

                <span className={statusPill(order?.status)}>
                    {statusLabel(order?.status)}
                </span>
            </div>

            <div className="mt-4 grid gap-3 rounded-2xl bg-orange-50/50 p-4 text-sm">
                <InfoMini label="Address" value={order?.address || "-"} />
                <InfoMini label="District" value={order?.cityDistrict || order?.deliveryZone?.name || "-"} />
                <InfoMini label="Total" value={money(order?.total)} strong />
                <InfoMini label="Payment" value={order?.paymentStatus || "-"} />
            </div>

            <button
                type="button"
                onClick={onView}
                className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[#1a4b8f] text-sm font-bold text-white transition hover:bg-[#0f2a5e]"
            >
                <Eye className="h-4 w-4" />
                {T.view}
            </button>

            {lower(order?.status) === "delivered" && (
                <div className="mt-4 rounded-2xl border border-orange-100 bg-orange-50/40 p-4">
                    <p className="mb-3 flex items-center gap-2 text-sm font-bold text-neutral-950">
                        <Star className="h-4 w-4 text-[#1a4b8f]" />
                        Review delivered products
                    </p>

                    <div className="space-y-3">
                        {(order?.items || []).map((item, index) => {
                            const productId = item?.productID?._id || item?.productID;
                            const reviewKey = getReviewKey(order?._id, productId);
                            const existingReview = reviewMap[reviewKey];
                            const isReviewLoading = reviewLoadingMap[reviewKey];

                            const displayProductName =
                                productName(existingReview?.product_id, locale) ||
                                productName(item?.product, locale) ||
                                "Product";

                            return (
                                <ReviewProductRow
                                    key={`${productId || index}-${index}`}
                                    item={item}
                                    displayProductName={displayProductName}
                                    existingReview={existingReview}
                                    isReviewLoading={isReviewLoading}
                                    productId={productId}
                                    onClick={() => openReviewModal(order, item)}
                                />
                            );
                        })}
                    </div>
                </div>
            )}
        </article>
    );
}

function InfoMini({ label, value, strong = false }) {
    return (
        <div className="flex justify-between gap-3">
            <span className="text-neutral-500">{label}</span>
            <span
                className={[
                    "text-right font-semibold",
                    strong ? "text-[#1a4b8f]" : "text-neutral-800",
                ].join(" ")}
            >
                {value}
            </span>
        </div>
    );
}

function Pagination({ pagination, limit, setLimit, setPage, label }) {
    return (
        <div className="flex flex-col gap-3 border-t border-orange-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="text-sm font-medium text-neutral-500">
                Page {pagination.page} of {pagination.totalPages} ·{" "}
                {pagination.total} {label}
            </div>

            <div className="flex items-center gap-2">
                <select
                    value={limit}
                    onChange={(e) => {
                        setLimit(Number(e.target.value));
                        setPage(1);
                    }}
                    className="h-10 rounded-xl border border-orange-100 bg-white px-3 text-sm outline-none focus:border-[#1a4b8f] focus:ring-4 focus:ring-[#1a4b8f]/10"
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>

                <button
                    type="button"
                    disabled={!pagination.hasPrevPage}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    className="inline-flex h-10 items-center gap-1 rounded-xl border border-orange-200 bg-white px-3 text-sm font-bold text-neutral-700 transition hover:text-[#1a4b8f] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Prev
                </button>

                <button
                    type="button"
                    disabled={!pagination.hasNextPage}
                    onClick={() => setPage((prev) => prev + 1)}
                    className="inline-flex h-10 items-center gap-1 rounded-xl border border-orange-200 bg-white px-3 text-sm font-bold text-neutral-700 transition hover:text-[#1a4b8f] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Next
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

function OrdersSkeleton({ text }) {
    return (
        <div className="p-6">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-neutral-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                {text}
            </div>

            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="h-24 animate-pulse rounded-2xl border border-orange-100 bg-orange-50/40"
                    />
                ))}
            </div>
        </div>
    );
}

function EmptyState({ text }) {
    return (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-[#1a4b8f]">
                <PackageCheck className="h-8 w-8" />
            </div>
            <p className="text-sm font-semibold text-neutral-500">{text}</p>
        </div>
    );
}

function AlertBox({ type, text }) {
    const isError = type === "error";

    return (
        <div
            className={[
                "flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm font-medium",
                isError
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-green-200 bg-green-50 text-green-700",
            ].join(" ")}
        >
            {isError ? (
                <AlertCircle className="mt-0.5 h-5 w-5" />
            ) : (
                <BadgeCheck className="mt-0.5 h-5 w-5" />
            )}
            <span>{text}</span>
        </div>
    );
}