"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    CheckCircle2,
    CreditCard,
    Loader2,
    MapPin,
    ShieldCheck,
    Tag,
    Trash2,
    Truck,
    UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, setUser } from "@/store/userSlice";

import http from "@/http";
import { clearStorage, fromStorage, imgUrl } from "@/lib";
import { useCart } from "@/contexts/CartContext";
import { INPUT_LIMITS } from "@/constants/inputLimits";
import CountryPhoneInput, { normalizeCountryPhone } from "@/components/clientComponents/CountryPhoneInput";

const PHONE_REGEX = /^(\+977-\d{10}|\+852-\d{8})$/;

const UI = {
    checkout: { en: "Checkout", ne: "चेकआउट", zh: "結帳" },
    generalInfo: { en: "General Information", ne: "सामान्य जानकारी", zh: "基本資料" },
    deliveryAddress: { en: "Delivery Address", ne: "डेलिभरी ठेगाना", zh: "送貨地址" },
    paymentMethods: { en: "Payment Methods", ne: "भुक्तानी विधि", zh: "付款方式" },
    orderSummary: { en: "Order Summary", ne: "अर्डर सारांश", zh: "訂單摘要" },
    fullName: { en: "Full Name", ne: "पूरा नाम", zh: "全名" },
    email: { en: "Email", ne: "इमेल", zh: "電郵" },
    phone: { en: "Phone Number", ne: "फोन नम्बर", zh: "電話號碼" },
    note: { en: "Order Note (Optional)", ne: "अर्डर नोट (वैकल्पिक)", zh: "訂單備註（可選）" },
    city: { en: "City/District", ne: "शहर/जिल्ला", zh: "城市/地區" },
    address: { en: "Address", ne: "ठेगाना", zh: "地址" },
    landmark: { en: "Landmark", ne: "नजिकको स्थान", zh: "地標" },
    deliveryType: { en: "Delivery Type", ne: "डेलिभरी प्रकार", zh: "送貨類型" },
    standardDelivery: { en: "Standard Delivery", ne: "सामान्य डेलिभरी", zh: "標準送貨" },
    expressDelivery: { en: "Express Delivery", ne: "एक्सप्रेस डेलिभरी", zh: "特快送貨" },
    regularDelivery: { en: "Regular delivery", ne: "सामान्य डेलिभरी", zh: "標準送貨" },
    fasterDelivery: { en: "Faster delivery", ne: "छिटो डेलिभरी", zh: "更快送貨" },
    freeAbove: { en: "Free above", ne: "यो भन्दा माथि नि:शुल्क", zh: "滿額免費" },
    codUnavailable: {
        en: "Cash on Delivery is not available for this location.",
        ne: "यो स्थानमा Cash on Delivery उपलब्ध छैन।",
        zh: "此地區不支援貨到付款。",
    },
    selectCity: { en: "Select City/District", ne: "शहर/जिल्ला छान्नुहोस्", zh: "選擇城市/地區" },
    coupon: { en: "Have a coupon code?", ne: "कुपन कोड छ?", zh: "有優惠券代碼？" },
    apply: { en: "Apply", ne: "लागू गर्नुहोस्", zh: "使用" },
    remove: { en: "Remove", ne: "हटाउनुहोस्", zh: "移除" },
    subTotal: { en: "Sub-total", ne: "उप-योग", zh: "小計" },
    discount: { en: "Discount", ne: "छुट", zh: "折扣" },
    deliveryCharge: { en: "Delivery Charge", ne: "डेलिभरी शुल्क", zh: "送貨費" },
    free: { en: "FREE", ne: "निःशुल्क", zh: "免費" },
    total: { en: "Total", ne: "जम्मा", zh: "總額" },
    placeOrder: { en: "Place Order", ne: "अर्डर गर्नुहोस्", zh: "提交訂單" },
    payNow: { en: "Pay Now", ne: "अहिले भुक्तानी गर्नुहोस्", zh: "立即付款" },
    placing: { en: "Processing...", ne: "प्रोसेस हुँदैछ...", zh: "處理中..." },
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
    paymentAsia: { en: "PaymentAsia", ne: "PaymentAsia", zh: "PaymentAsia" },
    stripe: { en: "Stripe", ne: "Stripe", zh: "Stripe" },
    paymentAsiaInfo: {
        en: "Pay securely through PaymentAsia hosted checkout.",
        ne: "PaymentAsia hosted checkout मार्फत सुरक्षित भुक्तानी गर्नुहोस्।",
        zh: "透過 PaymentAsia 託管結帳安全付款。",
    },
    stripeInfo: {
        en: "Pay securely by card using Stripe.",
        ne: "Stripe मार्फत card प्रयोग गरी सुरक्षित भुक्तानी गर्नुहोस्।",
        zh: "使用 Stripe 以信用卡安全付款。",
    },
    guestOnlineOnly: {
        en: "Guest checkout is available with PaymentAsia or Stripe. Login to use Cash on Delivery.",
        ne: "अतिथि चेकआउट PaymentAsia वा Stripe संग उपलब्ध छ। नगदमा डेलिभरी प्रयोग गर्न लगइन गर्नुहोस्।",
        zh: "訪客結帳可使用 PaymentAsia 或 Stripe。登錄以使用貨到付款。",
    },
    emptyCart: { en: "Your cart is empty.", ne: "तपाईंको कार्ट खाली छ।", zh: "購物車是空的。" },
    emptyCartDesc: {
        en: "Add some products to your cart before checkout.",
        ne: "चेकआउट गर्नु अघि केही उत्पादनहरू कार्टमा थप्नुहोस्।",
        zh: "請先將商品加入購物車再結帳。",
    },
    continueShopping: { en: "Continue Shopping", ne: "किनमेल जारी राख्नुहोस्", zh: "繼續購物" },
};

const t = (key, locale = "en") => UI[key]?.[locale] || UI[key]?.en || key;

const pick = (obj, locale = "en") => {
    if (!obj || typeof obj !== "object") return "";
    return obj?.[locale] || obj?.en || obj?.ne || obj?.zh || "";
};

const money = (value) => {
    const num = Number(value || 0);
    return `HK$ ${num.toLocaleString("en-HK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};

const normalizePhoneNumber = (value) => normalizeCountryPhone(value);


const getPhoneHelperText = (value) => {
    const normalized = normalizeCountryPhone(value);
    if (normalized.startsWith("+977")) return "Nepal selected. Enter 10 digits.";
    return "Hong Kong selected. Enter 8 digits.";
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

const getApiErrorMessage = (err, fallback = "Something went wrong.") => {
    const normalize = (value) => {
        if (!value) return "";
        if (typeof value === "string") return value;
        if (Array.isArray(value)) return value.map(normalize).filter(Boolean).join(", ");
        if (typeof value === "object") {
            return value.errorDescription || value.message || value.error || value.errorCode || value.description || JSON.stringify(value);
        }
        return String(value);
    };

    const data = err?.response?.data;
    return normalize(data?.message) || normalize(data?.error) || normalize(data?.errors) || normalize(data) || normalize(err?.message) || fallback;
};

const safeToastError = (value, fallback = "Something went wrong.") => {
    toast.error(getApiErrorMessage(value, fallback));
};

const getProduct = (item) => item?.productId || item?.product || {};
const getProductId = (item) => getProduct(item)?._id || item?.productId || item?.productID;
const getQty = (item) => Number(item?.quantity || item?.qty || 1);
const getPrice = (item) => Number(item?.discounted_price || item?.discountPrice || item?.price || getProduct(item)?.discounted_price || getProduct(item)?.discountPrice || getProduct(item)?.price || 0);

const getProductName = (item, locale) => {
    const product = getProduct(item);
    return pick(product?.name, locale) || product?.name || "Product";
};

const getProductImage = (item) => {
    const product = getProduct(item);
    const image =
        product?.featuredImage ||
        product?.thumbnail ||
        product?.image?.[0] ||
        product?.image ||
        product?.images?.[0] ||
        product?.gallery?.[0] ||
        item?.featuredImage ||
        item?.thumbnail ||
        item?.image?.[0] ||
        item?.image ||
        item?.images?.[0];

    return safeImageUrl(image);
};

export default function CheckoutPage({ locale = "en" }) {
    return <CheckoutForm locale={locale} />;
}

function CheckoutForm({ locale = "en" }) {
    const router = useRouter();
    const dispatch = useDispatch();
    const { cart, loading: cartLoading, clearCart, removeItem: removeCartItem, fetchCart } = useCart();
    const user = useSelector((state) => state.user.value);
    const isLoggedIn = user && Object.keys(user).length > 0;

    const [zones, setZones] = useState([]);
    const [zoneLoading, setZoneLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [couponLoading, setCouponLoading] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        orderNote: "",
        cityDistrict: "",
        address: "",
        landmark: "",
        paymentMethod: "paymentasia",
        deliveryType: "standard",
    });

    const cartItems = cart?.items || [];
    const productListHref = `/${locale}/product?page=1&limit=10`;

    const selectedZone = useMemo(() => {
        return zones.find((zone) => zone.name === form.cityDistrict);
    }, [zones, form.cityDistrict]);

    const getStandardDeliveryCharge = (zone) => Number(zone?.standardDeliveryCharge ?? zone?.deliveryCharge ?? 0);
    const getExpressDeliveryCharge = (zone) => Number(zone?.expressDeliveryCharge ?? zone?.deliveryCharge ?? 0);
    const getFreeDeliveryThreshold = (zone) => Number(zone?.freeDeliveryThreshold ?? 0);
    const isCodAvailable = (zone) => Boolean(zone?.codAvailable);

    const subTotal = useMemo(() => {
        if (cart?.subTotal !== undefined) return Number(cart.subTotal || 0);
        return cartItems.reduce((sum, item) => sum + getPrice(item) * getQty(item), 0);
    }, [cart, cartItems]);

    const deliveryCharge = useMemo(() => {
        if (!selectedZone) return 0;

        const threshold = getFreeDeliveryThreshold(selectedZone);

        if (threshold > 0 && subTotal >= threshold) return 0;

        return form.deliveryType === "express"
            ? getExpressDeliveryCharge(selectedZone)
            : getStandardDeliveryCharge(selectedZone);
    }, [selectedZone, subTotal, form.deliveryType]);

    const discountAmount = Number(appliedCoupon?.discountAmount || 0);
    const total = Math.max(subTotal + deliveryCharge - discountAmount, 0);

    useEffect(() => {
        fetchCart();
        loadZones();

        const token = fromStorage("hkmandu");

        if (isLoggedIn) {
            fillUserInfo(user);
            return;
        }

        if (token) {
            http.get("frontend/auth/details")
                .then((res) => {
                    const u = res.data?.user ?? res.data;

                    if (u) {
                        dispatch(setUser(u));
                        fillUserInfo(u);
                    }
                })
                .catch(() => {
                    clearStorage("hkmandu");
                    dispatch(clearUser());
                });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    useEffect(() => {
        if (isLoggedIn) fillUserInfo(user);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn, user]);

    useEffect(() => {
        setForm((prev) => ({
            ...prev,
            paymentMethod: isLoggedIn ? "cod" : "paymentasia",
        }));
    }, [isLoggedIn]);

    useEffect(() => {
        if (!selectedZone) return;

        if (!isLoggedIn) {
            setForm((prev) => ({
                ...prev,
                paymentMethod: ["paymentasia", "stripe"].includes(prev.paymentMethod)
                    ? prev.paymentMethod
                    : "paymentasia",
            }));
            return;
        }

        if (!isCodAvailable(selectedZone) && form.paymentMethod === "cod") {
            setForm((prev) => ({
                ...prev,
                paymentMethod: "paymentasia",
            }));
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedZone, isLoggedIn]);

    useEffect(() => {
        setAppliedCoupon(null);
    }, [subTotal]);

    const fillUserInfo = (u) => {
        if (!u) return;

        setForm((prev) => ({
            ...prev,
            name: prev.name || u?.name || u?.displayName || "",
            email: prev.email || u?.email || "",
            phoneNumber: prev.phoneNumber || normalizePhoneNumber(u?.phoneNumber || u?.phone || u?.mobile || ""),
        }));
    };

    const loadZones = async () => {
        try {
            setZoneLoading(true);

            const res = await http.get("/frontend/martDelivery/");
            const data = res?.data?.data;

            if (Array.isArray(data)) {
                setZones(data);
            } else if (Array.isArray(data?.deliveryZone)) {
                setZones(data.deliveryZone);
            } else {
                setZones([]);
            }
        } catch (err) {
            safeToastError(err, "Failed to load delivery zones.");
        } finally {
            setZoneLoading(false);
        }
    };

    const updateForm = (field, value) => {
        setForm((prev) => {
            const next = { ...prev, [field]: value };

            if (field === "cityDistrict") {
                next.deliveryType = "standard";

                const zone = zones.find((item) => item.name === value);

                if (!isLoggedIn || (zone && !isCodAvailable(zone))) {
                    next.paymentMethod = "paymentasia";
                } else if (zone && isCodAvailable(zone)) {
                    next.paymentMethod = prev.paymentMethod || "cod";
                }
            }

            return next;
        });

        setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const validate = () => {
        const next = {};

        if (!form.name.trim()) next.name = "Full name is required";
        if (!form.email.trim()) next.email = "Email is required";
        if (!form.phoneNumber.trim()) next.phoneNumber = "Phone number is required";

        const formattedPhone = normalizePhoneNumber(form.phoneNumber);

        if (formattedPhone && !PHONE_REGEX.test(formattedPhone)) {
            next.phoneNumber = "Invalid phone number. Use 10 digits for Nepal or 8 digits for Hong Kong.";
        }

        if (!form.cityDistrict) next.cityDistrict = "City/District is required";
        if (!form.address.trim()) next.address = "Address is required";
        if (!selectedZone) next.cityDistrict = "Please select delivery zone";
        if (!cartItems.length) next.cart = "Cart is empty";

        if (!["standard", "express"].includes(form.deliveryType)) {
            next.deliveryType = "Please select valid delivery type.";
        }

        if (!["cod", "paymentasia", "stripe"].includes(form.paymentMethod)) {
            next.paymentMethod = "Please select a valid payment method.";
        }

        if (selectedZone && form.paymentMethod === "cod" && !isCodAvailable(selectedZone)) {
            next.paymentMethod = "Cash on Delivery is not available for this location.";
        }

        if (!isLoggedIn && form.paymentMethod === "cod") {
            next.paymentMethod = "Please login to use Cash on Delivery.";
        }

        setErrors(next);

        if (Object.keys(next).length > 0) {
            toast.error(Object.values(next)[0]);
            return false;
        }

        return true;
    };

    const resetCartAfterSuccess = async () => {
        await clearCart({ silent: true });
        await fetchCart();
        setAppliedCoupon(null);
        setCouponCode("");
    };

    const removeItem = async (productId) => {
        await removeCartItem(productId);
        setAppliedCoupon(null);
        await fetchCart();
    };

    const applyCoupon = async () => {
        try {
            if (!isLoggedIn) return toast.error("Please login to use coupon codes.");
            if (!couponCode.trim()) return toast.error("Please enter coupon code.");
            if (!subTotal || subTotal <= 0) return toast.error("Cart subtotal is invalid.");

            setCouponLoading(true);

            const res = await http.post("/frontend/coupon/apply", {
                code: couponCode.trim(),
                subTotal,
            });

            const couponData = res?.data?.data;

            setAppliedCoupon(couponData);
            setCouponCode(couponData?.code || couponCode.trim());

            toast.success(res?.data?.message || "Coupon applied successfully.");
        } catch (err) {
            setAppliedCoupon(null);
            safeToastError(err, "Failed to apply coupon.");
        } finally {
            setCouponLoading(false);
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode("");
        toast.success("Coupon removed.");
    };

    const redirectToHostedPayment = (res) => {
        const payment = res?.data?.payment || res?.data?.data?.payment || {};
        const redirectUrl =
            payment.redirectUrl ||
            payment.paymentUrl ||
            payment.url ||
            res?.data?.redirectUrl ||
            res?.data?.paymentUrl;

        if (!redirectUrl) {
            console.log("Online payment response:", res?.data);
            toast.error("Payment link not received.");
            return false;
        }

        window.location.href = redirectUrl;
        return true;
    };

    const handlePhoneBlur = () => {
        updateForm("phoneNumber", normalizePhoneNumber(form.phoneNumber));
    };

    const handleOrder = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            setSubmitting(true);

            const payload = {
                name: form.name.trim(),
                email: form.email.trim(),
                phoneNumber: normalizePhoneNumber(form.phoneNumber),
                address: form.address.trim(),
                landmark: form.landmark.trim(),
                cityDistrict: form.cityDistrict,
                deliveryType: form.deliveryType,
                deliveryZone: {
                    name: selectedZone.name,
                    standardDeliveryCharge: getStandardDeliveryCharge(selectedZone),
                    expressDeliveryCharge: getExpressDeliveryCharge(selectedZone),
                    deliveryCharge,
                    freeDeliveryThreshold: getFreeDeliveryThreshold(selectedZone),
                    codAvailable: isCodAvailable(selectedZone),
                },
                items: cartItems.map((item) => ({
                    productID: getProductId(item),
                    qty: getQty(item),
                })),
                coupon:
                    isLoggedIn && appliedCoupon
                        ? {
                            couponId: appliedCoupon.couponId,
                            code: appliedCoupon.code,
                            discountType: appliedCoupon.discountType,
                            discountValue: appliedCoupon.discountValue,
                            discountAmount: appliedCoupon.discountAmount,
                        }
                        : null,
                discountAmount,
                finalAmount: total,
                paymentMethod: form.paymentMethod,
                orderNote: form.orderNote.trim(),
                locale,
            };

            const res = await http.post("/frontend/order/", payload);

            if (["paymentasia", "stripe"].includes(form.paymentMethod)) {
                redirectToHostedPayment(res);
                return;
            }

            toast.success(res?.data?.message || "Order placed successfully.");

            await resetCartAfterSuccess();

            router.push(`/${locale}/dashboard?tab=orders`);
        } catch (err) {
            toast.error(getApiErrorMessage(err, "Failed to place order."));
        } finally {
            setSubmitting(false);
        }
    };

    if (cartLoading) {
        return (
            <section className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 px-4 py-10">
                <div className="mx-auto max-w-6xl">
                    <div className="h-9 w-52 animate-pulse rounded-xl bg-orange-100" />

                    <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px]">
                        <div className="space-y-6">
                            <div className="h-72 animate-pulse rounded-[28px] bg-white shadow-sm ring-1 ring-orange-100" />
                            <div className="h-56 animate-pulse rounded-[28px] bg-white shadow-sm ring-1 ring-orange-100" />
                            <div className="h-48 animate-pulse rounded-[28px] bg-white shadow-sm ring-1 ring-orange-100" />
                        </div>

                        <div className="h-[520px] animate-pulse rounded-[28px] bg-white shadow-sm ring-1 ring-orange-100" />
                    </div>
                </div>
            </section>
        );
    }

    if (!cartItems.length) {
        return (
            <section className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 px-4 py-16">
                <div className="mx-auto max-w-lg rounded-[30px] bg-white p-8 text-center shadow-sm ring-1 ring-orange-100">
                    <h1 className="text-2xl font-bold text-neutral-950">
                        {t("emptyCart", locale)}
                    </h1>

                    <p className="mt-3 text-neutral-500">
                        {t("emptyCartDesc", locale)}
                    </p>

                    <Link
                        href={productListHref}
                        className="mt-6 inline-flex rounded-xl bg-[#1a4b8f] px-5 py-3 text-sm font-bold text-white"
                    >
                        {t("continueShopping", locale)}
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <Link
                    href={productListHref}
                    className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#1a4b8f] hover:text-[#0f2a5e]"
                >
                    <ArrowLeft className="h-4 w-4" />
                    {t("continueShopping", locale)}
                </Link>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-neutral-950 sm:text-4xl">
                        {t("checkout", locale)}
                    </h1>

                    <p className="mt-2 text-neutral-500">
                        Grocery-style checkout with delivery zone, payment, coupon, and order summary.
                    </p>
                </div>

                <form onSubmit={handleOrder} className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_410px]">
                    <div className="space-y-6">
                        <Card icon={<UserRound className="h-5 w-5" />} title={t("generalInfo", locale)} index="01">
                            <div className="grid gap-4 md:grid-cols-2">
                                <Field label={t("fullName", locale)} error={errors.name}>
                                    <input
                                        value={form.name}
                                        onChange={(e) => updateForm("name", e.target.value)}
                                        maxLength={INPUT_LIMITS.name}
                                        className={inputClass(errors.name)}
                                    />
                                </Field>

                                <Field label={t("email", locale)} error={errors.email}>
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => updateForm("email", e.target.value)}
                                        maxLength={INPUT_LIMITS.email}
                                        className={inputClass(errors.email)}
                                    />
                                </Field>

                                <Field label={t("phone", locale)} error={errors.phoneNumber} hint={getPhoneHelperText(form.phoneNumber)}>
                                    <CountryPhoneInput
                                        value={form.phoneNumber}
                                        onChange={(value) => updateForm("phoneNumber", value)}
                                        hasError={!!errors.phoneNumber}
                                    />
                                </Field>

                                <Field label={t("note", locale)}>
                                    <input
                                        value={form.orderNote}
                                        onChange={(e) => updateForm("orderNote", e.target.value)}
                                        maxLength={INPUT_LIMITS.note}
                                        className={inputClass()}
                                    />
                                </Field>
                            </div>
                        </Card>

                        <Card icon={<MapPin className="h-5 w-5" />} title={t("deliveryAddress", locale)} index="02">
                            <div className="grid gap-4 md:grid-cols-2">
                                <Field label={t("city", locale)} error={errors.cityDistrict}>
                                    <select
                                        value={form.cityDistrict}
                                        onChange={(e) => updateForm("cityDistrict", e.target.value)}
                                        className={inputClass(errors.cityDistrict)}
                                        disabled={zoneLoading}
                                    >
                                        <option value="">
                                            {zoneLoading ? "Loading..." : t("selectCity", locale)}
                                        </option>

                                        {zones.map((zone) => (
                                            <option key={zone._id || zone.name} value={zone.name}>
                                                {zone.name}
                                            </option>
                                        ))}
                                    </select>
                                </Field>

                                <Field label={t("landmark", locale)}>
                                    <input
                                        value={form.landmark}
                                        onChange={(e) => updateForm("landmark", e.target.value)}
                                        maxLength={INPUT_LIMITS.landmark}
                                        className={inputClass()}
                                    />
                                </Field>

                                <div className="md:col-span-2">
                                    <Field label={t("address", locale)} error={errors.address}>
                                        <textarea
                                            rows={3}
                                            value={form.address}
                                            onChange={(e) => updateForm("address", e.target.value)}
                                            maxLength={INPUT_LIMITS.note}
                                            className={`${inputClass(errors.address)} min-h-[96px] resize-none`}
                                        />
                                    </Field>
                                </div>
                            </div>
                        </Card>

                        <Card icon={<Truck className="h-5 w-5" />} title={t("deliveryType", locale)} index="03">
                            {!selectedZone ? (
                                <div className="rounded-2xl bg-orange-50 p-4 text-sm font-medium text-neutral-600">
                                    {t("selectZoneInfo", locale)}
                                </div>
                            ) : (
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <RadioCard
                                        checked={form.deliveryType === "standard"}
                                        title={t("standardDelivery", locale)}
                                        price={
                                            getFreeDeliveryThreshold(selectedZone) > 0 &&
                                                subTotal >= getFreeDeliveryThreshold(selectedZone)
                                                ? t("free", locale)
                                                : money(getStandardDeliveryCharge(selectedZone))
                                        }
                                        description={t("regularDelivery", locale)}
                                        onChange={() => updateForm("deliveryType", "standard")}
                                    />

                                    <RadioCard
                                        checked={form.deliveryType === "express"}
                                        title={t("expressDelivery", locale)}
                                        price={
                                            getFreeDeliveryThreshold(selectedZone) > 0 &&
                                                subTotal >= getFreeDeliveryThreshold(selectedZone)
                                                ? t("free", locale)
                                                : money(getExpressDeliveryCharge(selectedZone))
                                        }
                                        description={t("fasterDelivery", locale)}
                                        onChange={() => updateForm("deliveryType", "express")}
                                    />
                                </div>
                            )}
                        </Card>

                        <Card icon={<CreditCard className="h-5 w-5" />} title={t("paymentMethods", locale)} index="04">
                            {!selectedZone ? (
                                <div className="rounded-2xl bg-orange-50 p-4 text-sm font-medium text-neutral-600">
                                    {t("paymentInfo", locale)}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {isLoggedIn && isCodAvailable(selectedZone) && (
                                        <PaymentOption
                                            checked={form.paymentMethod === "cod"}
                                            label={t("cod", locale)}
                                            icon={<Truck className="h-4 w-4" />}
                                            onChange={() => updateForm("paymentMethod", "cod")}
                                        />
                                    )}

                                    {isLoggedIn && !isCodAvailable(selectedZone) && (
                                        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-3 text-sm text-amber-800">
                                            {t("codUnavailable", locale)}
                                        </div>
                                    )}

                                    <PaymentOption
                                        checked={form.paymentMethod === "paymentasia"}
                                        label={t("paymentAsia", locale)}
                                        icon={<CreditCard className="h-4 w-4" />}
                                        onChange={() => updateForm("paymentMethod", "paymentasia")}
                                    />

                                    <PaymentOption
                                        checked={form.paymentMethod === "stripe"}
                                        label={t("stripe", locale)}
                                        icon={<CreditCard className="h-4 w-4" />}
                                        onChange={() => updateForm("paymentMethod", "stripe")}
                                    />

                                    {form.paymentMethod === "paymentasia" && (
                                        <InfoBox>{t("paymentAsiaInfo", locale)}</InfoBox>
                                    )}

                                    {form.paymentMethod === "stripe" && (
                                        <InfoBox>{t("stripeInfo", locale)}</InfoBox>
                                    )}

                                    {!isLoggedIn && (
                                        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-3 text-sm text-amber-800">
                                            {t("guestOnlineOnly", locale)}
                                        </div>
                                    )}

                                    {errors.paymentMethod && (
                                        <p className="text-xs text-red-500">
                                            {errors.paymentMethod}
                                        </p>
                                    )}
                                </div>
                            )}
                        </Card>
                    </div>

                    <aside className="h-fit rounded-[28px] border border-orange-100 bg-white/95 p-5 shadow-[0_18px_45px_rgba(15,42,94,0.08)] backdrop-blur lg:sticky lg:top-24">
                        <h2 className="mb-6 text-lg font-bold text-neutral-950">
                            {t("orderSummary", locale)}
                        </h2>

                        <div className="max-h-[300px] space-y-4 overflow-y-auto pr-1">
                            {cartItems.map((item) => (
                                <div
                                    key={getProductId(item)}
                                    className="flex gap-3 rounded-2xl border border-orange-100 bg-orange-50/30 p-3"
                                >
                                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white">
                                        <Image
                                            src={getProductImage(item)}
                                            alt={getProductName(item, locale)}
                                            fill
                                            sizes="64px"
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="line-clamp-1 text-sm font-bold text-neutral-900">
                                            {getProductName(item, locale)}
                                        </p>

                                        <p className="mt-1 text-xs text-neutral-500">
                                            Qty: {getQty(item)}
                                        </p>

                                        <p className="mt-1 text-sm font-bold text-[#1a4b8f]">
                                            {money(getPrice(item) * getQty(item))}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => removeItem(getProductId(item))}
                                        className="h-9 w-9 rounded-xl text-neutral-400 hover:bg-red-50 hover:text-red-500"
                                    >
                                        <Trash2 className="mx-auto h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 rounded-2xl border border-orange-100 bg-orange-50/40 p-4">
                            <p className="mb-3 flex items-center gap-2 text-sm font-bold text-neutral-800">
                                <Tag className="h-4 w-4 text-[#1a4b8f]" />
                                {t("coupon", locale)}
                            </p>

                            <div className="flex gap-2">
                                <input
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    placeholder="CODE"
                                    maxLength={INPUT_LIMITS.coupon}
                                    className="h-11 min-w-0 flex-1 rounded-xl border border-orange-100 bg-white px-3 text-sm outline-none focus:border-[#1a4b8f]"
                                    disabled={Boolean(appliedCoupon)}
                                />

                                {appliedCoupon ? (
                                    <button
                                        type="button"
                                        onClick={removeCoupon}
                                        className="rounded-xl bg-neutral-100 px-4 text-sm font-bold text-neutral-700"
                                    >
                                        {t("remove", locale)}
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={applyCoupon}
                                        disabled={couponLoading}
                                        className="rounded-xl bg-[#1a4b8f] px-4 text-sm font-bold text-white disabled:opacity-60"
                                    >
                                        {couponLoading ? "..." : t("apply", locale)}
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="mt-7 space-y-4">
                            <SummaryRow label={t("subTotal", locale)} value={money(subTotal)} />

                            <SummaryRow
                                label={`${t("deliveryCharge", locale)} ${selectedZone
                                        ? form.deliveryType === "express"
                                            ? `(${t("expressDelivery", locale)})`
                                            : `(${t("standardDelivery", locale)})`
                                        : ""
                                    }`}
                                value={
                                    !selectedZone
                                        ? "-"
                                        : deliveryCharge === 0
                                            ? t("free", locale)
                                            : money(deliveryCharge)
                                }
                            />

                            {appliedCoupon && (
                                <SummaryRow
                                    label={`${t("discount", locale)} (${appliedCoupon.code})`}
                                    value={`- ${money(discountAmount)}`}
                                    danger
                                />
                            )}

                            <div className="h-px bg-orange-100" />

                            <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-neutral-950">
                                    {t("total", locale)}
                                </span>

                                <span className="text-xl font-bold text-[#1a4b8f]">
                                    {money(total)}
                                </span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting || !selectedZone}
                            className="mt-7 flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#1a4b8f] text-sm font-bold text-white shadow-lg shadow-[#1a4b8f]/20 transition hover:bg-[#0f2a5e] disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    {t("placing", locale)}
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="h-4 w-4" />
                                    {["paymentasia", "stripe"].includes(form.paymentMethod)
                                        ? t("payNow", locale)
                                        : t("placeOrder", locale)}
                                </>
                            )}
                        </button>

                        {!selectedZone && (
                            <p className="mt-3 text-center text-xs text-neutral-500">
                                {t("selectZoneInfo", locale)}
                            </p>
                        )}

                        <div className="mt-5 rounded-2xl bg-orange-50/70 p-4">
                            <p className="flex items-center justify-center gap-2 text-center text-xs font-medium text-neutral-600">
                                <ShieldCheck className="h-4 w-4 text-[#1a4b8f]" />
                                {t("secure", locale)}
                            </p>
                        </div>
                    </aside>
                </form>
            </div>
        </section>
    );
}

function Card({ children, title, icon, index }) {
    return (
        <div className="rounded-[28px] border border-orange-100 bg-white/95 p-5 shadow-sm backdrop-blur sm:p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-[#1a4b8f]">
                        {icon}
                    </div>

                    <h2 className="text-lg font-bold text-neutral-950">
                        {title}
                    </h2>
                </div>

                <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-[#1a4b8f]">
                    {index}
                </span>
            </div>

            {children}
        </div>
    );
}

function Field({ label, children, error, hint }) {
    return (
        <label className="block">
            <span className="mb-2 block text-sm font-bold text-neutral-800">
                {label}
            </span>

            {children}

            {hint && !error && (
                <span className="mt-1 block text-xs text-neutral-400">
                    {hint}
                </span>
            )}

            {error && (
                <span className="mt-1 block text-xs text-red-500">
                    {error}
                </span>
            )}
        </label>
    );
}

function inputClass(hasError) {
    return `h-12 w-full rounded-xl border bg-white px-4 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:ring-4 ${hasError
            ? "border-red-200 focus:border-red-400 focus:ring-red-50"
            : "border-orange-100 focus:border-[#1a4b8f] focus:ring-blue-50"
        }`;
}

function RadioCard({ checked, title, price, description, onChange }) {
    return (
        <label
            className={`cursor-pointer rounded-2xl border p-4 transition ${checked
                    ? "border-[#1a4b8f] bg-blue-50"
                    : "border-orange-100 bg-white hover:border-[#1a4b8f]/40"
                }`}
        >
            <input type="radio" className="sr-only" checked={checked} onChange={onChange} />

            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="font-bold text-neutral-900">
                        {title}
                    </p>

                    <p className="mt-1 text-xs text-neutral-500">
                        {description}
                    </p>
                </div>

                <span className="text-sm font-bold text-[#1a4b8f]">
                    {price}
                </span>
            </div>
        </label>
    );
}

function PaymentOption({ checked, label, icon, onChange }) {
    return (
        <label
            className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition ${checked
                    ? "border-[#1a4b8f] bg-blue-50"
                    : "border-orange-100 bg-white hover:border-[#1a4b8f]/40"
                }`}
        >
            <span className="flex items-center gap-3 text-sm font-bold text-neutral-900">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1a4b8f] text-white">
                    {icon}
                </span>
                {label}
            </span>

            <input
                type="radio"
                checked={checked}
                onChange={onChange}
                className="h-4 w-4 accent-[#1a4b8f]"
            />
        </label>
    );
}

function InfoBox({ children }) {
    return (
        <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-3 text-sm text-blue-800">
            {children}
        </div>
    );
}

function SummaryRow({ label, value, danger }) {
    return (
        <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-neutral-500">
                {label}
            </span>

            <span className={`font-bold ${danger ? "text-red-500" : "text-neutral-900"}`}>
                {value}
            </span>
        </div>
    );
}
