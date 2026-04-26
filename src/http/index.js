import axios from "axios";
import { toast } from "sonner";
import { fromStorage } from "@/lib/index";

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
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        return config;
    },
    (err) => Promise.reject(err)
);


http.interceptors.response.use(
    (resp) => {
        if ("success" in resp.data) {
            toast.success(resp.data.success);
        }
        return resp;
    },
    (err) => {
        if (err.response) {
            const { status, data } = err.response;

            if (status === 401) {
                console.log("Auth error:", data);
                return Promise.reject(err);
            }

            if ("error" in data) {
                if (typeof data.error === "string") {
                    toast.error(data.error);
                } else {
                    for (let k in data.error) {
                        toast.error(data.error[k]);
                    }
                }
            }
        } else {
            console.log("Network/Unknown error:", err);
        }

        return Promise.reject(err);
    }
);

export default http;