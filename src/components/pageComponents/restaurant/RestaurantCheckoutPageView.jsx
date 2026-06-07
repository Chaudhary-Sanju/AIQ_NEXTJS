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

const PHONE_REGEX = /^(\+977-\d{10}|\+852-\d{8}|\d{10}|\d{8})$/;
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
    en: "Pay with PayMe",
    ne: "PayMe बाट भुक्तानी गर्नुहोस्",
    zh: "使用 PayMe 付款",
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
  payme: {
    en: "PayMe",
    ne: "PayMe",
    zh: "PayMe",
  },
  paymeInfo: {
    en: "Pay securely with PayMe.",
    ne: "PayMe मार्फत सुरक्षित भुक्तानी गर्नुहोस्।",
    zh: "使用 PayMe 安全付款。",
  },
  guestPaymeOnly: {
    en: "Guest checkout is available with PayMe only. Login to use Cash on Delivery.",
    ne: "अतिथि चेकआउट केवल PayMe संग उपलब्ध छ। नगदमा डेलिभरी प्रयोग गर्न लगइन गर्नुहोस्।",
    zh: "訪客結帳僅可使用 PayMe。登錄以使用貨到付款。",
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

const normalizePhoneNumber = (value) => {
  const raw = String(value || "").trim();
  if (!raw) return raw;

  const digits = raw.replace(/\D/g, "");

  if (digits.length === 10) return `+977-${digits}`;
  if (digits.length === 8) return `+852-${digits}`;

  if (digits.startsWith("977") && digits.length === 13) {
    return `+977-${digits.slice(3)}`;
  }

  if (digits.startsWith("852") && digits.length === 11) {
    return `+852-${digits.slice(3)}`;
  }

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

  const [paymePayment, setPaymePayment] = useState(null);
  const [paymeStatus, setPaymeStatus] = useState(null);
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

    return () => stopPaymePolling();
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
          next.paymentMethod = "payme";
        } else if (zone.codAvailable) {
          next.paymentMethod = "cod";
        } else {
          next.paymentMethod = "payme";
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
        "Invalid phone number. Use 10 digits for Nepal or 8 digits for Hong Kong.";
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

    if (!isLoggedIn && form.paymentMethod !== "payme") {
      next.paymentMethod = "Guest checkout supports PayMe only.";
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

  const normalizePaymePayment = (payme) => {
    if (!payme) return null;

    const paymentRequestId =
      payme.paymentRequestId ||
      payme.payment_request_id ||
      payme.id ||
      payme.paymentId ||
      payme.checkoutId;

    const webLink =
      payme.webLink ||
      payme.weblink ||
      payme.paymentUrl ||
      payme.payment_url ||
      payme.url ||
      payme.uri ||
      payme.paymentUri;

    const appLink =
      payme.appLink ||
      payme.applink ||
      payme.deepLink ||
      payme.deeplink ||
      webLink;

    const qrValue = webLink || appLink || payme.uri;

    if (!paymentRequestId && !qrValue) return null;

    return {
      paymentRequestId,
      uri: qrValue,
      webLink,
      appLink,
      statusCode: payme.statusCode,
      statusDescription: payme.statusDescription,
      raw: payme,
    };
  };

  const savePendingPayme = ({ payment, checkoutId, orderNumber }) => {
    if (typeof window === "undefined") return;

    sessionStorage.setItem(
      "hkmandu_pending_food_payme",
      JSON.stringify({
        payment,
        checkoutId,
        orderNumber,
        createdAt: Date.now(),
      })
    );
  };

  const clearPendingPayme = () => {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem("hkmandu_pending_food_payme");
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
      order?.orderNo ||
      order?.orderId ||
      order?._id ||
      null;

    setPaymeStatus(status);
    clearPendingPayme();

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

  const checkPaymeStatusOnce = async (
    checkoutId,
    orderNumber,
    showPendingToast = true
  ) => {
    if (!checkoutId) return false;

    try {
      const res = await http.get(
        `/frontend/foodOrder/payme-status/${checkoutId}`
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
        safeToastError(err, "Unable to check PayMe payment status.");
      }

      return false;
    }
  };

  const simulateSandboxPaymentPaid = async () => {
    if (!currentCheckoutId) return;

    try {
      const res = await http.post(
        `/frontend/foodOrder/payme-sandbox-mark-paid/${currentCheckoutId}`
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

  const closePaymeModal = () => {
    stopPaymePolling();
    clearPendingPayme();

    setPaymePayment(null);
    setPaymeStatus(null);
    setCurrentCheckoutId(null);
    setCurrentOrderNumber(null);
  };

  const startPaymePollingAfter60Seconds = (checkoutId, orderNumber = null) => {
    stopPaymePolling();

    pollingTimeoutRef.current = setTimeout(() => {
      checkPaymeStatusOnce(checkoutId, orderNumber, false);

      pollingIntervalRef.current = setInterval(() => {
        checkPaymeStatusOnce(checkoutId, orderNumber, false);
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
      };

      const res = await http.post("/frontend/foodOrder", payload);

      if (form.paymentMethod === "payme") {
        const checkout =
          res?.data?.checkout ||
          res?.data?.data?.checkout ||
          res?.data?.data ||
          res?.data;

        const checkoutId =
          res?.data?.checkoutId ||
          checkout?.checkoutId ||
          checkout?._id ||
          checkout?.id ||
          checkout?.paymentRequestId;

        const payme =
          res?.data?.payme ||
          res?.data?.payment ||
          res?.data?.paymePayment ||
          checkout?.payme ||
          checkout?.payment ||
          checkout;

        const normalizedPayme = normalizePaymePayment(payme);

        if (!checkoutId && !normalizedPayme) {
          console.log("Restaurant PayMe response:", res?.data);
          toast.error("PayMe payment link not received.");
          return;
        }

        const finalCheckoutId = checkoutId || normalizedPayme?.paymentRequestId;

        setPaymePayment(normalizedPayme);
        setPaymeStatus("PENDING");
        setCurrentCheckoutId(finalCheckoutId);
        setCurrentOrderNumber(null);

        savePendingPayme({
          payment: normalizedPayme,
          checkoutId: finalCheckoutId,
          orderNumber: null,
        });

        startPaymePollingAfter60Seconds(finalCheckoutId, null);

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
            href={restaurantHref}
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
              Secure restaurant checkout
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
                    label={`${t("email", locale)} (${t(
                      "optional",
                      locale
                    )})`}
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
                      value={form.deliveryLocationId}
                      disabled={zoneLoading}
                      onChange={(e) =>
                        updateForm(
                          "deliveryLocationId",
                          e.target.value
                        )
                      }
                      className={[
                        "h-12 w-full rounded-2xl border bg-white px-4 text-sm text-neutral-900 outline-none transition focus:border-[#1a4b8f] focus:ring-4 focus:ring-[#1a4b8f]/10 disabled:cursor-not-allowed disabled:bg-neutral-100",
                        errors.deliveryLocationId
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
                          key={zone._id || zone.id || zone.name}
                          value={zone._id || zone.id}
                        >
                          {zone.name} — {money(zone.deliveryCharge)}
                          {Number(
                            zone.freeDeliveryThreshold || 0
                          ) > 0
                            ? ` | ${t(
                              "freeAbove",
                              locale
                            )} ${money(
                              zone.freeDeliveryThreshold
                            )}`
                            : ""}
                          {zone.codAvailable
                            ? " | COD"
                            : " | No COD"}
                        </option>
                      ))}
                    </select>

                    {errors.deliveryLocationId && (
                      <p className="mt-1 text-xs font-medium text-red-500">
                        {errors.deliveryLocationId}
                      </p>
                    )}

                    {selectedZone && (
                      <div className="mt-3 rounded-2xl border border-orange-100 bg-orange-50/60 p-4">
                        <div className="flex flex-wrap gap-3 text-xs font-semibold text-neutral-700">
                          <span>
                            {t("deliveryCharge", locale)}:{" "}
                            <strong>
                              {money(
                                selectedZone.deliveryCharge
                              )}
                            </strong>
                          </span>

                          {Number(
                            selectedZone.freeDeliveryThreshold ||
                            0
                          ) > 0 && (
                              <span>
                                {t("freeAbove", locale)}:{" "}
                                <strong>
                                  {money(
                                    selectedZone.freeDeliveryThreshold
                                  )}
                                </strong>
                              </span>
                            )}

                          <span>
                            COD:{" "}
                            <strong>
                              {selectedZone.codAvailable
                                ? "Available"
                                : "Not Available"}
                            </strong>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <Input
                    label={t("address", locale)}
                    required
                    value={form.address}
                    error={errors.address}
                    onChange={(v) => updateForm("address", v)}
                    placeholder="Street, building, room number"
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
                icon={<CreditCard className="h-5 w-5" />}
                title={t("paymentMethods", locale)}
                index="03"
              >
                {!selectedZone ? (
                  <div className="rounded-2xl border border-orange-100 bg-orange-50/70 p-5 text-center">
                    <CreditCard className="mx-auto h-8 w-8 text-[#1a4b8f]" />

                    <p className="mt-3 text-sm font-semibold text-neutral-800">
                      Select delivery zone first
                    </p>

                    <p className="mt-1 text-xs text-neutral-500">
                      Payment options will appear after choosing
                      delivery location.
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="mb-4 text-sm text-neutral-500">
                      {isLoggedIn
                        ? "Choose Cash on Delivery or PayMe for this restaurant order."
                        : t("guestPaymeOnly", locale)}
                    </p>

                    <div
                      className={`grid gap-4 ${isLoggedIn
                          ? "md:grid-cols-2"
                          : "md:grid-cols-1"
                        }`}
                    >
                      {isLoggedIn && (
                        <PaymentCard
                          selected={
                            form.paymentMethod === "cod"
                          }
                          disabled={
                            !isCodAvailable(selectedZone)
                          }
                          title={t("cod", locale)}
                          description={
                            isCodAvailable(selectedZone)
                              ? "Pay cash when your food is delivered."
                              : t(
                                "codUnavailable",
                                locale
                              )
                          }
                          icon={<Truck className="h-5 w-5" />}
                          onClick={() => {
                            if (
                              !isCodAvailable(
                                selectedZone
                              )
                            ) {
                              toast.error(
                                t(
                                  "codUnavailable",
                                  locale
                                )
                              );
                              return;
                            }

                            updateForm(
                              "paymentMethod",
                              "cod"
                            );
                          }}
                        />
                      )}

                      <PaymentCard
                        selected={
                          form.paymentMethod === "payme"
                        }
                        title={t("payme", locale)}
                        description={
                          isLoggedIn
                            ? "Pay now securely with PayMe."
                            : t("paymeInfo", locale)
                        }
                        logo={<PayMeRedLogo />}
                        onClick={() =>
                          updateForm(
                            "paymentMethod",
                            "payme"
                          )
                        }
                      />
                    </div>

                    {errors.paymentMethod && (
                      <p className="mt-3 text-xs font-medium text-red-500">
                        {errors.paymentMethod}
                      </p>
                    )}
                  </>
                )}
              </Card>
            </div>

            <aside className="sticky top-6 rounded-[28px] border border-orange-100 bg-white/95 p-5 shadow-[0_24px_70px_rgba(15,42,94,0.10)] backdrop-blur">
              <div className="mb-5 flex items-center justify-between">
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
                  const foodId = food._id;
                  const qty = Number(item.quantity || 1);
                  const price = getFoodPrice(food, item);

                  return (
                    <div key={foodId} className="flex gap-3">
                      <div className="relative h-14 w-14 shrink-0 overflow-visible rounded-2xl bg-orange-50">
                        <Image
                          src={safeImageUrl(food.image)}
                          alt={
                            pickText(
                              food.name,
                              locale,
                              "Food"
                            ) || "Food"
                          }
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
                          {pickText(
                            food.name,
                            locale,
                            "Food"
                          )}
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
                          onClick={() =>
                            safeRemoveFood?.(foodId)
                          }
                          className="rounded-lg p-1 text-red-400 transition hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
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
                disabled={
                  submitting || !selectedZone || !form.paymentMethod
                }
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
                      : form.paymentMethod === "payme"
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
        <PayMeModal
          locale={locale}
          payment={paymePayment}
          status={paymeStatus}
          onClose={closePaymeModal}
          onCheck={() =>
            checkPaymeStatusOnce(
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

function Card({ title, icon, index, children }) {
  return (
    <section className="rounded-[28px] border border-orange-100 bg-white/95 p-5 shadow-[0_18px_60px_rgba(15,42,94,0.08)] backdrop-blur">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-[#1a4b8f]">
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-orange-500">
            Step {index}
          </div>

          <h2 className="text-lg font-bold text-neutral-950">
            {title}
          </h2>
        </div>
      </div>

      {children}
    </section>
  );
}

function Input({
  label,
  value,
  onChange,
  onBlur,
  type = "text",
  required,
  placeholder,
  error,
  helperText,
  inputMode,
  maxLength,
  disabled,
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
        inputMode={inputMode}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className={[
          "h-12 w-full rounded-2xl border bg-white px-4 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-[#1a4b8f] focus:ring-4 focus:ring-[#1a4b8f]/10 disabled:cursor-not-allowed disabled:bg-neutral-100",
          error ? "border-red-400" : "border-orange-100",
        ].join(" ")}
      />

      {error ? (
        <p className="mt-1 text-xs font-medium text-red-500">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-neutral-500">{helperText}</p>
      ) : null}
    </div>
  );
}

function PaymentCard({
  selected,
  disabled,
  title,
  description,
  icon,
  logo,
  onClick,
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        "rounded-2xl border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-50",
        selected
          ? "border-[#1a4b8f] bg-blue-50 ring-4 ring-[#1a4b8f]/10"
          : "border-orange-100 bg-white hover:border-[#1a4b8f]/40",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-[#1a4b8f]">
          {logo || icon}
        </div>

        <div>
          <h3 className="font-bold text-neutral-950">{title}</h3>

          <p className="mt-1 text-xs leading-5 text-neutral-500">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}

function SummaryRow({ label, value, danger }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm font-medium text-neutral-600">{label}</span>

      <span
        className={[
          "text-sm font-bold",
          danger ? "text-red-500" : "text-neutral-950",
        ].join(" ")}
      >
        {value}
      </span>
    </div>
  );
}

function PayMeModal({
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
          <PayMeRedLogo className="h-11 w-auto" />
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
              PayMe link not available.
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
              <PayMeWhiteIcon />
              {t("openPaymeApp", locale)}
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