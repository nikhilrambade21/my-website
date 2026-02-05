"use client";

import { useRouter } from "next/navigation";

export default function ProductCard({ image, title, id }) {
  const router = useRouter();

  return (
    <div className="bg-[rgb(253,252,252)] border-2 border-[rgb(231,200,115)] 
                    rounded-2xl shadow-md p-6 hover:border-4 
                    hover:shadow-2xl transition">

      {/* IMAGE */}
      <img
        src={image}
        alt={title}
        className="mx-auto h-55 w-40 rounded-lg border-2 
                   border-[rgb(236,145,109)] 
                   hover:h-56 hover:w-41 transition"
      />

      {/* TITLE */}
      <h3 className="mt-4 text-lg font-bold text-[#4A3A1B]">
        {title}
      </h3>

      {/* BUTTONS */}
      <div className="mt-4 flex flex-col gap-2">

        {/* VIEW PRODUCT */}
        <button
          onClick={() => router.push(`/products#${id}`)}
          className="border border-[#6B8E23] text-[#6B8E23]
                     hover:bg-[#6B8E23] hover:text-white
                     px-5 py-2 rounded-full transition"
        >
          View Product
        </button>

        {/* ADD TO CART */}
        <button
          className="bg-[#6B8E23] hover:bg-[#5a781d] 
                     text-white px-5 py-2 rounded-full transition"
        >
          Add to Cart
        </button>

      </div>
    </div>
  );
}
