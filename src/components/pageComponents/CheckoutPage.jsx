"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    CreditCard,
    Loader2,
    MapPin,
    PackageCheck,
    ShieldCheck,
    Tag,
    Trash2,
    Truck,
    UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { QRCodeCanvas } from "qrcode.react";

import { useDispatch, useSelector } from "react-redux";
import { clearUser, setUser } from "@/store/userSlice";

import http from "@/http";
import { clearStorage, fromStorage, imgUrl } from "@/lib";
import { useCart } from "@/contexts/CartContext";

const PHONE_REGEX = /^(\+977-\d{10}|\+852-\d{8}|\d{10}|\d{8})$/;

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
    payme: { en: "PayMe", ne: "PayMe", zh: "PayMe" },
    paymeInfo: {
        en: "Pay securely with PayMe.",
        ne: "PayMe मार्फत सुरक्षित भुक्तानी गर्नुहोस्।",
        zh: "使用 PayMe 安全付款。",
    },
    scanQR: {
        en: "Scan this PayCode with PayMe",
        ne: "यो PayCode PayMe बाट scan गर्नुहोस्",
        zh: "使用 PayMe 掃描此 PayCode",
    },
    openPaymeApp: {
        en: "Open PayMe",
        ne: "PayMe खोल्नुहोस्",
        zh: "開啟 PayMe",
    },
    checkPayment: {
        en: "Check Payment Status",
        ne: "भुक्तानी स्थिति जाँच गर्नुहोस्",
        zh: "檢查付款狀態",
    },
    simulateSandboxPaid: {
        en: "Force Success Sandbox Payment",
        ne: "Sandbox Success force गर्नुहोस्",
        zh: "強制模擬付款成功",
    },
    paymentSuccess: {
        en: "Payment successful! Redirecting...",
        ne: "भुक्तानी सफल भयो। पुन: निर्देशित...",
        zh: "付款成功！正在跳轉...",
    },
    paymentFailed: {
        en: "Payment failed or expired. Please try again.",
        ne: "भुक्तानी असफल वा म्याद गुज्र्यो। कृपया पुन: प्रयास गर्नुहोस्।",
        zh: "付款失敗或過期。請重試。",
    },
    cancel: { en: "Cancel", ne: "रद्द गर्नुहोस्", zh: "取消" },

    emptyCart: { en: "Your cart is empty.", ne: "तपाईंको कार्ट खाली छ।", zh: "購物車是空的。" },
    emptyCartDesc: {
        en: "Add some products to your cart before checkout.",
        ne: "चेकआउट गर्नु अघि केही उत्पादनहरू कार्टमा थप्नुहोस्।",
        zh: "請先將商品加入購物車再結帳。",
    },
    continueShopping: { en: "Continue Shopping", ne: "किनमेल जारी राख्नुहोस्", zh: "繼續購物" },
    guestPaymeOnly: {
        en: "Guest checkout is available with PayMe only. Login to use Cash on Delivery.",
        ne: "अतिथि चेकआउट केवल PayMe संग उपलब्ध छ। नगदमा डेलिभरी प्रयोग गर्न लगइन गर्नुहोस्।",
        zh: "訪客結帳僅可使用 PayMe。登錄以使用貨到付款。",
    },
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

const normalizePhoneNumber = (value) => {
    const raw = String(value || "").trim();

    if (!raw) return raw;

    const digits = raw.replace(/\D/g, "");

    if (digits.length === 10) return `+977-${digits}`;
    if (digits.length === 8) return `+852-${digits}`;
    if (digits.startsWith("977") && digits.length === 13) return `+977-${digits.slice(3)}`;
    if (digits.startsWith("852") && digits.length === 11) return `+852-${digits.slice(3)}`;

    return raw;
};

const getPhoneHelperText = (value) => {
    const digits = String(value || "").replace(/\D/g, "");

    if (!digits) return "Enter 10 digits for Nepal or 8 digits for Hong Kong.";
    if (digits.length === 8) return "Hong Kong number will be saved as +852-XXXXXXXX.";
    if (digits.length === 10) return "Nepal number will be saved as +977-XXXXXXXXXX.";

    return "Use 10 digits for Nepal or 8 digits for Hong Kong.";
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

        if (Array.isArray(value)) {
            return value.map(normalize).filter(Boolean).join(", ");
        }

        if (typeof value === "object") {
            return (
                value.errorDescription ||
                value.message ||
                value.error ||
                value.errorCode ||
                value.description ||
                JSON.stringify(value)
            );
        }

        return String(value);
    };

    const data = err?.response?.data;

    return (
        normalize(data?.message) ||
        normalize(data?.error) ||
        normalize(data?.errors) ||
        normalize(data) ||
        normalize(err?.message) ||
        fallback
    );
};

const safeToastError = (value, fallback = "Something went wrong.") => {
    toast.error(getApiErrorMessage(value, fallback));
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

function PayMeRedLogo({ className = "h-8 w-auto" }) {
    return (
        <Image
            src="/images/payme/PayMe-Logo.wine.svg"
            alt="PayMe"
            width={120}
            height={40}
            className={className}
            priority
        />
    );
}

function PayMeWhiteIcon({ className = "h-5 w-auto" }) {
    return (
        <Image
            src="/images/payme/PayMe-Icon-White-Logo.wine.svg"
            alt="PayMe"
            width={28}
            height={28}
            className={className}
            priority
        />
    );
}

export default function CheckoutPage({ locale = "en" }) {
    return <CheckoutForm locale={locale} />;
}

function CheckoutForm({ locale = "en" }) {
    const router = useRouter();
    const dispatch = useDispatch();

    const {
        cart,
        loading: cartLoading,
        clearCart,
        removeItem: removeCartItem,
        fetchCart,
    } = useCart();

    const user = useSelector((state) => state.user.value);
    const isLoggedIn = user && Object.keys(user).length > 0;

    const pollingIntervalRef = useRef(null);
    const pollingTimeoutRef = useRef(null);

    const [zones, setZones] = useState([]);
    const [zoneLoading, setZoneLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [couponCode, setCouponCode] = useState("");
    const [couponLoading, setCouponLoading] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    const [errors, setErrors] = useState({});

    const [paymePayment, setPaymePayment] = useState(null);
    const [paymeStatus, setPaymeStatus] = useState(null);

    const [currentOrderId, setCurrentOrderId] = useState(null);
    const [currentOrderNumber, setCurrentOrderNumber] = useState(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        orderNote: "",
        cityDistrict: "",
        address: "",
        landmark: "",
        paymentMethod: "payme",
        deliveryType: "standard",
    });

    const cartItems = cart?.items || [];
    const productListHref = `/${locale}/product?page=1&limit=10`;

    const selectedZone = useMemo(() => {
        return zones.find((zone) => zone.name === form.cityDistrict);
    }, [zones, form.cityDistrict]);

    const getStandardDeliveryCharge = (zone) => {
        return Number(zone?.standardDeliveryCharge ?? zone?.deliveryCharge ?? 0);
    };

    const getExpressDeliveryCharge = (zone) => {
        return Number(zone?.expressDeliveryCharge ?? zone?.deliveryCharge ?? 0);
    };

    const getFreeDeliveryThreshold = (zone) => {
        return Number(zone?.freeDeliveryThreshold ?? 0);
    };

    const isCodAvailable = (zone) => {
        return Boolean(zone?.codAvailable);
    };

    const subTotal = useMemo(() => {
        if (cart?.subTotal !== undefined) return Number(cart.subTotal || 0);

        return cartItems.reduce((sum, item) => {
            return sum + getPrice(item) * getQty(item);
        }, 0);
    }, [cart, cartItems]);

    const deliveryCharge = useMemo(() => {
        if (!selectedZone) return 0;

        const threshold = getFreeDeliveryThreshold(selectedZone);

        if (threshold > 0 && subTotal >= threshold) return 0;

        if (form.deliveryType === "express") {
            return getExpressDeliveryCharge(selectedZone);
        }

        return getStandardDeliveryCharge(selectedZone);
    }, [selectedZone, subTotal, form.deliveryType]);

    const discountAmount = Number(appliedCoupon?.discountAmount || 0);
    const total = Math.max(subTotal + deliveryCharge - discountAmount, 0);

    const successSimulationAllowed = Number(total).toFixed(2).endsWith(".81");

    const stopPaymePolling = () => {
        if (pollingTimeoutRef.current) {
            clearTimeout(pollingTimeoutRef.current);
            pollingTimeoutRef.current = null;
        }

        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
        }
    };

    useEffect(() => {
        return () => {
            stopPaymePolling();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
        if (isLoggedIn) {
            fillUserInfo(user);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn, user]);

    useEffect(() => {
        setForm((prev) => ({
            ...prev,
            paymentMethod: isLoggedIn ? "cod" : "payme",
        }));
    }, [isLoggedIn]);

    useEffect(() => {
        if (!selectedZone) return;

        if (!isLoggedIn) {
            setForm((prev) => ({
                ...prev,
                paymentMethod: "payme",
            }));
            return;
        }

        if (!isCodAvailable(selectedZone) && form.paymentMethod === "cod") {
            setForm((prev) => ({
                ...prev,
                paymentMethod: "payme",
            }));
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedZone, isLoggedIn]);

    useEffect(() => {
        setAppliedCoupon(null);
    }, [subTotal]);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const raw = sessionStorage.getItem("hkmandu_pending_payme");
        if (!raw) return;

        try {
            const pending = JSON.parse(raw);

            if (!pending?.payment || !pending?.orderId) return;

            if (Date.now() - Number(pending.createdAt || 0) > 15 * 60 * 1000) {
                sessionStorage.removeItem("hkmandu_pending_payme");
                return;
            }

            setPaymePayment(pending.payment);
            setCurrentOrderId(pending.orderId);
            setCurrentOrderNumber(pending.orderNumber || null);
            setPaymeStatus("PENDING");
        } catch {
            sessionStorage.removeItem("hkmandu_pending_payme");
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handlePhoneBlur = () => {
        const formatted = normalizePhoneNumber(form.phoneNumber);

        setForm((prev) => ({
            ...prev,
            phoneNumber: formatted,
        }));
    };

    const fillUserInfo = (u) => {
        if (!u) return;

        setForm((prev) => ({
            ...prev,
            name: prev.name || u?.name || u?.displayName || "",
            email: prev.email || u?.email || "",
            phoneNumber:
                prev.phoneNumber ||
                normalizePhoneNumber(u?.phoneNumber || u?.phone || u?.mobile || ""),
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

                if (!isLoggedIn) {
                    next.paymentMethod = "payme";
                } else if (zone && !isCodAvailable(zone)) {
                    next.paymentMethod = "payme";
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
            next.phoneNumber =
                "Invalid phone number. Use 10 digits for Nepal or 8 digits for Hong Kong.";
        }

        if (!form.cityDistrict) next.cityDistrict = "City/District is required";
        if (!form.address.trim()) next.address = "Address is required";
        if (!selectedZone) next.cityDistrict = "Please select delivery zone";
        if (!cartItems.length) next.cart = "Cart is empty";

        if (!["standard", "express"].includes(form.deliveryType)) {
            next.deliveryType = "Please select valid delivery type.";
        }

        if (
            selectedZone &&
            form.paymentMethod === "cod" &&
            !isCodAvailable(selectedZone)
        ) {
            next.paymentMethod = "Cash on Delivery is not available for this location.";
        }

        if (!isLoggedIn && form.paymentMethod !== "payme") {
            next.paymentMethod = "Guest checkout supports PayMe only.";
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
            if (!isLoggedIn) {
                return toast.error("Please login to use coupon codes.");
            }

            if (!couponCode.trim()) {
                return toast.error("Please enter coupon code.");
            }

            if (!subTotal || subTotal <= 0) {
                return toast.error("Cart subtotal is invalid.");
            }

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

    const normalizePaymePayment = (payme) => {
        if (!payme) return null;

        const paymentRequestId =
            payme.paymentRequestId ||
            payme.payment_request_id ||
            payme.id ||
            payme.paymentId;

        const webLink =
            payme.webLink ||
            payme.weblink ||
            payme.paymentUrl ||
            payme.payment_url ||
            payme.uri ||
            payme.paymentUri;

        const appLink =
            payme.appLink ||
            payme.applink ||
            payme.deepLink ||
            payme.deeplink ||
            webLink;

        const qrValue = webLink || appLink || payme.uri;

        if (!paymentRequestId || !qrValue) return null;

        return {
            paymentRequestId,
            uri: qrValue,
            webLink,
            appLink,
            businessLogos: payme.businessLogos || payme.businessLogo || null,
            statusCode: payme.statusCode,
            statusDescription: payme.statusDescription,
            raw: payme,
        };
    };

    const savePendingPayme = ({ payment, orderId, orderNumber }) => {
        if (typeof window === "undefined") return;

        sessionStorage.setItem(
            "hkmandu_pending_payme",
            JSON.stringify({
                payment,
                orderId,
                orderNumber,
                createdAt: Date.now(),
            })
        );
    };

    const clearPendingPayme = () => {
        if (typeof window === "undefined") return;
        sessionStorage.removeItem("hkmandu_pending_payme");
    };

    const isPaidStatus = (status) => {
        return [
            "COMPLETED",
            "PAID",
            "SUCCESS",
            "SUCCEEDED",
            "PR005",
            "SANDBOX_PAID",
        ].includes(String(status || "").toUpperCase());
    };

    const isFailedStatus = (status) => {
        return [
            "FAILED",
            "EXPIRED",
            "CANCELLED",
            "CANCELED",
            "PR004",
            "PR006",
            "PR007",
            "PR008",
            "SANDBOX_FAILED",
        ].includes(String(status || "").toUpperCase());
    };

    const finishSuccessfulPayment = async (
        orderNumber,
        status = "COMPLETED",
        order = null
    ) => {
        stopPaymePolling();

        const finalOrderNumber =
            orderNumber ||
            order?.orderNumber ||
            order?.orderId ||
            order?._id ||
            null;

        setPaymeStatus(status);
        clearPendingPayme();

        toast.success(t("paymentSuccess", locale));

        await resetCartAfterSuccess();

        setTimeout(() => {
            if (isLoggedIn) {
                router.push(`/${locale}/dashboard?tab=orders`);
                return;
            }

            if (finalOrderNumber) {
                router.push(
                    `/${locale}/support/track-order?orderNumber=${finalOrderNumber}`
                );
                return;
            }

            router.push(`/${locale}/support/track-order`);
        }, 1200);
    };

    const checkPaymeStatusOnce = async (
        checkoutId,
        orderNumber,
        showPendingToast = true
    ) => {
        if (!checkoutId) return false;

        try {
            const res = await http.get(`/frontend/payment/payme-status/${checkoutId}`);

            const status = String(
                res?.data?.status ||
                res?.data?.statusCode ||
                res?.data?.paymentStatus ||
                res?.data?.data?.status ||
                res?.data?.data?.statusCode ||
                ""
            ).toUpperCase();

            const order =
                res?.data?.order ||
                res?.data?.data?.order ||
                res?.data?.data ||
                null;

            const resolvedOrderNumber =
                res?.data?.orderNumber ||
                order?.orderNumber ||
                order?.orderId ||
                orderNumber ||
                null;

            const paid = Boolean(
                res?.data?.paid ||
                res?.data?.isPaid ||
                res?.data?.data?.paid ||
                res?.data?.data?.isPaid ||
                isPaidStatus(status)
            );

            setPaymeStatus(status || "PENDING");

            if (paid) {
                await finishSuccessfulPayment(
                    resolvedOrderNumber,
                    status || "COMPLETED",
                    order
                );
                return true;
            }

            if (isFailedStatus(status) || res?.data?.isFailed) {
                stopPaymePolling();
                clearPendingPayme();

                toast.error(t("paymentFailed", locale));

                setPaymePayment(null);
                setPaymeStatus(null);
                setCurrentOrderId(null);
                setCurrentOrderNumber(null);

                return false;
            }

            if (showPendingToast) {
                toast.info("Payment is still pending.");
            }

            return false;
        } catch (err) {
            console.log("PayMe status check error:", getApiErrorMessage(err));

            if (showPendingToast) {
                safeToastError(err, "Unable to check PayMe payment status.");
            }

            return false;
        }
    };

    const simulateSandboxPaymentPaid = async () => {
        if (!currentOrderId) return;

        try {
            const res = await http.post(
                `/frontend/payment/payme-sandbox-mark-paid/${currentOrderId}`
            );

            const status = String(
                res?.data?.status || res?.data?.statusCode || "SANDBOX_PAID"
            ).toUpperCase();

            const order =
                res?.data?.order ||
                res?.data?.data?.order ||
                res?.data?.data ||
                null;

            const resolvedOrderNumber =
                res?.data?.orderNumber ||
                order?.orderNumber ||
                order?.orderId ||
                currentOrderNumber ||
                null;

            const paid = Boolean(
                res?.data?.paid ||
                res?.data?.isPaid ||
                res?.data?.data?.paid ||
                res?.data?.data?.isPaid ||
                isPaidStatus(status)
            );

            if (!paid) {
                toast.error("Sandbox payment simulation did not return paid status.");
                return;
            }

            await finishSuccessfulPayment(resolvedOrderNumber, status, order);
        } catch (err) {
            console.log("PayMe sandbox simulate error:", getApiErrorMessage(err));

            safeToastError(err, "Failed to simulate sandbox payment.");
        }
    };

    const closePaymeModal = async () => {
        stopPaymePolling();

        if (currentOrderId) {
            try {
                await http.put(`/frontend/payment/payme-cancel/${currentOrderId}`);
            } catch (err) {
                console.log("PayMe cancel error:", getApiErrorMessage(err));
                safeToastError(err, "Failed to cancel PayMe payment.");
            }
        }

        clearPendingPayme();

        setPaymePayment(null);
        setPaymeStatus(null);
        setCurrentOrderId(null);
        setCurrentOrderNumber(null);
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
            };

            const res = await http.post("/frontend/order/", payload);

            if (form.paymentMethod === "payme") {
                const checkoutId =
                    res?.data?.checkoutId ||
                    res?.data?.data?.checkoutId ||
                    res?.data?.checkout?._id ||
                    res?.data?.data?._id;

                const payme =
                    res?.data?.payme ||
                    res?.data?.payment ||
                    res?.data?.paymePayment ||
                    res?.data?.data?.payme;

                const normalizedPayme = normalizePaymePayment(payme);

                if (!checkoutId || !normalizedPayme) {
                    console.log("PayMe checkout response:", res?.data);
                    toast.error("PayMe payment link not received.");
                    return;
                }

                setPaymePayment(normalizedPayme);
                setPaymeStatus("PENDING");
                setCurrentOrderId(checkoutId);
                setCurrentOrderNumber(null);

                savePendingPayme({
                    payment: normalizedPayme,
                    orderId: checkoutId,
                    orderNumber: null,
                });

                return;
            }

            toast.success(res?.data?.message || "Order placed successfully.");

            await resetCartAfterSuccess();

            router.push(`/${locale}/dashboard?tab=orders`);
        } catch (err) {
            const errorMessage = getApiErrorMessage(err, "Failed to place order.");

            if (process.env.NODE_ENV !== "production") {
                console.log("Checkout error:", errorMessage);
            }

            toast.error(errorMessage);
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
            <section className="relative min-h-[70vh] overflow-hidden bg-gradient-to-br from-orange-50 via-white to-blue-50 px-4 py-16">
                <div className="relative mx-auto max-w-md rounded-[32px] border border-orange-100 bg-white/90 p-8 text-center shadow-[0_24px_70px_rgba(15,42,94,0.12)] backdrop-blur">
                    <div className="mx-auto mb-5 flex h-18 w-18 items-center justify-center rounded-full bg-orange-50 text-[#1a4b8f] ring-8 ring-orange-100/60">
                        <PackageCheck className="h-9 w-9" />
                    </div>

                    <h1 className="text-2xl font-bold text-neutral-950">
                        {t("emptyCart", locale)}
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-neutral-500">
                        {t("emptyCartDesc", locale)}
                    </p>

                    <Link
                        href={productListHref}
                        className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#1a4b8f] px-6 text-sm font-bold text-white shadow-lg shadow-[#1a4b8f]/20 transition hover:bg-[#0f2a5e]"
                    >
                        {t("continueShopping", locale)}
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <>
            <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-white to-blue-50 px-4 py-8 sm:px-6 lg:px-8">
                <div className="relative mx-auto max-w-6xl">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="mb-6 inline-flex items-center gap-3 rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-sm font-semibold text-[#1a4b8f] shadow-sm transition hover:bg-orange-50"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </button>

                    <div className="mb-7">
                        <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#1a4b8f] shadow-sm">
                            <ShieldCheck className="h-4 w-4" />
                            Secure checkout
                        </div>

                        <h1 className="mt-3 text-[32px] font-bold tracking-tight text-neutral-950 md:text-4xl">
                            {t("checkout", locale)}
                        </h1>
                    </div>

                    <form
                        onSubmit={handleOrder}
                        className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start"
                    >
                        <div className="space-y-6">
                            <Card
                                icon={<UserRound className="h-5 w-5" />}
                                title={t("generalInfo", locale)}
                                index="01"
                            >
                                <div className="grid gap-5 md:grid-cols-2">
                                    <Input
                                        label={t("fullName", locale)}
                                        required
                                        value={form.name}
                                        error={errors.name}
                                        onChange={(v) => updateForm("name", v)}
                                        placeholder="John Doe"
                                        disabled={isLoggedIn}
                                    />

                                    <Input
                                        label={t("email", locale)}
                                        required
                                        type="email"
                                        value={form.email}
                                        error={errors.email}
                                        onChange={(v) => updateForm("email", v)}
                                        placeholder="john.doe@example.com"
                                        disabled={isLoggedIn}
                                    />

                                    <div className="md:col-span-2">
                                        <Input
                                            label={t("phone", locale)}
                                            required
                                            value={form.phoneNumber}
                                            error={errors.phoneNumber}
                                            helperText={getPhoneHelperText(form.phoneNumber)}
                                            onChange={(v) => updateForm("phoneNumber", v)}
                                            onBlur={handlePhoneBlur}
                                            placeholder="Nepal: 9800000000 or Hong Kong: 12345678"
                                            inputMode="tel"
                                            maxLength={18}
                                            disabled={isLoggedIn}
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="mb-2 block text-sm font-semibold text-neutral-800">
                                            {t("note", locale)}
                                        </label>

                                        <textarea
                                            value={form.orderNote}
                                            onChange={(e) =>
                                                updateForm("orderNote", e.target.value)
                                            }
                                            placeholder="Leave a note, e.g. Call before delivery"
                                            rows={4}
                                            className="w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-[#1a4b8f] focus:ring-4 focus:ring-[#1a4b8f]/10"
                                        />
                                    </div>
                                </div>
                            </Card>

                            <Card
                                icon={<MapPin className="h-5 w-5" />}
                                title={t("deliveryAddress", locale)}
                                index="02"
                            >
                                <div className="grid gap-5 md:grid-cols-2">
                                    <div className="md:col-span-2">
                                        <label className="mb-2 block text-sm font-semibold text-neutral-800">
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
                                                "h-12 w-full rounded-2xl border bg-white px-4 text-sm text-neutral-900 outline-none transition focus:border-[#1a4b8f] focus:ring-4 focus:ring-[#1a4b8f]/10 disabled:cursor-not-allowed disabled:bg-neutral-100",
                                                errors.cityDistrict
                                                    ? "border-red-400"
                                                    : "border-orange-100",
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
                                        placeholder="Hong Kong"
                                    />

                                    <Input
                                        label={t("landmark", locale)}
                                        value={form.landmark}
                                        onChange={(v) => updateForm("landmark", v)}
                                        placeholder="Nearby landmark"
                                    />
                                </div>
                            </Card>

                            <Card
                                icon={<Truck className="h-5 w-5" />}
                                title={t("deliveryType", locale)}
                                index="03"
                            >
                                {!selectedZone ? (
                                    <div className="rounded-2xl bg-orange-50 p-4 text-sm font-medium text-neutral-600">
                                        {t("selectZoneInfo", locale)}
                                    </div>
                                ) : (
                                    <div className="grid gap-3 md:grid-cols-2">
                                        <DeliveryOption
                                            checked={form.deliveryType === "standard"}
                                            label={t("standardDelivery", locale)}
                                            price={
                                                getFreeDeliveryThreshold(selectedZone) > 0 &&
                                                    subTotal >= getFreeDeliveryThreshold(selectedZone)
                                                    ? t("free", locale)
                                                    : money(getStandardDeliveryCharge(selectedZone))
                                            }
                                            description={
                                                getFreeDeliveryThreshold(selectedZone) > 0
                                                    ? `${t("freeAbove", locale)} ${money(
                                                        getFreeDeliveryThreshold(selectedZone)
                                                    )}`
                                                    : t("regularDelivery", locale)
                                            }
                                            onChange={() =>
                                                updateForm("deliveryType", "standard")
                                            }
                                        />

                                        <DeliveryOption
                                            checked={form.deliveryType === "express"}
                                            label={t("expressDelivery", locale)}
                                            price={
                                                getFreeDeliveryThreshold(selectedZone) > 0 &&
                                                    subTotal >= getFreeDeliveryThreshold(selectedZone)
                                                    ? t("free", locale)
                                                    : money(getExpressDeliveryCharge(selectedZone))
                                            }
                                            description={t("fasterDelivery", locale)}
                                            onChange={() =>
                                                updateForm("deliveryType", "express")
                                            }
                                        />
                                    </div>
                                )}

                                {errors.deliveryType && (
                                    <p className="mt-2 text-xs text-red-500">
                                        {errors.deliveryType}
                                    </p>
                                )}
                            </Card>

                            <Card
                                icon={<CreditCard className="h-5 w-5" />}
                                title={t("paymentMethods", locale)}
                                index="04"
                            >
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
                                                onChange={() =>
                                                    updateForm("paymentMethod", "cod")
                                                }
                                            />
                                        )}

                                        {isLoggedIn && !isCodAvailable(selectedZone) && (
                                            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-3 text-sm text-amber-800">
                                                {t("codUnavailable", locale)}
                                            </div>
                                        )}

                                        <PaymentOption
                                            checked={form.paymentMethod === "payme"}
                                            label="PayMe"
                                            icon={<PayMeWhiteIcon className="h-5 w-auto" />}
                                            onChange={() =>
                                                updateForm("paymentMethod", "payme")
                                            }
                                        />

                                        {form.paymentMethod === "payme" && (
                                            <div className="rounded-2xl border border-red-100 bg-red-50/70 p-3 text-sm text-red-700">
                                                {t("paymeInfo", locale)}
                                            </div>
                                        )}

                                        {!isLoggedIn && (
                                            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-3 text-sm text-amber-800">
                                                {t("guestPaymeOnly", locale)}
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
                                {cartItems.map((item) => {
                                    const productId = getProductId(item);
                                    const qty = getQty(item);
                                    const price = getPrice(item);

                                    return (
                                        <div key={productId} className="flex gap-3">
                                            <div className="relative h-14 w-14 shrink-0 overflow-visible rounded-2xl bg-orange-50">
                                                <Image
                                                    src={getProductImage(item)}
                                                    alt={getProductName(item, locale)}
                                                    fill
                                                    sizes="56px"
                                                    className="rounded-2xl object-cover"
                                                    unoptimized
                                                />

                                                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#1a4b8f] px-1 text-[11px] font-bold text-white">
                                                    {qty}
                                                </span>
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-bold text-neutral-900">
                                                    {getProductName(item, locale)}
                                                </p>

                                                <p className="mt-1 text-xs text-neutral-500">
                                                    {qty} × {money(price)}
                                                </p>
                                            </div>

                                            <div className="flex shrink-0 items-start gap-2">
                                                <p className="text-sm font-bold text-neutral-900">
                                                    {money(price * qty)}
                                                </p>

                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(productId)}
                                                    className="rounded-lg p-1 text-red-400 transition hover:bg-red-50 hover:text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-6 rounded-2xl border border-orange-100 bg-orange-50/50 p-4">
                                <label className="mb-2 flex items-center gap-2 text-sm font-bold text-neutral-900">
                                    <Tag className="h-4 w-4 text-[#1a4b8f]" />
                                    {t("coupon", locale)}
                                </label>

                                <div className="flex gap-2">
                                    <input
                                        value={couponCode}
                                        disabled={!isLoggedIn || !!appliedCoupon}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        placeholder="COUPONCODE"
                                        className="h-11 min-w-0 flex-1 rounded-xl border border-orange-100 bg-white px-3 text-sm outline-none focus:border-[#1a4b8f] focus:ring-4 focus:ring-[#1a4b8f]/10 disabled:bg-neutral-100"
                                    />

                                    {appliedCoupon ? (
                                        <button
                                            type="button"
                                            onClick={removeCoupon}
                                            className="h-11 rounded-xl bg-red-500 px-4 text-sm font-bold text-white transition hover:bg-red-600"
                                        >
                                            {t("remove", locale)}
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={applyCoupon}
                                            disabled={couponLoading || !isLoggedIn}
                                            className="h-11 rounded-xl bg-[#1a4b8f] px-5 text-sm font-bold text-white transition hover:bg-[#0f2a5e] disabled:cursor-not-allowed disabled:opacity-70"
                                        >
                                            {couponLoading ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                t("apply", locale)
                                            )}
                                        </button>
                                    )}
                                </div>

                                {!isLoggedIn && (
                                    <p className="mt-2 text-xs font-medium text-neutral-500">
                                        Coupon codes are available after login.
                                    </p>
                                )}

                                {appliedCoupon && (
                                    <p className="mt-2 text-xs font-medium text-green-600">
                                        Coupon {appliedCoupon.code} applied.
                                    </p>
                                )}
                            </div>

                            <div className="mt-7 space-y-4">
                                <SummaryRow
                                    label={t("subTotal", locale)}
                                    value={money(subTotal)}
                                />

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
                                        {form.paymentMethod === "payme"
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

            {paymePayment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-4 backdrop-blur-sm">
                    <div className="flex max-h-[calc(100vh-32px)] w-full max-w-xs flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl sm:max-w-sm">
                        <div className="border-b border-neutral-100 bg-white px-5 py-4 text-center">
                            <div className="flex justify-center">
                                <PayMeRedLogo className="h-7 w-auto" />
                            </div>

                            <h3 className="mt-3 text-base font-bold text-neutral-950">
                                {t("scanQR", locale)}
                            </h3>

                            <p className="mt-1 text-[11px] font-medium text-neutral-500">
                                Open PayMe and scan to authorise payment.
                            </p>
                        </div>

                        <div className="overflow-y-auto px-5 py-5 text-center">
                            <div className="mx-auto flex w-fit justify-center rounded-[20px] border border-neutral-200 bg-white p-3 shadow-sm">
                                <QRCodeCanvas
                                    value={
                                        paymePayment.webLink ||
                                        paymePayment.appLink ||
                                        paymePayment.uri
                                    }
                                    size={230}
                                    level="H"
                                    includeMargin
                                />
                            </div>

                            {paymeStatus && (
                                <p className="mt-3 text-xs font-semibold text-neutral-500">
                                    Status: {paymeStatus}
                                </p>
                            )}

                            <div className="mt-5 grid gap-2.5">
                                {paymePayment.webLink && (
                                    <a
                                        href={paymePayment.webLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex w-full items-center justify-center rounded-xl bg-[#e60012] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#c90010]"
                                    >
                                        {t("openPaymeApp", locale)}
                                    </a>
                                )}

                                <button
                                    type="button"
                                    onClick={() =>
                                        checkPaymeStatusOnce(
                                            currentOrderId,
                                            currentOrderNumber,
                                            true
                                        )
                                    }
                                    disabled={!currentOrderId}
                                    className="inline-flex w-full items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-bold text-neutral-800 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {t("checkPayment", locale)}
                                </button>

                                {process.env.NEXT_PUBLIC_PAYME_SANDBOX === "true" &&
                                    successSimulationAllowed && (
                                        <button
                                            type="button"
                                            onClick={simulateSandboxPaymentPaid}
                                            disabled={!currentOrderId}
                                            className="inline-flex w-full items-center justify-center rounded-xl bg-green-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {t("simulateSandboxPaid", locale)}
                                        </button>
                                    )}

                                <button
                                    type="button"
                                    onClick={closePaymeModal}
                                    className="inline-flex w-full items-center justify-center rounded-xl bg-neutral-100 px-4 py-3 text-sm font-bold text-neutral-700 transition hover:bg-neutral-200"
                                >
                                    {t("cancel", locale)}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
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

                    <h2 className="text-lg font-bold text-neutral-950 sm:text-xl">
                        {title}
                    </h2>
                </div>

                <span className="hidden text-xs font-bold uppercase tracking-[0.18em] text-orange-300 sm:block">
                    {index}
                </span>
            </div>

            {children}
        </div>
    );
}

function Input({
    label,
    value,
    onChange,
    onBlur,
    error,
    helperText,
    placeholder,
    type = "text",
    required = false,
    disabled = false,
    inputMode,
    maxLength,
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-semibold text-neutral-800">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            <input
                type={type}
                value={value}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
                placeholder={placeholder}
                inputMode={inputMode}
                maxLength={maxLength}
                className={[
                    "h-12 w-full rounded-2xl border bg-white px-4 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-[#1a4b8f] focus:ring-4 focus:ring-[#1a4b8f]/10 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-500",
                    error ? "border-red-400" : "border-orange-100",
                ].join(" ")}
            />

            {error ? (
                <p className="mt-1 text-xs text-red-500">{error}</p>
            ) : helperText ? (
                <p className="mt-1 text-xs text-neutral-500">{helperText}</p>
            ) : null}
        </div>
    );
}

function DeliveryOption({ checked, label, price, description, onChange }) {
    return (
        <label
            className={[
                "flex cursor-pointer items-start justify-between gap-4 rounded-2xl border bg-white p-4 transition",
                checked
                    ? "border-[#1a4b8f] bg-blue-50/40"
                    : "border-orange-100 hover:border-orange-200 hover:bg-orange-50/40",
            ].join(" ")}
        >
            <span className="min-w-0">
                <span className="block text-sm font-bold text-neutral-900">
                    {label}
                </span>

                <span className="mt-1 block text-xs font-medium text-neutral-500">
                    {description}
                </span>

                <span className="mt-2 block text-sm font-bold text-[#1a4b8f]">
                    {price}
                </span>
            </span>

            <input
                type="radio"
                checked={checked}
                onChange={onChange}
                className="mt-1 accent-[#1a4b8f]"
            />
        </label>
    );
}

function PaymentOption({ checked, label, icon, onChange }) {
    return (
        <label
            className={[
                "flex cursor-pointer items-center justify-between rounded-2xl border bg-white p-4 transition",
                checked
                    ? "border-[#1a4b8f] bg-blue-50/40"
                    : "border-orange-100 hover:border-orange-200 hover:bg-orange-50/40",
            ].join(" ")}
        >
            <span className="flex items-center gap-2.5 font-semibold text-neutral-900">
                <span
                    className={[
                        "flex h-8 w-8 items-center justify-center rounded-full",
                        label === "PayMe"
                            ? "bg-[#e60012]"
                            : checked
                                ? "bg-[#1a4b8f] text-white"
                                : "bg-orange-50 text-[#1a4b8f]",
                    ].join(" ")}
                >
                    {icon}
                </span>

                {label}
            </span>

            <input
                type="radio"
                checked={checked}
                onChange={onChange}
                className="accent-[#1a4b8f]"
            />
        </label>
    );
}

function SummaryRow({ label, value, danger = false }) {
    return (
        <div className="flex items-center justify-between gap-4 text-sm text-neutral-600">
            <span className="min-w-0">{label}</span>

            <span
                className={[
                    "shrink-0 font-bold",
                    danger ? "text-red-500" : "text-neutral-900",
                ].join(" ")}
            >
                {value}
            </span>
        </div>
    );
}