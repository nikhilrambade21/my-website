"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="h-16 w-full flex items-center justify-between px-4 sm:px-6 md:px-8 border-b border-gray-200 bg-white">

      {/* Logo */}
      <div
        onClick={() => router.push("/")}
        className="cursor-pointer flex items-center"
      >
        <Image
  src="/images/logo12.png"
  alt="Dirghayush Oils"
  width={160}
  height={60}
  className="w-[140px] sm:w-[155px] md:w-[160px] h-auto object-contain"
  priority
/>
      </div>

      {/* Logout */}
      <button
        type="button"
        className="
          bg-gray-600
          hover:bg-gray-700
          text-white
          px-5
          py-2
          sm:px-6
          rounded-full
          text-xs
          sm:text-sm
          transition-colors
        "
      >
        Logout
      </button>

    </nav>
  );
}