"use client";

import { useClerk, useUser, UserButton } from "@clerk/nextjs";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingCart, ChevronDown, Menu, X, User } from "lucide-react";
import { useCart } from "@/context/CartContext";


export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const { cart } = useCart();
  const {openSignIn} = useClerk();
const { isSignedIn } = useUser();

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
      <div className="bg-[#5F1616] text-[#F2C94C] text-[11px] sm:text-xs text-center py-2 font-medium tracking-[0.15em] uppercase font-[family-name:var(--font-mono),monospace] border-b border-[#F2C94C]/20">
        Free shipping on orders above ₹2999
      </div>

      {/* HEADER */}
      <header
        className={`fixed left-0 w-full z-50 transition-all duration-500 ${
          scrolled ? "top-9" : "top-8"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div
            className={`flex items-center justify-between transition-all duration-500 border
            ${
              scrolled
                ? "bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border-[#C99A3B]/30 px-4 sm:px-8 py-2"
                : "bg-[#FFFDF8] border-transparent px-4 sm:px-8 py-3"
            }`}
          >
            {/* LOGO */}
            <div
              className="cursor-pointer flex items-center gap-2"
              onClick={() => router.push("/")}
            >
              <img
                src={scrolled ? "/images/logo8.png" : "/images/newlogo.jpeg"}
                alt="Dirghayush Oils"
                className={`transition-all duration-500 ${
                  scrolled ? "h-6" : "h-12 sm:h-16"
                }`}
              />
            </div>

            {/* DESKTOP NAV */}
            <nav className="hidden md:flex items-center gap-8 font-[family-name:var(--font-body),'Work_Sans',sans-serif]">
              {navItems.map((item) => {
                const isActive =
                  item.path === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.path);

                return (
                  <button
                    key={item.name}
                    onClick={() => router.push(item.path)}
                    className={`relative text-[15px] font-semibold pb-1 border-b-2 transition-colors duration-300 ${
                      isActive
                        ? "text-[#5F1616] border-[#F2C94C]"
                        : "text-[#5F1616]/60 border-transparent hover:text-[#5F1616] hover:border-[#F2C94C]/50"
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
                  className={`flex items-center gap-1 text-[15px] font-semibold pb-1 border-b-2 transition-colors duration-300 ${
                    showProducts
                      ? "text-[#5F1616] border-[#F2C94C]"
                      : "text-[#5F1616]/60 border-transparent hover:text-[#5F1616] hover:border-[#F2C94C]/50"
                  }`}
                >
                  Products
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${showProducts ? "rotate-180" : ""}`}
                  />
                </button>

                {showProducts && (
                  <div className="absolute top-9 left-1/2 -translate-x-1/2 bg-[#FFFDF8] shadow-xl rounded-xl py-2 w-56 border border-[#C99A3B]/30 overflow-hidden">
                    {products.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="block w-full text-left px-4 py-2 text-sm text-[#5F1616]/80 hover:bg-[#F2C94C]/15 hover:text-[#5F1616] transition-colors"
                      >
                        {product.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-1 sm:gap-2">

             {/* ACCOUNT ICON */}
<div className="relative group">
  {isSignedIn ? (
    <UserButton afterSignOutUrl="/">
      <UserButton.MenuItems>
        <UserButton.Action
          label="My Orders"
          labelIcon={<ShoppingCart className="w-4 h-4" />}
          onClick={() => router.push("/cart")}
        />
      </UserButton.MenuItems>
    </UserButton>
  ) : (
    <>
      <button
        onClick={() => openSignIn()}
        className="p-2 rounded-full text-[#5F1616] hover:bg-[#F2C94C]/15 transition-colors"
      >
        <User className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <span className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap text-[11px] font-semibold text-[#5F1616] bg-[#F2C94C] px-2 py-1 rounded-md opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
        Account
      </span>
    </>
  )}
</div>

              {/* CART ICON */}
              <div className="relative group">
                <button
                  onClick={() => router.push("/cart")}
                  aria-label="Cart"
                  className="relative p-2 rounded-full text-[#5F1616] hover:bg-[#F2C94C]/15 transition-colors"
                >
                  <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />

                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 bg-[#F2C94C] text-[#5F1616] text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border border-white">
                      {cartCount}
                    </span>
                  )}
                </button>
                <span className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap text-[11px] font-semibold text-[#5F1616] bg-[#F2C94C] px-2 py-1 rounded-md opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
                  Cart
                </span>
              </div>

              {/* MOBILE MENU BUTTON */}
              <button
                className="md:hidden p-2 ml-1 rounded-full text-[#5F1616] hover:bg-[#F2C94C]/15 transition-colors"
                onClick={() => setMobileMenu(!mobileMenu)}
                aria-label="Menu"
              >
                {mobileMenu ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* MOBILE MENU */}
          {mobileMenu && (
            <div className="md:hidden bg-[#FFFDF8] shadow-xl rounded-2xl mt-3 p-4 space-y-1 border border-[#C99A3B]/30">

              {/* NAV ITEMS */}
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    router.push(item.path);
                    setMobileMenu(false);
                  }}
                  className="block w-full text-left text-[#5F1616] font-semibold py-2 border-b border-[#C99A3B]/15"
                >
                  {item.name}
                </button>
              ))}

              {/* PRODUCTS */}
              <div className="border-b border-[#C99A3B]/15 py-2">
                <button
                  onClick={() => setShowProducts(!showProducts)}
                  className="flex justify-between w-full font-semibold text-[#5F1616]"
                >
                  Products
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-300 ${showProducts ? "rotate-180" : ""}`}
                  />
                </button>

                {showProducts && (
                  <div className="mt-2 ml-3 space-y-2">
                    {products.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="block w-full text-left text-sm text-[#5F1616]/70"
                      >
                        {product.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* MOBILE ACCOUNT */}
{isSignedIn ? (
    <UserButton afterSignOutUrl="/">
      <UserButton.MenuItems>
        <UserButton.Action
          label="My Orders"
          labelIcon={<ShoppingCart className="w-4 h-4" />}
          onClick={() => router.push("/cart")}
        />
      </UserButton.MenuItems>
    </UserButton>
  ) : (
    <>
      <button
        onClick={() => openSignIn()}
        className="p-2 rounded-full text-[#5F1616] hover:bg-[#F2C94C]/15 transition-colors"
      >
        <User className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <span className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap text-[11px] font-semibold text-[#5F1616] bg-[#F2C94C] px-2 py-1 rounded-md opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
        Account
      </span>
    </>
  )}

              {/* MOBILE CART */}
              <button
                onClick={() => {
                  router.push("/cart");
                  setMobileMenu(false);
                }}
                className="flex items-center gap-2 w-full text-left text-[#5F1616] font-semibold py-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Cart ({cartCount})
              </button>

            </div>
          )}
        </div>
      </header>

      <div className="h-[110px]" />
    </>
  );
}