import "./globals.css";
import WhatsAppButton from "./components/whatsapp";
import { Poppins, Playfair_Display } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CookieBanner from "./components/CookieBanner";
import GTMPageView from "./components/GTMPageView";
import SmoothScroll from "./components/SmoothScroll";
import { Metadata } from "next";

const BASE_URL = "https://www.evaplace.pt";

export function generateCanonicalMetadata(pathname: string): Metadata {
  const url = `${BASE_URL}${pathname}`;
  return {
    alternates: {
      canonical: url,
      languages: {
        pt: url,
        en: `${BASE_URL}/en${pathname}`,
      },
    },
  };
}

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
});

export function generateMetadata(): Metadata {
  return {
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: BASE_URL,
      languages: {
        pt: BASE_URL,
      },
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <head>
        <link rel="canonical" href={BASE_URL} />
      </head>
      <GoogleTagManager gtmId="GTM-MXPCKV3G" />
      <body className={`${poppins.variable} ${playfair.variable}`}>
        <GTMPageView />
        <SmoothScroll />

        <Header />
        <div id="smooth-wrapper">
          <div id="smooth-content">
            <main className="content">{children}</main>
            <Footer />
          </div>
        </div>

        {/* Botão flutuante WhatsApp */}
        <WhatsAppButton />

        {/* Banner de Cookies (RGPD) */}
        <CookieBanner />
      </body>
    </html>
  );
}
