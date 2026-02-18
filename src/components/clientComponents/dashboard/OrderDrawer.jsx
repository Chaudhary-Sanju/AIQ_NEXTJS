"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { tGet, withLocale } from "./utils";

const safeStr = (v) => (v == null ? "-" : String(v));

function formatDateTime(v) {
  if (!v) return "-";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return safeStr(v);
  return d.toLocaleString();
}

export default function OrderDrawer({ dict, locale, order, onClose }) {
  const T = useMemo(
    () => ({
      close: tGet(dict, "common.close", "Close"),
      details: tGet(dict, "dashboard.orders.drawer.details", "Order Details"),
      track: tGet(dict, "dashboard.orders.drawer.track", "Track"),
      done: tGet(dict, "dashboard.orders.drawer.done", "Done"),

      labels: {
        status: tGet(dict, "dashboard.orders.drawer.status", "Status"),
        created: tGet(dict, "dashboard.orders.drawer.created", "Created"),
        pickup: tGet(dict, "dashboard.orders.drawer.pickup", "Pickup"),
        drop: tGet(dict, "dashboard.orders.drawer.drop", "Drop"),
        sender: tGet(dict, "dashboard.orders.drawer.sender", "Sender"),
        receiver: tGet(dict, "dashboard.orders.drawer.receiver", "Receiver"),
        cost: tGet(dict, "dashboard.orders.drawer.cost", "Cost"),
        weight: tGet(dict, "dashboard.orders.drawer.weight", "Weight"),
        type: tGet(dict, "dashboard.orders.drawer.type", "Delivery Type"),
        handling: tGet(dict, "dashboard.orders.drawer.handling", "Handling"),
        pickupTime: tGet(dict, "dashboard.orders.drawer.pickupTime", "Pickup Time"),
        remark: tGet(dict, "dashboard.orders.drawer.remark", "Remark"),
        payment: tGet(dict, "dashboard.orders.drawer.payment", "Payment Method"),
      },
    }),
    [dict]
  );

  const statusPill = (sRaw) => {
    const s = String(sRaw || "pending").toLowerCase().replaceAll(" ", "_");
    const base = "px-2.5 py-1 rounded-full text-xs font-semibold";
    if (s === "delivered") return `${base} bg-green-100 text-green-700`;
    if (s === "cancelled") return `${base} bg-red-100 text-red-700`;
    if (s === "in_transit") return `${base} bg-blue-100 text-blue-700`;
    if (s === "confirmed") return `${base} bg-purple-100 text-purple-700`;
    if (s === "picked") return `${base} bg-teal-100 text-teal-700`;
    return `${base} bg-amber-100 text-amber-700`;
  };

  if (!order) return null;

  const orderId = order?.orderId || order?.trackingId || order?._id;
  const trackHref = withLocale(
    `/courier/track?order=${encodeURIComponent(orderId || "")}`,
    locale
  );

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="absolute right-0 top-0 h-full w-full sm:w-[520px] bg-white shadow-xl p-6 overflow-y-auto">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{T.details}</h3>
            <p className="text-sm text-gray-600 mt-1">{orderId}</p>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 font-medium"
          >
            {T.close}
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500">{T.labels.status}</div>
                <div className="mt-1">
                  <span className={statusPill(order?.status)}>
                    {safeStr(order?.status).replaceAll("_", " ")}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-gray-500">{T.labels.created}</div>
                <div className="mt-1 text-sm font-semibold text-gray-900">
                  {formatDateTime(order?.createdAt)}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <div className="text-xs text-gray-500">{T.labels.pickup}</div>
            <div className="mt-1 text-sm font-semibold text-gray-900">
              {safeStr(order?.pickUpLocation)}
            </div>
            <div className="text-sm text-gray-600">{safeStr(order?.pickupLandmark)}</div>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <div className="text-xs text-gray-500">{T.labels.drop}</div>
            <div className="mt-1 text-sm font-semibold text-gray-900">
              {safeStr(order?.dropLocation)}
            </div>
            <div className="text-sm text-gray-600">{safeStr(order?.dropLandmark)}</div>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <div className="text-xs text-gray-500">{T.labels.sender}</div>
            <div className="mt-1 text-sm font-semibold text-gray-900">
              {safeStr(order?.senderName)}
            </div>
            <div className="text-sm text-gray-600">{safeStr(order?.senderContact)}</div>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <div className="text-xs text-gray-500">{T.labels.receiver}</div>
            <div className="mt-1 text-sm font-semibold text-gray-900">
              {safeStr(order?.recieverName)}
            </div>
            <div className="text-sm text-gray-600">{safeStr(order?.recieverContact)}</div>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500">{T.labels.cost}</div>
                <div className="mt-1 text-lg font-bold text-gray-900">
                  {order?.estimatedCost != null ? `${order.estimatedCost} NPR` : "-"}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">{T.labels.weight}</div>
                <div className="mt-1 text-sm font-semibold text-gray-900">
                  {order?.packageSize != null ? `${order.packageSize} KG` : "-"}
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500">{T.labels.type}</div>
                <div className="mt-1 text-sm font-semibold text-gray-900">
                  {safeStr(order?.deliveryType)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">{T.labels.handling}</div>
                <div className="mt-1 text-sm font-semibold text-gray-900">
                  {safeStr(order?.Handling || order?.handling)}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-xs text-gray-500">{T.labels.pickupTime}</div>
              <div className="mt-1 text-sm font-semibold text-gray-900">
                {formatDateTime(order?.pickUpTimeOrDate)}
              </div>
            </div>

            <div className="mt-4">
              <div className="text-xs text-gray-500">{T.labels.payment}</div>
              <div className="mt-1 text-sm font-semibold text-gray-900">
                {safeStr(order?.paymentMethod)}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <div className="text-xs text-gray-500">{T.labels.remark}</div>
            <div className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
              {safeStr(order?.remark)}
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Link
            href={trackHref}
            className="flex-1 text-center px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            {T.track}
          </Link>

          <button
            onClick={onClose}
            className="px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 font-semibold"
          >
            {T.done}
          </button>
        </div>
      </div>
    </div>
  );
}
