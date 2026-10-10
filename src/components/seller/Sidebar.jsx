"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SquarePlus,
  ListChecks,
  ClipboardCheck,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Add Product",
      path: "/seller",
      icon: SquarePlus,
    },
    {
      name: "Product List",
      path: "/seller/product-list",
      icon: ListChecks,
    },
    {
      name: "Orders",
      path: "/seller/orders",
      icon: ClipboardCheck,
    },
  ];

  return (
    <aside
      className="
        w-16
        sm:w-20
        md:w-64
        min-h-[calc(100vh-64px)]
        border-r
        border-[#E6D3A3]
        bg-[#FFF9ED]
        flex
        flex-col
        shadow-[4px_0_20px_rgba(123,22,22,0.04)]
      "
    >

      {/* MENU ITEMS */}

      <div className="flex flex-col pt-3">

        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              href={item.path}
              key={item.name}
              className="w-full"
            >

              <div
                className={`
                  relative
                  flex
                  items-center
                  justify-center
                  md:justify-start
                  gap-3
                  py-4
                  px-3
                  md:px-5
                  transition-all
                  duration-200
                  cursor-pointer

                  ${
                    isActive
                      ? `
                        bg-[#F5E9D3]
                        text-[#7B1616]
                        border-r-4
                        border-[#7B1616]
                      `
                      : `
                        text-[#350303]
                        hover:bg-[#F5E9D3]/60
                        hover:text-[#7B1616]
                      `
                  }
                `}
              >

                {/* GOLD ACTIVE INDICATOR */}

                {isActive && (
                  <span
                    className="
                      absolute
                      left-0
                      top-1/2
                      -translate-y-1/2
                      w-1
                      h-8
                      bg-[#C5A059]
                      rounded-r-full
                    "
                  />
                )}

                {/* ICON */}

                <Icon
                  size={22}
                  strokeWidth={1.8}
                  className="flex-shrink-0"
                />

                {/* MENU NAME */}

                <span
                  className="
                    hidden
                    md:block
                    text-sm
                    font-semibold
                    whitespace-nowrap
                  "
                >
                  {item.name}
                </span>

              </div>

            </Link>
          );
        })}

      </div>

    </aside>
  );
}