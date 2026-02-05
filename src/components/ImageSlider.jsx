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
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <Image
        src={images[index]}
        alt="Traditional Wooden Cold Pressed Oil"
        fill
        sizes="100vw"
        className="object-cover transition-opacity duration-700 ease-in-out"
        priority={index === 0}
      />
    </div>
  );
}
