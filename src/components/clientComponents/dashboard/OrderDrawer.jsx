"use client";

import React, { useEffect, useState } from "react";
import http from "@/http";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { tGet } from "./utils";

const money = (v) => `HK$ ${Number(v || 0).toLocaleString("en-IN")}`;

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
    const en = product.match(/en:\s*'([^']*)'/)?.[1];
    const ne = product.match(/ne:\s*'([^']*)'/)?.[1];
    const zh = product.match(/zh:\s*'([^']*)'/)?.[1];

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

export default function OrderDrawer({ dict, locale = "en", orderId, onClose }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const T = {
    loading: tGet(dict, "common.loading", "Loading..."),
    noData: tGet(dict, "common.noData", "No data"),
    deliveryInfo: tGet(dict, "dashboard.orders.details.deliveryInfo", "Delivery Info"),
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
    estimatedDelivery: tGet(dict, "dashboard.orders.details.estimatedDelivery", "Estimated delivery"),
    days: tGet(dict, "dashboard.orders.details.days", "days"),
    failedLoad: tGet(dict, "dashboard.orders.details.failedLoad", "Failed to load order."),
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
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm transition-all duration-300">
      <div className="h-full w-full max-w-lg transform overflow-y-auto bg-white shadow-2xl transition-transform duration-300 animate-in slide-in-from-right">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white/95 px-6 py-5 backdrop-blur-sm">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-gray-900">
              {T.order} #{order?.orderNumber || ""}
            </h2>
            {order?.createdAt && (
              <p className="mt-1 text-xs text-gray-500">
                {formatDateTime(order.createdAt)}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div className="space-y-8 p-6">
            {/* Header skeleton */}
            <div className="space-y-2">
              <div className="h-6 w-40 rounded-md bg-gray-100" />
              <div className="h-4 w-24 rounded-md bg-gray-100" />
            </div>

            {/* Delivery skeleton */}
            <div className="space-y-3">
              <div className="h-5 w-32 rounded-md bg-gray-100" />
              <div className="space-y-2 rounded-xl border border-gray-100 bg-gray-50/30 p-4">
                <div className="h-4 w-full rounded bg-gray-100" />
                <div className="h-4 w-2/3 rounded bg-gray-100" />
              </div>
            </div>

            {/* Items skeleton */}
            <div className="space-y-3">
              <div className="h-5 w-24 rounded-md bg-gray-100" />
              {[1, 2].map((i) => (
                <div key={i} className="flex justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50/30 p-4">
                  <div className="space-y-2">
                    <div className="h-5 w-32 rounded bg-gray-100" />
                    <div className="h-4 w-16 rounded bg-gray-100" />
                  </div>
                  <div className="space-y-2 text-right">
                    <div className="h-5 w-20 rounded bg-gray-100" />
                    <div className="h-4 w-14 rounded bg-gray-100" />
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing skeleton */}
            <div className="space-y-2 border-t border-gray-100 pt-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 w-24 rounded bg-gray-100" />
                  <div className="h-4 w-16 rounded bg-gray-100" />
                </div>
              ))}
            </div>

            {/* Status skeleton */}
            <div className="space-y-2">
              <div className="h-5 w-16 rounded-md bg-gray-100" />
              <div className="rounded-xl border border-gray-100 bg-gray-50/30 p-4 space-y-2">
                <div className="h-4 w-32 rounded bg-gray-100" />
                <div className="h-4 w-40 rounded bg-gray-100" />
              </div>
            </div>

            {/* Timeline skeleton */}
            <div className="space-y-2">
              <div className="h-5 w-20 rounded-md bg-gray-100" />
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="rounded-xl border border-gray-100 bg-gray-50/30 p-4 space-y-1">
                    <div className="h-4 w-40 rounded bg-gray-100" />
                    <div className="h-3 w-32 rounded bg-gray-100" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : !order ? (
          <div className="flex h-64 items-center justify-center text-gray-400">
            {T.noData}
          </div>
        ) : (
          <div className="space-y-8 p-6">
            {/* Delivery Info */}
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                {T.deliveryInfo}
              </h3>

              <div className="rounded-xl border border-gray-100 bg-gradient-to-br from-white to-gray-50/50 p-5 shadow-sm">
                <p className="font-medium text-gray-900">
                  {order.address || "-"}
                </p>
                <p className="mt-1.5 text-sm text-gray-500">
                  {order.cityDistrict || order?.deliveryZone?.name || "-"}
                </p>

                {order.landmark && (
                  <p className="mt-1.5 text-sm text-gray-500">
                    {T.landmark}: {order.landmark}
                  </p>
                )}

                {order?.deliveryZone?.estimatedDeliveryDays && (
                  <p className="mt-1.5 text-sm text-gray-500">
                    {T.estimatedDelivery}:{" "}
                    {order.deliveryZone.estimatedDeliveryDays.min}-
                    {order.deliveryZone.estimatedDeliveryDays.max}{" "}
                    {T.days}
                  </p>
                )}
              </div>
            </section>

            {/* Items */}
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                {T.items}
              </h3>

              <div className="space-y-3">
                {(order.items || []).map((item) => (
                  <div
                    key={item._id}
                    className="group flex justify-between gap-4 rounded-xl border border-gray-100 bg-white p-4 transition-all hover:shadow-md"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">
                        {getProductName(item.product, locale)}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {T.qty}: {item.qty}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {money(item.price)}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {money(item.total)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Pricing */}
            <section className="space-y-3 rounded-xl border border-gray-100 bg-gray-50/30 p-5">
              <Row label={T.subtotal} value={money(order.subtotal)} />
              <Row label={T.delivery} value={money(order.deliveryCharge)} />

              {Number(order.discountAmount || 0) > 0 && (
                <Row
                  label={`${T.coupon} (${order?.appliedCoupon?.code || ""})`}
                  value={`- ${money(order.discountAmount)}`}
                  success
                />
              )}

              <div className="border-t border-gray-200 pt-3">
                <Row label={T.total} value={money(order.total)} bold />
              </div>
            </section>

            {/* Status */}
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                {T.status}
              </h3>

              <div className="rounded-xl border border-gray-100 bg-gradient-to-br from-white to-gray-50/50 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{T.order}:</span>
                  <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-medium capitalize text-blue-700">
                    {order.status || "-"}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-gray-500">{T.payment}:</span>
                  <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium capitalize text-emerald-700">
                    {order.paymentStatus || "-"}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-gray-500">{T.method}:</span>
                  <span className="text-sm font-medium text-gray-700">
                    {order.paymentMethod || "-"}
                  </span>
                </div>
              </div>
            </section>

            {/* Order Note */}
            {order.orderNote && (
              <section>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                  {T.orderNote}
                </h3>
                <div className="rounded-xl border-l-4 border-l-amber-400 bg-amber-50/30 p-5 text-sm text-gray-700">
                  {order.orderNote}
                </div>
              </section>
            )}

            {/* Timeline */}
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                {T.timeline}
              </h3>

              <div className="relative space-y-4 pl-4 before:absolute before:left-2 before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-gray-200">
                {(order.timeline || []).map((time, idx) => (
                  <div
                    key={time._id}
                    className="relative rounded-xl border border-gray-100 bg-white p-4 transition-all hover:shadow-sm"
                  >
                    <div className="absolute -left-[1.15rem] top-4 h-2.5 w-2.5 rounded-full bg-blue-500 ring-4 ring-white"></div>
                    <p className="font-medium text-gray-900">{time.task}</p>
                    <p className="mt-1 text-sm text-gray-500">
                      {formatDateTime(time.when)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, bold, success }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className={bold ? "font-bold text-gray-900" : "text-gray-600"}>
        {label}
      </span>
      <span
        className={[
          bold ? "font-bold text-indigo-600" : "font-medium text-gray-900",
          success ? "text-green-600" : "",
        ].join(" ")}
      >
        {value}
      </span>
    </div>
  );
}