"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingCart, ChevronDown, Menu, X } from "lucide-react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef(null);

  // Scroll shrink header
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown when clicking outside
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Navigation Items
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
    router.push(`/products#${id}`);
    setShowProducts(false);
    setMobileMenu(false);
  };

  return (
    <>
      {/* TOP BAR */}
      <div className="bg-[#5f1616] text-white text-xs sm:text-sm text-center py-2 font-medium">
        Free Shipping on Orders Above ₹1999
      </div>

      {/* HEADER */}
      <header
        className={`sticky z-50 transition-all duration-500 ${
          scrolled ? "top-2" : "top-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div
            className={`flex items-center justify-between transition-all duration-500
            ${
              scrolled
                ? "bg-white rounded-2xl shadow-lg px-4 sm:px-8 py-2"
                : "bg-white px-4 sm:px-8 py-3"
            }`}
          >
            {/* LOGO */}
            <div
              className="flex items-center cursor-pointer"
              onClick={() => router.push("/")}
            >
              <img
                src={scrolled ? "/images/logo8.png" : "/images/newlogo.jpeg"}
                alt="logo"
                className={`transition-all duration-500 ${
                  scrolled ? "h-8" : "h-14 sm:h-16"
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
                    className={`relative text-lg font-medium transition
                    ${
                      isActive ? "text-[#5f1616]" : "text-[#8a4343]"
                    }
                    after:absolute after:left-0 after:-bottom-1
                    after:h-[2px] after:bg-[#5f1616]
                    after:transition-all after:duration-300
                    ${isActive ? "after:w-full" : "after:w-0"}
                    hover:after:w-full hover:text-[#5f1616]
                    `}
                  >
                    {item.name}
                  </button>
                );
              })}

              {/* PRODUCTS DROPDOWN */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowProducts(!showProducts)}
                  className="flex items-center gap-1 text-lg font-medium text-[#8a4343] hover:text-[#5f1616]"
                >
                  Products
                  <ChevronDown
                    className={`transition ${
                      showProducts ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showProducts && (
                  <div className="absolute top-8 left-0 bg-white shadow-xl rounded-xl py-2 w-56">
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
            <div className="flex items-center gap-3 sm:gap-5">
              <button className="hidden md:block text-sm text-[#8a4343]">
                Login
              </button>

              <button className="bg-[#ac4343] text-white text-xs px-3 sm:px-4 py-1.5 rounded-full">
                Sign Up
              </button>

              <button className="relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  0
                </span>
              </button>

              {/* MOBILE MENU BUTTON */}
              <button
                className="md:hidden"
                onClick={() => setMobileMenu(!mobileMenu)}
              >
                {mobileMenu ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileMenu && (
          <div className="md:hidden bg-white shadow-lg px-6 py-4 space-y-4">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  router.push(item.path);
                  setMobileMenu(false);
                }}
                className="block text-left w-full text-[#8a4343]"
              >
                {item.name}
              </button>
            ))}

            {/* Mobile Products */}
            <div>
              <button
                onClick={() => setShowProducts(!showProducts)}
                className="flex items-center gap-2 text-[#8a4343]"
              >
                Products <ChevronDown />
              </button>

              {showProducts && (
                <div className="pl-4 mt-2 space-y-2">
                  {products.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleProductClick(product.id)}
                      className="block text-sm text-[#8a4343]"
                    >
                      {product.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
