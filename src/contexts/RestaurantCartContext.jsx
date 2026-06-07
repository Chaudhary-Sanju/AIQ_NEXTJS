"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";

const RestaurantCartContext = createContext(null);

const RESTAURANT_CART_KEY = "hkmandu_restaurant_cart";

const toNumber = (value, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const pickName = (name) => {
  if (!name) return "Food";
  if (typeof name === "string") return name;
  return name.en || name.ne || name.zh || "Food";
};

const getFoodImage = (food = {}) => {
  return (
    food.image ||
    food.featuredImage ||
    food.thumbnail ||
    food.images?.[0] ||
    food.imageUrl ||
    ""
  );
};

const getFoodPrice = (food = {}) => {
  const price = toNumber(food.price, 0);
  const discount = food.discounted_price ?? food.discountPrice;

  if (
    discount !== null &&
    discount !== undefined &&
    discount !== "" &&
    toNumber(discount, price) > 0 &&
    toNumber(discount, price) < price
  ) {
    return toNumber(discount, price);
  }

  return price;
};

const normalizeFood = (food = {}) => ({
  _id: food._id || food.id,
  name: food.name || "Food",
  summary: food.summary || "",
  description: food.description || "",
  slug: food.slug || "",
  category: food.category || "",
  restaurantName: food.restaurantName || "HKMandu Kitchen",
  price: toNumber(food.price, 0),
  discounted_price: food.discounted_price ?? food.discountPrice ?? "",
  finalPrice: getFoodPrice(food),
  image: getFoodImage(food),
  foodType: food.foodType || "",
  preparationTime: food.preparationTime || "",
});

const calculateCart = (items = []) => {
  const safeItems = items
    .map((item) => ({
      food: normalizeFood(item.food || item),
      quantity: Math.max(toNumber(item.quantity || item.qty, 1), 1),
    }))
    .filter((item) => item.food?._id);

  const totalItems = safeItems.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = safeItems.reduce(
    (sum, item) => sum + toNumber(item.food.finalPrice, 0) * item.quantity,
    0
  );

  return {
    items: safeItems,
    totalItems,
    subtotal,
    subTotal: subtotal,
  };
};

const readCart = () => {
  if (typeof window === "undefined") return calculateCart([]);

  try {
    const raw = localStorage.getItem(RESTAURANT_CART_KEY);
    if (!raw) return calculateCart([]);

    return calculateCart(JSON.parse(raw));
  } catch {
    return calculateCart([]);
  }
};

const writeCart = (items) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(RESTAURANT_CART_KEY, JSON.stringify(items));
};

export const RestaurantCartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => calculateCart([]));
  const [hydrated, setHydrated] = useState(false);

  const refreshCart = useCallback(() => {
    setCart(readCart());
  }, []);

  useEffect(() => {
    refreshCart();
    setHydrated(true);
  }, [refreshCart]);

  const persist = useCallback((items) => {
    const next = calculateCart(items);
    setCart(next);
    writeCart(next.items);
  }, []);

  const addToCart = useCallback(
    (food, quantity = 1) => {
      const current = readCart().items;
      const foodId = food?._id || food?.id;

      if (!foodId) {
        toast.error("Invalid food item.");
        return;
      }

      const existing = current.find(
        (item) => String(item.food._id) === String(foodId)
      );

      let next;

      if (existing) {
        next = current.map((item) =>
          String(item.food._id) === String(foodId)
            ? {
              ...item,
              quantity: item.quantity + Math.max(Number(quantity) || 1, 1),
            }
            : item
        );
      } else {
        next = [
          ...current,
          {
            food: normalizeFood(food),
            quantity: Math.max(Number(quantity) || 1, 1),
          },
        ];
      }

      persist(next);
      toast.success(`${pickName(food.name)} added to restaurant cart`);
    },
    [persist]
  );

  const updateQuantity = useCallback(
    (foodId, quantity) => {
      const qty = Math.max(Number(quantity) || 1, 1);

      const next = readCart().items.map((item) =>
        String(item.food._id) === String(foodId)
          ? { ...item, quantity: qty }
          : item
      );

      persist(next);
    },
    [persist]
  );

  const removeFromCart = useCallback(
    (foodId) => {
      const next = readCart().items.filter(
        (item) => String(item.food._id) !== String(foodId)
      );

      persist(next);
      toast.success("Food removed from restaurant cart");
    },
    [persist]
  );

  const clearCart = useCallback(() => {
    persist([]);
  }, [persist]);

  const value = useMemo(
    () => ({
      cart,
      ready: hydrated,
      hydrated,

      items: cart.items,
      totalItems: cart.totalItems,
      subtotal: cart.subtotal,
      subTotal: cart.subTotal,

      addToCart,
      updateQuantity,

      removeFromCart,
      removeFood: removeFromCart,

      clearCart,
      clearRestaurantCart: clearCart,

      refreshCart,
    }),
    [
      cart,
      hydrated,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      refreshCart,
    ]
  );

  return (
    <RestaurantCartContext.Provider value={value}>
      {children}
    </RestaurantCartContext.Provider>
  );
};

export const useRestaurantCart = () => {
  const ctx = useContext(RestaurantCartContext);

  if (!ctx) {
    throw new Error(
      "useRestaurantCart must be used inside RestaurantCartProvider"
    );
  }

  return ctx;
};