"use client";

import { useRouter } from "next/navigation";

export default function ProductCard({
  id,
  image,
  name,
}) {
  const router = useRouter();

  const handleViewProduct = () => {
    if (!id) {
      console.error("Product ID is missing");
      return;
    }

    router.push(`/products/${id}`);
  };

  return (
    <div
      className="
        bg-[#FDFCF8]
        border-2
        border-[#C99A3B]/50
        rounded-2xl
        p-4
        shadow-sm
        hover:shadow-xl
        hover:-translate-y-1
        transition-all
        duration-300
      "
    >
      {/* =====================================================
          PRODUCT IMAGE
      ===================================================== */}

      <div
        className="
          w-full
          h-64
          rounded-xl
          overflow-hidden
          bg-[#F6EFDF]
          border
          border-[#C99A3B]/30
        "
      >
        {image ? (
          <img
            src={image}
            alt={name || "Product"}
            className="
              w-full
              h-full
              object-contain
              transition-transform
              duration-500
              hover:scale-105
            "
          />
        ) : (
          <div
            className="
              w-full
              h-full
              flex
              items-center
              justify-center
              text-[#5A1A1F]/50
            "
          >
            No image
          </div>
        )}
      </div>

      {/* =====================================================
          PRODUCT NAME
      ===================================================== */}

      <h3
        className="
          mt-4
          text-lg
          font-bold
          text-[#5A1A1F]
          text-center
          font-[family-name:var(--font-display),'Fraunces',serif]
        "
      >
        {name || "Product"}
      </h3>

      {/* =====================================================
          VIEW PRODUCT BUTTON
      ===================================================== */}

      <button
        type="button"
        onClick={handleViewProduct}
        className="
          mt-5
          w-full
          px-5
          py-3
          rounded-full
          border-2
          border-[#5A1A1F]
          text-[#5A1A1F]
          font-semibold
          hover:bg-[#5A1A1F]
          hover:text-[#F6EFDF]
          transition-all
          duration-300
        "
      >
        View Product
      </button>
    </div>
  );
}