import { imgUrl } from "@/lib";

export const restaurantPath = (locale, path = "") => {
  const safeLocale = locale || "en";
  const cleanPath = String(path || "").replace(/^\/+/, "");
  return `/${safeLocale}/restaurant${cleanPath ? `/${cleanPath}` : ""}`;
};

export const money = (value) => {
  const num = Number(value || 0);

  return `HK$ ${num.toLocaleString("en-HK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const pickText = (value, locale = "en", fallback = "") => {
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

export const pickName = (name, locale = "en") => {
  return pickText(name, locale, "Food");
};

export const getFoodImage = (food = {}) => {
  const image =
    food.image ||
    food.featuredImage ||
    food.thumbnail ||
    food.images?.[0] ||
    food.imageUrl ||
    "";

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

export const getFoodPrice = (food = {}) => {
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

export const hasFoodDiscount = (food = {}) => {
  const price = Number(food.price || 0);
  const discount = food.discounted_price ?? food.discountPrice;

  return (
    discount !== null &&
    discount !== undefined &&
    discount !== "" &&
    Number(discount) > 0 &&
    Number(discount) < price
  );
};

export const isFoodAvailable = (food = {}) => {
  if (food.isAvailable !== undefined) return Boolean(food.isAvailable);
  return food.status === undefined ? true : Boolean(food.status);
};

export const getListFromResponse = (data) => {
  if (Array.isArray(data?.data?.foods)) return data.data.foods;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.foods)) return data.foods;
  if (Array.isArray(data)) return data;
  return [];
};

export const getDeliveryLocationsFromResponse = (data) => {
  if (Array.isArray(data?.data?.deliveryLocations)) {
    return data.data.deliveryLocations;
  }

  if (Array.isArray(data?.data?.restaurantDelivery)) {
    return data.data.restaurantDelivery;
  }

  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.deliveryLocations)) return data.deliveryLocations;
  if (Array.isArray(data?.restaurantDelivery)) return data.restaurantDelivery;
  if (Array.isArray(data)) return data;

  return [];
};

export const calculateRestaurantDelivery = (subtotal, location) => {
  const threshold = Number(location?.freeDeliveryThreshold || 0);
  const baseCharge = Number(location?.deliveryCharge || 0);

  const deliveryCharge =
    threshold > 0 && Number(subtotal || 0) >= threshold ? 0 : baseCharge;

  return {
    deliveryCharge,
    total: Number(subtotal || 0) + deliveryCharge,
    freeDeliveryApplied: baseCharge > 0 && deliveryCharge === 0,
  };
};

export const restaurantUI = {
  title: {
    en: "Restaurant Food",
    ne: "रेस्टुरेन्ट खाना",
    zh: "餐廳美食",
  },
  subtitle: {
    en: "Order fresh food from HKMandu Kitchen",
    ne: "HKMandu Kitchen बाट ताजा खाना अर्डर गर्नुहोस्",
    zh: "從 HKMandu Kitchen 訂購新鮮美食",
  },
  search: {
    en: "Search food...",
    ne: "खाना खोज्नुहोस्...",
    zh: "搜尋美食...",
  },
  allCategories: {
    en: "All Categories",
    ne: "सबै कोटीहरू",
    zh: "全部分類",
  },
  addToCart: {
    en: "Add to Cart",
    ne: "कार्टमा थप्नुहोस्",
    zh: "加入購物車",
  },
  cart: {
    en: "Restaurant Cart",
    ne: "रेस्टुरेन्ट कार्ट",
    zh: "餐廳購物車",
  },
  checkout: {
    en: "Restaurant Checkout",
    ne: "रेस्टुरेन्ट चेकआउट",
    zh: "餐廳結帳",
  },
  trackOrder: {
    en: "Track Restaurant Order",
    ne: "रेस्टुरेन्ट अर्डर ट्र्याक गर्नुहोस्",
    zh: "追蹤餐廳訂單",
  },
  emptyCart: {
    en: "Your restaurant cart is empty.",
    ne: "तपाईंको रेस्टुरेन्ट कार्ट खाली छ।",
    zh: "您的餐廳購物車是空的。",
  },
  deliveryLocation: {
    en: "Delivery Location",
    ne: "डेलिभरी स्थान",
    zh: "送貨地區",
  },
  selectLocation: {
    en: "Select delivery location",
    ne: "डेलिभरी स्थान छान्नुहोस्",
    zh: "選擇送貨地區",
  },
  deliveryCharge: {
    en: "Delivery Charge",
    ne: "डेलिभरी शुल्क",
    zh: "送貨費",
  },
  freeAbove: {
    en: "Free delivery above",
    ne: "यो भन्दा माथि नि:शुल्क डेलिभरी",
    zh: "滿額免費送貨",
  },
  subtotal: {
    en: "Subtotal",
    ne: "उप-योग",
    zh: "小計",
  },
  total: {
    en: "Total",
    ne: "जम्मा",
    zh: "總額",
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
  loggedInCod: {
    en: "Logged-in customers can order with Cash on Delivery.",
    ne: "लगइन भएका ग्राहकले Cash on Delivery प्रयोग गर्न सक्छन्।",
    zh: "已登入客戶可使用貨到付款。",
  },
  guestPayme: {
    en: "Guest customers must pay with PayMe.",
    ne: "गेस्ट ग्राहकले PayMe बाट भुक्तानी गर्नुपर्छ।",
    zh: "訪客客戶必須使用 PayMe 付款。",
  },
  codUnavailable: {
    en: "COD is not available for this delivery location.",
    ne: "यो स्थानमा COD उपलब्ध छैन।",
    zh: "此送貨地區不支援貨到付款。",
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
  orderNumber: {
    en: "Order Number",
    ne: "अर्डर नम्बर",
    zh: "訂單號碼",
  },
};

export const t = (locale, key) => {
  const value = restaurantUI[key];
  if (!value) return key;
  return value[locale] || value.en || key;
};