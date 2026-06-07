"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ChefHat,
  Minus,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Trash2,
  Utensils,
} from "lucide-react";
import { useRestaurantCart } from "@/contexts/RestaurantCartContext";
import {
  money,
  pickName,
  pickText,
  restaurantPath,
  t,
} from "./restaurantShared";
import { imgUrl } from "@/lib";

const imageSrc = (image) => {
  if (!image) return "";

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("/")
  ) {
    return image;
  }

  return imgUrl(image);
};

const getFoodPrice = (food = {}) => {
  const finalPrice = Number(food.finalPrice || 0);
  if (finalPrice > 0) return finalPrice;

  const price = Number(food.price || 0);
  const discount = food.discounted_price ?? food.discountPrice;

  if (
    discount !== null &&
    discount !== undefined &&
    discount !== "" &&
    Number(discount) > 0 &&
    Number(discount) < price
  ) {
    return Number(discount);
  }

  return price;
};

export default function RestaurantCartPageView({ locale = "en" }) {
  const {
    items = [],
    subtotal = 0,
    totalItems = 0,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useRestaurantCart();

  const cartSubtotal =
    Number(subtotal || 0) ||
    items.reduce((sum, item) => {
      const food = item.food || {};
      return sum + getFoodPrice(food) * Number(item.quantity || 1);
    }, 0);

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href={restaurantPath(locale)}
            className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-sm font-bold text-[#1a4b8f] shadow-sm transition hover:bg-orange-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Ordering
          </Link>

          {items.length > 0 ? (
            <button
              type="button"
              onClick={clearCart}
              className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-white px-4 py-2 text-sm font-bold text-red-500 shadow-sm transition hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Clear Cart
            </button>
          ) : null}
        </div>

        <section className="mb-7 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
                <ChefHat className="h-4 w-4" />
                HKMandu Kitchen
              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                {t(locale, "cart")}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                Review your selected restaurant items before checkout.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-[260px]">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Items
                </p>

                <p className="mt-1 text-2xl font-black text-slate-950">
                  {totalItems}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Subtotal
                </p>

                <p className="mt-1 text-2xl font-black text-slate-950">
                  {money(cartSubtotal)}
                </p>
              </div>
            </div>
          </div>
        </section>

        {items.length === 0 ? (
          <EmptyCart locale={locale} />
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
            <section className="space-y-4">
              {items.map((item) => {
                const food = item.food || {};
                const img = imageSrc(food.image);
                const summary =
                  pickText(food.summary, locale, "") ||
                  pickText(food.description, locale, "");
                const price = getFoodPrice(food);
                const lineTotal = price * Number(item.quantity || 1);
                const hasDiscount =
                  Number(food.price || 0) > 0 &&
                  Number(price || 0) < Number(food.price || 0);

                return (
                  <article
                    key={food._id}
                    className="group overflow-hidden rounded-[28px] border border-orange-100 bg-white/95 p-4 shadow-[0_16px_50px_rgba(15,42,94,0.08)] backdrop-blur transition hover:-translate-y-0.5 hover:shadow-[0_22px_70px_rgba(15,42,94,0.12)] sm:p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <div className="relative h-44 w-full overflow-hidden rounded-[24px] bg-orange-50 sm:h-36 sm:w-36 sm:shrink-0">
                        {img ? (
                          <Image
                            src={img}
                            alt={pickName(food.name, locale)}
                            fill
                            sizes="(max-width: 640px) 100vw, 144px"
                            className="object-cover transition duration-500 group-hover:scale-105"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-orange-300">
                            <Utensils className="h-10 w-10" />
                          </div>
                        )}

                        {food.foodType ? (
                          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-[#1a4b8f] shadow-sm">
                            {food.foodType}
                          </span>
                        ) : null}
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex gap-4">
                          <div className="min-w-0 flex-1">
                            <h2 className="line-clamp-1 text-lg font-black text-neutral-950">
                              {pickName(food.name, locale)}
                            </h2>

                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600">
                                {food.category || "Food"}
                              </span>

                              {food.preparationTime ? (
                                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#1a4b8f]">
                                  {food.preparationTime}
                                </span>
                              ) : null}
                            </div>

                            {summary ? (
                              <p className="mt-3 line-clamp-2 text-sm leading-6 text-neutral-500">
                                {summary}
                              </p>
                            ) : null}
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(food._id)}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-500 transition hover:bg-red-100"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-5 flex flex-col gap-4 border-t border-orange-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <div className="flex items-end gap-2">
                              <span className="text-xl font-black text-neutral-950">
                                {money(price)}
                              </span>

                              {hasDiscount ? (
                                <span className="pb-0.5 text-xs font-bold text-neutral-400 line-through">
                                  {money(food.price)}
                                </span>
                              ) : null}
                            </div>

                            <p className="mt-1 text-xs font-semibold text-neutral-500">
                              Line total:{" "}
                              <span className="text-[#1a4b8f]">
                                {money(lineTotal)}
                              </span>
                            </p>
                          </div>

                          <div className="flex items-center justify-between gap-4 sm:justify-end">
                            <div className="inline-flex items-center rounded-2xl border border-orange-100 bg-orange-50 p-1">
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(food._id, item.quantity - 1)
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-neutral-700 shadow-sm transition hover:text-[#1a4b8f]"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-4 w-4" />
                              </button>

                              <span className="w-12 text-center text-sm font-black text-neutral-950">
                                {item.quantity}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(food._id, item.quantity + 1)
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-neutral-700 shadow-sm transition hover:text-[#1a4b8f]"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>

            <aside className="sticky top-6 rounded-[32px] border border-orange-100 bg-white/95 p-5 shadow-[0_24px_70px_rgba(15,42,94,0.10)] backdrop-blur">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#1a4b8f]">
                    Cart Summary
                  </p>

                  <h2 className="mt-1 text-xl font-black text-neutral-950">
                    Your Order
                  </h2>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                  <ShoppingBag className="h-6 w-6" />
                </div>
              </div>

              <div className="space-y-4 rounded-3xl bg-gradient-to-br from-orange-50 to-blue-50 p-4">
                <SummaryRow label="Items" value={totalItems} />
                <SummaryRow label={t(locale, "subtotal")} value={money(cartSubtotal)} />

                <div className="h-px bg-orange-100" />

                <div className="flex items-center justify-between gap-4">
                  <span className="text-lg font-black text-neutral-950">
                    {t(locale, "total")}
                  </span>

                  <span className="text-2xl font-black text-[#1a4b8f]">
                    {money(cartSubtotal)}
                  </span>
                </div>
              </div>

              <div className="mt-5 rounded-3xl border border-orange-100 bg-white p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#1a4b8f]">
                    <Sparkles className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-black text-neutral-950">
                      Delivery calculated at checkout
                    </p>

                    <p className="mt-1 text-xs leading-5 text-neutral-500">
                      Choose your delivery location on the next page to see
                      delivery charge, free delivery threshold, and COD
                      availability.
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href={restaurantPath(locale, "checkout")}
                className="mt-5 inline-flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#1a4b8f] px-4 text-sm font-black text-white shadow-lg shadow-[#1a4b8f]/20 transition hover:bg-[#0f2a5e]"
              >
                <ShoppingCart className="h-5 w-5" />
                Proceed to Checkout
              </Link>

              <Link
                href={restaurantPath(locale)}
                className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-2xl border border-orange-100 bg-white px-4 text-sm font-black text-neutral-700 transition hover:bg-orange-50"
              >
                Add More Food
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

function EmptyCart({ locale }) {
  return (
    <div className="mx-auto max-w-lg rounded-[32px] border border-orange-100 bg-white/95 p-8 text-center shadow-[0_24px_70px_rgba(15,42,94,0.10)] backdrop-blur">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-[#1a4b8f] ring-8 ring-orange-100/60">
        <ShoppingCart className="h-10 w-10" />
      </div>

      <h2 className="mt-6 text-2xl font-black text-neutral-950">
        {t(locale, "emptyCart")}
      </h2>

      <p className="mt-3 text-sm leading-6 text-neutral-500">
        Your cart is waiting for delicious food. Browse the restaurant menu and
        add your favorite items.
      </p>

      <Link
        href={restaurantPath(locale)}
        className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#1a4b8f] px-6 text-sm font-black text-white shadow-lg shadow-[#1a4b8f]/20 transition hover:bg-[#0f2a5e]"
      >
        <Utensils className="h-4 w-4" />
        Browse Food
      </Link>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm font-semibold text-neutral-600">{label}</span>
      <span className="text-sm font-black text-neutral-950">{value}</span>
    </div>
  );
}