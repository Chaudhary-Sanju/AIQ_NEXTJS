import { NextResponse } from "next/server";
import { locales, defaultLocale } from "./i18n/getDictionary";

export function middleware(request) {
    const { pathname } = request.nextUrl;

    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    const hasLocale = locales.some(
        (lc) => pathname === `/${lc}` || pathname.startsWith(`/${lc}/`)
    );

    if (hasLocale) return NextResponse.next();

    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname}`;
    return NextResponse.redirect(url);
}

export const config = {
    matcher: ["/((?!_next|api|.*\\..*).*)"],
};
