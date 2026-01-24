import { requireAuth } from "@/lib/requireAuth";

export default async function SecurePage({ params }) {
    const { locale } = await params;

    // Optional: get user to show on page
    const user = await requireAuth(locale, `/${locale}/secure`);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold">Secure Page</h1>
            <p className="mt-2">Welcome, {user?.name ?? "User"} 👋</p>
        </div>
    );
}
