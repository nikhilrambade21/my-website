"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

import {
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  MapPin,
  Phone,
  ShieldCheck,
  Package,
  Truck,
  ShoppingBag,
  ChevronDown,
  CheckCircle2,
  Leaf,
} from "lucide-react";

import toast from "react-hot-toast";

import { useAppContext } from "@/context/AppContext";

const FREE_SHIPPING_LIMIT = 3000;
const SHIPPING_CHARGE = 99;

export default function CartPage() {
  const router = useRouter();

  /*
   * IMPORTANT:
   * getToken comes from Clerk useAuth().
   * Do NOT get getToken from useAppContext().
   */
  const { getToken } = useAuth();

  const {
    user,
    userData,
    cartItems,
    updateCartQuantity,
    removeFromCart,
  } = useAppContext();

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  const [cartReady, setCartReady] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressesLoading, setAddressesLoading] = useState(false);

  /*
   * Custom address dropdown
   */
  const [addressDropdownOpen, setAddressDropdownOpen] =
    useState(false);

  const addressDropdownRef = useRef(null);

  /* =====================================================
     CLOSE ADDRESS DROPDOWN WHEN CLICKING OUTSIDE
  ===================================================== */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        addressDropdownRef.current &&
        !addressDropdownRef.current.contains(event.target)
      ) {
        setAddressDropdownOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* =====================================================
     CART READY
  ===================================================== */

  useEffect(() => {
    if (user) {
      if (
        userData !== null &&
        userData !== undefined
      ) {
        setCartReady(true);
      }
    } else {
      setCartReady(true);
    }
  }, [user, userData]);

  /* =====================================================
     FETCH USER ADDRESSES
  ===================================================== */

  useEffect(() => {
    let cancelled = false;

    const fetchUserAddresses = async () => {
      /*
       * User must be signed in to fetch private addresses.
       */
      if (!user) {
        if (!cancelled) {
          setAddresses([]);
          setSelectedAddress(null);
          setAddressesLoading(false);
        }

        return;
      }

      try {
        setAddressesLoading(true);

        /*
         * Wait for Clerk to provide the token.
         */
        const token = await getToken();

        if (!token) {
          console.error(
            "ADDRESS ERROR: Clerk token not available"
          );

          if (!cancelled) {
            setAddresses([]);
            setSelectedAddress(null);
          }

          return;
        }

        /*
         * Fetch saved addresses.
         */
        const response = await fetch(
          "/api/user/get-address",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            cache: "no-store",
          }
        );

        /*
         * Read response as text first.
         * This prevents JSON parse errors when
         * API returns an empty response.
         */
        const responseText =
          await response.text();

        console.log(
          "ADDRESS API STATUS:",
          response.status
        );

        console.log(
          "ADDRESS API RESPONSE:",
          responseText
        );

        if (!response.ok) {
          throw new Error(
            responseText ||
              `Unable to fetch addresses. Status: ${response.status}`
          );
        }

        if (!responseText.trim()) {
          throw new Error(
            `Address API returned an empty response. Status: ${response.status}`
          );
        }

        let data;

        try {
          data = JSON.parse(responseText);
        } catch (jsonError) {
          console.error(
            "ADDRESS JSON PARSE ERROR:",
            jsonError
          );

          throw new Error(
            "Address API returned invalid JSON."
          );
        }

        console.log(
          "PARSED ADDRESS DATA:",
          data
        );

        if (!data?.success) {
          throw new Error(
            data?.message ||
              "Unable to load addresses"
          );
        }

        /*
         * Database fields:
         *
         * _id
         * fullName
         * phoneNumber
         * area
         * city
         * state
         * pinCode
         *
         * Frontend fields:
         *
         * id
         * name
         * phone
         * address
         * city
         * state
         * pincode
         */
        const serverAddresses =
          Array.isArray(data.addresses)
            ? data.addresses
            : [];

        const normalizedAddresses =
          serverAddresses.map((address) => ({
            id: String(
              address._id ||
                address.id ||
                ""
            ),

            name:
              address.fullName ||
              address.name ||
              "",

            phone:
              address.phoneNumber ||
              address.phone ||
              "",

            address:
              address.area ||
              address.address ||
              "",

            city:
              address.city || "",

            state:
              address.state || "",

            pincode:
              address.pinCode ||
              address.pincode ||
              "",

            _original: address,
          }));

        if (cancelled) return;

        setAddresses(
          normalizedAddresses
        );

        /*
         * Restore previously selected address.
         */
        let savedSelectedAddress = null;

        try {
          savedSelectedAddress =
            JSON.parse(
              localStorage.getItem(
                "dirghayush_selected_address"
              ) || "null"
            );
        } catch (error) {
          console.error(
            "Saved address parse error:",
            error
          );
        }

        if (savedSelectedAddress?.id) {
          const existingAddress =
            normalizedAddresses.find(
              (item) =>
                String(item.id) ===
                String(
                  savedSelectedAddress.id
                )
            );

          if (existingAddress) {
            setSelectedAddress(
              existingAddress
            );

            localStorage.setItem(
              "dirghayush_selected_address",
              JSON.stringify(
                existingAddress
              )
            );

            return;
          }
        }

        /*
         * Automatically select first address.
         */
        if (
          normalizedAddresses.length >
          0
        ) {
          const firstAddress =
            normalizedAddresses[0];

          setSelectedAddress(
            firstAddress
          );

          localStorage.setItem(
            "dirghayush_selected_address",
            JSON.stringify(
              firstAddress
            )
          );
        } else {
          setSelectedAddress(null);

          localStorage.removeItem(
            "dirghayush_selected_address"
          );
        }
      } catch (error) {
        console.error(
          "FETCH USER ADDRESSES ERROR:",
          error
        );

        if (!cancelled) {
          setAddresses([]);

          if (user) {
            toast.error(
              error.message ||
                "Unable to load addresses"
            );
          }
        }
      } finally {
        if (!cancelled) {
          setAddressesLoading(false);
        }
      }
    };

    fetchUserAddresses();

    return () => {
      cancelled = true;
    };
  }, [user, getToken]);

  /* =====================================================
     FETCH PRODUCTS
  ===================================================== */

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        setProductsLoading(true);

        const response = await fetch(
          "/api/product/list",
          {
            cache: "no-store",
          }
        );

        const responseText =
          await response.text();

        if (!responseText.trim()) {
          throw new Error(
            `Product API returned an empty response. Status: ${response.status}`
          );
        }

        let data;

        try {
          data = JSON.parse(responseText);
        } catch {
          throw new Error(
            "Product API returned invalid JSON."
          );
        }

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data?.message ||
              "Unable to load products"
          );
        }

        if (!cancelled) {
          setProducts(
            Array.isArray(data.products)
              ? data.products
              : []
          );
        }
      } catch (error) {
        console.error(
          "Cart product error:",
          error
        );

        if (!cancelled) {
          toast.error(
            error.message ||
              "Unable to load products"
          );
        }
      } finally {
        if (!cancelled) {
          setProductsLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =====================================================
     CART PRODUCTS
  ===================================================== */

  const cartProducts = useMemo(() => {
    if (
      !cartReady ||
      productsLoading
    ) {
      return [];
    }

    if (
      !cartItems ||
      !products.length
    ) {
      return [];
    }

    return Object.entries(cartItems)
      .map(([cartKey, cartValue]) => {
        const item =
          typeof cartValue ===
            "object" &&
          cartValue !== null
            ? cartValue
            : {
                productId: cartKey,
                quantity:
                  Number(cartValue),
              };

        const product = products.find(
          (product) =>
            String(product._id) ===
            String(item.productId)
        );

        if (!product) {
          return null;
        }

        const images =
          Array.isArray(
            product.image
          )
            ? product.image
            : [];

        return {
          cartKey,
          product,
          productId:
            item.productId,
          size: item.size || "",
          price: Number(
            item.price ?? 0
          ),
          quantity: Math.max(
            Number(
              item.quantity || 1
            ),
            1
          ),
          image:
            images[0] ||
            "/images/logo6.png",
        };
      })
      .filter(Boolean);
  }, [
    cartItems,
    products,
    cartReady,
    productsLoading,
  ]);

  /* =====================================================
     TOTAL ITEMS
  ===================================================== */

  const totalItems = useMemo(() => {
    return cartProducts.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );
  }, [cartProducts]);

  /* =====================================================
     SUBTOTAL
  ===================================================== */

  const subtotal = useMemo(() => {
    return cartProducts.reduce(
      (total, item) =>
        total +
        item.price *
          item.quantity,
      0
    );
  }, [cartProducts]);

  /* =====================================================
     SHIPPING
  ===================================================== */

  const shipping =
    subtotal >=
    FREE_SHIPPING_LIMIT
      ? 0
      : SHIPPING_CHARGE;

  /* =====================================================
     TOTAL
  ===================================================== */

  const total =
    subtotal + shipping;

  /* =====================================================
     FREE SHIPPING PROGRESS
  ===================================================== */

  const amountRemaining =
    Math.max(
      FREE_SHIPPING_LIMIT -
        subtotal,
      0
    );

  const shippingProgress =
    Math.min(
      (subtotal /
        FREE_SHIPPING_LIMIT) *
        100,
      100
    );

  const freeShipping =
    subtotal >=
    FREE_SHIPPING_LIMIT;

  /* =====================================================
     UPDATE QUANTITY
  ===================================================== */

  const updateQuantity = async (
    cartKey,
    change
  ) => {
    if (!cartItems?.[cartKey]) {
      return;
    }

    const currentItem =
      cartItems[cartKey];

    const currentQuantity =
      typeof currentItem ===
      "object"
        ? Number(
            currentItem.quantity ||
              1
          )
        : Number(
            currentItem || 1
          );

    const newQuantity =
      currentQuantity + change;

    if (newQuantity < 1) {
      return;
    }

    try {
      await updateCartQuantity(
        cartKey,
        newQuantity
      );
    } catch (error) {
      console.error(
        "Quantity update error:",
        error
      );

      toast.error(
        "Unable to update quantity"
      );
    }
  };

  /* =====================================================
     REMOVE ITEM
  ===================================================== */

  const removeItem = async (
    cartKey
  ) => {
    try {
      await removeFromCart(
        cartKey
      );

      toast.success(
        "Item removed from cart"
      );
    } catch (error) {
      console.error(
        "Remove item error:",
        error
      );

      toast.error(
        "Unable to remove item"
      );
    }
  };

  /* =====================================================
     SELECT ADDRESS
  ===================================================== */

  const handleAddressSelect = (
    address
  ) => {
    if (!address) {
      return;
    }

    setSelectedAddress(address);

    localStorage.setItem(
      "dirghayush_selected_address",
      JSON.stringify(address)
    );

    setAddressDropdownOpen(false);
  };

  /* =====================================================
     PLACE ORDER
  ===================================================== */
/* =====================================================
   PLACE ORDER
===================================================== */
/* =====================================================
   PLACE ORDER
===================================================== */

const handlePlaceOrder = async () => {
  if (!cartProducts.length) {
    toast.error("Your cart is empty");
    return;
  }

  if (!selectedAddress) {
    toast.error("Please select a delivery address");
    return;
  }

  if (!user) {
    toast.error("Please sign in before placing your order");
    return;
  }

  try {
    setPlacingOrder(true);

    /* =================================================
       GET CLERK TOKEN
    ================================================= */

    const token = await getToken();

    if (!token) {
      toast.error(
        "Authentication failed. Please sign in again."
      );
      return;
    }

    /* =================================================
       PREPARE CART ITEMS
    ================================================= */

    const cartItemsArray = Object.entries(cartItems)
      .map(([key, value]) => {
        if (
          typeof value === "object" &&
          value !== null
        ) {
          return {
            product: value.productId || key,
            quantity: Number(
              value.quantity || 0
            ),
          };
        }

        return {
          product: key,
          quantity: Number(value || 0),
        };
      })
      .filter(
        (item) => item.quantity > 0
      );

    if (cartItemsArray.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    /* =================================================
       PREPARE ORDER DATA
    ================================================= */

   const orderData = {
    address: selectedAddress.id,
    items: cartItemsArray,
    amounts: Number(total),
};

console.log(
    "FINAL ORDER DATA:",
    JSON.stringify(orderData, null, 2)
);

    console.log(
      "================================"
    );

    console.log(
      "ORDER DATA SENT TO API:"
    );

    console.log(
      JSON.stringify(
        orderData,
        null,
        2
      )
    );

    console.log(
      "================================"
    );

    /* =================================================
       CREATE ORDER
    ================================================= */

    const response = await fetch(
      "/api/order/create",
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify(
          orderData
        ),
      }
    );

    /* =================================================
       READ API RESPONSE
    ================================================= */

    const responseText =
      await response.text();

    console.log(
      "ORDER API STATUS:",
      response.status
    );

    console.log(
      "ORDER API RESPONSE:",
      responseText
    );

    let data;

    try {
      data = JSON.parse(
        responseText
      );
    } catch (error) {
      console.error(
        "ORDER JSON PARSE ERROR:",
        error
      );

      throw new Error(
        "Order API returned an invalid response."
      );
    }

    /* =================================================
       CHECK ORDER RESULT
    ================================================= */

    if (
      !response.ok ||
      !data?.success
    ) {
      throw new Error(
        data?.message ||
          "Unable to place order"
      );
    }

    /* =================================================
       ORDER SUCCESS
    ================================================= */

    console.log(
      "ORDER CREATED SUCCESSFULLY:",
      data
    );

    toast.success(
      data.message ||
        "Order placed successfully!"
    );

    /*
     * IMPORTANT:
     *
     * Do not call:
     *
     * setCartItems({})
     *
     * because your current AppContext does not
     * provide setCartItems.
     */

    /* =================================================
       REDIRECT TO SUCCESS PAGE
    ================================================= */

    router.push(
      "/order-placed"
    );

  } catch (error) {

    console.error(
      "PLACE ORDER ERROR:",
      error
    );

    toast.error(
      error?.message ||
        "Unable to place order"
    );

  } finally {

    setPlacingOrder(false);

  }
};
  /* =====================================================
     LOADING
  ===================================================== */

  if (
    !cartReady ||
    productsLoading
  ) {
    return (
      <main
        className="
          min-h-screen
          bg-[#F8F1E3]
          flex
          items-center
          justify-center
        "
      >
        <div className="text-center">
          <div
            className="
              w-14
              h-14
              rounded-full
              border-4
              border-[#7B1616]/20
              border-t-[#7B1616]
              animate-spin
              mx-auto
              mb-5
            "
          />

          <p
            className="
              text-[#5F1616]
              font-semibold
            "
          >
            Preparing your cart...
          </p>

          <p
            className="
              text-sm
              text-gray-500
              mt-1
            "
          >
            Please wait
          </p>
        </div>
      </main>
    );
  }

  /* =====================================================
     EMPTY CART
  ===================================================== */

  if (!cartProducts.length) {
    return (
      <main
        className="
          min-h-screen
          bg-[#F8F1E3]
          px-4
          py-12
        "
      >
        <div
          className="
            max-w-3xl
            mx-auto
            bg-white
            rounded-[28px]
            border
            border-[#C5A059]/30
            shadow-[0_15px_50px_rgba(95,22,22,0.08)]
            overflow-hidden
          "
        >
          <div
            className="
              h-2
              bg-[#7B1616]
            "
          />

          <div
            className="
              px-6
              py-16
              sm:px-16
              text-center
            "
          >
            <div
              className="
                w-24
                h-24
                rounded-full
                bg-[#F5E9D3]
                mx-auto
                flex
                items-center
                justify-center
                mb-7
              "
            >
              <ShoppingBag
                size={40}
                className="text-[#7B1616]"
              />
            </div>

            <p
              className="
                text-xs
                tracking-[0.3em]
                uppercase
                text-[#C5A059]
                font-bold
              "
            >
              DIRGHAYUSH OILS
            </p>

            <h1
              className="
                mt-3
                text-4xl
                font-bold
                text-[#5F1616]
              "
            >
              Your Cart is Empty
            </h1>

            <p
              className="
                mt-4
                text-gray-500
                leading-7
                max-w-md
                mx-auto
              "
            >
              Discover our pure,
              traditional wood-pressed
              oils and add your
              favourites to the cart.
            </p>

            <button
              type="button"
              onClick={() =>
                router.push("/")
              }
              className="
                mt-8
                inline-flex
                items-center
                gap-2
                px-8
                py-4
                rounded-xl
                bg-[#7B1616]
                hover:bg-[#5F1616]
                text-white
                font-bold
                shadow-lg
                transition
              "
            >
              <ArrowLeft size={18} />
              Continue Shopping
            </button>
          </div>
        </div>
      </main>
    );
  }

  /* =====================================================
     MAIN PAGE
  ===================================================== */

  return (
    <main
      className="
        min-h-screen
        bg-[#F8F1E3]
        pb-20
      "
    >
      {/* TOP BANNER */}

      <div
        className="
          bg-[#5F1616]
          text-white
          py-3
          px-4
        "
      >
        <div
          className="
            max-w-7xl
            mx-auto
            flex
            items-center
            justify-center
            gap-2
            text-sm
            font-medium
          "
        >
          <Truck
            size={17}
            className="text-[#F2C94C]"
          />

          {freeShipping ? (
            <span>
              🎉 Congratulations!
              You have unlocked{" "}
              <strong>
                FREE SHIPPING
              </strong>
            </span>
          ) : (
            <span>
              Add ₹
              {amountRemaining.toLocaleString(
                "en-IN"
              )}{" "}
              more to unlock{" "}
              <strong>
                FREE SHIPPING
              </strong>
            </span>
          )}
        </div>
      </div>

      {/* PAGE HEADER */}

      <section
        className="
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          pt-8
          pb-7
        "
      >
        <button
          type="button"
          onClick={() =>
            router.back()
          }
          className="
            inline-flex
            items-center
            gap-2
            text-sm
            text-[#5F1616]
            hover:text-[#7B1616]
            font-semibold
            mb-7
          "
        >
          <ArrowLeft size={17} />
          Continue Shopping
        </button>

        <div
          className="
            flex
            flex-col
            md:flex-row
            md:items-end
            md:justify-between
            gap-4
          "
        >
          <div>
            <div
              className="
                flex
                items-center
                gap-2
                mb-2
              "
            >
              <Leaf
                size={16}
                className="text-[#C5A059]"
              />

              <span
                className="
                  text-xs
                  uppercase
                  tracking-[0.28em]
                  text-[#C5A059]
                  font-bold
                "
              >
                Pure • Natural • Traditional
              </span>
            </div>

            <h1
              className="
                text-4xl
                sm:text-5xl
                font-black
                text-[#5F1616]
              "
            >
              Your Cart
            </h1>

            <p
              className="
                mt-2
                text-gray-500
              "
            >
              Review your selected
              oils before checkout.
            </p>
          </div>

          <div
            className="
              inline-flex
              items-center
              gap-2
              bg-white
              border
              border-[#C5A059]/30
              px-4
              py-2.5
              rounded-full
              text-sm
              text-[#5F1616]
              font-semibold
              shadow-sm
            "
          >
            <ShoppingBag size={17} />

            {totalItems}{" "}
            {totalItems === 1
              ? "Item"
              : "Items"}
          </div>
        </div>
      </section>

      {/* CONTENT */}

      <section
        className="
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
        "
      >
        <div
          className="
            grid
            grid-cols-1
            xl:grid-cols-[1fr_410px]
            gap-7
            items-start
          "
        >
          {/* LEFT SIDE */}

          <div className="space-y-6">
            {/* FREE SHIPPING PROGRESS */}

            <div
              className="
                bg-white
                rounded-2xl
                border
                border-[#C5A059]/25
                shadow-sm
                p-5
                sm:p-6
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                  mb-3
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >
                  <div
                    className="
                      w-10
                      h-10
                      rounded-full
                      bg-[#F5E9D3]
                      flex
                      items-center
                      justify-center
                    "
                  >
                    {freeShipping ? (
                      <CheckCircle2
                        size={21}
                        className="text-[#7B1616]"
                      />
                    ) : (
                      <Truck
                        size={21}
                        className="text-[#7B1616]"
                      />
                    )}
                  </div>

                  <div>
                    <p
                      className="
                        text-sm
                        font-bold
                        text-[#5F1616]
                      "
                    >
                      {freeShipping
                        ? "Free shipping unlocked!"
                        : "Free shipping on orders above ₹2999"}
                    </p>

                    <p
                      className="
                        text-xs
                        text-gray-500
                        mt-0.5
                      "
                    >
                      {freeShipping
                        ? "Your order qualifies for free delivery."
                        : `Only ₹${amountRemaining.toLocaleString(
                            "en-IN"
                          )} more to go.`}
                    </p>
                  </div>
                </div>

                <span
                  className="
                    hidden
                    sm:block
                    text-sm
                    font-bold
                    text-[#7B1616]
                  "
                >
                  ₹3000
                </span>
              </div>

              <div
                className="
                  h-2.5
                  bg-[#F1E6D2]
                  rounded-full
                  overflow-hidden
                "
              >
                <div
                  className="
                    h-full
                    bg-[#7B1616]
                    rounded-full
                    transition-all
                    duration-500
                  "
                  style={{
                    width: `${shippingProgress}%`,
                  }}
                />
              </div>
            </div>

            {/* PRODUCTS CARD */}

            <div
              className="
                bg-white
                rounded-2xl
                border
                border-[#C5A059]/25
                shadow-[0_10px_35px_rgba(95,22,22,0.06)]
                overflow-hidden
              "
            >
              <div
                className="
                  px-5
                  sm:px-7
                  py-5
                  border-b
                  border-[#C5A059]/20
                  flex
                  items-center
                  justify-between
                "
              >
                <div>
                  <h2
                    className="
                      text-xl
                      font-bold
                      text-[#5F1616]
                    "
                  >
                    Your Selected Oils
                  </h2>

                  <p
                    className="
                      text-xs
                      text-gray-500
                      mt-1
                    "
                  >
                    Freshly packed for
                    your order
                  </p>
                </div>

                <div
                  className="
                    hidden
                    sm:flex
                    items-center
                    gap-2
                    text-xs
                    font-semibold
                    text-[#7B1616]
                    bg-[#F8F1E3]
                    px-3
                    py-2
                    rounded-full
                  "
                >
                  <Package size={14} />
                  {totalItems} Items
                </div>
              </div>

              <div
                className="
                  divide-y
                  divide-[#C5A059]/15
                "
              >
                {cartProducts.map(
                  (item) => (
                    <div
                      key={
                        item.cartKey
                      }
                      className="
                        p-5
                        sm:p-6
                        hover:bg-[#FFFCF6]
                        transition
                      "
                    >
                      <div
                        className="
                          flex
                          gap-4
                          sm:gap-5
                        "
                      >
                        {/* PRODUCT IMAGE */}

                        <div
                          className="
                            relative
                            w-[100px]
                            h-[115px]
                            sm:w-[125px]
                            sm:h-[140px]
                            shrink-0
                            rounded-2xl
                            bg-[#F8F1E3]
                            border
                            border-[#C5A059]/20
                            overflow-hidden
                          "
                        >
                          <Image
                            src={
                              item.image
                            }
                            alt={
                              item.product
                                .name
                            }
                            fill
                            sizes="140px"
                            className="
                              object-contain
                              p-3
                              hover:scale-105
                              transition-transform
                            "
                          />
                        </div>

                        {/* DETAILS */}

                        <div
                          className="
                            flex-1
                            min-w-0
                          "
                        >
                          <div
                            className="
                              flex
                              justify-between
                              gap-3
                            "
                          >
                            <div>
                              <p
                                className="
                                  text-[10px]
                                  uppercase
                                  tracking-[0.2em]
                                  text-[#C5A059]
                                  font-bold
                                "
                              >
                                Wood Pressed
                              </p>

                              <h3
                                className="
                                  mt-1
                                  text-lg
                                  sm:text-xl
                                  font-bold
                                  text-[#5F1616]
                                "
                              >
                                {
                                  item
                                    .product
                                    .name
                                }
                              </h3>

                              {item.size && (
                                <span
                                  className="
                                    inline-block
                                    mt-2
                                    text-xs
                                    font-semibold
                                    text-gray-600
                                    bg-[#F8F1E3]
                                    px-2.5
                                    py-1
                                    rounded-md
                                  "
                                >
                                  {item.size}
                                </span>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                removeItem(
                                  item.cartKey
                                )
                              }
                              className="
                                w-9
                                h-9
                                shrink-0
                                rounded-full
                                flex
                                items-center
                                justify-center
                                text-gray-400
                                hover:text-[#7B1616]
                                hover:bg-[#F8F1E3]
                                transition
                              "
                              aria-label="Remove product"
                            >
                              <Trash2
                                size={18}
                              />
                            </button>
                          </div>

                          <div
                            className="
                              mt-5
                              flex
                              flex-wrap
                              items-end
                              justify-between
                              gap-4
                            "
                          >
                            <div>
                              <p
                                className="
                                  text-[11px]
                                  text-gray-400
                                  uppercase
                                  tracking-wider
                                "
                              >
                                Price
                              </p>

                              <p
                                className="
                                  mt-0.5
                                  text-lg
                                  font-bold
                                  text-[#7B1616]
                                "
                              >
                                ₹
                                {item.price.toLocaleString(
                                  "en-IN"
                                )}
                              </p>
                            </div>

                            <div>
                              <p
                                className="
                                  text-[11px]
                                  text-gray-400
                                  uppercase
                                  tracking-wider
                                  mb-1.5
                                "
                              >
                                Quantity
                              </p>

                              <div
                                className="
                                  flex
                                  items-center
                                  h-9
                                  border
                                  border-[#C5A059]/40
                                  rounded-lg
                                  overflow-hidden
                                  bg-white
                                "
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(
                                      item.cartKey,
                                      -1
                                    )
                                  }
                                  className="
                                    w-9
                                    h-full
                                    flex
                                    items-center
                                    justify-center
                                    text-[#5F1616]
                                    hover:bg-[#F8F1E3]
                                  "
                                >
                                  <Minus
                                    size={14}
                                  />
                                </button>

                                <span
                                  className="
                                    w-9
                                    text-center
                                    text-sm
                                    font-bold
                                    text-[#5F1616]
                                  "
                                >
                                  {
                                    item.quantity
                                  }
                                </span>

                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(
                                      item.cartKey,
                                      1
                                    )
                                  }
                                  className="
                                    w-9
                                    h-full
                                    flex
                                    items-center
                                    justify-center
                                    text-[#5F1616]
                                    hover:bg-[#F8F1E3]
                                  "
                                >
                                  <Plus
                                    size={14}
                                  />
                                </button>
                              </div>
                            </div>

                            <div className="text-right">
                              <p
                                className="
                                  text-[11px]
                                  text-gray-400
                                  uppercase
                                  tracking-wider
                                "
                              >
                                Subtotal
                              </p>

                              <p
                                className="
                                  mt-0.5
                                  text-xl
                                  font-black
                                  text-[#5F1616]
                                "
                              >
                                ₹
                                {(
                                  item.price *
                                  item.quantity
                                ).toLocaleString(
                                  "en-IN"
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* TRUST SECTION */}

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-3
                gap-3
              "
            >
              <div
                className="
                  bg-white
                  rounded-xl
                  p-4
                  border
                  border-[#C5A059]/20
                  flex
                  items-center
                  gap-3
                "
              >
                <Leaf
                  size={20}
                  className="text-[#7B1616]"
                />

                <div>
                  <p
                    className="
                      text-xs
                      font-bold
                      text-[#5F1616]
                    "
                  >
                    100% Natural
                  </p>

                  <p
                    className="
                      text-[10px]
                      text-gray-500
                    "
                  >
                    Pure ingredients
                  </p>
                </div>
              </div>

              <div
                className="
                  bg-white
                  rounded-xl
                  p-4
                  border
                  border-[#C5A059]/20
                  flex
                  items-center
                  gap-3
                "
              >
                <Package
                  size={20}
                  className="text-[#7B1616]"
                />

                <div>
                  <p
                    className="
                      text-xs
                      font-bold
                      text-[#5F1616]
                    "
                  >
                    Freshly Packed
                  </p>

                  <p
                    className="
                      text-[10px]
                      text-gray-500
                    "
                  >
                    Quality checked
                  </p>
                </div>
              </div>

              <div
                className="
                  bg-white
                  rounded-xl
                  p-4
                  border
                  border-[#C5A059]/20
                  flex
                  items-center
                  gap-3
                "
              >
                <ShieldCheck
                  size={20}
                  className="text-[#7B1616]"
                />

                <div>
                  <p
                    className="
                      text-xs
                      font-bold
                      text-[#5F1616]
                    "
                  >
                    Secure Order
                  </p>

                  <p
                    className="
                      text-[10px]
                      text-gray-500
                    "
                  >
                    Safe checkout
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              ORDER SUMMARY
          ================================================= */}

          <aside
            className="
              xl:sticky
              xl:top-6
            "
          >
            <div
              className="
                bg-white
                rounded-[24px]
                border
                border-[#C5A059]/30
                shadow-[0_15px_45px_rgba(95,22,22,0.10)]
                overflow-hidden
              "
            >
              {/* HEADER */}

              <div
                className="
                  bg-[#5F1616]
                  px-6
                  py-6
                  text-white
                  relative
                  overflow-hidden
                "
              >
                <div
                  className="
                    absolute
                    -right-10
                    -top-10
                    w-28
                    h-28
                    rounded-full
                    border
                    border-[#F2C94C]/20
                  "
                />

                <p
                  className="
                    text-[10px]
                    uppercase
                    tracking-[0.3em]
                    text-[#F2C94C]
                    font-bold
                  "
                >
                  Dirghayush Oils
                </p>

                <h2
                  className="
                    mt-1
                    text-2xl
                    font-bold
                  "
                >
                  Order Summary
                </h2>
              </div>

              <div className="p-6">
                {/* =================================================
                    ADDRESS
                ================================================= */}

                <div
                  className="
                    pb-6
                    mb-6
                    border-b
                    border-[#C5A059]/20
                  "
                >
                  {/* ADDRESS TITLE */}

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      mb-3
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        gap-2
                      "
                    >
                      <div
                        className="
                          w-8
                          h-8
                          rounded-lg
                          bg-[#F5E9D3]
                          flex
                          items-center
                          justify-center
                        "
                      >
                        <MapPin
                          size={17}
                          className="text-[#7B1616]"
                        />
                      </div>

                      <div>
                        <p
                          className="
                            text-[10px]
                            uppercase
                            tracking-wider
                            text-[#C5A059]
                            font-bold
                          "
                        >
                          Delivery
                        </p>

                        <h3
                          className="
                            text-sm
                            font-bold
                            text-[#5F1616]
                          "
                        >
                          Select Address
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* =================================================
                      CUSTOM ADDRESS DROPDOWN
                  ================================================= */}

                  <div
                    ref={addressDropdownRef}
                    className="relative"
                  >
                    {/* SELECTED ADDRESS BUTTON */}

                    <button
                      type="button"
                      disabled={
                        addressesLoading
                      }
                      onClick={() =>
                        setAddressDropdownOpen(
                          (previous) =>
                            !previous
                        )
                      }
                      className="
                        w-full
                        min-h-[58px]
                        border
                        border-[#C5A059]/40
                        rounded-xl
                        px-4
                        py-3
                        pr-11
                        text-left
                        bg-[#FFFCF7]
                        hover:border-[#7B1616]/60
                        focus:border-[#7B1616]
                        focus:ring-2
                        focus:ring-[#7B1616]/10
                        outline-none
                        transition
                        relative
                        disabled:opacity-60
                        disabled:cursor-wait
                      "
                    >
                      {addressesLoading ? (
                        <div className="flex items-center gap-2">
                          <div
                            className="
                              w-4
                              h-4
                              rounded-full
                              border-2
                              border-[#7B1616]/20
                              border-t-[#7B1616]
                              animate-spin
                            "
                          />

                          <span
                            className="
                              text-sm
                              text-gray-500
                            "
                          >
                            Loading addresses...
                          </span>
                        </div>
                      ) : selectedAddress ? (
                        <div className="pr-2">
                          <p
                            className="
                              text-sm
                              font-semibold
                              text-[#35405A]
                              truncate
                            "
                          >
                            {selectedAddress.name}
                          </p>

                          <p
                            className="
                              mt-0.5
                              text-xs
                              leading-4
                              text-gray-500
                              line-clamp-2
                            "
                          >
                            {selectedAddress.address}
                            {selectedAddress.address &&
                            selectedAddress.city
                              ? ", "
                              : ""}
                            {selectedAddress.city}
                            {selectedAddress.city &&
                            selectedAddress.state
                              ? ", "
                              : ""}
                            {selectedAddress.state}
                            {(selectedAddress.state ||
                              selectedAddress.city) &&
                            selectedAddress.pincode
                              ? " - "
                              : ""}
                            {selectedAddress.pincode}
                          </p>
                        </div>
                      ) : (
                        <span
                          className="
                            text-sm
                            text-gray-500
                          "
                        >
                          {addresses.length
                            ? "Select Address"
                            : "No saved address"}
                        </span>
                      )}

                      <ChevronDown
                        size={18}
                        className={`
                          absolute
                          right-4
                          top-1/2
                          -translate-y-1/2
                          text-[#7B1616]
                          transition-transform
                          ${
                            addressDropdownOpen
                              ? "rotate-180"
                              : ""
                          }
                        `}
                      />
                    </button>

                    {/* =================================================
                        DROPDOWN LIST
                    ================================================= */}

                    {addressDropdownOpen &&
                      !addressesLoading && (
                        <div
                          className="
                            absolute
                            left-0
                            right-0
                            top-full
                            mt-2
                            z-50
                            bg-white
                            border
                            border-[#C5A059]/30
                            rounded-xl
                            shadow-[0_15px_35px_rgba(95,22,22,0.15)]
                            overflow-hidden
                          "
                        >
                          {addresses.length >
                          0 ? (
                            <div
                              className="
                                max-h-[300px]
                                overflow-y-auto
                              "
                            >
                              {addresses.map(
                                (
                                  address
                                ) => {
                                  const isSelected =
                                    String(
                                      selectedAddress?.id
                                    ) ===
                                    String(
                                      address.id
                                    );

                                  return (
                                    <button
                                      key={
                                        address.id
                                      }
                                      type="button"
                                      onClick={() =>
                                        handleAddressSelect(
                                          address
                                        )
                                      }
                                      className={`
                                        w-full
                                        text-left
                                        px-4
                                        py-3
                                        border-b
                                        border-gray-100
                                        transition
                                        ${
                                          isSelected
                                            ? "bg-[#FFF7F0]"
                                            : "bg-white hover:bg-[#FFFCF7]"
                                        }
                                      `}
                                    >
                                      <div className="flex gap-3">
                                        {/* RADIO/CHECK */}

                                        <div
                                          className={`
                                            mt-0.5
                                            w-5
                                            h-5
                                            rounded-full
                                            border
                                            flex
                                            items-center
                                            justify-center
                                            shrink-0
                                            ${
                                              isSelected
                                                ? "border-[#7B1616] bg-[#7B1616]"
                                                : "border-gray-300 bg-white"
                                            }
                                          `}
                                        >
                                          {isSelected && (
                                            <CheckCircle2
                                              size={
                                                14
                                              }
                                              className="text-white"
                                            />
                                          )}
                                        </div>

                                        {/* ADDRESS */}

                                        <div className="min-w-0 flex-1">
                                          <div
                                            className="
                                              flex
                                              items-center
                                              justify-between
                                              gap-2
                                            "
                                          >
                                            <p
                                              className="
                                                text-sm
                                                font-bold
                                                text-[#5F1616]
                                              "
                                            >
                                              {
                                                address.name
                                              }
                                            </p>

                                            {isSelected && (
                                              <span
                                                className="
                                                  text-[9px]
                                                  uppercase
                                                  tracking-wider
                                                  font-bold
                                                  text-[#7B1616]
                                                "
                                              >
                                                Selected
                                              </span>
                                            )}
                                          </div>

                                          <p
                                            className="
                                              mt-1
                                              text-xs
                                              leading-5
                                              text-gray-600
                                            "
                                          >
                                            {
                                              address.address
                                            }
                                            {address.address &&
                                            address.city
                                              ? ", "
                                              : ""}
                                            {
                                              address.city
                                            }
                                            {address.city &&
                                            address.state
                                              ? ", "
                                              : ""}
                                            {
                                              address.state
                                            }
                                            {(address.state ||
                                              address.city) &&
                                            address.pincode
                                              ? " - "
                                              : ""}
                                            {
                                              address.pincode
                                            }
                                          </p>

                                          {address.phone && (
                                            <div
                                              className="
                                                mt-1.5
                                                flex
                                                items-center
                                                gap-1.5
                                                text-[11px]
                                                text-gray-500
                                              "
                                            >
                                              <Phone
                                                size={
                                                  11
                                                }
                                              />

                                              {
                                                address.phone
                                              }
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </button>
                                  );
                                }
                              )}
                            </div>
                          ) : (
                            <div
                              className="
                                px-4
                                py-5
                                text-center
                              "
                            >
                              <MapPin
                                size={22}
                                className="
                                  mx-auto
                                  text-[#C5A059]
                                  mb-2
                                "
                              />

                              <p
                                className="
                                  text-sm
                                  font-medium
                                  text-gray-600
                                "
                              >
                                No saved addresses
                              </p>

                              <p
                                className="
                                  mt-1
                                  text-xs
                                  text-gray-400
                                "
                              >
                                Add an address
                                to continue
                              </p>
                            </div>
                          )}

                          {/* =================================================
                              ADD NEW ADDRESS INSIDE DROPDOWN
                          ================================================= */}

                          <button
                            type="button"
                            onClick={() => {
                              setAddressDropdownOpen(
                                false
                              );

                              router.push(
                                "/add-address"
                              );
                            }}
                            className="
                              w-full
                              px-4
                              py-3
                              bg-[#FFFCF7]
                              border-t
                              border-[#C5A059]/20
                              text-sm
                              font-bold
                              text-[#9A5B20]
                              hover:bg-[#F8F1E3]
                              transition
                              flex
                              items-center
                              justify-center
                              gap-2
                            "
                          >
                            <Plus
                              size={16}
                            />

                            Add New Address
                          </button>
                        </div>
                      )}
                  </div>

                  {/* =================================================
                      SELECTED ADDRESS CARD
                  ================================================= */}

                  {selectedAddress ? (
                    <div
                      className="
                        mt-3
                        rounded-xl
                        bg-[#F8F1E3]
                        border
                        border-[#C5A059]/25
                        p-4
                      "
                    >
                      <div
                        className="
                          flex
                          gap-3
                        "
                      >
                        <div
                          className="
                            w-8
                            h-8
                            rounded-full
                            bg-white
                            flex
                            items-center
                            justify-center
                            shrink-0
                          "
                        >
                          <MapPin
                            size={15}
                            className="text-[#7B1616]"
                          />
                        </div>

                        <div className="min-w-0">
                          <div
                            className="
                              flex
                              items-center
                              gap-2
                            "
                          >
                            <p
                              className="
                                text-sm
                                font-bold
                                text-[#5F1616]
                              "
                            >
                              {
                                selectedAddress.name
                              }
                            </p>

                            <CheckCircle2
                              size={14}
                              className="text-[#7B1616]"
                            />
                          </div>

                          {/* FULL ADDRESS */}

                          <p
                            className="
                              mt-1
                              text-xs
                              leading-5
                              text-gray-600
                            "
                          >
                            {
                              selectedAddress.address
                            }

                            {selectedAddress.address &&
                            selectedAddress.city
                              ? ", "
                              : ""}

                            {
                              selectedAddress.city
                            }

                            {selectedAddress.city &&
                            selectedAddress.state
                              ? ", "
                              : ""}

                            {
                              selectedAddress.state
                            }

                            {(selectedAddress.state ||
                              selectedAddress.city) &&
                            selectedAddress.pincode
                              ? " - "
                              : ""}

                            {
                              selectedAddress.pincode
                            }
                          </p>

                          {selectedAddress.phone && (
                            <div
                              className="
                                mt-2
                                flex
                                items-center
                                gap-1.5
                                text-xs
                                text-gray-600
                              "
                            >
                              <Phone
                                size={12}
                              />

                              {
                                selectedAddress.phone
                              }
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="
                        mt-3
                        p-4
                        rounded-xl
                        bg-[#FFF7F0]
                        border
                        border-dashed
                        border-[#C5A059]/50
                        text-center
                      "
                    >
                      <MapPin
                        size={22}
                        className="
                          mx-auto
                          text-[#7B1616]
                          mb-2
                        "
                      />

                      <p
                        className="
                          text-xs
                          text-gray-500
                        "
                      >
                        {addressesLoading
                          ? "Loading your delivery addresses..."
                          : "No delivery address selected"}
                      </p>
                    </div>
                  )}

                  {/* =================================================
                      ADD NEW ADDRESS BUTTON
                  ================================================= */}

                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        "/add-address"
                      )
                    }
                    className="
                      w-full
                      mt-3
                      h-11
                      rounded-xl
                      border
                      border-[#7B1616]
                      text-[#7B1616]
                      hover:bg-[#7B1616]
                      hover:text-white
                      font-bold
                      text-sm
                      transition
                    "
                  >
                    + Add New Address
                  </button>
                </div>

                {/* PRICE BREAKDOWN */}

                <div className="space-y-4">
                  <div
                    className="
                      flex
                      justify-between
                      text-sm
                    "
                  >
                    <span className="text-gray-500">
                      Items
                    </span>

                    <span
                      className="
                        font-semibold
                        text-[#5F1616]
                      "
                    >
                      {totalItems}
                    </span>
                  </div>

                  <div
                    className="
                      flex
                      justify-between
                      text-sm
                    "
                  >
                    <span className="text-gray-500">
                      Subtotal
                    </span>

                    <span
                      className="
                        font-semibold
                        text-[#35405A]
                      "
                    >
                      ₹
                      {subtotal.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>

                  <div
                    className="
                      flex
                      justify-between
                      text-sm
                    "
                  >
                    <span
                      className="
                        text-gray-500
                        flex
                        items-center
                        gap-2
                      "
                    >
                      <Truck size={15} />
                      Delivery
                    </span>

                    {freeShipping ? (
                      <span
                        className="
                          font-bold
                          text-green-600
                        "
                      >
                        FREE
                      </span>
                    ) : (
                      <span
                        className="
                          font-semibold
                          text-[#35405A]
                        "
                      >
                        ₹
                        {SHIPPING_CHARGE}
                      </span>
                    )}
                  </div>
                </div>

                {/* SHIPPING MESSAGE */}

                <div
                  className={`
                    mt-5
                    rounded-xl
                    p-3.5
                    text-xs
                    ${
                      freeShipping
                        ? "bg-green-50 text-green-700 border border-green-100"
                        : "bg-[#F8F1E3] text-[#5F1616] border border-[#C5A059]/20"
                    }
                  `}
                >
                  <div
                    className="
                      flex
                      gap-2
                      items-start
                    "
                  >
                    {freeShipping ? (
                      <CheckCircle2
                        size={16}
                        className="
                          shrink-0
                          mt-0.5
                        "
                      />
                    ) : (
                      <Truck
                        size={16}
                        className="
                          shrink-0
                          mt-0.5
                        "
                      />
                    )}

                    <span>
                      {freeShipping
                        ? "Great! Your order qualifies for FREE shipping."
                        : `Add ₹${amountRemaining.toLocaleString(
                            "en-IN"
                          )} more to get FREE shipping.`}
                    </span>
                  </div>
                </div>

                {/* DIVIDER */}

                <div
                  className="
                    my-6
                    border-t
                    border-[#C5A059]/20
                  "
                />

                {/* TOTAL */}

                <div
                  className="
                    flex
                    justify-between
                    items-end
                  "
                >
                  <div>
                    <p
                      className="
                        text-sm
                        text-gray-500
                      "
                    >
                      Total Amount
                    </p>

                    <p
                      className="
                        text-[10px]
                        text-gray-400
                        mt-1
                      "
                    >
                      Inclusive of
                      applicable
                      shipping
                    </p>
                  </div>

                  <p
                    className="
                      text-3xl
                      font-black
                      text-[#7B1616]
                  "
                  >
                    ₹
                    {total.toLocaleString(
                      "en-IN"
                    )}
                  </p>
                </div>

                {/* PLACE ORDER */}

                <button
                  type="button"
                  disabled={
                    placingOrder ||
                    !selectedAddress
                  }
                  onClick={
                    handlePlaceOrder
                  }
                  className="
                    w-full
                    mt-6
                    h-14
                    rounded-xl
                    bg-[#7B1616]
                    hover:bg-[#5F1616]
                    text-white
                    font-bold
                    shadow-lg
                    shadow-[#7B1616]/20
                    transition
                    disabled:bg-gray-400
                    disabled:shadow-none
                    disabled:cursor-not-allowed
                  "
                >
                  {placingOrder
                    ? "Processing..."
                    : "PLACE ORDER"}
                </button>

                {/* SECURITY */}

                <div
                  className="
                    mt-5
                    flex
                    gap-3
                    items-start
                    text-xs
                    text-gray-500
                    leading-5
                  "
                >
                  <ShieldCheck
                    size={18}
                    className="
                      text-[#C5A059]
                      shrink-0
                    "
                  />

                  <p>
                    Your information
                    is protected and
                    used only to
                    process and
                    deliver your
                    order.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}