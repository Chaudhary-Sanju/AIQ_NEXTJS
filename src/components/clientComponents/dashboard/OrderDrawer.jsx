"use client";

import React, { useEffect, useState } from "react";
import http from "@/http";
import {
  BadgeCheck,
  CalendarDays,
  CreditCard,
  Loader2,
  MapPin,
  PackageCheck,
  ReceiptText,
  ShoppingBag,
  Truck,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { tGet } from "./utils";

const money = (v) =>
  `HK$ ${Number(v || 0).toLocaleString("en-HK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function formatDateTime(v) {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return String(v);
  return d.toLocaleString();
}

function getProductName(product, locale = "en") {
  if (!product) return "Product";

  if (typeof product === "object") {
    return (
      product?.[locale] ||
      product?.en ||
      product?.ne ||
      product?.zh ||
      "Product"
    );
  }

  if (typeof product === "string") {
    const en = product.match(/en\s*:\s*['"`]([^'"`]*)['"`]/)?.[1];
    const ne = product.match(/ne\s*:\s*['"`]([^'"`]*)['"`]/)?.[1];
    const zh = product.match(/zh\s*:\s*['"`]([^'"`]*)['"`]/)?.[1];

    const parsed = { en, ne, zh };

    return (
      parsed?.[locale] ||
      parsed.en ||
      parsed.ne ||
      parsed.zh ||
      product
    );
  }

  return "Product";
}

function getStatusClass(status = "") {
  const s = String(status).toLowerCase();

  if (s === "delivered" || s === "completed") {
    return "bg-green-100 text-green-700";
  }

  if (s === "cancelled" || s === "failed") {
    return "bg-red-100 text-red-700";
  }

  if (s === "shipped") {
    return "bg-blue-100 text-blue-700";
  }

  if (s === "processing") {
    return "bg-cyan-100 text-cyan-700";
  }

  if (s === "confirmed") {
    return "bg-indigo-100 text-indigo-700";
  }

  return "bg-orange-100 text-orange-700";
}

export default function OrderDrawer({ dict, locale = "en", orderId, onClose }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const T = {
    loading: tGet(dict, "common.loading", "Loading..."),
    noData: tGet(dict, "common.noData", "No data"),
    deliveryInfo: tGet(
      dict,
      "dashboard.orders.details.deliveryInfo",
      "Delivery Info"
    ),
    items: tGet(dict, "dashboard.orders.details.items", "Items"),
    qty: tGet(dict, "dashboard.orders.details.qty", "Qty"),
    subtotal: tGet(dict, "dashboard.orders.details.subtotal", "Subtotal"),
    delivery: tGet(dict, "dashboard.orders.details.delivery", "Delivery"),
    coupon: tGet(dict, "dashboard.orders.details.coupon", "Coupon"),
    total: tGet(dict, "dashboard.orders.details.total", "Total"),
    status: tGet(dict, "dashboard.orders.details.status", "Status"),
    order: tGet(dict, "dashboard.orders.details.order", "Order"),
    payment: tGet(dict, "dashboard.orders.details.payment", "Payment"),
    method: tGet(dict, "dashboard.orders.details.method", "Method"),
    orderNote: tGet(dict, "dashboard.orders.details.orderNote", "Order Note"),
    timeline: tGet(dict, "dashboard.orders.details.timeline", "Timeline"),
    landmark: tGet(dict, "dashboard.orders.details.landmark", "Landmark"),
    estimatedDelivery: tGet(
      dict,
      "dashboard.orders.details.estimatedDelivery",
      "Estimated delivery"
    ),
    days: tGet(dict, "dashboard.orders.details.days", "days"),
    failedLoad: tGet(
      dict,
      "dashboard.orders.details.failedLoad",
      "Failed to load order."
    ),
  };

  useEffect(() => {
    if (!orderId) {
      setOrder(null);
      return;
    }

    const loadOrder = async () => {
      try {
        setLoading(true);

        const res = await http.get(`/frontend/order/my-orders/${orderId}`);
        setOrder(res?.data?.data || null);
      } catch (err) {
        toast.error(err?.response?.data?.message || T.failedLoad);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  if (!orderId) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
      <div className="h-full w-full max-w-xl overflow-y-auto bg-gradient-to-br from-orange-50 via-white to-blue-50 shadow-2xl animate-in slide-in-from-right">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-orange-100 bg-white/95 px-5 py-5 backdrop-blur sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#1a4b8f]">
                <ReceiptText className="h-4 w-4" />
                Order Details
              </div>

              <h2 className="truncate text-xl font-bold tracking-tight text-neutral-950">
                {T.order} #{order?.orderNumber || ""}
              </h2>

              {order?.createdAt && (
                <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-neutral-500">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {formatDateTime(order.createdAt)}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-neutral-400 transition hover:bg-orange-50 hover:text-neutral-700 focus:outline-none focus:ring-4 focus:ring-[#1a4b8f]/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {loading ? (
          <OrderDrawerSkeleton T={T} />
        ) : !order ? (
          <div className="flex h-64 items-center justify-center px-6 text-center">
            <div>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-[#1a4b8f]">
                <PackageCheck className="h-8 w-8" />
              </div>

              <p className="text-sm font-semibold text-neutral-500">
                {T.noData}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 p-5 sm:p-6">
            {/* Summary Cards */}
            <section className="grid gap-3 sm:grid-cols-2">
              <SummaryCard
                icon={<PackageCheck className="h-5 w-5" />}
                label={T.order}
                value={order.status || "-"}
                pillClass={getStatusClass(order.status)}
              />

              <SummaryCard
                icon={<CreditCard className="h-5 w-5" />}
                label={T.payment}
                value={order.paymentStatus || "-"}
                pillClass={getStatusClass(order.paymentStatus)}
              />
            </section>

            {/* Delivery Info */}
            <SectionCard
              icon={<MapPin className="h-5 w-5" />}
              title={T.deliveryInfo}
            >
              <div className="rounded-2xl border border-orange-100 bg-orange-50/50 p-4">
                <p className="font-bold text-neutral-950">
                  {order.address || "-"}
                </p>

                <p className="mt-1.5 text-sm text-neutral-500">
                  {order.cityDistrict || order?.deliveryZone?.name || "-"}
                </p>

                {order.landmark && (
                  <p className="mt-1.5 text-sm text-neutral-500">
                    {T.landmark}: {order.landmark}
                  </p>
                )}

                {order?.deliveryZone?.estimatedDeliveryDays && (
                  <p className="mt-1.5 text-sm text-neutral-500">
                    {T.estimatedDelivery}:{" "}
                    {order.deliveryZone.estimatedDeliveryDays.min}-
                    {order.deliveryZone.estimatedDeliveryDays.max}{" "}
                    {T.days}
                  </p>
                )}
              </div>
            </SectionCard>

            {/* Items */}
            <SectionCard
              icon={<ShoppingBag className="h-5 w-5" />}
              title={T.items}
            >
              <div className="space-y-3">
                {(order.items || []).map((item) => (
                  <div
                    key={item._id}
                    className="group flex justify-between gap-4 rounded-2xl border border-orange-100 bg-white p-4 shadow-sm transition hover:border-orange-200 hover:shadow-[0_12px_30px_rgba(15,42,94,0.08)]"
                  >
                    <div className="min-w-0">
                      <p className="line-clamp-2 font-bold text-neutral-950">
                        {getProductName(item.product, locale)}
                      </p>

                      <p className="mt-1 text-sm text-neutral-500">
                        {T.qty}: {item.qty}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="font-bold text-neutral-950">
                        {money(item.price)}
                      </p>

                      <p className="mt-1 text-sm font-semibold text-[#1a4b8f]">
                        {money(item.total)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Pricing */}
            <section className="rounded-[24px] border border-orange-100 bg-white/95 p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-50 text-[#1a4b8f]">
                  <ReceiptText className="h-5 w-5" />
                </div>

                <h3 className="text-base font-bold text-neutral-950">
                  Payment Summary
                </h3>
              </div>

              <div className="space-y-3 rounded-2xl bg-orange-50/40 p-4">
                <Row label={T.subtotal} value={money(order.subtotal)} />
                <Row label={T.delivery} value={money(order.deliveryCharge)} />

                {Number(order.discountAmount || 0) > 0 && (
                  <Row
                    label={`${T.coupon} (${order?.appliedCoupon?.code || ""})`}
                    value={`- ${money(order.discountAmount)}`}
                    success
                  />
                )}

                <div className="border-t border-orange-100 pt-3">
                  <Row label={T.total} value={money(order.total)} bold />
                </div>
              </div>
            </section>

            {/* Status */}
            <SectionCard
              icon={<BadgeCheck className="h-5 w-5" />}
              title={T.status}
            >
              <div className="space-y-3 rounded-2xl border border-orange-100 bg-orange-50/40 p-4">
                <StatusRow
                  label={T.order}
                  value={order.status || "-"}
                  className={getStatusClass(order.status)}
                />

                <StatusRow
                  label={T.payment}
                  value={order.paymentStatus || "-"}
                  className={getStatusClass(order.paymentStatus)}
                />

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-neutral-500">
                    {T.method}:
                  </span>

                  <span className="text-sm font-bold capitalize text-neutral-800">
                    {order.paymentMethod || "-"}
                  </span>
                </div>
              </div>
            </SectionCard>

            {/* Order Note */}
            {order.orderNote && (
              <SectionCard
                icon={<ReceiptText className="h-5 w-5" />}
                title={T.orderNote}
              >
                <div className="rounded-2xl border border-orange-200 bg-orange-50/70 p-4 text-sm leading-6 text-neutral-700">
                  {order.orderNote}
                </div>
              </SectionCard>
            )}

            {/* Timeline */}
            <SectionCard
              icon={<Truck className="h-5 w-5" />}
              title={T.timeline}
            >
              <div className="relative space-y-4 pl-5 before:absolute before:left-2 before:top-3 before:h-[calc(100%-1.5rem)] before:w-px before:bg-orange-200">
                {(order.timeline || []).map((time, idx) => (
                  <div
                    key={time._id || `${time.task}-${idx}`}
                    className="relative rounded-2xl border border-orange-100 bg-white p-4 shadow-sm transition hover:shadow-[0_12px_30px_rgba(15,42,94,0.08)]"
                  >
                    <div className="absolute -left-[1.45rem] top-5 h-3 w-3 rounded-full bg-[#1a4b8f] ring-4 ring-white" />

                    <p className="font-bold text-neutral-950">
                      {time.task || time.label || time.title}
                    </p>

                    <p className="mt-1 text-sm text-neutral-500">
                      {formatDateTime(time.when || time.date)}
                    </p>
                  </div>
                ))}

                {(!order.timeline || order.timeline.length === 0) && (
                  <div className="rounded-2xl border border-dashed border-orange-200 bg-orange-50/40 p-4 text-sm font-semibold text-neutral-500">
                    {T.noData}
                  </div>
                )}
              </div>
            </SectionCard>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ icon, label, value, pillClass }) {
  return (
    <div className="rounded-[22px] border border-orange-100 bg-white/95 p-4 shadow-sm">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-50 text-[#1a4b8f]">
        {icon}
      </div>

      <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">
        {label}
      </p>

      <span
        className={[
          "mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize",
          pillClass,
        ].join(" ")}
      >
        {value}
      </span>
    </div>
  );
}

function SectionCard({ icon, title, children }) {
  return (
    <section className="rounded-[24px] border border-orange-100 bg-white/95 p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-50 text-[#1a4b8f]">
          {icon}
        </div>

        <h3 className="text-base font-bold text-neutral-950">
          {title}
        </h3>
      </div>

      {children}
    </section>
  );
}

function Row({ label, value, bold, success }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className={bold ? "font-bold text-neutral-950" : "text-neutral-600"}>
        {label}
      </span>

      <span
        className={[
          bold ? "text-lg font-bold text-[#1a4b8f]" : "font-bold text-neutral-900",
          success ? "text-green-600" : "",
        ].join(" ")}
      >
        {value}
      </span>
    </div>
  );
}

function StatusRow({ label, value, className }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-neutral-500">{label}:</span>

      <span
        className={[
          "inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize",
          className,
        ].join(" ")}
      >
        {value}
      </span>
    </div>
  );
}

function OrderDrawerSkeleton({ T }) {
  return (
    <div className="space-y-6 p-5 sm:p-6">
      <div className="flex items-center gap-2 text-sm font-semibold text-neutral-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        {T.loading}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="h-32 animate-pulse rounded-[22px] border border-orange-100 bg-white/80" />
        <div className="h-32 animate-pulse rounded-[22px] border border-orange-100 bg-white/80" />
      </div>

      <div className="h-36 animate-pulse rounded-[24px] border border-orange-100 bg-white/80" />

      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-2xl border border-orange-100 bg-white/80"
          />
        ))}
      </div>

      <div className="h-44 animate-pulse rounded-[24px] border border-orange-100 bg-white/80" />
      <div className="h-44 animate-pulse rounded-[24px] border border-orange-100 bg-white/80" />
    </div>
  );
}