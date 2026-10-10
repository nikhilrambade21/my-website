"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Check, ArrowLeft, ShoppingCart } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const { addToCart } = useAppContext();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedSize, setSelectedSize] = useState("");

  /* =========================================================
     FETCH PRODUCT
  ========================================================= */

  useEffect(() => {
    if (!params?.id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/product/${params.id}`, {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to load product"
          );
        }

        setProduct(data.product);

        // Automatically select first available price
        if (data.product?.prices) {
          const firstAvailableSize = Object.entries(
            data.product.prices
          ).find(([, price]) => price !== null);

          if (firstAvailableSize) {
            setSelectedSize(firstAvailableSize[0]);
          }
        }
      } catch (error) {
        console.error("Product fetch error:", error);

        setError(
          error.message || "Unable to load product"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params?.id]);

  /* =========================================================
     ADD TO CART
  ========================================================= */

  const handleAddToCart = async () => {
    if (!selectedSize) {
      return;
    }

    if (
      selectedPrice === null ||
      selectedPrice === undefined
    ) {
      return;
    }

    try {
      await addToCart(
        product._id,
        selectedSize,
        selectedPrice
      );
    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };

  /* =========================================================
     BUY NOW
     
     Add product to cart and immediately open cart page.
  ========================================================= */

  const handleBuyNow = async () => {
    if (!selectedSize) {
      return;
    }

    if (
      selectedPrice === null ||
      selectedPrice === undefined
    ) {
      return;
    }

    try {
      await addToCart(
        product._id,
        selectedSize,
        selectedPrice
      );

      // After adding the product, open cart
      router.push("/cart");
    } catch (error) {
      console.error("Buy now error:", error);
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F6EFDF] flex items-center justify-center">
        <div className="text-center">

          <div className="w-10 h-10 border-4 border-[#C99A3B] border-t-transparent rounded-full animate-spin mx-auto mb-4" />

          <p className="text-[#5A1A1F] text-lg">
            Loading product...
          </p>

        </div>
      </main>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error || !product) {
    return (
      <main className="min-h-screen bg-[#F6EFDF] flex items-center justify-center px-6">

        <div className="text-center">

          <h1 className="text-3xl font-bold text-[#5A1A1F] mb-4">
            Product Not Found
          </h1>

          <p className="text-gray-600 mb-6">
            {error || "This product does not exist."}
          </p>

          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 rounded-lg bg-[#5A1A1F] text-white hover:bg-[#421317] transition"
          >
            Back to Home
          </button>

        </div>

      </main>
    );
  }

  /* =========================================================
     PRODUCT DATA
  ========================================================= */

  const images = Array.isArray(product.image)
    ? product.image
    : [];

  const prices = product.prices
    ? Object.entries(product.prices)
    : [];

  const selectedPrice =
    selectedSize && product.prices
      ? product.prices[selectedSize]
      : null;

  /* =========================================================
     BENEFITS
  ========================================================= */

  const benefits = product.benefits
    ? product.benefits
        .split(/\r?\n/)
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <main className="min-h-screen bg-[#F6EFDF]">

      {/* =====================================================
          BACK BUTTON
      ===================================================== */}

      <div className="max-w-7xl mx-auto px-6 pt-4">

        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#5A1A1F] font-medium hover:opacity-70 transition"
        >
          <ArrowLeft size={18} />

          Back
        </button>

      </div>

      {/* =====================================================
          PRODUCT SECTION
      ===================================================== */}

      <section className="max-w-6xl mx-auto px-6 py-10">

        <div className="bg-white rounded-[28px] shadow-sm overflow-hidden">

          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* =================================================
                PRODUCT IMAGE
            ================================================= */}

            <div className="bg-white flex items-center justify-center p-8 lg:p-10">

              {images.length > 0 ? (

                <div className="relative w-full max-w-[500px] aspect-square">

                  <Image
                    src={images[0]}
                    alt={product.name}
                    fill
                    priority
                    className="object-contain rounded-2xl"
                    sizes="(max-width: 768px) 90vw, 500px"
                  />

                </div>

              ) : (

                <div className="w-full aspect-square flex items-center justify-center bg-[#F6EFDF] rounded-2xl">

                  <p className="text-gray-400">
                    No image available
                  </p>

                </div>

              )}

            </div>

            {/* =================================================
                PRODUCT DETAILS
            ================================================= */}

            <div className="px-8 py-10 lg:px-10">

              {/* BRAND */}

              <p className="text-sm uppercase tracking-[0.2em] text-[#C99A3B] mb-3">
                DIRGHAYUSH OILS
              </p>

              {/* PRODUCT NAME */}

              <h1 className="text-4xl md:text-5xl font-bold text-[#5A1A1F] mb-7">
                {product.name}
              </h1>

              {/* =================================================
                  DESCRIPTION
              ================================================= */}

              <div className="mb-7">

                <h2 className="text-xl font-semibold text-[#8B1111] mb-3">
                  Description
                </h2>

                <p className="text-[#35405A] leading-7">
                  {product.description}
                </p>

              </div>

              {/* =================================================
                  BENEFITS
              ================================================= */}

              {benefits.length > 0 && (

                <div className="mb-8">

                  <h2 className="text-xl font-semibold text-[#8B1111] mb-4">
                    Benefits
                  </h2>

                  <div className="space-y-2">

                    {benefits.map((benefit, index) => (

                      <div
                        key={index}
                        className="flex items-start gap-2 text-[#35405A]"
                      >

                        <Check
                          size={19}
                          strokeWidth={3}
                          className="text-green-600 flex-shrink-0 mt-[2px]"
                        />

                        <span>
                          {benefit.replace(/,$/, "")}
                        </span>

                      </div>

                    ))}

                  </div>

                </div>

              )}

              {/* =================================================
                  SELECT SIZE
              ================================================= */}

              {prices.length > 0 && (

                <div className="mb-7">

                  <h2 className="text-xl font-semibold text-[#8B1111] mb-4">
                    Select Size
                  </h2>

                  <div className="flex flex-wrap gap-3">

                    {prices.map(([size, price]) => {

                      const unavailable = price === null;

                      const selected =
                        selectedSize === size;

                      return (

                        <button
                          key={size}
                          type="button"
                          disabled={unavailable}
                          onClick={() => {
                            if (!unavailable) {
                              setSelectedSize(size);
                            }
                          }}
                          className={`
                            px-5 py-2.5
                            rounded-full
                            border
                            text-sm
                            font-medium
                            transition-all

                            ${
                              selected
                                ? "bg-[#8B1111] text-white border-[#8B1111]"
                                : unavailable
                                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                : "bg-white text-[#35405A] border-gray-300 hover:border-[#8B1111] hover:text-[#8B1111]"
                            }
                          `}
                        >
                          {size}
                        </button>

                      );

                    })}

                  </div>

                </div>

              )}

              {/* =================================================
                  PRICE
              ================================================= */}

              {selectedPrice !== null &&
                selectedPrice !== undefined && (

                  <div className="mb-7">

                    <p className="text-3xl font-bold text-[#8B1111]">
                      ₹{selectedPrice}
                    </p>

                  </div>

                )}

              {/* =================================================
                  ADD TO CART + BUY NOW
              ================================================= */}

              <div className="flex flex-col sm:flex-row gap-3">

                {/* =================================================
                    ADD TO CART
                ================================================= */}

                <button
                  type="button"
                  disabled={
                    !selectedSize ||
                    selectedPrice === null ||
                    selectedPrice === undefined
                  }
                  onClick={handleAddToCart}
                  className="
                    flex
                    items-center
                    justify-center
                    gap-3
                    flex-1
                    bg-[#8B1111]
                    text-white
                    px-8
                    py-3.5
                    rounded-lg
                    font-medium
                    hover:bg-[#6F0D0D]
                    transition
                    disabled:bg-gray-400
                    disabled:cursor-not-allowed
                  "
                >

                  <ShoppingCart size={19} />

                  Add To Cart

                </button>

                {/* =================================================
                    BUY NOW
                ================================================= */}

                <button
                  type="button"
                  disabled={
                    !selectedSize ||
                    selectedPrice === null ||
                    selectedPrice === undefined
                  }
                  onClick={handleBuyNow}
                  className="
                    flex
                    items-center
                    justify-center
                    gap-3
                    flex-1
                    bg-[#C99A3B]
                    text-white
                    px-8
                    py-3.5
                    rounded-lg
                    font-medium
                    hover:bg-[#B08A2E]
                    transition
                    disabled:bg-gray-400
                    disabled:cursor-not-allowed
                  "
                >

                  Buy Now

                </button>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}