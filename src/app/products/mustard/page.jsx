"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function MustardOil() {
  const { addToCart } = useCart();

  const product = {
    id: "mustard",

    name: "Mustard Oil",

    description:
      "Cold pressed Mustard Oil is rich in healthy fats and essential nutrients, ideal for cooking, massage, and promoting overall wellness.",

    benefits: [
      "Rich in monounsaturated and polyunsaturated fats",
      "Supports heart health",
      "Boosts immunity",
      "Promotes healthy skin and hair",
      "Aids digestion and metabolism",
      "Ideal for cooking and massage",
    ],

    prices: [
      { size: "100 ml", price: 60 },
      { size: "200 ml", price: 110 },
      { size: "500 ml", price: 235 },
      { size: "1 Liter", price: 450 },
      { size: "2 Liter", price: 900 },
      { size: "5 Liter", price: 2200 },
    ],

    image: "/images/mustard.png",
  };

  const [selectedSize, setSelectedSize] = useState(product.prices[0]);

  return (
    <div className="min-h-screen bg-[#F5E9D3] py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-6 md:p-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">

          {/* Product Image */}
          <div className="relative w-full h-[380px] sm:h-[420px] md:h-[530px] lg:h-[560px] rounded-2xl overflow-hidden border border-[#E7C873] shadow-md">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-[#7B1616]">
              {product.name}
            </h1>

            <p className="mt-4 text-gray-600 text-sm md:text-base leading-relaxed">
              {product.description}
            </p>

            {/* Benefits */}
            <div className="mt-6">
              <h3 className="font-semibold text-lg text-[#7B1616]">
                Benefits
              </h3>

              <ul className="mt-2 space-y-1 text-gray-700 text-sm md:text-base">
                {product.benefits.map((benefit, index) => (
                  <li key={index}>✔ {benefit}</li>
                ))}
              </ul>
            </div>

            {/* Size Selection */}
            <div className="mt-6">
              <h3 className="font-semibold text-lg text-[#7B1616] mb-2">
                Select Size
              </h3>

              <div className="flex flex-wrap gap-3">
                {product.prices.map((item) => (
                  <button
                    key={item.size}
                    onClick={() => setSelectedSize(item)}
                    className={`px-4 py-2 rounded-full border transition text-sm md:text-base
                      ${
                        selectedSize.size === item.size
                          ? "bg-[#7B1616] text-white border-[#7B1616]"
                          : "border-gray-300 hover:border-[#7B1616]"
                      }
                    `}
                  >
                    {item.size}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="mt-5">
              <p className="text-xl md:text-2xl font-bold text-[#7B1616]">
                ₹{selectedSize.price}
              </p>
            </div>

            {/* Add To Cart */}
            <button
              onClick={() =>
                addToCart({
                  id: product.id,
                  name: product.name,
                  size: selectedSize.size,
                  price: selectedSize.price,
                  image: product.image,
                  quantity: 1,
                })
              }
              className="mt-6 bg-[#5f1616] text-white px-6 py-2 rounded-lg hover:bg-[#7B1616] transition"
            >
              Add To Cart
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
