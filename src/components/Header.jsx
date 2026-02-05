"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingCart, ChevronDown } from "lucide-react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [showProducts, setShowProducts] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef(null);

  /* Scroll Floating Header */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Close dropdown outside click */
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

  /* Navigation Items */
  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about_us" },
    { name: "Our Process", path: "/our_process" },
    { name: "Contact Us", path: "/contact_us" },
  ];

  /* Products */
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

  /* Navigate product */
  const handleProductClick = (id) => {
    router.push(`/products#${id}`);
    setShowProducts(false);
  };

  return (
    <>
      {/* TOP BAR */}
      <div className="bg-[#5f1616] text-white text-sm text-center py-2 font-medium">
        Free Shipping on Orders Above ₹1999
      </div>

      {/* HEADER */}
      <header
        className={`fixed left-0 w-full z-50 transition-all duration-500 ${
          scrolled ? "top-12" : "top-10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div
            className={`flex items-center justify-between transition-all duration-500
            ${
              scrolled
                ? "bg-white/95 backdrop-blur-md rounded-2xl shadow-xl px-10 py-2.5 mx-4"
                : "bg-white px-10 py-4"
            }`}
          >
            {/* LOGO */}
            <div
              className="relative w-[160px] h-[80px] flex items-center cursor-pointer"
              onClick={() => router.push("/")}
            >
              <img
                src={scrolled ? "/images/logo8.png" : "/images/newlogo.jpeg"}
                alt="Logo"
                className={`transition-all duration-500 ${
                  scrolled ? "h-8" : "ml-4 h-20 w-22"
                }`}
              />
            </div>

            {/* NAVIGATION */}
            <nav className="hidden md:flex items-center gap-12 font-sans ml-[-20px] mr-12">
              {navItems.map((item) => {
                const isActive =
                  item.path === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.path);

                return (
                  <button
                    key={item.name}
                    onClick={() => router.push(item.path)}
                    className={`relative text-[18px] font-medium transition
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
                  className="flex items-center gap-1 text-[18px] font-medium text-[#8a4343] hover:text-[#5f1616]"
                >
                  Products
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-300 ${
                      showProducts ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showProducts && (
                  <div className="absolute top-8 left-0 bg-white shadow-xl rounded-xl py-2 w-56 border border-gray-100">
                    {products.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="block w-full text-left px-4 py-2 text-sm text-[#8a4343] hover:bg-[#f6e7e7] hover:text-[#5f1616]"
                      >
                        {product.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-6">
              <button className="hidden md:block text-sm text-[#8a4343] hover:text-[#5f1616]">
                Login
              </button>

              <button className="bg-[#ac4343] text-white text-xs px-4 py-1.5 rounded-full hover:bg-[#5f1616]">
                Sign Up
              </button>

              <button className="relative">
                <ShoppingCart className="w-5 h-5 text-[#1F2937]" />
                <span className="absolute -top-2 -right-2 bg-[#F2C94C] text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  0
                </span>
              </button>

              <button
                className="hidden md:flex text-sm text-[#8a4343] border border-[#8a4343] px-3 py-1.5 rounded-md hover:border-[#5f1616]"
                onClick={() => router.push("/admin")}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer so content doesn't hide under fixed header */}
      <div className="h-[120px]" />
    </>
  );
}
