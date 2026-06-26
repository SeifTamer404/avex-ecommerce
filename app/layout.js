import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import Providers from "@/components/providers/Index";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import CartDrawer from "@/components/layout/CartDrawer";
import MobileMenu from "@/components/layout/MobileMenu";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    template: "AVEX — %s",
    default: "AVEX",
  },
  description: "Your premium shopping destination",
  // Material Symbols — loaded via metadata so Next.js handles it correctly
  // during SSR and avoids the "script tag while rendering" React warning.
  other: {
    "material-symbols": "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200",
  },
};

import NotificationContainer from "@/components/ui/NotificationContainer";

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakarta.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect — tells the browser to open a socket to Google Fonts early
            so the icon font starts downloading as soon as possible. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Material Symbols — display=block hides the raw ligature text (e.g.
            "shopping_bag") while the font is loading instead of flashing it. */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
          crossOrigin="anonymous"
        />
      </head>
      <body
        suppressHydrationWarning
        className={
          " bg-surface font-sans antialiased transition-colors duration-300 "
        }
      >
        <Providers>
          <Navbar />
          <MobileMenu />
          <CartDrawer />
          <NotificationContainer />
          <main className="pt-24 pb-24 md:pb-8 px-4 md:px-8">{children}</main>
          <Footer />
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}

