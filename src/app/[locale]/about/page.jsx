export async function generateMetadata() {
    return {
        title: "About Vendriks - Launch Your Ecommerce Store in a Minutes",
        description: "Build, manage, and grow your online store with Vendriks. Nepali payments (Khalti/eSewa), custom templates, delivery zones, analytics, and more.",
        icons: {
            icon: 'default.ico'
        },
        category: "ecommerce",
        generator: "Next.js",
        keywords: [
            "Vendriks",
            "ecommerce Nepal",
            "multi-tenant SaaS",
            "Khalti",
            "eSewa",
            "online store",
            "Nepal",
        ],
        authors: [{ name: "Vendriks Team", url: "https://vendriks.com" }],
        creator: "Vendriks",
        publisher: "Vendriks",
        openGraph: {
            title: "About Vendriks - Launch Your Ecommerce Store in a Minutes",
            description: "Build, manage, and grow your online store with Vendriks. Nepali payments (Khalti/eSewa), custom templates, delivery zones, analytics, and more.",
            locale: "en_NP",
            type: "website",
            images: [
                'default-og.png'
            ]
        }
    };
}

export default function Page() {
    return (
        <>
            <p className="my-4 mx-4">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptas, excepturi minima? Tenetur mollitia aliquid veritatis commodi perferendis corporis optio eos necessitatibus asperiores quae ad omnis dignissimos rem voluptatum nihil ducimus, iure laborum aliquam blanditiis animi explicabo voluptates modi laboriosam? Odit facilis voluptatum voluptatem autem eveniet aperiam debitis est quis. Ullam eum, magnam, est, hic doloremque veritatis a ad architecto ut neque dignissimos numquam! Pariatur quaerat nesciunt necessitatibus, ipsam dolorem, nisi harum sint voluptatem, inventore tempora nulla iure. Error, iusto saepe? Dolorum perferendis quibusdam aliquam dolorem dignissimos corporis earum libero tenetur, ad deleniti sed! Tempore magni unde commodi, dolor quisquam distinctio.</p>
        </>
    );
}
