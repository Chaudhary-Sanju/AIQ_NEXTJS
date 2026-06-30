import { notFound } from "next/navigation";
import { getDictionary, locales } from "@/i18n/getDictionary";
import ProductDetailsView from "@/components/pageComponents/ProductDetailsView";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    "http://localhost:8000";

const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://hkmandu.com";

const IMAGE_URL =
    process.env.NEXT_PUBLIC_IMAGE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000";

const SITE_BASE_URL = SITE_URL.replace(/\/+$/, "");
const API_BASE_URL = API_URL.replace(/\/+$/, "");
const IMAGE_BASE_URL = IMAGE_URL.replace(/\/+$/, "");

const pick = (obj, locale = "en") => {
    if (!obj || typeof obj !== "object") return "";
    return obj?.[locale] || obj?.en || obj?.ne || obj?.zh || "";
};

const stripHtml = (html = "") => {
    return String(html)
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
};

const getProductImageUrl = (image) => {
    if (!image) return `${SITE_BASE_URL}/og-default.jpg`;

    const imageValue = String(image).trim();

    if (!imageValue) return `${SITE_BASE_URL}/og-default.jpg`;

    if (imageValue.startsWith("http://") || imageValue.startsWith("https://")) {
        return imageValue;
    }

    const cleanImage = imageValue
        .replace(/^\/+/, "")
        .replace(/^uploads\/+/i, "")
        .replace(/^image\/+/i, "");

    return `${IMAGE_BASE_URL}/image/${cleanImage}`;
};

async function getProductBySlug(slug) {
    try {
        const res = await fetch(`${API_BASE_URL}/frontend/product/${slug}`, {
            cache: "no-store",
        });

        if (!res.ok) return null;

        const json = await res.json();

        return json?.data || null;
    } catch (error) {
        return null;
    }
}

export async function generateMetadata({ params }) {
    const { locale, slug } = await params;

    if (!locales.includes(locale)) {
        return {
            metadataBase: new URL(SITE_BASE_URL),
            title: "Product | HKMandu",
            description: "Buy products from HKMandu.",
        };
    }

    const product = await getProductBySlug(slug);

    if (!product) {
        return {
            metadataBase: new URL(SITE_BASE_URL),
            title: "Product not found | HKMandu",
            description: "The requested product could not be found.",
        };
    }

    const name = pick(product?.name, locale) || "Product";

    const summary =
        pick(product?.summary, locale) ||
        stripHtml(product?.description) ||
        "Buy products from HKMandu.";

    const description = summary.slice(0, 160);

    const image = getProductImageUrl(product?.images?.[0]);

    const price = product?.discounted_price || product?.price || "";

    const averageRating = product?.reviewSummary?.averageRating || 0;
    const totalReviews = product?.reviewSummary?.totalReviews || 0;

    const productSlug = product?.slug || slug;
    const canonicalUrl = `${SITE_BASE_URL}/${locale}/product/${productSlug}`;

    return {
        metadataBase: new URL(SITE_BASE_URL),

        title: `${name} | HKMandu`,
        description,

        keywords: [
            name,
            product?.brandId?.name,
            pick(product?.categoryId?.name, locale),
            "HKMandu",
            "Hong Kong",
            "Nepali Store",
        ].filter(Boolean),

        alternates: {
            canonical: canonicalUrl,
            languages: {
                en: `${SITE_BASE_URL}/en/product/${productSlug}`,
                ne: `${SITE_BASE_URL}/ne/product/${productSlug}`,
                zh: `${SITE_BASE_URL}/zh/product/${productSlug}`,
            },
        },

        openGraph: {
            title: `${name} | HKMandu`,
            description,
            url: canonicalUrl,
            siteName: "HKMandu",
            type: "website",
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: name,
                },
            ],
        },

        twitter: {
            card: "summary_large_image",
            title: `${name} | HKMandu`,
            description,
            images: [image],
        },

        other: {
            "product:price:amount": String(price),
            "product:price:currency": "HKD",
            "product:availability":
                Number(product?.qty) > 0 || product?.sellOnNoStock
                    ? "in stock"
                    : "out of stock",
            "product:rating:value": String(averageRating),
            "product:review:count": String(totalReviews),
        },
    };
}

export default async function Page({ params }) {
    const { locale, slug } = await params;

    if (!locales.includes(locale)) notFound();

    const dict = await getDictionary(locale);

    const product = await getProductBySlug(slug);

    if (!product) notFound();

    const name = pick(product?.name, locale) || "Product";
    const summary = pick(product?.summary, locale);
    const image = getProductImageUrl(product?.images?.[0]);
    const price = product?.discounted_price || product?.price;
    const productSlug = product?.slug || slug;
    const canonicalUrl = `${SITE_BASE_URL}/${locale}/product/${productSlug}`;

    const productImages =
        Array.isArray(product?.images) && product.images.length > 0
            ? product.images.map((img) => getProductImageUrl(img))
            : [image];

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name,
        description: summary || stripHtml(product?.description),
        image: productImages,
        sku: product?._id,
        brand: product?.brandId?.name
            ? {
                "@type": "Brand",
                name: product.brandId.name,
            }
            : undefined,
        category: pick(product?.categoryId?.name, locale),
        offers: {
            "@type": "Offer",
            url: canonicalUrl,
            priceCurrency: "HKD",
            price: String(price || ""),
            availability:
                Number(product?.qty) > 0 || product?.sellOnNoStock
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
            itemCondition: "https://schema.org/NewCondition",
        },
        aggregateRating:
            product?.reviewSummary?.totalReviews > 0
                ? {
                    "@type": "AggregateRating",
                    ratingValue: String(
                        product.reviewSummary.averageRating || 0
                    ),
                    reviewCount: String(
                        product.reviewSummary.totalReviews || 0
                    ),
                }
                : undefined,
        review:
            Array.isArray(product?.reviews) && product.reviews.length > 0
                ? product.reviews.map((item) => ({
                    "@type": "Review",
                    author: {
                        "@type": "Person",
                        name: item?.user_id?.name || "Customer",
                    },
                    reviewRating: {
                        "@type": "Rating",
                        ratingValue: String(item?.rating || 0),
                        bestRating: "5",
                        worstRating: "1",
                    },
                    reviewBody: item?.review || "",
                    datePublished: item?.createdAt,
                }))
                : undefined,
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
                }}
            />

            <ProductDetailsView
                locale={locale}
                slug={slug}
                dict={dict}
                initialProduct={product}
            />
        </>
    );
}