"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  ShoppingCart,
  RefreshCw,
  Utensils,
  Clock,
} from "lucide-react";
import http from "@/http";
import { useRestaurantCart } from "@/contexts/RestaurantCartContext";
import {
  getFoodImage,
  getFoodPrice,
  getListFromResponse,
  hasFoodDiscount,
  isFoodAvailable,
  money,
  pickName,
  pickText,
  restaurantPath,
  t,
} from "./restaurantShared";
import { INPUT_LIMITS } from "@/constants/inputLimits";

export default function RestaurantPageView({ locale = "en" }) {
  const { addToCart, totalItems } = useRestaurantCart();

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const fetchFoods = async () => {
    setLoading(true);

    try {
      const { data } = await http.get("/frontend/restaurantFood");
      setFoods(getListFromResponse(data));
    } catch (err) {
      console.error(err);
      setFoods([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const categories = useMemo(() => {
    return Array.from(
      new Set(foods.map((food) => food.category).filter(Boolean))
    );
  }, [foods]);

  const filteredFoods = useMemo(() => {
    const q = search.trim().toLowerCase();

    return foods.filter((food) => {
      if (!isFoodAvailable(food)) return false;

      const name = pickName(food.name, locale).toLowerCase();
      const summary = pickText(food.summary, locale, "").toLowerCase();
      const description = pickText(food.description, locale, "").toLowerCase();
      const restaurant = String(food.restaurantName || "").toLowerCase();

      const matchSearch =
        !q ||
        name.includes(q) ||
        summary.includes(q) ||
        description.includes(q) ||
        restaurant.includes(q);

      const matchCategory = !category || food.category === category;

      return matchSearch && matchCategory;
    });
  }, [foods, search, category, locale]);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-r from-slate-950 to-slate-800 px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                <Utensils size={14} />
                HKMandu Kitchen
              </div>

              <h1 className="text-3xl font-bold sm:text-4xl">
                {t(locale, "title")}
              </h1>

              <p className="mt-2 text-sm text-slate-300">
                {t(locale, "subtitle")}
              </p>
            </div>

            <Link
              href={restaurantPath(locale, "cart")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900"
            >
              <ShoppingCart size={18} />
              {t(locale, "cart")} ({totalItems || 0})
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="relative md:col-span-2">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t(locale, "search")}
                  maxLength={INPUT_LIMITS.search}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-slate-400 focus:bg-white"
                />
              </div>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white"
              >
                <option value="">{t(locale, "allCategories")}</option>

                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <RefreshCw className="animate-spin text-slate-500" />
            </div>
          ) : filteredFoods.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              No restaurant food found.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredFoods.map((food) => {
                const image = getFoodImage(food);
                const finalPrice = getFoodPrice(food);
                const hasDiscount = hasFoodDiscount(food);
                const description =
                  pickText(food.summary, locale, "") ||
                  pickText(food.description, locale, "");

                return (
                  <article
                    key={food._id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="relative h-48 bg-slate-100">
                      {image ? (
                        <img
                          src={image}
                          alt={pickName(food.name, locale)}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-slate-400">
                          <Utensils size={34} />
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <div>
                          <h2 className="line-clamp-1 font-bold text-slate-900">
                            {pickName(food.name, locale)}
                          </h2>

                          <p className="mt-1 text-sm text-slate-500">
                            {food.category || "Food"}
                          </p>
                        </div>

                        <div className="text-right">
                          <div className="font-bold text-slate-900">
                            {money(finalPrice)}
                          </div>

                          {hasDiscount ? (
                            <div className="text-xs text-slate-400 line-through">
                              {money(food.price)}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      {food.preparationTime ? (
                        <div className="mb-3 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                          <Clock size={13} />
                          {food.preparationTime}
                        </div>
                      ) : null}

                      <p className="line-clamp-2 min-h-[40px] text-sm text-slate-600">
                        {description}
                      </p>

                      <button
                        type="button"
                        onClick={() => addToCart(food, 1)}
                        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                      >
                        <ShoppingCart size={16} />
                        {t(locale, "addToCart")}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
