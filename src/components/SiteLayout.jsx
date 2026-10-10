"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SiteLayout({ children }) {
  const pathname = usePathname();

  // Do not show the normal website Header/Footer
  // on seller dashboard pages.
  const isSellerPage = pathname.startsWith("/seller");

  if (isSellerPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />

      {children}

      <Footer />
    </>
  );
}