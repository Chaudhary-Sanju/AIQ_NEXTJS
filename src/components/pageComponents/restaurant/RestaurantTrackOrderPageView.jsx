"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, RefreshCw, ReceiptText } from "lucide-react";
import { toast } from "sonner";
import http from "@/http";
import { money, t } from "./restaurantShared";

export default function RestaurantTrackOrderPageView({ locale = "en" }) {
  const searchParams = useSearchParams();

  const [orderNumber, setOrderNumber] = useState(
    searchParams.get("order") || ""
  );
  const [checkoutId, setCheckoutId] = useState(
    searchParams.get("checkout") || ""
  );
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);

  const fetchOrder = async () => {
    if (!orderNumber.trim() && !checkoutId.trim()) {
      toast.error("Please enter order number.");
      return;
    }

    setLoading(true);

    try {
      if (checkoutId.trim()) {
        const { data } = await http.get(
          `/frontEnd/foodOrder/payme-status/${checkoutId.trim()}`
        );

        setOrder(data?.data?.order || data?.order || data?.data || data);
      } else {
        const { data } = await http.get(
          `/frontEnd/foodOrder/track/${orderNumber.trim()}`
        );

        setOrder(data?.data || data?.order || data);
      }
    } catch (err) {
      console.error(err);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderNumber || checkoutId) fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-2xl bg-gradient-to-r from-slate-950 to-slate-800 p-6 text-white">
          <h1 className="text-3xl font-bold">
            {t(locale, "trackOrder")}
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Enter your restaurant order number to check status.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <label className="mb-1 block text-sm font-semibold text-slate-700">
            {t(locale, "orderNumber")}
          </label>

          <div className="flex gap-2">
            <input
              value={orderNumber}
              onChange={(e) => {
                setOrderNumber(e.target.value);
                setCheckoutId("");
              }}
              placeholder="FOOD-ORDER-NUMBER"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white"
            />

            <button
              type="button"
              onClick={fetchOrder}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : (
                <Search size={18} />
              )}
              Track
            </button>
          </div>
        </div>

        {order ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                <ReceiptText size={22} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  {order.orderNumber ||
                    order.orderNo ||
                    order.orderId ||
                    "Restaurant Order"}
                </h2>
                <p className="text-sm text-slate-500">
                  Current order status
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Info label="Order Status" value={order.orderStatus || "pending"} />
              <Info label="Payment Status" value={order.paymentStatus || "pending"} />
              <Info label="Delivery Status" value={order.deliveryStatus || "pending"} />
              <Info label="Payment Method" value={order.paymentMethod || "cod"} />
              <Info
                label="Delivery Location"
                value={
                  order.deliveryLocation?.name ||
                  order.delivery?.location?.name ||
                  order.cityDistrict ||
                  "-"
                }
              />
              <Info
                label="Total"
                value={money(
                  order.total ||
                  order.totalAmount ||
                  order.grandTotal ||
                  order.delivery?.total ||
                  0
                )}
              />
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}

const Info = ({ label, value }) => (
  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
    <div className="text-xs font-bold uppercase tracking-wide text-slate-400">
      {label}
    </div>
    <div className="mt-1 font-semibold capitalize text-slate-800">
      {value || "-"}
    </div>
  </div>
);