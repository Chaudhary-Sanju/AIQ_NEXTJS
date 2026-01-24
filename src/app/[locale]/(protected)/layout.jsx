import { requireAuth } from "@/lib/requireAuth";

export default async function ProtectedLayout({ children, params }) {
    const { locale } = await params;

    // this blocks render unless token is valid
    await requireAuth(locale);

    return children;
}
