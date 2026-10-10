"use client";

import React from "react";
import Navbar from "@/components/seller/Navbar";
import Sidebar from "@/components/seller/Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Seller Navbar */}
      <Navbar />

      {/* Sidebar + Main Content */}
      <div className="flex w-full">

        {/* Seller Sidebar */}
        <Sidebar />

        {/* Seller Page */}
        <main className="flex-1">
          {children}
        </main>

      </div>
    </div>
  );
};

export default Layout;