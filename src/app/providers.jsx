"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { Toaster } from "sonner";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

import { makeStore } from "@/store";
import { RestaurantCartProvider } from "@/contexts/RestaurantCartContext";

export default function Providers({ children }) {
    const storeRef = useRef(null);
    const persistorRef = useRef(null);

    if (!storeRef.current) {
        storeRef.current = makeStore();
        persistorRef.current = persistStore(storeRef.current);
    }

    return (
        <GoogleReCaptchaProvider
            reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            scriptProps={{
                async: true,
                defer: true,
                appendTo: "head",
            }}
        >
            <Provider store={storeRef.current}>
                <PersistGate loading={null} persistor={persistorRef.current}>
                    <RestaurantCartProvider>{children}</RestaurantCartProvider>
                </PersistGate>

                <Toaster position="top-right" richColors closeButton />
            </Provider>
        </GoogleReCaptchaProvider>
    );
}