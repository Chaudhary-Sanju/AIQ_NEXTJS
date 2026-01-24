import Navbar from "@/components/clientComponents/Navbar";
import Footer from "@/components/clientComponents/Footer";
import { notFound } from "next/navigation";
import { Raleway } from "next/font/google";
import { getDictionary, locales } from "@/i18n/getDictionary";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-raleway",
  display: "swap",
});

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  if (!locales.includes(locale)) notFound();

  const dict = await getDictionary(locale);

  return (
    <div className={raleway.variable}>
      <Navbar locale={locale} dict={dict} />
      {children}
      <Footer locale={locale} dict={dict} />
    </div>
  );
}
