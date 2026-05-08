"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Minus,
  Plus,
  ShoppingCart,
  ChevronRight,
  Star,
  StarHalf,
  PackageCheck,
  ShieldCheck,
  BadgeCheck,
  Truck,
  Tag,
} from "lucide-react";

import http from "@/http";
import { imgUrl } from "@/lib";
import ProductDetailsSkeleton from "../clientComponents/ProductDetailsSkeleton";
import SimilarProductsSection from "./SimilarProductsSection";
import { useCart } from "@/contexts/CartContext";

const pick = (obj, locale = "en") => {
  if (!obj) return "";
  if (typeof obj === "string") return obj;
  if (typeof obj !== "object") return "";
  return obj?.[locale] || obj?.en || obj?.ne || obj?.zh || "";
};

const money = (n) => {
  const num = Number(n);
  if (Number.isNaN(num)) return "";
  return `HK$ ${num}`;
};

const formatDate = (date) => {
  if (!date) return "";

  try {
    return new Date(date).toLocaleDateString();
  } catch {
    return "";
  }
};

const getProductImages = (product) => {
  if (Array.isArray(product?.images) && product.images.length) {
    return product.images;
  }

  if (Array.isArray(product?.image) && product.image.length) {
    return product.image;
  }

  if (product?.featuredImage) return [product.featuredImage];
  if (product?.thumbnail) return [product.thumbnail];

  if (typeof product?.image === "string") return [product.image];

  return [];
};

const normalizeProductForCart = (product) => {
  const images = getProductImages(product);

  return {
    ...product,
    _id: product?._id,
    id: product?._id,
    slug: product?.slug || "",
    name: product?.name || {
      en: "Product",
      ne: "Product",
      zh: "Product",
    },
    summary: product?.summary || {},
    price: product?.price,
    discounted_price: product?.discounted_price ?? product?.discountPrice ?? null,
    discountPrice: product?.discountPrice ?? product?.discounted_price ?? null,
    image: images,
    images,
    featuredImage: product?.featuredImage || images?.[0] || null,
    thumbnail: product?.thumbnail || images?.[0] || null,
    qty: product?.qty,
    stock: product?.stock ?? product?.qty,
    sellOnNoStock: Boolean(product?.sellOnNoStock),
  };
};

const UI = {
  breadcrumbHome: {
    en: "Home",
    ne: "होम",
    zh: "首页",
  },
  breadcrumbProducts: {
    en: "Products",
    ne: "उत्पादनहरू",
    zh: "产品",
  },
  aboutItem: {
    en: "About this item:",
    ne: "यस वस्तु बारे:",
    zh: "关于此商品：",
  },
  quantity: {
    en: "Quantity",
    ne: "मात्रा",
    zh: "数量",
  },
  addToCart: {
    en: "Add to Cart",
    ne: "कार्टमा थप्नुहोस्",
    zh: "加入购物车",
  },
  category: {
    en: "Category",
    ne: "श्रेणी",
    zh: "分类",
  },
  brand: {
    en: "Brand",
    ne: "ब्रान्ड",
    zh: "品牌",
  },
  outOfStock: {
    en: "Out of stock",
    ne: "स्टक सकिएको",
    zh: "缺货",
  },
  inStock: {
    en: "In stock",
    ne: "स्टकमा उपलब्ध",
    zh: "有货",
  },
  allTaxes: {
    en: "MRP incl. of all taxes",
    ne: "सबै कर सहितको मूल्य",
    zh: "含所有税费",
  },
  noProduct: {
    en: "Product not found.",
    ne: "उत्पादन फेला परेन।",
    zh: "未找到商品。",
  },
  loading: {
    en: "Loading product...",
    ne: "उत्पादन लोड हुँदैछ...",
    zh: "正在加载商品...",
  },
  customerReviews: {
    en: "Customer Reviews",
    ne: "ग्राहक समीक्षा",
    zh: "客户评价",
  },
  outOfFive: {
    en: "out of 5 based on",
    ne: "मध्ये 5 बाट आधारित",
    zh: "满分 5 分，基于",
  },
  review: {
    en: "review",
    ne: "समीक्षा",
    zh: "评价",
  },
  reviews: {
    en: "reviews",
    ne: "समीक्षाहरू",
    zh: "评价",
  },
  noReviews: {
    en: "No reviews yet.",
    ne: "अहिलेसम्म कुनै समीक्षा छैन।",
    zh: "暂无评价。",
  },
  verifiedOrder: {
    en: "Verified order",
    ne: "प्रमाणित अर्डर",
    zh: "已验证订单",
  },
  adding: {
    en: "Adding...",
    ne: "थपिँदै...",
    zh: "正在添加...",
  },
  trusted: {
    en: "Trusted product",
    ne: "भरपर्दो उत्पादन",
    zh: "可信商品",
  },
  delivery: {
    en: "Delivery support",
    ne: "डेलिभरी सहयोग",
    zh: "配送支持",
  },
  secure: {
    en: "Secure checkout",
    ne: "सुरक्षित चेकआउट",
    zh: "安全结账",
  },
};

function RatingStars({ value = 0, size = "sm" }) {
  const rating = Number(value || 0);
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  const iconClass = size === "lg" ? "h-5 w-5" : "h-4 w-4";

  return (
    <div className="flex items-center gap-0.5 text-yellow-500">
      {Array.from({ length: 5 }).map((_, index) => {
        if (index < fullStars) {
          return (
            <Star
              key={index}
              className={`${iconClass} fill-current`}
            />
          );
        }

        if (index === fullStars && hasHalf) {
          return (
            <StarHalf
              key={index}
              className={`${iconClass} fill-current`}
            />
          );
        }

        return (
          <Star
            key={index}
            className={`${iconClass} text-neutral-300`}
          />
        );
      })}
    </div>
  );
}

export default function ProductDetailsView({
  locale = "en",
  slug,
  dict,
  initialProduct = null,
}) {
  const [loading, setLoading] = useState(!initialProduct);
  const [product, setProduct] = useState(initialProduct);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { addToCart, busy } = useCart();

  const t = {
    breadcrumbHome:
      dict?.productView?.breadcrumbHome ||
      UI.breadcrumbHome[locale] ||
      UI.breadcrumbHome.en,
    breadcrumbProducts:
      dict?.productView?.breadcrumbProducts ||
      UI.breadcrumbProducts[locale] ||
      UI.breadcrumbProducts.en,
    aboutItem:
      dict?.productView?.aboutItem ||
      UI.aboutItem[locale] ||
      UI.aboutItem.en,
    quantity:
      dict?.productView?.quantity ||
      UI.quantity[locale] ||
      UI.quantity.en,
    addToCart:
      dict?.productView?.addToCart ||
      UI.addToCart[locale] ||
      UI.addToCart.en,
    category:
      dict?.productView?.category ||
      UI.category[locale] ||
      UI.category.en,
    brand:
      dict?.productView?.brand || UI.brand[locale] || UI.brand.en,
    outOfStock:
      dict?.productView?.outOfStock ||
      UI.outOfStock[locale] ||
      UI.outOfStock.en,
    inStock:
      dict?.productView?.inStock || UI.inStock[locale] || UI.inStock.en,
    allTaxes:
      dict?.productView?.allTaxes ||
      UI.allTaxes[locale] ||
      UI.allTaxes.en,
    noProduct:
      dict?.productView?.noProduct ||
      UI.noProduct[locale] ||
      UI.noProduct.en,
    loading:
      dict?.productView?.loading || UI.loading[locale] || UI.loading.en,
    customerReviews:
      dict?.productView?.customerReviews ||
      UI.customerReviews[locale] ||
      UI.customerReviews.en,
    outOfFive:
      dict?.productView?.outOfFive ||
      UI.outOfFive[locale] ||
      UI.outOfFive.en,
    review: dict?.productView?.review || UI.review[locale] || UI.review.en,
    reviews:
      dict?.productView?.reviews || UI.reviews[locale] || UI.reviews.en,
    noReviews:
      dict?.productView?.noReviews ||
      UI.noReviews[locale] ||
      UI.noReviews.en,
    verifiedOrder:
      dict?.productView?.verifiedOrder ||
      UI.verifiedOrder[locale] ||
      UI.verifiedOrder.en,
    adding: dict?.productView?.adding || UI.adding[locale] || UI.adding.en,
    trusted:
      dict?.productView?.trusted || UI.trusted[locale] || UI.trusted.en,
    delivery:
      dict?.productView?.delivery ||
      UI.delivery[locale] ||
      UI.delivery.en,
    secure: dict?.productView?.secure || UI.secure[locale] || UI.secure.en,
  };

  useEffect(() => {
    let mounted = true;

    async function loadProduct() {
      setLoading(true);

      try {
        const res = await http.get(`/frontend/product/${slug}`);
        const data = res?.data?.data || null;

        if (mounted) {
          setProduct(data);
          setSelectedImage(0);
          setQuantity(1);
        }
      } catch {
        if (mounted) {
          setProduct(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (slug && !initialProduct) {
      loadProduct();
    }

    return () => {
      mounted = false;
    };
  }, [slug, initialProduct]);

  const name = useMemo(() => pick(product?.name, locale), [product, locale]);

  const summary = useMemo(
    () => pick(product?.summary, locale),
    [product, locale]
  );

  const images = useMemo(() => getProductImages(product), [product]);

  const reviews = useMemo(() => {
    return Array.isArray(product?.reviews) ? product.reviews : [];
  }, [product]);

  const reviewSummary = product?.reviewSummary || {};
  const averageRating = Number(reviewSummary?.averageRating || 0);
  const totalReviews = Number(reviewSummary?.totalReviews || 0);
  const ratingBreakdown = reviewSummary?.ratingBreakdown || {};

  const hasDiscount =
    product?.discounted_price !== null &&
    product?.discounted_price !== undefined &&
    String(product?.discounted_price) !== "" &&
    Number(product?.discounted_price) < Number(product?.price);

  const discountPercent = (() => {
    if (!hasDiscount) return null;

    const price = Number(product?.price);
    const disc = Number(product?.discounted_price);

    if (!price || Number.isNaN(price) || Number.isNaN(disc)) return null;

    const pct = Math.round(((price - disc) / price) * 100);

    return pct > 0 ? pct : null;
  })();

  const displayPrice = hasDiscount ? product?.discounted_price : product?.price;

  const maxQty = Number(product?.qty) > 0 ? Number(product?.qty) : 1;

  const inStock = Number(product?.qty) > 0 || product?.sellOnNoStock;

  const increaseQty = () => {
    if (product?.sellOnNoStock) {
      setQuantity((prev) => prev + 1);
      return;
    }

    setQuantity((prev) => Math.min(prev + 1, maxQty));
  };

  const decreaseQty = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const handleAddToCart = () => {
    if (!product?._id) return;

    const cartProduct = normalizeProductForCart(product);

    addToCart(product._id, quantity, cartProduct);
  };

  if (loading) {
    return <ProductDetailsSkeleton />;
  }

  if (!product) {
    return (
      <section className="relative min-h-[60vh] overflow-hidden bg-gradient-to-br from-orange-50 via-white to-blue-50 py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="rounded-[28px] border border-orange-100 bg-white/90 p-6 text-center shadow-sm md:p-8">
            <p className="text-sm font-semibold text-red-500">
              {t.noProduct}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-blue-50 py-8 md:py-12">
        <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-neutral-500">
            <Link
              href={`/${locale}`}
              className="font-medium transition hover:text-[#1a4b8f]"
            >
              {t.breadcrumbHome}
            </Link>

            <ChevronRight className="h-4 w-4" />

            <Link
              href={`/${locale}/product?page=1&limit=10`}
              className="font-medium transition hover:text-[#1a4b8f]"
            >
              {t.breadcrumbProducts}
            </Link>

            <ChevronRight className="h-4 w-4" />

            <span className="line-clamp-1 font-semibold text-neutral-900">
              {name}
            </span>
          </div>

          <div className="rounded-[32px] border border-orange-100 bg-white/95 p-4 shadow-[0_24px_70px_rgba(15,42,94,0.10)] backdrop-blur md:p-6 lg:p-8">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
              <div className="grid gap-4 md:grid-cols-[96px_minmax(0,1fr)]">
                <div className="order-2 flex gap-3 overflow-x-auto md:order-1 md:flex-col md:overflow-visible">
                  {images.map((img, index) => {
                    const active = selectedImage === index;

                    return (
                      <button
                        key={`${img}-${index}`}
                        type="button"
                        onClick={() => setSelectedImage(index)}
                        className={[
                          "relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border bg-white transition",
                          active
                            ? "border-[#1a4b8f] ring-4 ring-[#1a4b8f]/10"
                            : "border-orange-100 hover:border-orange-200",
                        ].join(" ")}
                      >
                        <Image
                          src={imgUrl(img)}
                          alt={`${name} ${index + 1}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </button>
                    );
                  })}
                </div>

                <div className="order-1 md:order-2">
                  <div className="relative aspect-square overflow-hidden rounded-[30px] border border-orange-100 bg-gradient-to-br from-white to-orange-50/50">
                    {discountPercent ? (
                      <span className="absolute left-4 top-4 z-10 inline-flex items-center gap-1 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
                        <Tag className="h-3.5 w-3.5" />
                        -{discountPercent}%
                      </span>
                    ) : null}

                    {images[selectedImage] ? (
                      <Image
                        src={imgUrl(images[selectedImage])}
                        alt={name}
                        fill
                        className="object-contain p-6 transition duration-500 hover:scale-105 md:p-10"
                        unoptimized
                        priority
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-neutral-400">
                        No image
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#1a4b8f]">
                  <PackageCheck className="h-4 w-4" />
                  {pick(product?.categoryId?.name, locale) ||
                    t.breadcrumbProducts}
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-neutral-950 md:text-4xl">
                  {name}
                </h1>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                  <RatingStars value={averageRating} size="lg" />

                  <span className="font-bold text-neutral-900">
                    {averageRating ? averageRating.toFixed(1) : "0.0"}
                  </span>

                  <span className="text-neutral-500">
                    ({totalReviews}{" "}
                    {totalReviews === 1 ? t.review : t.reviews})
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap items-end gap-3">
                  <div className="text-3xl font-bold text-[#1a4b8f]">
                    {money(displayPrice)}
                  </div>

                  {hasDiscount ? (
                    <div className="flex items-center gap-2 pb-1">
                      <span className="text-sm text-neutral-400 line-through">
                        {money(product?.price)}
                      </span>

                      {discountPercent ? (
                        <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-500">
                          -{discountPercent}%
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                <p className="mt-1 text-sm text-neutral-500">
                  {t.allTaxes}
                </p>

                {summary ? (
                  <p className="mt-6 max-w-xl text-[15px] leading-7 text-neutral-600">
                    {summary}
                  </p>
                ) : null}

                <div className="mt-6 grid gap-3 rounded-2xl border border-orange-100 bg-orange-50/60 p-4 text-sm text-neutral-700 sm:grid-cols-2">
                  <MetaItem
                    label={t.category}
                    value={pick(product?.categoryId?.name, locale) || "-"}
                  />

                  <MetaItem
                    label={t.brand}
                    value={product?.brandId?.name || "-"}
                  />

                  <div className="sm:col-span-2">
                    <span className="font-semibold text-neutral-900">
                      Status:
                    </span>{" "}
                    <span
                      className={[
                        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold",
                        inStock
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-500",
                      ].join(" ")}
                    >
                      <BadgeCheck className="h-3.5 w-3.5" />
                      {inStock ? t.inStock : t.outOfStock}
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <TrustBadge
                    icon={<ShieldCheck className="h-4 w-4" />}
                    text={t.secure}
                  />
                  <TrustBadge
                    icon={<Truck className="h-4 w-4" />}
                    text={t.delivery}
                  />
                  <TrustBadge
                    icon={<PackageCheck className="h-4 w-4" />}
                    text={t.trusted}
                  />
                </div>

                <div className="mt-8">
                  <p className="mb-3 text-base font-bold text-neutral-950">
                    {t.quantity}
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="inline-flex items-center overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
                      <button
                        type="button"
                        onClick={decreaseQty}
                        className="flex h-12 w-12 items-center justify-center text-neutral-700 transition hover:bg-orange-50"
                      >
                        <Minus className="h-4 w-4" />
                      </button>

                      <div className="flex h-12 min-w-[56px] items-center justify-center border-x border-orange-100 px-4 text-base font-bold text-neutral-950">
                        {quantity}
                      </div>

                      <button
                        type="button"
                        onClick={increaseQty}
                        className="flex h-12 w-12 items-center justify-center text-neutral-700 transition hover:bg-orange-50"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!inStock || busy}
                  className="mt-8 inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#1a4b8f] px-6 text-base font-bold text-white shadow-lg shadow-[#1a4b8f]/20 transition hover:bg-[#0f2a5e] disabled:cursor-not-allowed disabled:opacity-50 md:max-w-[320px]"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {busy ? t.adding : t.addToCart}
                </button>
              </div>
            </div>

            <div className="mt-10 rounded-[26px] border border-orange-100 bg-gradient-to-br from-white to-orange-50/40 p-5 md:p-7">
              <h2 className="text-2xl font-bold text-neutral-950">
                {t.aboutItem}
              </h2>

              <div
                className="mt-3 text-[15px] leading-7 text-neutral-600 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_strong]:font-semibold [&_a]:text-[#1a4b8f] [&_a]:underline"
                dangerouslySetInnerHTML={{
                  __html: product?.description || `<p>${summary || ""}</p>`,
                }}
              />
            </div>

            <div className="mt-8 rounded-[26px] border border-orange-100 bg-white p-5 md:p-7">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-950">
                    {t.customerReviews}
                  </h2>

                  <p className="mt-1 text-sm text-neutral-500">
                    {averageRating ? averageRating.toFixed(1) : "0.0"}{" "}
                    {t.outOfFive} {totalReviews}{" "}
                    {totalReviews === 1 ? t.review : t.reviews}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <RatingStars value={averageRating} size="lg" />

                  <div className="text-3xl font-bold text-neutral-950">
                    {averageRating ? averageRating.toFixed(1) : "0.0"}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = Number(ratingBreakdown?.[star] || 0);

                  const percent = totalReviews
                    ? Math.round((count / totalReviews) * 100)
                    : 0;

                  return (
                    <div key={star} className="flex items-center gap-3 text-sm">
                      <div className="w-12 shrink-0 font-semibold text-neutral-700">
                        {star} ★
                      </div>

                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-orange-50">
                        <div
                          className="h-full rounded-full bg-yellow-400"
                          style={{
                            width: `${percent}%`,
                          }}
                        />
                      </div>

                      <div className="w-12 text-right text-neutral-500">
                        {count}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 grid gap-4">
                {reviews.length > 0 ? (
                  reviews.map((item) => (
                    <div
                      key={item._id}
                      className="rounded-2xl border border-orange-100 bg-orange-50/50 p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-bold text-neutral-950">
                            {item?.user_id?.name || "Customer"}
                          </p>

                          <div className="mt-1 flex items-center gap-2">
                            <RatingStars value={item?.rating || 0} />

                            {item?.order_id?.orderNumber ? (
                              <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-bold text-green-700">
                                {t.verifiedOrder}
                              </span>
                            ) : null}
                          </div>
                        </div>

                        {item?.createdAt ? (
                          <p className="text-xs text-neutral-500">
                            {formatDate(item.createdAt)}
                          </p>
                        ) : null}
                      </div>

                      {item?.review ? (
                        <p className="mt-3 text-sm leading-6 text-neutral-600">
                          {item.review}
                        </p>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-orange-200 bg-orange-50/40 p-5 text-sm text-neutral-500">
                    {t.noReviews}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <SimilarProductsSection
        locale={locale}
        slug={slug}
        limit={6}
        className="bg-white pb-10 md:pb-14"
      />
    </>
  );
}

function MetaItem({ label, value }) {
  return (
    <div>
      <span className="font-semibold text-neutral-900">{label}:</span>{" "}
      <span>{value}</span>
    </div>
  );
}

function TrustBadge({ icon, text }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-orange-100 bg-white px-3 py-3 text-xs font-bold text-neutral-700 shadow-sm">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-50 text-[#1a4b8f]">
        {icon}
      </span>
      <span>{text}</span>
    </div>
  );
}