"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { QRCodeCanvas } from "qrcode.react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Loader2,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Trash2,
  Truck,
  UserRound,
  Utensils,
} from "lucide-react";
import { toast } from "sonner";

import http from "@/http";
import { fromStorage, imgUrl } from "@/lib";
import { useRestaurantCart } from "@/contexts/RestaurantCartContext";
import { INPUT_LIMITS } from "@/constants/inputLimits";
import CountryPhoneInput, { normalizeHongKongPhone } from "@/components/clientComponents/CountryPhoneInput";

const PHONE_REGEX = /^\+852-\d{8}$/;
const HONG_KONG_COUNTRY_CODES = ["+852"];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const UI = {
  checkout: {
    en: "Restaurant Checkout",
    ne: "रेस्टुरेन्ट चेकआउट",
    zh: "餐廳結帳",
  },
  generalInfo: {
    en: "General Information",
    ne: "सामान्य जानकारी",
    zh: "基本資料",
  },
  deliveryAddress: {
    en: "Delivery Address",
    ne: "डेलिभरी ठेगाना",
    zh: "送貨地址",
  },
  paymentMethods: {
    en: "Payment Methods",
    ne: "भुक्तानी विधि",
    zh: "付款方式",
  },
  orderSummary: {
    en: "Order Summary",
    ne: "अर्डर सारांश",
    zh: "訂單摘要",
  },
  fullName: {
    en: "Full Name",
    ne: "पूरा नाम",
    zh: "全名",
  },
  email: {
    en: "Email",
    ne: "इमेल",
    zh: "電郵",
  },
  optional: {
    en: "Optional",
    ne: "वैकल्पिक",
    zh: "可選",
  },
  phone: {
    en: "Phone Number",
    ne: "फोन नम्बर",
    zh: "電話號碼",
  },
  note: {
    en: "Order Note (Optional)",
    ne: "अर्डर नोट (वैकल्पिक)",
    zh: "訂單備註（可選）",
  },
  city: {
    en: "Delivery Location",
    ne: "डेलिभरी स्थान",
    zh: "送貨地區",
  },
  address: {
    en: "Address",
    ne: "ठेगाना",
    zh: "地址",
  },
  landmark: {
    en: "Landmark",
    ne: "नजिकको स्थान",
    zh: "地標",
  },
  freeAbove: {
    en: "Free above",
    ne: "यो भन्दा माथि नि:शुल्क",
    zh: "滿額免費",
  },
  codUnavailable: {
    en: "Cash on Delivery is not available for this location.",
    ne: "यो स्थानमा Cash on Delivery उपलब्ध छैन।",
    zh: "此地區不支援貨到付款。",
  },
  selectCity: {
    en: "Select Delivery Location",
    ne: "डेलिभरी स्थान छान्नुहोस्",
    zh: "選擇送貨地區",
  },
  subTotal: {
    en: "Sub-total",
    ne: "उप-योग",
    zh: "小計",
  },
  deliveryCharge: {
    en: "Delivery Charge",
    ne: "डेलिभरी शुल्क",
    zh: "送貨費",
  },
  free: {
    en: "FREE",
    ne: "निःशुल्क",
    zh: "免費",
  },
  total: {
    en: "Total",
    ne: "जम्मा",
    zh: "總額",
  },
  placeOrder: {
    en: "Place COD Order",
    ne: "COD अर्डर गर्नुहोस्",
    zh: "提交貨到付款訂單",
  },
  payNow: {
    en: "Pay with PaymentAsia",
    ne: "PaymentAsia बाट भुक्तानी गर्नुहोस्",
    zh: "使用 PaymentAsia 付款",
  },
  placing: {
    en: "Processing...",
    ne: "प्रोसेस हुँदैछ...",
    zh: "處理中...",
  },
  secure: {
    en: "Your order information is secure and encrypted",
    ne: "तपाईंको अर्डर जानकारी सुरक्षित छ",
    zh: "您的訂單資料安全加密",
  },
  selectZoneInfo: {
    en: "Please select a delivery location to continue",
    ne: "जारी राख्न डेलिभरी स्थान छान्नुहोस्",
    zh: "請選擇送貨地區以繼續",
  },
  cod: {
    en: "Cash on Delivery",
    ne: "डेलिभरीमा नगद",
    zh: "貨到付款",
  },
  codInfo: {
    en: "Pay in cash when your order arrives.",
    ne: "अर्डर आइपुग्दा नगद भुक्तानी गर्नुहोस्।",
    zh: "訂單送達時以現金付款。",
  },
  codLoginInfo: {
    en: "Login to use Cash on Delivery.",
    ne: "Cash on Delivery प्रयोग गर्न लगइन गर्नुहोस्।",
    zh: "請登入以使用貨到付款。",
  },
  paymentasia: {
    en: "PaymentAsia",
    ne: "PaymentAsia",
    zh: "PaymentAsia",
  },
  paymentasiaInfo: {
    en: "Pay securely with PaymentAsia.",
    ne: "PaymentAsia मार्फत सुरक्षित भुक्तानी गर्नुहोस्।",
    zh: "使用 PaymentAsia 安全付款。",
  },
  stripe: {
    en: "Stripe",
    ne: "Stripe",
    zh: "Stripe",
  },
  stripeInfo: {
    en: "Pay securely by card with Stripe.",
    ne: "Stripe मार्फत कार्डबाट सुरक्षित भुक्तानी गर्नुहोस्।",
    zh: "使用 Stripe 以銀行卡安全付款。",
  },
  guestPaymentAsiaOnly: {
    en: "Guest checkout is available with PaymentAsia or Stripe. Login to use Cash on Delivery.",
    ne: "अतिथि चेकआउट PaymentAsia वा Stripe संग उपलब्ध छ। नगदमा डेलिभरी प्रयोग गर्न लगइन गर्नुहोस्।",
    zh: "訪客結帳可使用 PaymentAsia 或 Stripe。登錄以使用貨到付款。",
  },
  scanQR: {
    en: "Scan this PayCode with PaymentAsia",
    ne: "यो PayCode PaymentAsia बाट scan गर्नुहोस्",
    zh: "使用 PaymentAsia 掃描此 PayCode",
  },
  openPaymentAsiaApp: {
    en: "Open PaymentAsia",
    ne: "PaymentAsia खोल्नुहोस्",
    zh: "開啟 PaymentAsia",
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
  cancel: {
    en: "Cancel",
    ne: "रद्द गर्नुहोस्",
    zh: "取消",
  },
  emptyCart: {
    en: "Your restaurant cart is empty.",
    ne: "तपाईंको रेस्टुरेन्ट कार्ट खाली छ।",
    zh: "餐廳購物車是空的。",
  },
  emptyCartDesc: {
    en: "Add food to your restaurant cart before checkout.",
    ne: "चेकआउट गर्नु अघि रेस्टुरेन्ट कार्टमा खाना थप्नुहोस्।",
    zh: "請先將餐點加入購物車再結帳。",
  },
  continueShopping: {
    en: "Continue Ordering",
    ne: "अर्डर जारी राख्नुहोस्",
    zh: "繼續點餐",
  },
};

const t = (key, locale = "en") => UI[key]?.[locale] || UI[key]?.en || key;

const money = (value) => {
  const num = Number(value || 0);

  return `HK$ ${num.toLocaleString("en-HK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const pickText = (value, locale = "en", fallback = "") => {
  if (!value) return fallback;
  if (typeof value === "string") return value;

  return (
    value?.[locale] ||
    value?.en ||
    value?.ne ||
    value?.zh ||
    fallback
  );
};

const normalizePhoneNumber = (value) => normalizeHongKongPhone(value);


const getPhoneHelperText = () =>
  "Hong Kong number only. Enter exactly 8 digits.";


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

const getFoodPrice = (food = {}, item = {}) => {
  const cartPrice = Number(item.price || item.finalPrice || 0);
  if (cartPrice > 0) return cartPrice;

  const price = Number(food.finalPrice || food.price || 0);
  const discount = food.discounted_price ?? food.discountPrice;

  if (
    discount !== null &&
    discount !== undefined &&
    discount !== "" &&
    Number(discount) > 0 &&
    Number(discount) < Number(food.price || price)
  ) {
    return Number(discount);
  }

  return price;
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

const safeToastError = (err, fallback = "Something went wrong.") => {
  toast.error(getApiErrorMessage(err, fallback));
};

const getRestaurantDeliveryLocations = (res) => {
  const payload = res?.data;

  if (Array.isArray(payload?.data)) return payload.data;

  if (Array.isArray(payload?.data?.deliveryLocations)) {
    return payload.data.deliveryLocations;
  }

  if (Array.isArray(payload?.data?.restaurantDelivery)) {
    return payload.data.restaurantDelivery;
  }

  if (Array.isArray(payload?.deliveryLocations)) {
    return payload.deliveryLocations;
  }

  if (Array.isArray(payload?.restaurantDelivery)) {
    return payload.restaurantDelivery;
  }

  if (Array.isArray(payload)) return payload;

  return [];
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

function PaymentAsiaRedLogo({ className = "" }) {
  return <span className={`text-sm font-black text-[#1a4b8f] ${className}`}>PaymentAsia</span>;
}

function PaymentAsiaWhiteIcon({ className = "h-5 w-5" }) {
  return <CreditCard className={className} />;
}

export default function RestaurantCheckoutPageView({ locale = "en" }) {
  return <RestaurantCheckoutForm locale={locale} />;
}

function RestaurantCheckoutForm({ locale = "en" }) {
  const router = useRouter();
  const user = useSelector((state) => state?.user?.value || {});
  const token = fromStorage("hkmandu");
  const isLoggedIn = Boolean(token || (user && Object.keys(user).length > 0));

  const {
    cart,
    ready,
    items = [],
    subtotal = 0,
    removeFood,
    removeFromCart,
    clearRestaurantCart,
    clearCart,
    refreshCart,
  } = useRestaurantCart();

  const safeRemoveFood = removeFood || removeFromCart;
  const safeClearCart = clearRestaurantCart || clearCart;

  const pollingIntervalRef = useRef(null);
  const pollingTimeoutRef = useRef(null);

  const [zones, setZones] = useState([]);
  const [zoneLoading, setZoneLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [paymentasiaPayment, setPaymentAsiaPayment] = useState(null);
  const [paymentasiaStatus, setPaymentAsiaStatus] = useState(null);
  const [currentCheckoutId, setCurrentCheckoutId] = useState(null);
  const [currentOrderNumber, setCurrentOrderNumber] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    orderNote: "",
    cityDistrict: "",
    deliveryLocationId: "",
    address: "",
    landmark: "",
    paymentMethod: "",
  });

  const restaurantHref = `/${locale}/restaurant`;
  const cartItems = cart?.items || items || [];

  const selectedZone = useMemo(() => {
    return zones.find(
      (zone) =>
        String(zone._id || zone.id) === String(form.deliveryLocationId)
    );
  }, [zones, form.deliveryLocationId]);

  const subTotal = useMemo(() => {
    if (cart?.subTotal !== undefined) return Number(cart.subTotal || 0);
    if (cart?.subtotal !== undefined) return Number(cart.subtotal || 0);
    if (subtotal !== undefined) return Number(subtotal || 0);

    return cartItems.reduce((sum, item) => {
      const food = item.food || {};
      const price = getFoodPrice(food, item);
      return sum + price * Number(item.quantity || 1);
    }, 0);
  }, [cart, cartItems, subtotal]);

  const deliveryCharge = useMemo(() => {
    if (!selectedZone) return 0;

    const threshold = Number(selectedZone?.freeDeliveryThreshold || 0);
    const charge = Number(selectedZone?.deliveryCharge || 0);

    if (threshold > 0 && subTotal >= threshold) return 0;

    return charge;
  }, [selectedZone, subTotal]);

  const total = subTotal + deliveryCharge;
  const successSimulationAllowed = Number(total).toFixed(2).endsWith(".81");

  const isCodAvailable = (zone) => Boolean(zone?.codAvailable);

  const stopPaymentAsiaPolling = () => {
    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current);
      pollingTimeoutRef.current = null;
    }

    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
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

      const res = await http.get("/frontend/restaurantDelivery");

      const list = getRestaurantDeliveryLocations(res).filter(
        (zone) => zone.status !== false
      );

      setZones(list);
    } catch (err) {
      safeToastError(err, "Failed to load restaurant delivery locations.");
    } finally {
      setZoneLoading(false);
    }
  };

  useEffect(() => {
    refreshCart?.();
    loadZones();

    if (user) fillUserInfo(user);

    return () => stopPaymentAsiaPolling();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user) fillUserInfo(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const updateForm = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };

      if (field === "deliveryLocationId") {
        const zone = zones.find(
          (item) => String(item._id || item.id) === String(value)
        );

        next.cityDistrict = zone?.name || "";

        if (!zone) {
          next.paymentMethod = "";
        } else if (!isLoggedIn) {
          next.paymentMethod = "paymentasia";
        } else if (zone.codAvailable) {
          next.paymentMethod = "cod";
        } else {
          next.paymentMethod = "paymentasia";
        }
      }

      return next;
    });

    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handlePhoneBlur = () => {
    const formatted = normalizePhoneNumber(form.phoneNumber);

    setForm((prev) => ({
      ...prev,
      phoneNumber: formatted,
    }));
  };

  const validate = () => {
    const next = {};

    if (!form.name.trim()) next.name = "Full name is required";
    if (!form.phoneNumber.trim()) next.phoneNumber = "Phone number is required";

    const formattedPhone = normalizePhoneNumber(form.phoneNumber);

    if (formattedPhone && !PHONE_REGEX.test(formattedPhone)) {
      next.phoneNumber =
        "Invalid Hong Kong phone number. Enter exactly 8 digits.";
    }

    if (form.email.trim() && !EMAIL_REGEX.test(form.email.trim())) {
      next.email = "Please enter a valid email address.";
    }

    if (!form.deliveryLocationId) {
      next.deliveryLocationId = "Delivery location is required";
    }

    if (!selectedZone) {
      next.deliveryLocationId = "Please select delivery location";
    }

    if (!form.address.trim()) next.address = "Address is required";
    if (!cartItems.length) next.cart = "Restaurant cart is empty";

    if (!form.paymentMethod) {
      next.paymentMethod = "Please select payment method.";
    }

    if (!isLoggedIn && form.paymentMethod === "cod") {
      next.paymentMethod = "Please login to use Cash on Delivery.";
    }

    if (
      isLoggedIn &&
      form.paymentMethod === "cod" &&
      selectedZone &&
      !isCodAvailable(selectedZone)
    ) {
      next.paymentMethod = "Cash on Delivery is not available for this location.";
    }

    setErrors(next);

    if (Object.keys(next).length > 0) {
      toast.error(Object.values(next)[0]);
      return false;
    }

    return true;
  };

  const resetCartAfterSuccess = () => {
    safeClearCart?.();
    refreshCart?.();
  };

  const normalizePaymentAsiaPayment = (paymentasia) => {
    if (!paymentasia) return null;

    const paymentRequestId =
      paymentasia.paymentRequestId ||
      paymentasia.payment_request_id ||
      paymentasia.id ||
      paymentasia.paymentId ||
      paymentasia.checkoutId;

    const webLink =
      paymentasia.webLink ||
      paymentasia.weblink ||
      paymentasia.paymentUrl ||
      paymentasia.payment_url ||
      paymentasia.url ||
      paymentasia.uri ||
      paymentasia.paymentUri;

    const appLink =
      paymentasia.appLink ||
      paymentasia.applink ||
      paymentasia.deepLink ||
      paymentasia.deeplink ||
      webLink;

    const qrValue = webLink || appLink || paymentasia.uri;

    if (!paymentRequestId && !qrValue) return null;

    return {
      paymentRequestId,
      uri: qrValue,
      webLink,
      appLink,
      statusCode: paymentasia.statusCode,
      statusDescription: paymentasia.statusDescription,
      raw: paymentasia,
    };
  };

  const savePendingPaymentAsia = ({ payment, checkoutId, orderNumber }) => {
    if (typeof window === "undefined") return;

    sessionStorage.setItem(
      "hkmandu_pending_food_paymentasia",
      JSON.stringify({
        payment,
        checkoutId,
        orderNumber,
        createdAt: Date.now(),
      })
    );
  };

  const clearPendingPaymentAsia = () => {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem("hkmandu_pending_food_paymentasia");
  };

  const finishSuccessfulPayment = async (
    orderNumber,
    status = "COMPLETED",
    order = null
  ) => {
    stopPaymentAsiaPolling();

    const finalOrderNumber =
      orderNumber ||
      order?.orderNumber ||
      order?.orderNo ||
      order?.orderId ||
      order?._id ||
      null;

    setPaymentAsiaStatus(status);
    clearPendingPaymentAsia();

    toast.success(t("paymentSuccess", locale));

    resetCartAfterSuccess();

    setTimeout(() => {
      if (finalOrderNumber) {
        router.push(
          `/${locale}/restaurant/track-order?order=${encodeURIComponent(
            finalOrderNumber
          )}`
        );
        return;
      }

      router.push(`/${locale}/restaurant/track-order`);
    }, 1200);
  };

  const checkPaymentAsiaStatusOnce = async (
    checkoutId,
    orderNumber,
    showPendingToast = true
  ) => {
    if (!checkoutId) return false;

    try {
      const res = await http.get(
        `/frontend/foodOrder/payment-status/${checkoutId}`
      );

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
        order?.orderNo ||
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

      setPaymentAsiaStatus(status || "PENDING");

      if (paid) {
        await finishSuccessfulPayment(
          resolvedOrderNumber,
          status || "COMPLETED",
          order
        );

        return true;
      }

      if (isFailedStatus(status) || res?.data?.isFailed) {
        stopPaymentAsiaPolling();
        clearPendingPaymentAsia();

        toast.error(t("paymentFailed", locale));

        setPaymentAsiaPayment(null);
        setPaymentAsiaStatus(null);
        setCurrentCheckoutId(null);
        setCurrentOrderNumber(null);

        return false;
      }

      if (showPendingToast) {
        toast.info("Payment is still pending.");
      }

      return false;
    } catch (err) {
      if (showPendingToast) {
        safeToastError(err, "Unable to check PaymentAsia payment status.");
      }

      return false;
    }
  };

  const simulateSandboxPaymentPaid = async () => {
    if (!currentCheckoutId) return;

    try {
      const res = await http.post(
        `/frontend/foodOrder/sandbox-mark-paid/${currentCheckoutId}`
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
        order?.orderNo ||
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
      safeToastError(err, "Failed to simulate sandbox payment.");
    }
  };

  const closePaymentAsiaModal = () => {
    stopPaymentAsiaPolling();
    clearPendingPaymentAsia();

    setPaymentAsiaPayment(null);
    setPaymentAsiaStatus(null);
    setCurrentCheckoutId(null);
    setCurrentOrderNumber(null);
  };

  const startPaymentAsiaPollingAfter60Seconds = (checkoutId, orderNumber = null) => {
    stopPaymentAsiaPolling();

    pollingTimeoutRef.current = setTimeout(() => {
      checkPaymentAsiaStatusOnce(checkoutId, orderNumber, false);

      pollingIntervalRef.current = setInterval(() => {
        checkPaymentAsiaStatusOnce(checkoutId, orderNumber, false);
      }, 10000);
    }, 60000);
  };

  const handleOrder = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setSubmitting(true);

      const normalizedPhone = normalizePhoneNumber(form.phoneNumber);
      const optionalEmail = form.email.trim() || "";

      const payload = {
        items: cartItems.map((item) => ({
          foodID: item.food?._id,
          foodId: item.food?._id,
          food: item.food?._id,
          qty: Number(item.quantity || 1),
          quantity: Number(item.quantity || 1),
        })),

        customer: {
          name: form.name.trim(),
          email: optionalEmail,
          phoneNumber: normalizedPhone,
          phone: normalizedPhone,
        },

        name: form.name.trim(),
        email: optionalEmail,
        phoneNumber: normalizedPhone,

        address: form.address.trim(),
        landmark: form.landmark.trim(),
        cityDistrict: selectedZone?.name || form.cityDistrict,

        deliveryLocationId: form.deliveryLocationId,

        deliveryLocation: {
          id: selectedZone?._id || selectedZone?.id,
          name: selectedZone?.name,
          deliveryCharge: Number(selectedZone?.deliveryCharge || 0),
          freeDeliveryThreshold: Number(
            selectedZone?.freeDeliveryThreshold || 0
          ),
          codAvailable: Boolean(selectedZone?.codAvailable),
        },

        deliveryCharge,
        finalAmount: total,
        paymentMethod: form.paymentMethod,
        orderNote: form.orderNote.trim(),
        locale,
      };

      const res = await http.post("/frontend/foodOrder", payload);

      if (["paymentasia", "stripe"].includes(form.paymentMethod)) {
        const payment = res?.data?.payment || res?.data?.data?.payment || {};
        const redirectUrl = payment.redirectUrl || payment.paymentUrl || payment.url || res?.data?.redirectUrl || res?.data?.paymentUrl;

        if (!redirectUrl) {
          console.log("Restaurant online payment response:", res?.data);
          toast.error("Payment link not received.");
          return;
        }

        window.location.href = redirectUrl;
        return;
      }

      const order =
        res?.data?.data?.order ||
        res?.data?.order ||
        res?.data?.data ||
        res?.data;

      const orderNumber =
        order?.orderNumber ||
        order?.orderNo ||
        order?.orderId ||
        res?.data?.orderNumber ||
        null;

      toast.success(res?.data?.message || "Restaurant order placed successfully.");

      resetCartAfterSuccess();

      if (orderNumber) {
        router.push(
          `/${locale}/restaurant/track-order?order=${encodeURIComponent(
            orderNumber
          )}`
        );
      } else {
        router.push(`/${locale}/restaurant/track-order`);
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to place restaurant order."));
    } finally {
      setSubmitting(false);
    }
  };

  if (!ready) {
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
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-[#1a4b8f]">
            <PackageCheck className="h-8 w-8" />
          </div>

          <h1 className="text-2xl font-bold text-neutral-950">
            {t("emptyCart", locale)}
          </h1>

          <p className="mt-3 text-neutral-500">
            {t("emptyCartDesc", locale)}
          </p>

          <Link
            href={restaurantHref}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1a4b8f] px-5 py-3 text-sm font-bold text-white"
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
      <section className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href={restaurantHref}
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
              Restaurant-style checkout with delivery location, payment method, and order summary.
            </p>
          </div>

          <form
            onSubmit={handleOrder}
            className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_410px]"
          >
            <div className="space-y-6">
              <Card
                icon={<UserRound className="h-5 w-5" />}
                title={t("generalInfo", locale)}
                index="01"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label={t("fullName", locale)} error={errors.name}>
                    <input
                      value={form.name}
                      onChange={(e) => updateForm("name", e.target.value)}
                      maxLength={INPUT_LIMITS.name}
                      disabled={isLoggedIn}
                      className={inputClass(errors.name)}
                    />
                  </Field>

                  <Field
                    label={`${t("email", locale)} (${t("optional", locale)})`}
                    error={errors.email}
                  >
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => updateForm("email", e.target.value)}
                      maxLength={INPUT_LIMITS.email}
                      disabled={isLoggedIn}
                      className={inputClass(errors.email)}
                    />
                  </Field>

                  <Field
                    label={t("phone", locale)}
                    error={errors.phoneNumber}
                    hint={getPhoneHelperText(form.phoneNumber)}
                  >
                    <CountryPhoneInput
                      value={form.phoneNumber}
                      onChange={(value) => updateForm("phoneNumber", value)}
                      allowedCountryCodes={HONG_KONG_COUNTRY_CODES}
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

              <Card
                icon={<MapPin className="h-5 w-5" />}
                title={t("deliveryAddress", locale)}
                index="02"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label={t("city", locale)} error={errors.deliveryLocationId}>
                    <select
                      value={form.deliveryLocationId}
                      disabled={zoneLoading}
                      onChange={(e) => updateForm("deliveryLocationId", e.target.value)}
                      className={inputClass(errors.deliveryLocationId)}
                    >
                      <option value="">
                        {zoneLoading ? "Loading..." : t("selectCity", locale)}
                      </option>

                      {zones.map((zone) => (
                        <option
                          key={zone._id || zone.id || zone.name}
                          value={zone._id || zone.id}
                        >
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
                        maxLength={INPUT_LIMITS.address}
                        className={`${inputClass(errors.address)} min-h-[96px] resize-none py-3`}
                      />
                    </Field>
                  </div>

                  {selectedZone && (
                    <div className="md:col-span-2">
                      <InfoBox>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                          <span>
                            {t("deliveryCharge", locale)}: <strong>{deliveryCharge === 0 ? t("free", locale) : money(deliveryCharge)}</strong>
                          </span>

                          {Number(selectedZone.freeDeliveryThreshold || 0) > 0 && (
                            <span>
                              {t("freeAbove", locale)}: <strong>{money(selectedZone.freeDeliveryThreshold)}</strong>
                            </span>
                          )}

                          <span>
                            COD: <strong>{selectedZone.codAvailable ? "Available" : "Not Available"}</strong>
                          </span>
                        </div>
                      </InfoBox>
                    </div>
                  )}
                </div>
              </Card>

              <Card
                icon={<CreditCard className="h-5 w-5" />}
                title={t("paymentMethods", locale)}
                index="03"
              >
                {!selectedZone ? (
                  <InfoBox>{t("selectZoneInfo", locale)}</InfoBox>
                ) : (
                  <div className="space-y-3">
                    {!isLoggedIn && <InfoBox>{t("guestPaymentAsiaOnly", locale)}</InfoBox>}

                    <ul className="space-y-3">
                      <PaymentOption
                        checked={form.paymentMethod === "cod"}
                        disabled={!isLoggedIn || !isCodAvailable(selectedZone)}
                        label={t("cod", locale)}
                        description={
                          !isLoggedIn
                            ? t("codLoginInfo", locale)
                            : !isCodAvailable(selectedZone)
                              ? t("codUnavailable", locale)
                              : t("codInfo", locale)
                        }
                        icon={<Truck className="h-4 w-4" />}
                        onChange={() => {
                          if (!isLoggedIn) {
                            toast.error(t("codLoginInfo", locale));
                            return;
                          }

                          if (!isCodAvailable(selectedZone)) {
                            toast.error(t("codUnavailable", locale));
                            return;
                          }

                          updateForm("paymentMethod", "cod");
                        }}
                      />

                      <PaymentOption
                        checked={form.paymentMethod === "paymentasia"}
                        label={t("paymentasia", locale)}
                        description={t("paymentasiaInfo", locale)}
                        icon={<CreditCard className="h-4 w-4" />}
                        onChange={() => updateForm("paymentMethod", "paymentasia")}
                      />

                      <PaymentOption
                        checked={form.paymentMethod === "stripe"}
                        label={t("stripe", locale)}
                        description={t("stripeInfo", locale)}
                        icon={<CreditCard className="h-4 w-4" />}
                        onChange={() => updateForm("paymentMethod", "stripe")}
                      />
                    </ul>

                    {form.paymentMethod === "paymentasia" && (
                      <InfoBox>{t("paymentasiaInfo", locale)}</InfoBox>
                    )}

                    {form.paymentMethod === "stripe" && (
                      <InfoBox>{t("stripeInfo", locale)}</InfoBox>
                    )}

                    {errors.paymentMethod && (
                      <p className="text-xs font-medium text-red-500">
                        {errors.paymentMethod}
                      </p>
                    )}
                  </div>
                )}
              </Card>
            </div>

            <aside className="sticky top-6 rounded-[28px] border border-orange-100 bg-white/95 p-5 shadow-sm backdrop-blur">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1a4b8f]">
                    {t("orderSummary", locale)}
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-neutral-950">
                    Restaurant Cart
                  </h2>
                </div>

                <Utensils className="h-6 w-6 text-orange-500" />
              </div>

              <div className="max-h-[310px] space-y-4 overflow-auto pr-1">
                {cartItems.map((item) => {
                  const food = item.food || {};
                  const foodId = food._id || item.foodId || item._id;
                  const qty = Number(item.quantity || 1);
                  const price = getFoodPrice(food, item);

                  return (
                    <div
                      key={foodId}
                      className="flex items-center gap-3 rounded-2xl border border-orange-100 bg-orange-50/30 p-3"
                    >
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white">
                        <Image
                          src={safeImageUrl(food.image)}
                          alt={pickText(food.name, locale, "Food") || "Food"}
                          fill
                          sizes="64px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 text-sm font-bold text-neutral-900">
                          {pickText(food.name, locale, "Food")}
                        </p>

                        <p className="mt-1 text-xs text-neutral-500">
                          Qty: {qty}
                        </p>

                        <p className="mt-1 text-sm font-bold text-[#1a4b8f]">
                          {money(price * qty)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => safeRemoveFood?.(foodId)}
                        className="h-9 w-9 rounded-xl text-neutral-400 hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 className="mx-auto h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="mt-7 space-y-4">
                <SummaryRow label={t("subTotal", locale)} value={money(subTotal)} />

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
                disabled={submitting || !selectedZone || !form.paymentMethod}
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
                    {!form.paymentMethod
                      ? "Select Payment Method"
                      : ["paymentasia", "stripe"].includes(form.paymentMethod)
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

      {paymentasiaPayment && (
        <PaymentAsiaModal
          locale={locale}
          payment={paymentasiaPayment}
          status={paymentasiaStatus}
          onClose={closePaymentAsiaModal}
          onCheck={() =>
            checkPaymentAsiaStatusOnce(
              currentCheckoutId,
              currentOrderNumber,
              true
            )
          }
          onSimulatePaid={simulateSandboxPaymentPaid}
          successSimulationAllowed={successSimulationAllowed}
        />
      )}
    </>
  );
}

function Card({ children, title, icon, index }) {
  return (
    <div className="relative overflow-visible rounded-[28px] border border-orange-100 bg-white/95 p-5 shadow-sm sm:p-6">
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
  return `h-12 w-full rounded-xl border bg-white px-4 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:ring-4 disabled:cursor-not-allowed disabled:bg-neutral-100 ${hasError
    ? "border-red-200 focus:border-red-400 focus:ring-red-50"
    : "border-orange-100 focus:border-[#1a4b8f] focus:ring-blue-50"
    }`;
}

function PaymentOption({ checked, disabled, label, description, icon, onChange }) {
  return (
    <li className="list-none">
      <label
        className={`flex cursor-pointer items-center justify-between gap-4 rounded-2xl border p-4 transition ${disabled
          ? "cursor-not-allowed border-neutral-100 bg-neutral-50 opacity-60"
          : checked
            ? "border-[#1a4b8f] bg-blue-50"
            : "border-orange-100 bg-white hover:border-[#1a4b8f]/40"
          }`}
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1a4b8f] text-white">
            {icon}
          </span>

          <span className="min-w-0">
            <span className="block text-sm font-bold text-neutral-900">
              {label}
            </span>

            {description && (
              <span className="mt-1 block text-xs font-medium text-neutral-500">
                {description}
              </span>
            )}
          </span>
        </span>

        <input
          type="radio"
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          className="h-4 w-4 shrink-0 accent-[#1a4b8f]"
        />
      </label>
    </li>
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

function PaymentAsiaModal({
  locale,
  payment,
  status,
  onClose,
  onCheck,
  onSimulatePaid,
  successSimulationAllowed,
}) {
  const link = payment?.webLink || payment?.appLink || payment?.uri;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 px-4 py-6">
      <div className="relative max-h-[95vh] w-full max-w-md overflow-y-auto rounded-[28px] bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-neutral-100 px-3 py-1 text-sm font-bold text-neutral-500 hover:bg-neutral-200"
        >
          ×
        </button>

        <div className="mb-5 flex justify-center">
          <PaymentAsiaRedLogo className="h-11 w-auto" />
        </div>

        <div className="rounded-3xl border border-pink-100 bg-pink-50 p-5 text-center">
          <p className="mb-4 text-sm font-bold text-neutral-800">
            {t("scanQR", locale)}
          </p>

          {link ? (
            <div className="inline-flex rounded-2xl bg-white p-4 shadow-sm">
              <QRCodeCanvas value={link} size={210} />
            </div>
          ) : (
            <p className="text-sm text-red-500">
              PaymentAsia link not available.
            </p>
          )}

          {status && (
            <p className="mt-4 text-xs font-bold uppercase tracking-wide text-pink-700">
              Status: {status}
            </p>
          )}
        </div>

        <div className="mt-5 grid gap-3">
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#e5007e] text-sm font-bold text-white hover:bg-[#c80070]"
            >
              <PaymentAsiaWhiteIcon />
              {t("openPaymentAsiaApp", locale)}
            </a>
          )}

          <button
            type="button"
            onClick={onCheck}
            className="h-12 rounded-xl bg-[#1a4b8f] text-sm font-bold text-white hover:bg-[#0f2a5e]"
          >
            {t("checkPayment", locale)}
          </button>

          {successSimulationAllowed && (
            <button
              type="button"
              onClick={onSimulatePaid}
              className="h-12 rounded-xl bg-green-600 text-sm font-bold text-white hover:bg-green-700"
            >
              {t("simulateSandboxPaid", locale)}
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-xl border border-neutral-200 text-sm font-bold text-neutral-700 hover:bg-neutral-50"
          >
            {t("cancel", locale)}
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-neutral-500">
          Status polling starts automatically after 60 seconds.
        </p>
      </div>
    </div>
  );
}