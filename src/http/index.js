import axios from "axios";
import { toast } from "sonner";
import { fromStorage } from "@/lib/index";

const toMessage = (value, fallback = "Something went wrong.") => {
    if (!value) return "";

    if (typeof value === "string") return value;

    if (typeof value === "number" || typeof value === "boolean") {
        return String(value);
    }

    if (Array.isArray(value)) {
        const message = value
            .map((item) => toMessage(item, ""))
            .filter(Boolean)
            .join(", ");

        return message || fallback;
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

    return fallback;
};

export const getAxiosErrorMessage = (err, fallback = "Something went wrong.") => {
    const data = err?.response?.data;

    if (!data) {
        return toMessage(err?.message, fallback) || fallback;
    }

    return (
        toMessage(data.message, "") ||
        toMessage(data.error, "") ||
        toMessage(data.errors, "") ||
        toMessage(data.errorDescription, "") ||
        toMessage(data.errorCode, "") ||
        toMessage(data, fallback) ||
        fallback
    );
};

const http = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

http.interceptors.request.use(
    (config) => {
        const token = fromStorage("hkmandu");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (err) => Promise.reject(err)
);

http.interceptors.response.use(
    (resp) => {
        const successMessage = resp?.data?.success;

        if (typeof successMessage === "string" && successMessage.trim()) {
            toast.success(successMessage);
        }

        return resp;
    },
    (err) => {
        if (err.response) {
            const { status } = err.response;

            if (status === 401) {
                console.log("Auth error:", getAxiosErrorMessage(err, "Unauthorized."));
                return Promise.reject(err);
            }

            const message = getAxiosErrorMessage(err, "");

            if (typeof message === "string" && message.trim()) {
                toast.error(message);
            }
        } else {
            console.log("Network/Unknown error:", err?.message || err);
            toast.error("Network error. Please try again.");
        }

        return Promise.reject(err);
    }
);

export default http;