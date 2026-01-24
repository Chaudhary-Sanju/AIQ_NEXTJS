"use client";

import { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";

import { setUser } from "@/store/userSlice";
import { PasswordToggler } from "@/components/clientComponents/PasswordToggler";
import http from "@/http";
import { inStorage } from "@/lib";
import { setInForm } from "@/lib/index";

const Login = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState("");

    const dispatch = useDispatch();
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();

    const locale = params?.locale || "en";

    const rawNext = searchParams.get("next");     // can be null or weird type
    const nextPath = typeof rawNext === "string" ? rawNext : null;

    // allow only internal paths
    const safeNext = nextPath && nextPath.startsWith("/") ? nextPath : null;

    // middleware usually sets: /{locale}/auth/login?next=/en/secure
    const nextUrl = useMemo(() => {
        const raw = searchParams?.get("next");
        if (!raw) return null;

        // allow only internal paths to avoid open-redirect issues
        if (raw.startsWith("/")) return raw;

        return null;
    }, [searchParams]);

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data } = await http.post("frontend/auth/login", form);

            dispatch(setUser(data.user));
            inStorage("yalakhom", data.token, remember);

            router.replace(safeNext || `/${locale}/secure`);
            router.refresh();

        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                "Login failed. Please try again.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen mx-auto w-11/12 -mt-12 lg:w-1/2">
            <form onSubmit={handleSubmit} className="w-11/12 py-10">
                <h1 className="text-center text-4xl">Signin</h1>
                <p className="text-center py-2 text-lg">Welcome back</p>

                {error ? (
                    <div className="mb-3 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </div>
                ) : null}

                <div className="mb-3">
                    <input
                        className="rounded-full w-full p-3 border border-gray-300"
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter email"
                        required
                        value={form.email}
                        onChange={(ev) => setInForm(ev, form, setForm)}
                        autoComplete="email"
                    />
                </div>

                <div className="mb-3">
                    <PasswordToggler
                        name="password"
                        id="password"
                        placeholder="Enter password"
                        state={passwordVisible}
                        setState={setPasswordVisible}
                        form={form}
                        setForm={setForm}
                    />
                </div>

                <div className="mb-3 flex items-center">
                    <input
                        type="checkbox"
                        name="remember"
                        id="remember"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        className="mr-2 ms-5"
                    />
                    <label htmlFor="remember">Remember me</label>
                </div>

                <div className="mt-5 flex flex-wrap justify-center items-center">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`bg-slate-800 text-white py-3 px-4 rounded-full w-full ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"
                            } flex items-center justify-center dark:bg-slate-200 dark:text-slate-800`}
                    >
                        <i
                            className={`fa-solid ${loading ? "fa-spinner fa-spin" : "fa-right-to-bracket"
                                } me-2`}
                        ></i>
                        LOGIN
                    </button>

                    <p className="mt-3 text-base">
                        <Link
                            href={`/${locale}/auth/signup`}
                            className="text-center hover:underline"
                        >
                            Don&apos;t have an account? Signup
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Login;
