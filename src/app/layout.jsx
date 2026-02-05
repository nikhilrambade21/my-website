import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// ⭐ Import Header & Footer
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* ⭐ Header appears on all pages */}
        <Header />

        {/* ⭐ Page Content */}
        {children}

        {/* ⭐ Footer appears on all pages */}
        <Footer />
      </body>
    </html>
  );
}
