"use client";

import { Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <div className="bg-[#fffaf5] min-h-screen">

      {/* HERO */}
      <section className="bg-[#8d8d88] text-white py-14 sm:py-16 px-4 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
          Contact Us
        </h1>
        <p className="text-gray-200 text-sm sm:text-lg">
          We are here to help you. Reach out anytime.
        </p>
      </section>

      {/* CONTACT SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

        {/* LEFT INFO */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-7 sm:space-y-9 bg-white shadow-lg rounded-2xl p-6 sm:p-10"
        >
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#5f1616] text-center">
            Get In Touch
          </h2>

          {/* PHONE */}
          <div className="flex items-start gap-3">
            <Phone className="text-[#5f1616] w-6 h-6" />
            <div>
              <p className="font-semibold">Call Us</p>
              <p className="text-gray-700 text-sm sm:text-base">
                +91 9860548492
              </p>
            </div>
          </div>

          {/* EMAIL */}
          <div className="flex items-start gap-3">
            <Mail className="text-[#5f1616] w-6 h-6" />
            <div>
              <p className="font-semibold">Email</p>
              <p className="text-gray-700 text-sm sm:text-base break-all">
                Dirghayush.coldpressedoils@gmail.com
              </p>
            </div>
          </div>

          {/* ADDRESS */}
          <div className="flex items-start gap-3">
            <MapPin className="text-[#5f1616] w-6 h-6" />
            <div className="text-sm sm:text-base">
              <p className="font-semibold">Shop 1</p>
              <p className="text-gray-700">
                Near SMS Hospital, Bus Stand Road <br />
                Chiplun, Maharashtra 415605
              </p>

              <p className="font-semibold mt-3">Shop 2</p>
              <p className="text-gray-700">
                Near HDFC Bank Kaviltali, Karad-Chiplun Road <br />
                Chiplun, Maharashtra 415605
              </p>
            </div>
          </div>

          {/* SOCIAL MEDIA */}
          <div className="text-center">
            <p className="font-semibold mb-3">Follow Us</p>

            <div className="flex justify-center gap-6">
              <a href="#" className="hover:text-[#5f1616] transition">
                <Facebook className="w-6 h-6" />
              </a>

              <a href="#" className="hover:text-[#5f1616] transition">
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* ---------------- COMMENTED CONTACT FORM ---------------- */}

        {/*
        <motion.div className="bg-white shadow-lg rounded-2xl p-8">
          <h3 className="text-2xl font-semibold text-[#5f1616] mb-6">
            Send Message
          </h3>

          <form className="space-y-4">
            <input type="text" placeholder="Your Name" />
            <input type="email" placeholder="Your Email" />
            <input type="tel" placeholder="Phone Number" />
            <textarea rows="4" placeholder="Your Message"></textarea>

            <button type="submit">
              Send Message
            </button>
          </form>
        </motion.div>
        */}

      </section>
    </div>
  );
}
