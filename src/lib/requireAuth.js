import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";

async function getCookieValue(name) {
    // Prefer cookies() when available
    try {
        const c = await cookies();
        const v = c.get(name)?.value;
        if (v) return v;
    } catch (_) {
        // ignore and fallback to headers
    }

    // Fallback: read cookie header
    const h = await headers();
    const cookieHeader = h.get("cookie") || "";
    const found = cookieHeader
        .split(";")
        .map((x) => x.trim())
        .find((x) => x.startsWith(`${name}=`));

    if (!found) return null;
    return decodeURIComponent(found.split("=").slice(1).join("="));
}

export async function requireAuth(locale, nextPath = "") {
    const token = await getCookieValue("yalakhom");

    const loginUrl =
        `/${locale}/auth/login` +
        (nextPath ? `?next=${encodeURIComponent(nextPath)}` : "");

    if (!token) redirect(loginUrl);

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/frontend/auth/details`,
        {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        }
    );

    if (!res.ok) redirect(loginUrl);

    const data = await res.json();
    return data.user ?? data;
}
