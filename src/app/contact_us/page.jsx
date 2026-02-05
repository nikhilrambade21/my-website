"use client";

import { Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <div className="bg-[#fffaf5] min-h-screen">

      {/* HERO */}
      <section className="bg-[#5f1616] text-white py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Contact Us
        </h1>
        <p className="text-gray-200 text-lg">
          We are here to help you. Reach out anytime.
        </p>
      </section>

      {/* CONTACT SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">

        {/* LEFT INFO */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-8"
        >
          <h2 className="text-3xl font-semibold text-[#5f1616]">
            Get In Touch
          </h2>

          {/* PHONE */}
          <div className="flex items-start gap-3">
            <Phone className="text-[#5f1616]" />
            <div>
              <p className="font-semibold">Call Us</p>
              <p className="text-gray-700">+91 9860548492</p>
            </div>
          </div>

          {/* EMAIL */}
          <div className="flex items-start gap-3">
            <Mail className="text-[#5f1616]" />
            <div>
              <p className="font-semibold">Email</p>
              <p className="text-gray-700">
                Dirghayush.coldpressedoils@gmail.com
              </p>
            </div>
          </div>

          {/* ADDRESS */}
          <div className="flex items-start gap-3">
            <MapPin className="text-[#5f1616]" />
            <div>
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
          <div>
            <p className="font-semibold mb-3">Follow Us</p>

            <div className="flex gap-4">
              <a href="#" className="hover:text-[#5f1616] transition">
                <Facebook />
              </a>

              <a href="#" className="hover:text-[#5f1616] transition">
                <Instagram />
              </a>
            </div>
          </div>
        </motion.div>


        {/* RIGHT FORM */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-white shadow-lg rounded-2xl p-8"
        >
          <h3 className="text-2xl font-semibold text-[#5f1616] mb-6">
            Send Message
          </h3>

          <form className="space-y-4">

            <input
              type="text"
              placeholder="Your Name"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5f1616]"
            />

            <input
              type="email"
              placeholder="Your Email"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5f1616]"
            />

            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5f1616]"
            />

            <textarea
              rows="4"
              placeholder="Your Message"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5f1616]"
            ></textarea>

            <button
              type="submit"
              className="w-full bg-[#5f1616] text-white py-3 rounded-lg font-semibold hover:bg-[#7a2020] transition"
            >
              Send Message
            </button>

          </form>
        </motion.div>

      </section>

    </div>
  );
}
