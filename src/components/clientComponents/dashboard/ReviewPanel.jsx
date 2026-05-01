"use client";

import React, { useEffect, useMemo, useState } from "react";
import http from "@/http";
import { tGet } from "./utils";
import { imgUrl } from "@/lib";

const safeStr = (v) => (v == null ? "" : String(v));

function productName(product, locale = "en") {
    const name = product?.name;

    if (typeof name === "string") return name;

    return (
        name?.[locale] ||
        name?.en ||
        name?.ne ||
        name?.zh ||
        "Product"
    );
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
            setErr(
                error?.response?.data?.message ||
                "Unable to update review."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
                <div className="flex items-start justify-between border-b border-gray-100 px-6 py-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">
                            Update Review
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            {productName(reviewItem?.product_id, locale)}
                        </p>

                        <div className="mt-2">
                            <span
                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${reviewItem?.approved
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                                    }`}
                            >
                                {reviewItem?.approved
                                    ? "Approved"
                                    : "Waiting for approval"}
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full px-2 py-1 text-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
                    {err && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            {err}
                        </div>
                    )}

                    {success && (
                        <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                            {success}
                        </div>
                    )}

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Rating
                        </label>

                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className={`h-10 w-10 rounded-xl border text-lg font-bold ${rating >= star
                                        ? "border-yellow-300 bg-yellow-50 text-yellow-500"
                                        : "border-gray-200 bg-white text-gray-300"
                                        }`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Review
                        </label>

                        <textarea
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            required
                            minLength={3}
                            rows={5}
                            placeholder="Write your review..."
                            className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
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

            if (approved !== "all") {
                params.approved = approved;
            }

            if (rating !== "all") {
                params.rating = rating;
            }

            const res = await http.get("/frontend/martReview/my", {
                params,
            });

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
            <div className="rounded-2xl border border-gray-100 bg-white shadow-md">
                <div className="border-b border-gray-100 px-6 py-5">
                    <div className="mb-5">
                        <h2 className="text-xl font-bold tracking-tight text-gray-900">
                            {T.title}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            {T.subtitle}
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder={T.search}
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-blue-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:w-80"
                            />

                            <select
                                value={approved}
                                onChange={(e) => {
                                    setApproved(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-blue-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:w-44"
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
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-blue-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:w-40"
                            >
                                <option value="all">All Rating</option>
                                <option value="5">5 Stars</option>
                                <option value="4">4 Stars</option>
                                <option value="3">3 Stars</option>
                                <option value="2">2 Stars</option>
                                <option value="1">1 Star</option>
                            </select>

                            <button
                                type="button"
                                onClick={loadReviews}
                                className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                            >
                                {T.refresh}
                            </button>
                        </div>
                    </div>
                </div>

                {err && (
                    <div className="mx-6 mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {err}
                    </div>
                )}

                {loading ? (
                    <div className="p-6 text-sm text-gray-500">{T.loading}</div>
                ) : reviews.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                        <p className="text-sm">{T.empty}</p>
                    </div>
                ) : (
                    <>
                        <div className="divide-y divide-gray-100">
                            {reviews.map((item) => {
                                const name = productName(item?.product_id, locale);
                                const productImage = item?.product_id?.images?.[0];
                                const orderNumber = item?.order_id?.orderNumber || "-";
                                const orderStatus = item?.order_id?.status || "-";

                                return (
                                    <div
                                        key={item?._id}
                                        className="px-6 py-5 transition-colors hover:bg-gray-50/60"
                                    >
                                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                            <div className="flex min-w-0 flex-1 gap-4">
                                                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                                                    {productImage ? (
                                                        <img
                                                            src={imgUrl(productImage)}
                                                            alt={name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-xs text-gray-400">
                                                            No Image
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h3 className="text-sm font-bold text-gray-900">
                                                            {name}
                                                        </h3>

                                                        <span
                                                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item?.approved
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-yellow-100 text-yellow-700"
                                                                }`}
                                                        >
                                                            {item?.approved ? "Approved" : "Pending"}
                                                        </span>
                                                    </div>

                                                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
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

                                                    <p className="mt-2 text-sm leading-6 text-gray-700">
                                                        {item?.review}
                                                    </p>

                                                    <p className="mt-2 text-xs text-gray-500">
                                                        Status:{" "}
                                                        <span
                                                            className={
                                                                item?.approved
                                                                    ? "font-semibold text-green-600"
                                                                    : "font-semibold text-yellow-600"
                                                            }
                                                        >
                                                            {item?.approved
                                                                ? "Approved by admin"
                                                                : "Waiting for admin approval"}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex shrink-0 justify-start lg:justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() => openEdit(item)}
                                                    className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                                                >
                                                    Update Review
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex flex-col gap-3 border-t border-gray-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="text-sm text-gray-500">
                                Page {pagination.page || pagination.currentPage} of{" "}
                                {pagination.totalPages} · {pagination.total} reviews
                            </div>

                            <div className="flex items-center gap-2">
                                <select
                                    value={limit}
                                    onChange={(e) => {
                                        setLimit(Number(e.target.value));
                                        setPage(1);
                                    }}
                                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
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
                                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Prev
                                </button>

                                <button
                                    type="button"
                                    disabled={!pagination.hasNextPage}
                                    onClick={() => setPage((prev) => prev + 1)}
                                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

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