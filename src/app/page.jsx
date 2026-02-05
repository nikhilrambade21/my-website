"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import ImageSlider from "@/components/ImageSlider";

export default function Hero() {
  const [showAll, setShowAll] = useState(false);

  const products = [
    { id: "groundnut", image: "/images/groundnut.jpeg", title: "Groundnut Oil" },
    { id: "sunflower", image: "/images/sunflower.jpeg", title: "Sunflower Oil" },
    { id: "coconut", image: "/images/coconut.jpeg", title: "Coconut Oil" },
    { id: "safflower", image: "/images/safflower.png", title: "Safflower Oil" },
    { id: "mustard", image: "/images/mustard.png", title: "Mustard Oil" },
    { id: "sesame", image: "/images/sesame.png", title: "White Sesame Oil" },
    { id: "niger", image: "/images/niger.png", title: "Niger Oil" },
    { id: "flaxseed", image: "/images/flaxseed.png", title: "Flaxseed Oil" },
    { id: "almond", image: "/images/almond.png", title: "Almond Oil" },
  ];

  const visibleProducts = showAll ? products : products.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#F5E9D3]">

      {/* HERO SECTION */}
      <section className="relative w-full min-h-[100svh] md:min-h-[calc(100vh-96px)]">

        {/* Background Slider */}
        <div className="absolute inset-0">
          <ImageSlider />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">

          <div className="relative max-w-xl bg-black/60 backdrop-blur-sm 
          p-6 sm:p-8 md:p-12 rounded-3xl border-2 md:border-4 border-[#E7C873] shadow-xl">

            <h2 className="mb-3 text-white text-sm sm:text-base tracking-widest uppercase font-bold">
              Welcome to
            </h2>

            <h1 className="inline-block px-6 sm:px-8 py-2 sm:py-3 
            text-2xl sm:text-4xl md:text-6xl font-bold text-[#e4f778] 
            rounded-2xl bg-[#330606] shadow-lg">
              DIRGHAYUSH
            </h1>

            <div className="w-full h-[3px] bg-[#f8d304] my-4 rounded-full" />

            <h2 className="text-lg sm:text-xl md:text-3xl text-white font-bold">
              Pure Cold Pressed Oils
            </h2>

            <p className="mt-4 text-base sm:text-lg text-white">
              100% शुद्ध लाकडी घाण्यावरचे तेल
            </p>

            <p className="mt-1 text-sm sm:text-base text-white">
              Healthy • Natural • Chemical-Free • Traditionally Made
            </p>

          </div>
        </div>

        {/* Right Circle Logo */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 
        hidden lg:block">

          <div className="w-56 h-56 xl:w-72 xl:h-72 rounded-full overflow-hidden 
          border-4 border-[#E7C873] shadow-xl bg-white/30">

            <img
              src="/images/logo6.png"
              alt="Cold Pressed Oil"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </section>

      {/* PRODUCTS SECTION */}
      <section className="py-12 sm:py-16" id="products">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center 
        bg-[#dbc2c2]/80 rounded-3xl py-10 sm:py-12 border border-[#C5A059]">

          <h2 className="text-2xl sm:text-4xl font-bold text-[#7B1616]">
            Our Products
          </h2>

          <p className="mt-2 text-sm sm:text-lg text-gray-700">
            100% Pure Cold Pressed Oils
          </p>

          {/* Products Grid */}
          <div className="grid gap-6 sm:gap-8 mt-10 
          grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">

            {visibleProducts.map((product) => (
              <div key={product.id} id={product.id}>
                <ProductCard
                  image={product.image}
                  title={product.title}
                />
              </div>
            ))}

          </div>

          {/* Button */}
          <button
            onClick={() => setShowAll(!showAll)}
            className="mt-10 bg-[#7B1616] hover:bg-[#641212] 
            text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full transition"
          >
            {showAll ? "Show Less" : "View All Products"}
          </button>

        </div>
      </section>

      {/* FEATURES */}
      <section className="py-12 sm:py-16">

        <div className="max-w-6xl mx-auto 
        grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 
        gap-8 px-4 sm:px-6 text-center 
        bg-white/80 rounded-3xl py-10 border border-[#C5A059]">

          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#7B1616]">
              100% Natural
            </h3>
            <p className="mt-2 text-gray-700">No Artificial Processing</p>
            <p className="mt-1 text-gray-700">High in Antioxidants</p>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#7B1616]">
              Traditional Wooden Cold Pressing
            </h3>
            <p className="mt-2 text-gray-700">Rich in Nutrients</p>
            <p className="mt-1 text-gray-700">Healthy Fats</p>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#7B1616]">
              No Chemicals
            </h3>
            <p className="mt-2 text-gray-700">Pure & Preservative-Free</p>
            <p className="mt-1 text-gray-700">Better for Cooking</p>
          </div>

        </div>
      </section>

    </div>
  );
}
