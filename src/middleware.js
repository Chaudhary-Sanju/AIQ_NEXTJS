import { NextResponse } from "next/server";
import { locales, defaultLocale } from "./i18n/getDictionary";

const PROTECTED = ["/secure", "/bookmark", "/dashboard"];
const AUTH_PAGES = ["/auth/login", "/auth/signup"];

function safeNext(next) {
    // prevent open redirect: allow only internal paths
    if (!next) return null;
    if (next.startsWith("/")) return next;
    return null;
}

export function middleware(request) {
    const { pathname, searchParams } = request.nextUrl;

    // ignore next internals + api + files
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    // 1) locale redirect
    const hasLocale = locales.some(
        (lc) => pathname === `/${lc}` || pathname.startsWith(`/${lc}/`)
    );

    if (!hasLocale) {
        const url = request.nextUrl.clone();
        url.pathname = `/${defaultLocale}${pathname}`;
        return NextResponse.redirect(url);
    }

    // 2) auth presence check (NOT full security)
    const token = request.cookies.get("yalakhom")?.value;

    // extract locale from /{locale}/...
    const locale = pathname.split("/")[1];
    const restPath = pathname.replace(`/${locale}`, "") || "/";

    const isProtected = PROTECTED.some(
        (p) => restPath === p || restPath.startsWith(`${p}/`)
    );
    const isAuthPage = AUTH_PAGES.some(
        (p) => restPath === p || restPath.startsWith(`${p}/`)
    );

    // if not logged in -> block protected routes
    if (!token && isProtected) {
        const url = request.nextUrl.clone();
        url.pathname = `/${locale}/auth/login`;
        url.searchParams.set("next", pathname);
        return NextResponse.redirect(url);
    }

    // if logged in -> prevent visiting login/signup
    if (token && isAuthPage) {
        const next = safeNext(searchParams.get("next"));
        const url = request.nextUrl.clone();

        // if user came with ?next=/en/secure, send them there
        url.pathname = next || `/${locale}/secure`; // or `/${locale}` if you want home
        url.search = ""; // clear params
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next|api|.*\\..*).*)"],
};
