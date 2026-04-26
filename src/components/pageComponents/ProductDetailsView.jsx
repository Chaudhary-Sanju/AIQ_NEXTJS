"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, ChevronRight } from "lucide-react";

import http from "@/http";
import { imgUrl } from "@/lib";
import ProductDetailsSkeleton from "../clientComponents/ProductDetailsSkeleton";
import SimilarProductsSection from "./SimilarProductsSection";
import { useCart } from "@/contexts/CartContext";

const pick = (obj, locale = "en") => {
  if (!obj || typeof obj !== "object") return "";
  return obj?.[locale] || obj?.en || obj?.ne || obj?.zh || "";
};

const money = (n) => {
  const num = Number(n);
  if (Number.isNaN(num)) return "";
  return `HK$ ${num}`;
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
};

export default function ProductDetailsView({ locale = "en", slug, dict }) {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, busy } = useCart();

  const t = {
    breadcrumbHome: dict?.productView?.breadcrumbHome || UI.breadcrumbHome[locale] || UI.breadcrumbHome.en,
    breadcrumbProducts: dict?.productView?.breadcrumbProducts || UI.breadcrumbProducts[locale] || UI.breadcrumbProducts.en,
    aboutItem: dict?.productView?.aboutItem || UI.aboutItem[locale] || UI.aboutItem.en,
    quantity: dict?.productView?.quantity || UI.quantity[locale] || UI.quantity.en,
    addToCart: dict?.productView?.addToCart || UI.addToCart[locale] || UI.addToCart.en,
    category: dict?.productView?.category || UI.category[locale] || UI.category.en,
    brand: dict?.productView?.brand || UI.brand[locale] || UI.brand.en,
    outOfStock: dict?.productView?.outOfStock || UI.outOfStock[locale] || UI.outOfStock.en,
    inStock: dict?.productView?.inStock || UI.inStock[locale] || UI.inStock.en,
    allTaxes: dict?.productView?.allTaxes || UI.allTaxes[locale] || UI.allTaxes.en,
    noProduct: dict?.productView?.noProduct || UI.noProduct[locale] || UI.noProduct.en,
    loading: dict?.productView?.loading || UI.loading[locale] || UI.loading.en,
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
      } catch (error) {
        if (mounted) {
          setProduct(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (slug) loadProduct();

    return () => {
      mounted = false;
    };
  }, [slug]);

  const name = useMemo(() => pick(product?.name, locale), [product, locale]);
  const summary = useMemo(() => pick(product?.summary, locale), [product, locale]);

  const images = useMemo(() => {
    return Array.isArray(product?.images) ? product.images : [];
  }, [product]);

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
    addToCart(product._id, quantity);
  };

  if (loading) {
    return <ProductDetailsSkeleton />;
  }

  if (!product) {
    return (
      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
            <p className="text-sm text-red-500">{t.noProduct}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href={`/${locale}`} className="hover:text-[#5b4fd4]">
              {t.breadcrumbHome}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/${locale}/product`} className="hover:text-[#5b4fd4]">
              {t.breadcrumbProducts}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-slate-800">{name}</span>
          </div>

          <div className="rounded-[28px] p-4 md:p-6 lg:p-8">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
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
                            ? "border-[#5b4fd4] ring-2 ring-[#5b4fd4]/15"
                            : "border-slate-200 hover:border-slate-300",
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
                  <div className="relative aspect-square overflow-hidden rounded-[28px]">
                    {images[selectedImage] ? (
                      <Image
                        src={imgUrl(images[selectedImage])}
                        alt={name}
                        fill
                        className="object-contain p-6 md:p-10"
                        unoptimized
                        priority
                      />
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <h1 className="text-2xl font-extrabold uppercase tracking-tight text-[#161616] md:text-4xl">
                  {name}
                </h1>

                <div className="mt-4 flex items-end gap-3">
                  <div className="text-3xl font-bold text-[#161616]">
                    {money(displayPrice)}
                  </div>

                  {hasDiscount ? (
                    <div className="flex items-center gap-2 pb-1">
                      <span className="text-sm text-slate-400 line-through">
                        {money(product?.price)}
                      </span>
                      {discountPercent ? (
                        <span className="text-sm font-semibold text-red-500">
                          -{discountPercent}%
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                <p className="mt-1 text-sm text-slate-500">{t.allTaxes}</p>

                {summary ? (
                  <p className="mt-6 max-w-xl text-[15px] leading-7 text-slate-700">
                    {summary}
                  </p>
                ) : null}

                <div className="mt-6 grid gap-2 text-sm text-slate-700">
                  <div>
                    <span className="font-semibold">{t.category}:</span>{" "}
                    {pick(product?.categoryId?.name, locale)}
                  </div>
                  <div>
                    <span className="font-semibold">{t.brand}:</span>{" "}
                    {product?.brandId?.name || "-"}
                  </div>
                  <div>
                    <span className="font-semibold">Status:</span>{" "}
                    <span className={inStock ? "text-green-600" : "text-red-500"}>
                      {inStock ? t.inStock : t.outOfStock}
                    </span>
                  </div>
                </div>

                <div className="mt-8">
                  <p className="mb-3 text-base font-semibold text-[#161616]">
                    {t.quantity}
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="inline-flex items-center overflow-hidden rounded-xl border border-slate-200 bg-white">
                      <button
                        type="button"
                        onClick={decreaseQty}
                        className="flex h-12 w-12 items-center justify-center text-slate-700 transition hover:bg-slate-50"
                      >
                        <Minus className="h-4 w-4" />
                      </button>

                      <div className="flex h-12 min-w-[56px] items-center justify-center border-x border-slate-200 px-4 text-base font-semibold text-slate-900">
                        {quantity}
                      </div>

                      <button
                        type="button"
                        onClick={increaseQty}
                        className="flex h-12 w-12 items-center justify-center text-slate-700 transition hover:bg-slate-50"
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
                  className="mt-8 inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#5b4fd4] px-6 text-base font-semibold text-white transition hover:bg-[#4a3fcb] disabled:cursor-not-allowed disabled:opacity-50 md:max-w-[320px]"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {busy ? "Adding..." : t.addToCart}
                </button>
              </div>
            </div>

            <div className="mt-10 rounded-[24px] bg-white p-5 md:p-7">
              <h2 className="text-2xl font-bold text-[#161616]">{t.aboutItem}</h2>

              <div
                className="mt-3 text-[15px] leading-7 text-slate-700 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_strong]:font-semibold [&_a]:text-[#5b4fd4] [&_a]:underline"
                dangerouslySetInnerHTML={{
                  __html: product?.description || `<p>${summary || ""}</p>`,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <SimilarProductsSection
        locale={locale}
        slug={slug}
        limit={6}
        className="pb-10 md:pb-14"
      />
    </>
  );
}