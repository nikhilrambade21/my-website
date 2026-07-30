import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// ⭐ Import Header & Footer
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
// ⭐ Import Cart Provider
import { CartProvider } from "@/context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Dirghayush Oils",
  description: "Traditional Wood Cold Pressed Oils",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* ⭐ Wrap Entire App Inside CartProvider */}
        <CartProvider>

          {/* ⭐ Header appears on all pages */}
          <Header />

          {/* ⭐ Page Content */}
          {children}

          {/* ⭐ Footer appears on all pages */}
          <Footer />

        </CartProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
