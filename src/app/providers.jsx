"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { Toaster } from "sonner";

import { makeStore } from "@/store";

export default function Providers({ children }) {
    const storeRef = useRef(null);
    const persistorRef = useRef(null);

    if (!storeRef.current) {
        storeRef.current = makeStore();
        persistorRef.current = persistStore(storeRef.current);
    }

    return (
        <Provider store={storeRef.current}>
            <PersistGate loading={null} persistor={persistorRef.current}>
                {children}
            </PersistGate>

            <Toaster position="top-right" richColors closeButton />
        </Provider>
    );
}
