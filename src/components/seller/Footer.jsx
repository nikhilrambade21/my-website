"use client";

import React from "react";

const Footer = () => {
  return (
    <footer className="flex md:flex-row flex-col items-center justify-between w-full px-4 md:px-10 py-4 border-t border-gray-200 bg-white">

      {/* Copyright */}
      <div className="flex items-center gap-4">
        <div className="hidden md:block h-7 w-px bg-gray-300"></div>

        <p className="text-center text-xs md:text-sm text-gray-500">
          Copyright 2026 © Dirghayush Oils. All Rights Reserved.
        </p>
      </div>

      {/* Social Media */}
      <div className="flex items-center gap-4 mt-3 md:mt-0">
        <a
          href="#"
          className="text-sm text-gray-500 hover:text-orange-600 transition"
        >
          Facebook
        </a>

        <a
          href="#"
          className="text-sm text-gray-500 hover:text-orange-600 transition"
        >
          Instagram
        </a>

        <a
          href="#"
          className="text-sm text-gray-500 hover:text-orange-600 transition"
        >
          Twitter
        </a>
      </div>

    </footer>
  );
};

export default Footer;