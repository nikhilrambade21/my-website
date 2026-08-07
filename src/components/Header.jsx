"use client";

import { useClerk, useUser, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  ShoppingCart,
  ChevronDown,
  Menu,
  X,
  User,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Header() {
  /* ==================================================
     STATES
  ================================================== */

  const [scrolled, setScrolled] = useState(false);

  // Desktop Products dropdown
  const [showProducts, setShowProducts] = useState(false);

  // Mobile Products dropdown
  const [showMobileProducts, setShowMobileProducts] =
    useState(false);

  // Mobile main menu
  const [mobileMenu, setMobileMenu] = useState(false);

  /* ==================================================
     CLERK
  ================================================== */

  const { openSignIn } = useClerk();
  const { isSignedIn } = useUser();

  /* ==================================================
     ROUTER
  ================================================== */

  const router = useRouter();
  const pathname = usePathname();

  /* ==================================================
     CART
  ================================================== */

  const { cart } = useCart();

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  /* ==================================================
     SCROLL
  ================================================== */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* ==================================================
     CLOSE MENUS AFTER NAVIGATION
  ================================================== */

  useEffect(() => {
    setMobileMenu(false);
    setShowMobileProducts(false);
    setShowProducts(false);
  }, [pathname]);

  /* ==================================================
     NAVIGATION ITEMS
  ================================================== */

  const navItems = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "About Us",
      path: "/about_us",
    },
    {
      name: "Our Process",
      path: "/our_process",
    },
    {
      name: "Contact Us",
      path: "/contact_us",
    },
  ];

  /* ==================================================
     PRODUCTS
  ================================================== */

  const products = [
    {
      name: "Groundnut Oil",
      id: "groundnut",
    },
    {
      name: "Sunflower Oil",
      id: "sunflower",
    },
    {
      name: "Coconut Oil",
      id: "coconut",
    },
    {
      name: "Safflower Oil",
      id: "safflower",
    },
    {
      name: "Mustard Oil",
      id: "mustard",
    },
    {
      name: "White Sesame Oil",
      id: "sesame",
    },
    {
      name: "Niger Oil",
      id: "niger",
    },
    {
      name: "Flaxseed Oil",
      id: "flaxseed",
    },
    {
      name: "Almond Oil",
      id: "almond",
    },
  ];

  /* ==================================================
     DESKTOP PRODUCT CLICK
  ================================================== */

  const handleProductClick = (id) => {
    // Close all menus first
    setShowProducts(false);
    setShowMobileProducts(false);
    setMobileMenu(false);

    // Navigate
    router.push(`/products/${id}`);
  };

  /* ==================================================
     MOBILE NORMAL NAVIGATION
  ================================================== */

  const handleMobileNavClick = (path) => {
    setMobileMenu(false);
    setShowMobileProducts(false);
    setShowProducts(false);

    router.push(path);
  };

  /* ==================================================
     MOBILE MENU TOGGLE
  ================================================== */

  const handleMobileMenuToggle = () => {
    setMobileMenu((previous) => {
      const newState = !previous;

      if (!newState) {
        setShowMobileProducts(false);
      }

      return newState;
    });
  };

  /* ==================================================
     ACCOUNT / CLERK LOGIN
     
     IMPORTANT:
     Do NOT add huge z-index values to the header.
     Clerk's modal must appear above the header.
  ================================================== */

  const handleAccountClick = () => {
    // Close any open menus before opening Clerk
    setMobileMenu(false);
    setShowMobileProducts(false);
    setShowProducts(false);

    // Open Clerk sign-in
    openSignIn();
  };

  /* ==================================================
     RENDER
  ================================================== */

  return (
    <>
      {/* ==================================================
          ANNOUNCEMENT BAR
      ================================================== */}

      <div
        className="
          relative
          z-40
          bg-[#5F1616]
          text-[#F2C94C]
          text-[11px]
          sm:text-xs
          text-center
          py-2
          font-medium
          tracking-[0.15em]
          uppercase
          font-[family-name:var(--font-mono),monospace]
          border-b
          border-[#F2C94C]/20
        "
      >
        Free shipping on orders above ₹2999
      </div>

      {/* ==================================================
          HEADER
      ================================================== */}

      <header
        className={`fixed left-0 w-full z-50 transition-all duration-500 ${
          scrolled ? "top-9" : "top-8"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4">

          {/* ==================================================
              MAIN HEADER BAR
          ================================================== */}

          <div
            className={`
              relative
              flex
              items-center
              justify-between
              transition-all
              duration-500
              border

              ${
                scrolled
                  ? `
                    bg-white/95
                    backdrop-blur-md
                    rounded-2xl
                    shadow-xl
                    border-[#C99A3B]/30
                    px-4
                    sm:px-8
                    py-2
                  `
                  : `
                    bg-[#FFFDF8]
                    border-transparent
                    px-4
                    sm:px-8
                    py-3
                  `
              }
            `}
          >

            {/* ==================================================
                LOGO
            ================================================== */}

            <button
              type="button"
              onClick={() => {
                setMobileMenu(false);
                setShowMobileProducts(false);
                setShowProducts(false);

                router.push("/");
              }}
              className="cursor-pointer flex items-center gap-2"
              aria-label="Go to home"
            >
              <img
                src={
                  scrolled
                    ? "/images/logo8.png"
                    : "/images/newlogo.jpeg"
                }
                alt="Dirghayush Oils"
                className={`
                  transition-all
                  duration-500

                  ${
                    scrolled
                      ? "h-6"
                      : "h-12 sm:h-16"
                  }
                `}
              />
            </button>

            {/* ==================================================
                DESKTOP NAVIGATION
            ================================================== */}

            <nav
              className="
                hidden
                md:flex
                items-center
                gap-8
                font-[family-name:var(--font-body),'Work_Sans',sans-serif]
              "
            >

              {/* ==================================================
                  NORMAL NAV ITEMS
              ================================================== */}

              {navItems.map((item) => {
                const isActive =
                  item.path === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.path);

                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      setShowProducts(false);
                      setShowMobileProducts(false);
                      setMobileMenu(false);

                      router.push(item.path);
                    }}
                    className={`
                      relative
                      text-[15px]
                      font-semibold
                      pb-1
                      border-b-2
                      transition-colors
                      duration-300

                      ${
                        isActive
                          ? `
                            text-[#5F1616]
                            border-[#F2C94C]
                          `
                          : `
                            text-[#5F1616]/60
                            border-transparent
                            hover:text-[#5F1616]
                            hover:border-[#F2C94C]/50
                          `
                      }
                    `}
                  >
                    {item.name}
                  </button>
                );
              })}

              {/* ==================================================
                  DESKTOP PRODUCTS
              ================================================== */}

              <div className="relative">

                {/* PRODUCTS BUTTON */}

                <button
                  type="button"
                  onClick={() => {
                    setShowProducts(
                      (previous) => !previous
                    );

                    // Close mobile menu
                    setMobileMenu(false);
                    setShowMobileProducts(false);
                  }}
                  className={`
                    flex
                    items-center
                    gap-1
                    text-[15px]
                    font-semibold
                    pb-1
                    border-b-2
                    transition-colors
                    duration-300

                    ${
                      showProducts
                        ? `
                          text-[#5F1616]
                          border-[#F2C94C]
                        `
                        : `
                          text-[#5F1616]/60
                          border-transparent
                          hover:text-[#5F1616]
                          hover:border-[#F2C94C]/50
                        `
                    }
                  `}
                >
                  Products

                  <ChevronDown
                    size={16}
                    className={`
                      transition-transform
                      duration-300

                      ${
                        showProducts
                          ? "rotate-180"
                          : ""
                      }
                    `}
                  />
                </button>

                {/* ==================================================
                    DESKTOP PRODUCT LIST
                ================================================== */}

                {showProducts && (
                  <div
                    className="
                      absolute
                      top-9
                      left-1/2
                      -translate-x-1/2
                      z-[60]
                      bg-[#FFFDF8]
                      shadow-xl
                      rounded-xl
                      py-2
                      w-56
                      border
                      border-[#C99A3B]/30
                      overflow-hidden
                    "
                  >
                    {products.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() =>
                          handleProductClick(
                            product.id
                          )
                        }
                        className="
                          block
                          w-full
                          text-left
                          px-4
                          py-2
                          text-sm
                          text-[#5F1616]/80
                          hover:bg-[#F2C94C]/15
                          hover:text-[#5F1616]
                          transition-colors
                          cursor-pointer
                        "
                      >
                        {product.name}
                      </button>
                    ))}
                  </div>
                )}

              </div>
            </nav>

            {/* ==================================================
                RIGHT SIDE ACTIONS
            ================================================== */}

            <div
              className="
                flex
                items-center
                gap-1
                sm:gap-2
                relative
              "
            >

              {/* ==================================================
                  ACCOUNT
              ================================================== */}

              <div className="relative group">

                {isSignedIn ? (
                  <UserButton afterSignOutUrl="/">
                    <UserButton.MenuItems>

                      <UserButton.Action
                        label="My Orders"
                        labelIcon={
                          <ShoppingCart className="w-4 h-4" />
                        }
                        onClick={() =>
                          router.push("/cart")
                        }
                      />

                    </UserButton.MenuItems>
                  </UserButton>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleAccountClick}
                      aria-label="Account"
                      className="
                        p-2
                        rounded-full
                        text-[#5F1616]
                        hover:bg-[#F2C94C]/15
                        transition-colors
                      "
                    >
                      <User
                        className="
                          w-5
                          h-5
                          sm:w-6
                          sm:h-6
                        "
                      />
                    </button>

                    {/* ACCOUNT TOOLTIP */}

                    <span
                      className="
                        pointer-events-none
                        absolute
                        top-full
                        left-1/2
                        -translate-x-1/2
                        mt-1
                        whitespace-nowrap
                        text-[11px]
                        font-semibold
                        text-[#5F1616]
                        bg-[#F2C94C]
                        px-2
                        py-1
                        rounded-md
                        opacity-0
                        -translate-y-1
                        group-hover:opacity-100
                        group-hover:translate-y-0
                        transition-all
                        duration-200
                      "
                    >
                      Account
                    </span>
                  </>
                )}

              </div>

              {/* ==================================================
                  CART
              ================================================== */}

              <div className="relative group">

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenu(false);
                    setShowMobileProducts(false);
                    setShowProducts(false);

                    router.push("/cart");
                  }}
                  aria-label="Cart"
                  className="
                    relative
                    p-2
                    rounded-full
                    text-[#5F1616]
                    hover:bg-[#F2C94C]/15
                    transition-colors
                  "
                >
                  <ShoppingCart
                    className="
                      w-5
                      h-5
                      sm:w-6
                      sm:h-6
                    "
                  />

                  {cartCount > 0 && (
                    <span
                      className="
                        absolute
                        top-0
                        right-0
                        bg-[#F2C94C]
                        text-[#5F1616]
                        text-[10px]
                        w-5
                        h-5
                        rounded-full
                        flex
                        items-center
                        justify-center
                        font-bold
                        border
                        border-white
                      "
                    >
                      {cartCount}
                    </span>
                  )}
                </button>

                {/* CART TOOLTIP */}

                <span
                  className="
                    pointer-events-none
                    absolute
                    top-full
                    left-1/2
                    -translate-x-1/2
                    mt-1
                    whitespace-nowrap
                    text-[11px]
                    font-semibold
                    text-[#5F1616]
                    bg-[#F2C94C]
                    px-2
                    py-1
                    rounded-md
                    opacity-0
                    -translate-y-1
                    group-hover:opacity-100
                    group-hover:translate-y-0
                    transition-all
                    duration-200
                  "
                >
                  Cart
                </span>

              </div>

              {/* ==================================================
                  MOBILE MENU BUTTON
              ================================================== */}

              <button
                type="button"
                className="
                  md:hidden
                  p-2
                  ml-1
                  rounded-full
                  text-[#5F1616]
                  hover:bg-[#F2C94C]/15
                  transition-colors
                  cursor-pointer
                "
                onClick={handleMobileMenuToggle}
                aria-label="Menu"
                aria-expanded={mobileMenu}
              >
                {mobileMenu ? (
                  <X size={24} />
                ) : (
                  <Menu size={24} />
                )}
              </button>

            </div>
          </div>

          {/* ==================================================
              MOBILE MENU
          ================================================== */}

          {mobileMenu && (
            <div
              className="
                md:hidden
                bg-[#FFFDF8]
                shadow-xl
                rounded-2xl
                mt-3
                p-4
                border
                border-[#C99A3B]/30
              "
            >

              {/* ==================================================
                  MOBILE NORMAL NAVIGATION
              ================================================== */}

              <div className="space-y-1">

                {navItems.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() =>
                      handleMobileNavClick(
                        item.path
                      )
                    }
                    className="
                      block
                      w-full
                      text-left
                      text-[#5F1616]
                      font-semibold
                      py-3
                      border-b
                      border-[#C99A3B]/15
                      cursor-pointer
                      touch-manipulation
                    "
                  >
                    {item.name}
                  </button>
                ))}

              </div>

              {/* ==================================================
                  MOBILE PRODUCTS
              ================================================== */}

              <div
                className="
                  border-b
                  border-[#C99A3B]/15
                  py-2
                "
              >

                {/* PRODUCTS BUTTON */}

                <button
                  type="button"
                  onClick={() => {
                    setShowMobileProducts(
                      (previous) => !previous
                    );
                  }}
                  className="
                    flex
                    items-center
                    justify-between
                    w-full
                    py-3
                    font-semibold
                    text-[#5F1616]
                    cursor-pointer
                    touch-manipulation
                  "
                  aria-expanded={
                    showMobileProducts
                  }
                >
                  <span>Products</span>

                  <ChevronDown
                    size={18}
                    className={`
                      transition-transform
                      duration-300

                      ${
                        showMobileProducts
                          ? "rotate-180"
                          : ""
                      }
                    `}
                  />
                </button>

                {/* ==================================================
                    MOBILE PRODUCT LIST
                ================================================== */}

                {showMobileProducts && (
                  <div
                    className="
                      mt-1
                      ml-2
                      pl-3
                      border-l-2
                      border-[#C99A3B]/30
                      flex
                      flex-col
                    "
                  >
                    {products.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        onClick={() => {
                          // Close everything immediately
                          setShowMobileProducts(false);
                          setMobileMenu(false);
                          setShowProducts(false);
                        }}
                        className="
                          block
                          w-full
                          text-left
                          py-3
                          px-2
                          text-sm
                          text-[#5F1616]/75
                          hover:text-[#5F1616]
                          hover:bg-[#F2C94C]/10
                          active:bg-[#F2C94C]/20
                          rounded-md
                          transition-colors
                          cursor-pointer
                          touch-manipulation
                        "
                      >
                        {product.name}
                      </Link>
                    ))}
                  </div>
                )}

              </div>
            </div>
          )}

        </div>
      </header>

      {/* ==================================================
          HEADER SPACING
      ================================================== */}

      <div className="h-[110px]" />
    </>
  );
}