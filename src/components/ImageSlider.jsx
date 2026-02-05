"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const images = [
  "/images/hero/oil-1.png",
  "/images/hero/oil-2.png",
  "/images/hero/oil-3.png",
  "/images/hero/oil-4.png",
];

export default function ImageSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full">

      {images.map((img, i) => (
        <Image
          key={i}
          src={img}
          alt="Traditional Wooden Cold Pressed Oil"
          fill
          sizes="100vw"
          priority={i === 0}
          className={`object-cover transition-opacity duration-1000
          ${i === index ? "opacity-100" : "opacity-0"}`}
        />
      ))}

    </div>
  );
}
