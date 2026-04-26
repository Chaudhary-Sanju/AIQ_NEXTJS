"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    CheckCircle2,
    Loader2,
    ShieldCheck,
    Tag,
    Trash2,
} from "lucide-react";
import { toast } from "sonner";

import http from "@/http";
import { imgUrl } from "@/lib";
import { useCart } from "@/contexts/CartContext";

const PHONE_REGEX = /^(\+977-\d{10}|\+852-\d{8}|\d{10})$/;

const UI = {
    checkout: { en: "Checkout", ne: "चेकआउट", zh: "結帳" },
    generalInfo: { en: "1. General Information", ne: "१. सामान्य जानकारी", zh: "1. 基本資料" },
    deliveryAddress: { en: "2. Delivery Address", ne: "२. डेलिभरी ठेगाना", zh: "2. 送貨地址" },
    paymentMethods: { en: "3. Payment Methods", ne: "३. भुक्तानी विधि", zh: "3. 付款方式" },
    orderSummary: { en: "Order Summary", ne: "अर्डर सारांश", zh: "訂單摘要" },

    fullName: { en: "Full Name", ne: "पूरा नाम", zh: "全名" },
    email: { en: "Email", ne: "इमेल", zh: "電郵" },
    phone: { en: "Phone Number", ne: "फोन नम्बर", zh: "電話號碼" },
    note: { en: "Order Note (Optional)", ne: "अर्डर नोट (वैकल्पिक)", zh: "訂單備註（可選）" },
    city: { en: "City/District", ne: "शहर/जिल्ला", zh: "城市/地區" },
    address: { en: "Address", ne: "ठेगाना", zh: "地址" },
    landmark: { en: "Landmark", ne: "नजिकको स्थान", zh: "地標" },

    selectCity: { en: "Select City/District", ne: "शहर/जिल्ला छान्नुहोस्", zh: "選擇城市/地區" },
    coupon: { en: "Have a coupon code?", ne: "कुपन कोड छ?", zh: "有優惠券代碼？" },
    apply: { en: "Apply", ne: "लागू गर्नुहोस्", zh: "使用" },
    subTotal: { en: "Sub-total", ne: "उप-योग", zh: "小計" },
    deliveryCharge: { en: "Delivery Charge", ne: "डेलिभरी शुल्क", zh: "送貨費" },
    free: { en: "FREE", ne: "निःशुल्क", zh: "免費" },
    total: { en: "Total", ne: "जम्मा", zh: "總額" },
    placeOrder: { en: "Place Order", ne: "अर्डर गर्नुहोस्", zh: "提交訂單" },
    placing: { en: "Placing Order...", ne: "अर्डर हुँदैछ...", zh: "正在提交..." },
    secure: {
        en: "Your order information is secure and encrypted",
        ne: "तपाईंको अर्डर जानकारी सुरक्षित छ",
        zh: "您的訂單資料安全加密",
    },
    selectZoneInfo: {
        en: "Please select a delivery zone to continue",
        ne: "जारी राख्न डेलिभरी क्षेत्र छान्नुहोस्",
        zh: "請選擇送貨區域以繼續",
    },
    paymentInfo: {
        en: "Select your city or district to see available payment methods",
        ne: "भुक्तानी विधि हेर्न शहर वा जिल्ला छान्नुहोस्",
        zh: "選擇城市或地區以查看可用付款方式",
    },
    cod: { en: "Cash on Delivery", ne: "डेलिभरीमा नगद", zh: "貨到付款" },
    emptyCart: { en: "Your cart is empty.", ne: "तपाईंको कार्ट खाली छ।", zh: "購物車是空的。" },
    continueShopping: { en: "Continue Shopping", ne: "किनमेल जारी राख्नुहोस्", zh: "繼續購物" },
};

const t = (key, locale = "en") => UI[key]?.[locale] || UI[key]?.en || key;

const pick = (obj, locale = "en") => {
    if (!obj || typeof obj !== "object") return "";
    return obj?.[locale] || obj?.en || obj?.ne || obj?.zh || "";
};

const money = (value) => {
    const num = Number(value || 0);
    return `Rs. ${num.toLocaleString("en-IN")}`;
};

const safeImageUrl = (image) => {
    if (!image) return "/placeholder.png";

    if (
        typeof image === "string" &&
        (image.startsWith("http://") ||
            image.startsWith("https://") ||
            image.startsWith("/"))
    ) {
        return image;
    }

    return imgUrl(image);
};

const getProduct = (item) => item?.productId || {};
const getProductId = (item) => getProduct(item)?._id || item?.productId;
const getQty = (item) => Number(item?.quantity || item?.qty || 1);

const getPrice = (item) => {
    return Number(
        item?.discounted_price ||
        item?.discountPrice ||
        item?.price ||
        getProduct(item)?.discounted_price ||
        getProduct(item)?.discountPrice ||
        getProduct(item)?.price ||
        0
    );
};

const getProductName = (item, locale) => {
    const product = getProduct(item);
    return pick(product?.name, locale) || product?.name || "Product";
};

const getProductImage = (item) => {
    const product = getProduct(item);

    const image =
        product?.featuredImage ||
        product?.thumbnail ||
        product?.image ||
        product?.images?.[0] ||
        product?.gallery?.[0] ||
        item?.featuredImage ||
        item?.thumbnail ||
        item?.image ||
        item?.images?.[0];

    return safeImageUrl(image);
};

export default function CheckoutPage({ locale = "en" }) {
    const router = useRouter();
    const { clearCart } = useCart();

    const [cart, setCart] = useState(null);
    const [cartLoading, setCartLoading] = useState(true);
    const [zones, setZones] = useState([]);
    const [zoneLoading, setZoneLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [errors, setErrors] = useState({});

    const [form, setForm] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        orderNote: "",
        cityDistrict: "",
        address: "",
        landmark: "",
        paymentMethod: "cod",
    });

    const cartItems = cart?.items || [];

    const selectedZone = useMemo(() => {
        return zones.find((zone) => zone.name === form.cityDistrict);
    }, [zones, form.cityDistrict]);

    const subTotal = useMemo(() => {
        if (cart?.subTotal !== undefined) return Number(cart.subTotal || 0);

        return cartItems.reduce((sum, item) => {
            return sum + getPrice(item) * getQty(item);
        }, 0);
    }, [cart, cartItems]);

    const deliveryCharge = useMemo(() => {
        if (!selectedZone) return 0;

        const threshold = Number(selectedZone?.freeDeliveryThreshold || 0);
        if (threshold > 0 && subTotal >= threshold) return 0;

        return Number(selectedZone?.deliveryCharge || 0);
    }, [selectedZone, subTotal]);

    const total = subTotal + deliveryCharge;

    const loadCart = async () => {
        try {
            setCartLoading(true);
            const res = await http.get("/frontend/cart");
            setCart(res?.data?.data || null);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to load cart.");
        } finally {
            setCartLoading(false);
        }
    };

    const loadZones = async () => {
        try {
            setZoneLoading(true);
            const res = await http.get("/frontend/martDelivery/");
            setZones(res?.data?.data || []);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to load delivery zones.");
        } finally {
            setZoneLoading(false);
        }
    };

    useEffect(() => {
        loadCart();
        loadZones();
    }, []);

    const updateForm = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const validate = () => {
        const next = {};

        if (!form.name.trim()) next.name = "Required";
        if (!form.email.trim()) next.email = "Required";
        if (!form.phoneNumber.trim()) next.phoneNumber = "Required";

        if (form.phoneNumber && !PHONE_REGEX.test(form.phoneNumber)) {
            next.phoneNumber = "Use 9862200000, +977-9862200000 or +852-12345678";
        }

        if (!form.cityDistrict) next.cityDistrict = "Required";
        if (!form.address.trim()) next.address = "Required";
        if (!selectedZone) next.cityDistrict = "Please select delivery zone";
        if (!cartItems.length) next.cart = "Cart is empty";

        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const removeItem = async (productId) => {
        try {
            await http.delete(`/frontend/cart/remove/${productId}`);
            toast.success("Item removed from cart.");
            loadCart();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to remove item.");
        }
    };

    const handleOrder = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            setSubmitting(true);

            const payload = {
                name: form.name.trim(),
                email: form.email.trim(),
                phoneNumber: form.phoneNumber.trim(),
                address: form.address.trim(),
                landmark: form.landmark.trim(),
                cityDistrict: form.cityDistrict,
                deliveryZone: {
                    name: selectedZone.name,
                    deliveryCharge,
                    estimatedDeliveryDays: selectedZone.estimatedDeliveryDays,
                },
                items: cartItems.map((item) => ({
                    productID: getProductId(item),
                    qty: getQty(item),
                })),
                paymentMethod: form.paymentMethod,
                orderNote: form.orderNote.trim(),
            };

            const res = await http.post("/frontend/order/", payload);

            await clearCart({ silent: true });

            setCart({
                items: [],
                totalItems: 0,
                subTotal: 0,
            });

            toast.success(res?.data?.message || "Order placed successfully.");
            router.push(`/${locale}/dashboard?tab=orders`);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to place order.");
        } finally {
            setSubmitting(false);
        }
    };

    if (cartLoading) {
        return (
            <section className="min-h-screen bg-[#f6f6f6] px-4 py-10">
                <div className="mx-auto max-w-6xl">
                    <div className="h-8 w-52 animate-pulse rounded bg-neutral-200" />

                    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_386px]">
                        <div className="space-y-8">
                            <div className="h-72 animate-pulse rounded-lg bg-white" />
                            <div className="h-56 animate-pulse rounded-lg bg-white" />
                        </div>

                        <div className="h-96 animate-pulse rounded-lg bg-white" />
                    </div>
                </div>
            </section>
        );
    }

    if (!cartItems.length) {
        return (
            <section className="min-h-screen bg-[#f6f6f6] px-4 py-14">
                <div className="mx-auto max-w-xl rounded-lg border border-neutral-200 bg-white p-8 text-center shadow-sm">
                    <h1 className="text-2xl font-bold text-[#07152f]">
                        {t("emptyCart", locale)}
                    </h1>

                    <Link
                        href={`/${locale}/products`}
                        className="mt-6 inline-flex rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        {t("continueShopping", locale)}
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-screen bg-[#f6f6f6] px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="mb-8 flex items-center gap-3 text-[#07152f]"
                >
                    <ArrowLeft className="h-5 w-5" />

                    <span className="text-3xl font-bold tracking-tight">
                        {t("checkout", locale)}
                    </span>
                </button>

                <form
                    onSubmit={handleOrder}
                    className="grid gap-8 lg:grid-cols-[1fr_386px] lg:items-start"
                >
                    <div className="space-y-8">
                        <Card>
                            <h2 className="mb-7 text-xl font-bold text-[#07152f]">
                                {t("generalInfo", locale)}
                            </h2>

                            <div className="grid gap-6 md:grid-cols-2">
                                <Input
                                    label={t("fullName", locale)}
                                    required
                                    value={form.name}
                                    error={errors.name}
                                    onChange={(v) => updateForm("name", v)}
                                    placeholder="John Doe"
                                />

                                <Input
                                    label={t("email", locale)}
                                    required
                                    type="email"
                                    value={form.email}
                                    error={errors.email}
                                    onChange={(v) => updateForm("email", v)}
                                    placeholder="john.doe@example.com"
                                />

                                <div className="md:col-span-2">
                                    <Input
                                        label={t("phone", locale)}
                                        required
                                        value={form.phoneNumber}
                                        error={errors.phoneNumber}
                                        onChange={(v) => updateForm("phoneNumber", v)}
                                        placeholder="+977-9862200000"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm text-[#07152f]">
                                        {t("note", locale)}
                                    </label>

                                    <textarea
                                        value={form.orderNote}
                                        onChange={(e) =>
                                            updateForm("orderNote", e.target.value)
                                        }
                                        placeholder="Leave a note, e.g. Call before delivery"
                                        rows={4}
                                        className="w-full rounded-md border border-[#cfd6df] bg-white px-4 py-3 text-sm text-[#07152f] outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                                    />
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <h2 className="mb-7 text-xl font-bold text-[#07152f]">
                                {t("deliveryAddress", locale)}
                            </h2>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm text-[#07152f]">
                                        {t("city", locale)}{" "}
                                        <span className="text-red-500">*</span>
                                    </label>

                                    <select
                                        value={form.cityDistrict}
                                        disabled={zoneLoading}
                                        onChange={(e) =>
                                            updateForm("cityDistrict", e.target.value)
                                        }
                                        className={[
                                            "h-13 w-full rounded-md border bg-white px-4 text-sm text-[#07152f] outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20",
                                            errors.cityDistrict
                                                ? "border-red-400"
                                                : "border-[#cfd6df]",
                                        ].join(" ")}
                                    >
                                        <option value="">
                                            {zoneLoading
                                                ? "Loading..."
                                                : t("selectCity", locale)}
                                        </option>

                                        {zones.map((zone) => (
                                            <option
                                                key={zone._id || zone.name}
                                                value={zone.name}
                                            >
                                                {zone.name}
                                            </option>
                                        ))}
                                    </select>

                                    {errors.cityDistrict && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.cityDistrict}
                                        </p>
                                    )}
                                </div>

                                <Input
                                    label={t("address", locale)}
                                    required
                                    value={form.address}
                                    error={errors.address}
                                    onChange={(v) => updateForm("address", v)}
                                    placeholder="Kathmandu, Tinkune"
                                />

                                <Input
                                    label={t("landmark", locale)}
                                    value={form.landmark}
                                    onChange={(v) => updateForm("landmark", v)}
                                    placeholder="Near Bhatbhateni Supermarket"
                                />
                            </div>
                        </Card>

                        <Card>
                            <h2 className="mb-7 text-xl font-bold text-[#07152f]">
                                {t("paymentMethods", locale)}
                            </h2>

                            {!selectedZone ? (
                                <p className="text-sm text-[#07152f]">
                                    {t("paymentInfo", locale)}
                                </p>
                            ) : (
                                <label className="flex cursor-pointer items-center justify-between rounded-md border border-[#cfd6df] bg-white p-4">
                                    <span className="font-medium text-[#07152f]">
                                        {t("cod", locale)}
                                    </span>

                                    <input
                                        type="radio"
                                        checked={form.paymentMethod === "cod"}
                                        onChange={() =>
                                            updateForm("paymentMethod", "cod")
                                        }
                                        className="accent-cyan-500"
                                    />
                                </label>
                            )}
                        </Card>
                    </div>

                    <aside className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
                        <h2 className="mb-7 text-xl font-bold text-[#07152f]">
                            {t("orderSummary", locale)}
                        </h2>

                        <div className="space-y-4">
                            {cartItems.map((item) => {
                                const productId = getProductId(item);
                                const qty = getQty(item);
                                const price = getPrice(item);

                                return (
                                    <div key={productId} className="flex gap-3">
                                        <div className="relative h-12 w-12 shrink-0 overflow-visible rounded-md bg-neutral-100">
                                            <Image
                                                src={getProductImage(item)}
                                                alt={getProductName(item, locale)}
                                                fill
                                                sizes="48px"
                                                className="rounded-md object-cover"
                                                unoptimized
                                            />

                                            <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-500 px-1 text-xs font-bold text-white">
                                                {qty}
                                            </span>
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="line-clamp-1 text-sm text-[#07152f]">
                                                {getProductName(item, locale)}
                                            </p>

                                            <p className="text-sm font-bold text-cyan-600">
                                                {money(price)} x {qty}
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => removeItem(productId)}
                                            className="text-neutral-400 transition hover:text-red-500"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="my-6 border-t border-[#07152f]" />

                        <div>
                            <div className="mb-3 flex items-center gap-2 text-sm text-[#07152f]">
                                <Tag className="h-4 w-4 text-orange-600" />
                                <span>{t("coupon", locale)}</span>
                            </div>

                            <div className="flex gap-2">
                                <input
                                    value={couponCode}
                                    onChange={(e) =>
                                        setCouponCode(e.target.value)
                                    }
                                    placeholder="SUMMER25"
                                    className="h-10 min-w-0 flex-1 rounded-md border border-[#cfd6df] px-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        toast.info("Coupon API not connected yet.")
                                    }
                                    className="h-10 rounded-md bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700"
                                >
                                    {t("apply", locale)}
                                </button>
                            </div>
                        </div>

                        <div className="mt-7 space-y-4">
                            <SummaryRow
                                label={t("subTotal", locale)}
                                value={money(subTotal)}
                            />

                            <SummaryRow
                                label={t("deliveryCharge", locale)}
                                value={
                                    !selectedZone
                                        ? "-"
                                        : deliveryCharge === 0
                                            ? t("free", locale)
                                            : money(deliveryCharge)
                                }
                            />

                            <div className="border-t border-[#07152f]" />

                            <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-[#07152f]">
                                    {t("total", locale)}
                                </span>

                                <span className="text-lg font-bold text-cyan-600">
                                    {money(total)}
                                </span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting || !selectedZone}
                            className="mt-7 flex h-14 w-full items-center justify-center gap-2 rounded-md bg-blue-600 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    {t("placing", locale)}
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="h-4 w-4" />
                                    {t("placeOrder", locale)}
                                </>
                            )}
                        </button>

                        {!selectedZone && (
                            <p className="mt-3 text-center text-xs text-[#45607a]">
                                {t("selectZoneInfo", locale)}
                            </p>
                        )}

                        <p className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-[#45607a]">
                            <ShieldCheck className="h-4 w-4" />
                            {t("secure", locale)}
                        </p>
                    </aside>
                </form>
            </div>
        </section>
    );
}

function Card({ children }) {
    return (
        <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
            {children}
        </div>
    );
}

function Input({
    label,
    value,
    onChange,
    error,
    placeholder,
    type = "text",
    required = false,
}) {
    return (
        <div>
            <label className="mb-2 block text-sm text-[#07152f]">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={[
                    "h-13 w-full rounded-md border bg-white px-4 text-sm text-[#07152f] outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20",
                    error ? "border-red-400" : "border-[#cfd6df]",
                ].join(" ")}
            />

            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}

function SummaryRow({ label, value }) {
    return (
        <div className="flex items-center justify-between text-[#07152f]">
            <span>{label}</span>
            <span className="font-bold">{value}</span>
        </div>
    );
}