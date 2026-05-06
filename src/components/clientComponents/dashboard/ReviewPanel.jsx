"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
    AlertCircle,
    BadgeCheck,
    ChevronLeft,
    ChevronRight,
    Edit3,
    Loader2,
    PackageCheck,
    RefreshCw,
    Search,
    Star,
    X,
} from "lucide-react";
import http from "@/http";
import { tGet } from "./utils";
import { imgUrl } from "@/lib";

const safeStr = (v) => (v == null ? "" : String(v));

function productName(product, locale = "en") {
    const name = product?.name;

    if (typeof name === "string") return name;

    return name?.[locale] || name?.en || name?.ne || name?.zh || "Product";
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

function Stars({ rating = 0, size = "text-sm" }) {
    return (
        <div className={`flex items-center gap-0.5 text-yellow-500 ${size}`}>
            {[1, 2, 3, 4, 5].map((star) => (
                <span key={star}>{Number(rating) >= star ? "★" : "☆"}</span>
            ))}
        </div>
    );
}

function ReviewEditModal({ open, reviewItem, locale, onClose, onUpdated }) {
    const [rating, setRating] = useState(5);
    const [review, setReview] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [err, setErr] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (open && reviewItem) {
            setRating(reviewItem?.rating || 5);
            setReview(reviewItem?.review || "");
            setErr("");
            setSuccess("");
        }
    }, [open, reviewItem]);

    if (!open) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSubmitting(true);
        setErr("");
        setSuccess("");

        try {
            await http.patch(`/frontend/martReview/my/${reviewItem?._id}`, {
                rating,
                review,
            });

            setSuccess("Review updated successfully. Waiting for approval again.");
            await onUpdated?.();

            setTimeout(() => {
                onClose();
            }, 700);
        } catch (error) {
            setErr(error?.response?.data?.message || "Unable to update review.");
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
                            Review
                        </div>

                        <h3 className="text-xl font-bold text-neutral-950">
                            Update Review
                        </h3>

                        <p className="mt-1 text-sm text-neutral-500">
                            {productName(reviewItem?.product_id, locale)}
                        </p>

                        <span
                            className={[
                                "mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold",
                                reviewItem?.approved
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700",
                            ].join(" ")}
                        >
                            {reviewItem?.approved ? "Approved" : "Waiting for approval"}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-neutral-400 transition hover:bg-orange-50 hover:text-neutral-700"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
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
                            placeholder="Write your review..."
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
                            {submitting ? "Updating..." : "Update Review"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function ReviewPanel({ dict, locale = "en" }) {
    const T = useMemo(
        () => ({
            title: tGet(dict, "dashboard.reviews.title", "My Reviews"),
            subtitle: tGet(
                dict,
                "dashboard.reviews.subtitle",
                "View and manage the reviews you submitted for delivered products."
            ),
            search: tGet(
                dict,
                "dashboard.reviews.search",
                "Search by product, order number, or review"
            ),
            loading: tGet(dict, "common.loading", "Loading..."),
            empty: tGet(dict, "dashboard.reviews.empty", "No reviews found."),
            error: tGet(dict, "common.error", "Something went wrong."),
            refresh: tGet(dict, "dashboard.reviews.refresh", "Refresh"),
        }),
        [dict]
    );

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    const [q, setQ] = useState("");
    const [debouncedQ, setDebouncedQ] = useState("");

    const [approved, setApproved] = useState("all");
    const [rating, setRating] = useState("all");

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 1,
        currentPage: 1,
        page: 1,
        perPage: 10,
        limit: 10,
        hasNextPage: false,
        hasPrevPage: false,
    });

    const [editOpen, setEditOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQ(q.trim());
            setPage(1);
        }, 400);

        return () => clearTimeout(timer);
    }, [q]);

    const loadReviews = async () => {
        setLoading(true);
        setErr("");

        try {
            const params = {
                page,
                limit,
                search: debouncedQ,
            };

            if (approved !== "all") params.approved = approved;
            if (rating !== "all") params.rating = rating;

            const res = await http.get("/frontend/martReview/my", { params });

            setReviews(Array.isArray(res?.data?.data) ? res.data.data : []);

            setPagination(
                res?.data?.pagination || {
                    total: 0,
                    totalPages: 1,
                    currentPage: page,
                    page,
                    perPage: limit,
                    limit,
                    hasNextPage: false,
                    hasPrevPage: false,
                }
            );
        } catch (error) {
            setErr(error?.response?.data?.message || T.error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReviews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, limit, debouncedQ, approved, rating]);

    const openEdit = (item) => {
        setSelectedReview(item);
        setEditOpen(true);
    };

    return (
        <>
            <section className="overflow-hidden rounded-[28px] border border-orange-100 bg-white/95 shadow-[0_18px_45px_rgba(15,42,94,0.08)] backdrop-blur">
                <div className="border-b border-orange-100 bg-gradient-to-br from-white to-orange-50/60 px-5 py-6 sm:px-6">
                    <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#1a4b8f]">
                                <Star className="h-4 w-4" />
                                Reviews
                            </div>

                            <h2 className="text-2xl font-bold tracking-tight text-neutral-950">
                                {T.title}
                            </h2>

                            <p className="mt-1 text-sm leading-6 text-neutral-500">
                                {T.subtitle}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={loadReviews}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-orange-200 bg-white px-4 text-sm font-bold text-[#1a4b8f] transition hover:bg-orange-50"
                        >
                            <RefreshCw className="h-4 w-4" />
                            {T.refresh}
                        </button>
                    </div>

                    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_170px_160px]">
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
                            value={approved}
                            onChange={(e) => {
                                setApproved(e.target.value);
                                setPage(1);
                            }}
                            className="h-12 rounded-2xl border border-orange-100 bg-white px-4 text-sm text-neutral-900 outline-none transition focus:border-[#1a4b8f] focus:ring-4 focus:ring-[#1a4b8f]/10"
                        >
                            <option value="all">All Status</option>
                            <option value="true">Approved</option>
                            <option value="false">Pending</option>
                        </select>

                        <select
                            value={rating}
                            onChange={(e) => {
                                setRating(e.target.value);
                                setPage(1);
                            }}
                            className="h-12 rounded-2xl border border-orange-100 bg-white px-4 text-sm text-neutral-900 outline-none transition focus:border-[#1a4b8f] focus:ring-4 focus:ring-[#1a4b8f]/10"
                        >
                            <option value="all">All Rating</option>
                            <option value="5">5 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="2">2 Stars</option>
                            <option value="1">1 Star</option>
                        </select>
                    </div>
                </div>

                {err && (
                    <div className="mx-5 mt-5 sm:mx-6">
                        <AlertBox type="error" text={err} />
                    </div>
                )}

                {loading ? (
                    <ReviewsSkeleton text={T.loading} />
                ) : reviews.length === 0 ? (
                    <EmptyState text={T.empty} />
                ) : (
                    <>
                        <div className="divide-y divide-orange-100">
                            {reviews.map((item) => {
                                const name = productName(item?.product_id, locale);
                                const productImage = item?.product_id?.images?.[0];
                                const orderNumber = item?.order_id?.orderNumber || "-";
                                const orderStatus = item?.order_id?.status || "-";

                                return (
                                    <article
                                        key={item?._id}
                                        className="px-5 py-5 transition hover:bg-orange-50/30 sm:px-6"
                                    >
                                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                            <div className="flex min-w-0 flex-1 gap-4">
                                                <div className="flex h-18 w-18 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-orange-100 bg-orange-50">
                                                    {productImage ? (
                                                        <img
                                                            src={imgUrl(productImage)}
                                                            alt={name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="px-2 text-center text-xs font-semibold text-neutral-400">
                                                            No Image
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h3 className="text-sm font-bold text-neutral-950">
                                                            {name}
                                                        </h3>

                                                        <span
                                                            className={[
                                                                "rounded-full px-2.5 py-1 text-xs font-bold",
                                                                item?.approved
                                                                    ? "bg-green-100 text-green-700"
                                                                    : "bg-yellow-100 text-yellow-700",
                                                            ].join(" ")}
                                                        >
                                                            {item?.approved ? "Approved" : "Pending"}
                                                        </span>
                                                    </div>

                                                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500">
                                                        <span>Order: {orderNumber}</span>
                                                        <span className="capitalize">
                                                            Order Status: {orderStatus}
                                                        </span>
                                                        <span>
                                                            Price:{" "}
                                                            {money(
                                                                item?.product_id?.discounted_price ||
                                                                item?.product_id?.price
                                                            )}
                                                        </span>
                                                        <span>
                                                            Updated: {formatDateTime(item?.updatedAt)}
                                                        </span>
                                                    </div>

                                                    <div className="mt-3">
                                                        <Stars rating={item?.rating} />
                                                    </div>

                                                    <p className="mt-2 text-sm leading-6 text-neutral-700">
                                                        {item?.review}
                                                    </p>

                                                    <p className="mt-2 text-xs text-neutral-500">
                                                        Status:{" "}
                                                        <span
                                                            className={
                                                                item?.approved
                                                                    ? "font-bold text-green-600"
                                                                    : "font-bold text-yellow-600"
                                                            }
                                                        >
                                                            {item?.approved
                                                                ? "Approved by admin"
                                                                : "Waiting for admin approval"}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => openEdit(item)}
                                                className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#1a4b8f] px-4 text-xs font-bold text-white transition hover:bg-[#0f2a5e]"
                                            >
                                                <Edit3 className="h-4 w-4" />
                                                Update Review
                                            </button>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>

                        <Pagination
                            pagination={pagination}
                            limit={limit}
                            setLimit={setLimit}
                            setPage={setPage}
                            label="reviews"
                        />
                    </>
                )}
            </section>

            <ReviewEditModal
                open={editOpen}
                reviewItem={selectedReview}
                locale={locale}
                onClose={() => {
                    setEditOpen(false);
                    setSelectedReview(null);
                }}
                onUpdated={loadReviews}
            />
        </>
    );
}

function Pagination({ pagination, limit, setLimit, setPage, label }) {
    const currentPage = pagination.page || pagination.currentPage || 1;

    return (
        <div className="flex flex-col gap-3 border-t border-orange-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="text-sm font-medium text-neutral-500">
                Page {currentPage} of {pagination.totalPages} ·{" "}
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

function ReviewsSkeleton({ text }) {
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
                        className="h-28 animate-pulse rounded-2xl border border-orange-100 bg-orange-50/40"
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