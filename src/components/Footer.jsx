"use client";

import { Facebook, Instagram, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#5f1616] text-white mt-12">

      {/* MAIN FOOTER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 
      grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

        {/* LOGO & ABOUT */}
        <div className="text-center sm:text-left">
          <img
            src="/images/newlogo.jpeg"
            alt="Dirghayush Oils"
            className="w-16 h-16 mb-3 rounded-full mx-auto sm:mx-0"
          />

          <p className="text-sm text-gray-200 leading-relaxed">
            <b>Dirghayush Oils</b> provides traditional wooden cold-pressed oils
            prepared using Lakdi Ghani method.
          </p>
        </div>


        {/* ADDRESS */}
        <div>
          <h3 className="text-md font-semibold mb-3 text-[#F2C94C]">
            Address
          </h3>

          <div className="flex items-start gap-2 text-sm text-gray-200 mb-3">
            <MapPin size={16} />
            <span>
              <b>Shop 1 :</b> <br />
              Near SMS Hospital, Bus Stand Road <br />
              Chiplun, Maharashtra 415605
            </span>
          </div>

          <div className="flex items-start gap-2 text-sm text-gray-200">
            <MapPin size={16} />
            <span>
              <b>Shop 2 :</b> <br />
              Near HDFC Bank Kaviltali, Karad-Chiplun Road <br />
              Chiplun, Maharashtra 415605
            </span>
          </div>
        </div>


        {/* CONTACT */}
        <div>
          <h3 className="text-md font-semibold mb-3 text-[#F2C94C]">
            Contact Us
          </h3>

          <ul className="space-y-2 text-sm text-gray-200">
            <li className="flex items-center gap-2">
              <Phone size={16} />
              <b>+91 9860548492</b>
            </li>

            <li className="flex items-center gap-2 break-all">
              <Mail size={16} />
              Dirghayush.coldpressedoils@gmail.com
            </li>
          </ul>
        </div>


        {/* SOCIAL MEDIA */}
        <div className="text-center sm:text-left lg:text-right">
          <h3 className="text-md font-semibold mb-3 text-[#F2C94C]">
            Social Media
          </h3>

          <div className="flex flex-col gap-3 lg:items-end">
            <a
              href="#"
              className="flex items-center justify-center sm:justify-start lg:justify-end gap-2 hover:text-[#F2C94C] transition"
            >
              <Facebook size={20} />
              <span>Facebook</span>
            </a>

            <a
              href="#"
              className="flex items-center justify-center sm:justify-start lg:justify-end gap-2 hover:text-[#F2C94C] transition"
            >
              <Instagram size={20} />
              <span>Instagram</span>
            </a>
          </div>
        </div>
      </div>


      {/* BOTTOM BAR */}
      <div className="border-t border-[#7a2a2a] text-center text-xs py-3 text-gray-200 px-4">
        © {new Date().getFullYear()} Dirghayush Oils. All Rights Reserved.
      </div>

    </footer>
  );
}
