"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
      <section className="relative w-full min-h-[calc(100vh-96px)] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageSlider />
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/30 to-black/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="relative max-w-2xl bg-white/30 p-12 rounded-[2.5rem] border-4 border-[#E7C873] shadow-xl hover:bg-white/33">

            <h2 className="inline-block mb-4 text-white text-lg tracking-widest uppercase font-bold">
              Welcome to
            </h2>

            <h1 className="inline-block px-10 py-4 text-3xl sm:text-4xl md:text-6xl font-bold text-[#e4f778] leading-tight whitespace-nowrap rounded-[1.75rem] bg-[#330606] shadow-lg">
              DIRGHAYUSH
            </h1>

            <div className="w-120 h-[3px] bg-[#f8d304] my-6 rounded-full" />

            <h2 className="text-2xl md:text-3xl text-white tracking-wide font-bold">
              Pure Cold Pressed Oils
            </h2>

            <p className="mt-6 text-xl text-white leading-relaxed">
              100% शुद्ध लाकडी घाण्यावरचे तेल
            </p>

            <p className="mt-2 text-white text-lg tracking-wide">
              Healthy • Natural • Chemical-Free • Traditionally Made
            </p>

          </div>
        </div>

        {/* RIGHT CIRCLE IMAGE */} <div className="absolute top-1/2 right-6 -translate-y-1/2 hidden md:block mr-35"> 
        <div className="w-80 h-80 rounded-full overflow-hidden border-4 border-[#E7C873] shadow-xl bg-white/30"> 
        <img src="/images/logo6.png" alt="Cold Pressed Oil" className="w-full h-full object-cover" />
         </div> 
         </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section className="py-16" id="products">
        <div className="max-w-7xl mx-auto px-6 text-center bg-[#dbc2c2]/80 rounded-3xl py-12 border border-[#C5A059]">

          <h2 className="text-4xl font-bold text-[#7B1616]">
            Our Products
          </h2>

          <p className="mt-2 text-lg text-gray-700">
            100% Pure Cold Pressed Oils
          </p>

          {/* PRODUCTS GRID */}
          <div className="grid gap-8 mt-12 sm:grid-cols-2 lg:grid-cols-4">

            {visibleProducts.map((product) => (
              <div key={product.id} id={product.id}>
                <ProductCard
                  image={product.image}
                  title={product.title}
                />
              </div>
            ))}

          </div>

          {/* BUTTON */}
          <button
            onClick={() => setShowAll(!showAll)}
            className="mt-10 bg-[#7B1616] hover:bg-[#641212] text-white px-8 py-3 rounded-full transition"
          >
            {showAll ? "Show Less" : "View All Products"}
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 px-6 text-center bg-white/80 rounded-3xl py-10 border border-[#C5A059]">
          
          <div>
            <h3 className="text-xl font-bold text-[#7B1616]">100% Natural</h3>
            <p className="mt-2 text-gray-700 text-lg">No Artificial Processing</p>
            <p className="mt-2 text-gray-700 text-lg">High in Antioxidants</p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-[#7B1616]">
              Traditional Wooden Cold Pressing
            </h3>
            <p className="mt-2 text-gray-700 text-lg">Rich in Nutrients</p>
            <p className="mt-2 text-gray-700 text-lg">Healthy Fats</p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-[#7B1616]">No Chemicals</h3>
            <p className="mt-2 text-gray-700 text-lg">Pure & Preservative-Free</p>
            <p className="mt-2 text-gray-700 text-lg">Better for Cooking</p>
          </div>

        </div>
      </section>

    </div>
  );
}
