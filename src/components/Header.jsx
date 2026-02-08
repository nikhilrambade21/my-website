"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingCart, ChevronDown, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const { cart } = useCart();

  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef(null);

  /* ---------------- CART COUNT ---------------- */

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  /* ---------------- SCROLL ---------------- */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ---------------- CLOSE DROPDOWN ---------------- */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowProducts(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- NAV ---------------- */

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about_us" },
    { name: "Our Process", path: "/our_process" },
    { name: "Contact Us", path: "/contact_us" },
  ];

  const products = [
    { name: "Groundnut Oil", id: "groundnut" },
    { name: "Sunflower Oil", id: "sunflower" },
    { name: "Coconut Oil", id: "coconut" },
    { name: "Safflower Oil", id: "safflower" },
    { name: "Mustard Oil", id: "mustard" },
    { name: "White Sesame Oil", id: "sesame" },
    { name: "Niger Oil", id: "niger" },
    { name: "Flaxseed Oil", id: "flaxseed" },
    { name: "Almond Oil", id: "almond" },
  ];

  const handleProductClick = (id) => {
    router.push(`/products/${id}`);
    setShowProducts(false);
    setMobileMenu(false);
  };

  return (
    <>
      {/* TOP BAR */}
      <div className="bg-[#5f1616] text-white text-xs sm:text-sm text-center py-2 font-medium">
        Free Shipping on Orders Above ₹2999
      </div>

      {/* HEADER */}
      <header
        className={`fixed left-0 w-full z-50 transition-all duration-500 ${
          scrolled ? "top-10" : "top-8"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div
            className={`flex items-center justify-between transition-all duration-500
            ${
              scrolled
                ? "bg-white/95 backdrop-blur-md rounded-xl shadow-xl px-4 sm:px-10 py-2"
                : "bg-white px-4 sm:px-10 py-3"
            }`}
          >
            {/* LOGO */}
            <div
              className="cursor-pointer"
              onClick={() => router.push("/")}
            >
              <img
                src={scrolled ? "/images/logo8.png" : "/images/newlogo.jpeg"}
                alt="Logo"
                className={`transition-all duration-500 ${
                  scrolled ? "h-6" : "h-12 sm:h-16"
                }`}
              />
            </div>

            {/* DESKTOP NAV */}
            <nav className="hidden md:flex items-center gap-10 font-sans">
              {navItems.map((item) => {
                const isActive =
                  item.path === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.path);

                return (
                  <button
                    key={item.name}
                    onClick={() => router.push(item.path)}
                    className={`text-[17px] font-medium ${
                      isActive ? "text-[#5f1616]" : "text-[#8a4343]"
                    }`}
                  >
                    {item.name}
                  </button>
                );
              })}

              {/* PRODUCTS */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowProducts(!showProducts)}
                  className="flex items-center gap-1 text-[17px] font-medium text-[#8a4343]"
                >
                  Products
                  <ChevronDown size={18} />
                </button>

                {showProducts && (
                  <div className="absolute top-8 left-0 bg-white shadow-xl rounded-xl py-2 w-56 border">
                    {products.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="block w-full text-left px-4 py-2 text-sm text-[#8a4343] hover:bg-[#f6e7e7]"
                      >
                        {product.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-4">

              {/* CART ICON */}
              <button
                onClick={() => router.push("/cart")}
                className="relative"
              >
                <ShoppingCart className="w-6 h-6 text-[#1F2937]" />

                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#F2C94C] text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* ADMIN BUTTON (Desktop) */}
              <button
                onClick={() => router.push("/admin")}
                className="hidden md:block text-[#8a4343] font-medium"
              >
                Admin
              </button>

              {/* MOBILE MENU BUTTON */}
              <button
                className="md:hidden"
                onClick={() => setMobileMenu(!mobileMenu)}
              >
                {mobileMenu ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>

          {/* MOBILE MENU */}
          {mobileMenu && (
            <div className="md:hidden bg-white shadow-xl rounded-xl mt-3 p-4 space-y-3">

              {/* NAV ITEMS */}
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    router.push(item.path);
                    setMobileMenu(false);
                  }}
                  className="block w-full text-left text-[#8a4343] font-medium"
                >
                  {item.name}
                </button>
              ))}

              {/* PRODUCTS */}
              <div>
                <button
                  onClick={() => setShowProducts(!showProducts)}
                  className="flex justify-between w-full font-medium text-[#8a4343]"
                >
                  Products <ChevronDown size={18} />
                </button>

                {showProducts && (
                  <div className="ml-3 mt-2 space-y-2">
                    {products.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="block w-full text-left text-sm text-[#8a4343]"
                      >
                        {product.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* ⭐ MOBILE CART */}
              <button
                onClick={() => {
                  router.push("/cart");
                  setMobileMenu(false);
                }}
                className="block w-full text-left text-[#8a4343] font-medium"
              >
                🛒 Cart ({cartCount})
              </button>

              {/* ⭐ MOBILE ADMIN */}
              <button
                onClick={() => {
                  router.push("/admin");
                  setMobileMenu(false);
                }}
                className="block w-full text-left text-[#8a4343] font-medium"
              >
                🔐 Admin
              </button>

            </div>
          )}
        </div>
      </header>

      <div className="h-[110px]" />
    </>
  );
}
