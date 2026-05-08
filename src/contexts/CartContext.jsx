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
import http from "@/http";
import { fromStorage } from "@/lib";

const CartContext = createContext(null);

const GUEST_CART_KEY = "hkmandu_guest_cart";

const toNumber = (value, fallback = 0) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
};

const ensureNameObject = (name) => {
    if (name && typeof name === "object") return name;

    if (typeof name === "string") {
        return {
            en: name,
            ne: name,
            zh: name,
        };
    }

    return {
        en: "Product",
        ne: "Product",
        zh: "Product",
    };
};

const normalizeProductSnapshot = (productId, product = {}) => {
    const image =
        product?.featuredImage ||
        product?.thumbnail ||
        product?.image?.[0] ||
        product?.images?.[0] ||
        product?.image ||
        null;

    return {
        _id: product?._id || product?.id || productId,
        slug: product?.slug || "",
        name: ensureNameObject(product?.name),
        summary:
            product?.summary && typeof product.summary === "object"
                ? product.summary
                : product?.summary
                    ? {
                        en: product.summary,
                        ne: product.summary,
                        zh: product.summary,
                    }
                    : {},
        image: image ? [image] : [],
        images: image ? [image] : [],
        price: toNumber(product?.price, 0),
        discounted_price:
            product?.discounted_price ?? product?.discountPrice ?? null,
        qty: toNumber(product?.qty ?? product?.stock, 9999),
        sellOnNoStock: Boolean(product?.sellOnNoStock),
    };
};

const calculateCart = (items = []) => {
    const safeItems = items
        .map((item) => {
            const product =
                item?.productId && typeof item.productId === "object"
                    ? item.productId
                    : normalizeProductSnapshot(
                        item?.productId || item?.productID || item?._id
                    );

            const price = toNumber(item?.price ?? product?.price, 0);

            const discounted_price =
                item?.discounted_price ?? product?.discounted_price ?? null;

            const hasDiscount =
                discounted_price !== null &&
                discounted_price !== undefined &&
                discounted_price !== "" &&
                toNumber(discounted_price, price) < price;

            const quantity = Math.max(
                toNumber(item?.quantity ?? item?.qty, 1),
                1
            );

            return {
                productId: product,
                quantity,
                price,
                discounted_price: hasDiscount ? discounted_price : null,
            };
        })
        .filter((item) => item?.productId?._id && item.quantity > 0);

    const totalItems = safeItems.reduce((sum, item) => sum + item.quantity, 0);

    const subTotal = safeItems.reduce((sum, item) => {
        const price = toNumber(item.price, 0);
        const discounted = item.discounted_price;

        const finalPrice =
            discounted !== null &&
                discounted !== undefined &&
                discounted !== "" &&
                toNumber(discounted, price) < price
                ? toNumber(discounted, price)
                : price;

        return sum + finalPrice * item.quantity;
    }, 0);

    return {
        items: safeItems,
        totalItems,
        subTotal,
        totalAmount: subTotal,
    };
};

const readGuestCart = () => {
    if (typeof window === "undefined") return calculateCart([]);

    try {
        const raw = window.localStorage.getItem(GUEST_CART_KEY);

        if (!raw) return calculateCart([]);

        const parsed = JSON.parse(raw);

        return calculateCart(Array.isArray(parsed?.items) ? parsed.items : []);
    } catch {
        return calculateCart([]);
    }
};

const writeGuestCart = (cart) => {
    if (typeof window === "undefined") return;

    window.localStorage.setItem(
        GUEST_CART_KEY,
        JSON.stringify(calculateCart(cart?.items || []))
    );

    window.dispatchEvent(new Event("hkmandu-guest-cart-updated"));
};

export const clearGuestCartStorage = () => {
    if (typeof window === "undefined") return;

    window.localStorage.removeItem(GUEST_CART_KEY);
    window.dispatchEvent(new Event("hkmandu-guest-cart-updated"));
};

export function CartProvider({ children }) {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);

    const hasToken = useCallback(() => Boolean(fromStorage("hkmandu")), []);

    const fetchCart = useCallback(async () => {
        try {
            setLoading(true);

            if (!hasToken()) {
                setCart(readGuestCart());
                return;
            }

            const res = await http.get("/frontend/cart");
            setCart(res?.data?.data || calculateCart([]));
        } catch {
            if (hasToken()) {
                setCart(calculateCart([]));
            } else {
                setCart(readGuestCart());
            }
        } finally {
            setLoading(false);
        }
    }, [hasToken]);

    const addToCart = useCallback(
        async (productId, quantity = 1, product = {}) => {
            try {
                setBusy(true);

                if (!hasToken()) {
                    const current = readGuestCart();
                    const id = String(productId);

                    const existingIndex = current.items.findIndex((item) => {
                        const existingId =
                            item?.productId?._id || item?.productId;

                        return String(existingId) === id;
                    });

                    const snapshot = normalizeProductSnapshot(productId, product);
                    const qtyToAdd = Math.max(toNumber(quantity, 1), 1);

                    let nextItems;

                    if (existingIndex >= 0) {
                        nextItems = current.items.map((item, index) =>
                            index === existingIndex
                                ? {
                                    ...item,
                                    productId: {
                                        ...item.productId,
                                        ...snapshot,
                                    },
                                    quantity:
                                        toNumber(item.quantity, 1) + qtyToAdd,
                                    price: toNumber(snapshot.price, item.price),
                                    discounted_price:
                                        snapshot.discounted_price ??
                                        item.discounted_price,
                                }
                                : item
                        );
                    } else {
                        nextItems = [
                            ...current.items,
                            {
                                productId: snapshot,
                                quantity: qtyToAdd,
                                price: toNumber(snapshot.price, 0),
                                discounted_price: snapshot.discounted_price,
                            },
                        ];
                    }

                    const nextCart = calculateCart(nextItems);

                    writeGuestCart(nextCart);
                    setCart(nextCart);

                    toast.success("Product added to cart");

                    return true;
                }

                const res = await http.post("/frontend/cart/add", {
                    productId,
                    quantity,
                });

                toast.success(res?.data?.message || "Product added to cart");

                await fetchCart();

                return true;
            } catch (err) {
                toast.error(
                    err?.response?.data?.message || "Failed to add product"
                );

                return false;
            } finally {
                setBusy(false);
            }
        },
        [fetchCart, hasToken]
    );

    const updateQty = useCallback(
        async (productId, quantity) => {
            try {
                setBusy(true);

                const nextQty = Math.max(toNumber(quantity, 1), 1);

                if (!hasToken()) {
                    const current = readGuestCart();

                    const nextItems = current.items.map((item) => {
                        const id = item?.productId?._id || item?.productId;

                        return String(id) === String(productId)
                            ? {
                                ...item,
                                quantity: nextQty,
                            }
                            : item;
                    });

                    const nextCart = calculateCart(nextItems);

                    writeGuestCart(nextCart);
                    setCart(nextCart);

                    toast.success("Cart updated");

                    return;
                }

                const res = await http.patch(
                    `/frontend/cart/update/${productId}`,
                    {
                        quantity: nextQty,
                    }
                );

                toast.success(res?.data?.message || "Cart updated");

                await fetchCart();
            } catch (err) {
                toast.error(
                    err?.response?.data?.message || "Failed to update cart"
                );
            } finally {
                setBusy(false);
            }
        },
        [fetchCart, hasToken]
    );

    const removeItem = useCallback(
        async (productId, options = {}) => {
            try {
                setBusy(true);

                if (!hasToken()) {
                    const current = readGuestCart();

                    const nextItems = current.items.filter((item) => {
                        const id = item?.productId?._id || item?.productId;

                        return String(id) !== String(productId);
                    });

                    const nextCart = calculateCart(nextItems);

                    writeGuestCart(nextCart);
                    setCart(nextCart);

                    if (!options.silent) toast.success("Item removed");

                    return;
                }

                const res = await http.delete(
                    `/frontend/cart/remove/${productId}`
                );

                if (!options.silent) {
                    toast.success(res?.data?.message || "Item removed");
                }

                await fetchCart();
            } catch (err) {
                if (!options.silent) {
                    toast.error(
                        err?.response?.data?.message || "Failed to remove item"
                    );
                }
            } finally {
                setBusy(false);
            }
        },
        [fetchCart, hasToken]
    );

    const clearCart = useCallback(
        async (options = {}) => {
            try {
                setBusy(true);

                if (!hasToken()) {
                    clearGuestCartStorage();
                    setCart(calculateCart([]));

                    if (!options.silent) toast.success("Cart cleared");

                    return;
                }

                const res = await http.delete("/frontend/cart/clear");

                if (!options.silent) {
                    toast.success(res?.data?.message || "Cart cleared");
                }

                await fetchCart();
            } catch (err) {
                if (!options.silent) {
                    toast.error(
                        err?.response?.data?.message || "Failed to clear cart"
                    );
                }
            } finally {
                setBusy(false);
            }
        },
        [fetchCart, hasToken]
    );

    useEffect(() => {
        fetchCart();

        const refreshGuestCart = () => {
            if (!hasToken()) setCart(readGuestCart());
        };

        window.addEventListener("storage", refreshGuestCart);
        window.addEventListener("hkmandu-guest-cart-updated", refreshGuestCart);
        window.addEventListener("focus", fetchCart);
        window.addEventListener("hkmandu-auth-changed", fetchCart);

        return () => {
            window.removeEventListener("storage", refreshGuestCart);
            window.removeEventListener(
                "hkmandu-guest-cart-updated",
                refreshGuestCart
            );
            window.removeEventListener("focus", fetchCart);
            window.removeEventListener("hkmandu-auth-changed", fetchCart);
        };
    }, [fetchCart, hasToken]);

    const value = useMemo(
        () => ({
            cart,
            loading,
            busy,
            fetchCart,
            addToCart,
            updateQty,
            removeItem,
            clearCart,
            isGuestCart: !hasToken(),
            totalItems: cart?.totalItems || 0,
        }),
        [
            cart,
            loading,
            busy,
            fetchCart,
            addToCart,
            updateQty,
            removeItem,
            clearCart,
            hasToken,
        ]
    );

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);

    if (!ctx) {
        throw new Error("useCart must be used inside CartProvider");
    }

    return ctx;
}