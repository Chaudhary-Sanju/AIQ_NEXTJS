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

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);

    const fetchCart = useCallback(async () => {
        try {
            setLoading(true);

            const res = await http.get("/frontend/cart");
            setCart(res?.data?.data || null);
        } catch {
            setCart(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const addToCart = useCallback(
        async (productId, quantity = 1) => {
            try {
                setBusy(true);

                const res = await http.post("/frontend/cart/add", {
                    productId,
                    quantity,
                });

                toast.success(res?.data?.message || "Product added to cart");

                // Important: get populated cart again
                await fetchCart();

                return true;
            } catch (err) {
                toast.error(
                    err?.response?.data?.message || "Please login to add product"
                );
                return false;
            } finally {
                setBusy(false);
            }
        },
        [fetchCart]
    );

    const updateQty = useCallback(
        async (productId, quantity) => {
            try {
                setBusy(true);

                const res = await http.patch(`/frontend/cart/update/${productId}`, {
                    quantity,
                });

                toast.success(res?.data?.message || "Cart updated");

                // Important: get populated cart again
                await fetchCart();
            } catch (err) {
                toast.error(
                    err?.response?.data?.message || "Failed to update cart"
                );
            } finally {
                setBusy(false);
            }
        },
        [fetchCart]
    );

    const removeItem = useCallback(
        async (productId) => {
            try {
                setBusy(true);

                const res = await http.delete(`/frontend/cart/remove/${productId}`);

                toast.success(res?.data?.message || "Item removed");

                // Important: get populated cart again
                await fetchCart();
            } catch (err) {
                toast.error(
                    err?.response?.data?.message || "Failed to remove item"
                );
            } finally {
                setBusy(false);
            }
        },
        [fetchCart]
    );

    const clearCart = useCallback(async () => {
        try {
            setBusy(true);

            const res = await http.delete("/frontend/cart/clear");

            toast.success(res?.data?.message || "Cart cleared");

            // Important: get populated cart again
            await fetchCart();
        } catch (err) {
            toast.error(
                err?.response?.data?.message || "Failed to clear cart"
            );
        } finally {
            setBusy(false);
        }
    }, [fetchCart]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

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