import "./globals.css";
import WhatsAppButton from "./components/whatsapp";
import { Poppins, Playfair_Display } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CookieBanner from "./components/CookieBanner";
import GTMPageView from "./components/GTMPageView";
import SmoothScroll from "./components/SmoothScroll";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
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
