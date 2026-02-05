"use client";

import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="bg-[#ecd3bf] min-h-screen">

      {/* HERO SECTION */}
      <section className="bg-[#8d8d88] text-white py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          About Dirghayush Oils
        </h1>
        <p className="max-w-2xl mx-auto text-gray-200 text-lg">
          A journey of purity, tradition, and determination.
        </p>
      </section>

      {/* OUR JOURNEY */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-semibold text-[#5f1616] mb-6">
            Our Journey
          </h2>

          <p className="text-gray-700 leading-relaxed mb-4 text-lg">
            Dirghayush Cold Pressed Oils was born from determination, hard
            work, and a dream to live a healthier and self-reliant life.
          </p>

          <p className="text-gray-700 leading-relaxed text-lg">
            Our journey began when a husband and wife from a financially
            struggling background decided to start a small traditional oil
            extraction business using Lakdi Ghani method trusted by our
            ancestors.
          </p>
        </motion.div>

      </section>

      {/* WOMEN LED BUSINESS */}
      <section className="bg-[#fff3e8] py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-semibold text-[#5f1616] mb-6">
              Women Led Vision
            </h2>

            <p className="text-gray-700 leading-relaxed mb-4 text-lg">
              Dirghayush Oils proudly stands as a women-led business. The
              dedication and vision of our founder drives the entire operation.
            </p>

            <p className="text-gray-700 italic text-lg">
              “Healthy families begin with pure food.”
            </p>
          </motion.div>

        </div>
      </section>

      {/* OUR COMMITMENT */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">

        <h2 className="text-3xl font-semibold text-[#5f1616] mb-10">
          Our Commitment to Purity
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {[
            "100% Natural",
            "Chemical Free",
            "Traditional Lakdi Ghani Extraction",
            "Unrefined Oils",
            "Nutrient Rich",
            "Hygienically Packed",
          ].map((item, index) => (
            <motion.div
              key={index}
              className="bg-white shadow-md rounded-xl p-6"
              whileHover={{ scale: 1.05 }}
            >
              <p className="text-lg font-medium text-gray-700">{item}</p>
            </motion.div>
          ))}

        </div>
      </section>

      {/* SUPPORTING FARMERS */}
      <section className="bg-[#fff3e8] py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">

          <h2 className="text-3xl font-semibold text-[#5f1616] mb-6">
            Supporting Farmers & Tradition
          </h2>

          <p className="text-gray-700 leading-relaxed text-lg">
            We directly source seeds from trusted local farmers. This helps us
            maintain premium quality while supporting rural agriculture and
            sustainable farming practices.
          </p>

        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10">

        <div className="bg-white shadow-lg rounded-xl p-8">
          <h3 className="text-2xl font-semibold text-[#5f1616] mb-4">
            Our Mission
          </h3>

          <p className="text-gray-700 text-lg">
            To bring back the forgotten purity of traditional oils and make
            healthy cooking accessible to every household.
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-8">
          <h3 className="text-2xl font-semibold text-[#5f1616] mb-4">
            Our Vision
          </h3>

          <p className="text-gray-700 text-lg">
            To become a trusted brand that promotes natural living, supports
            women entrepreneurship, and preserves India’s traditional food
            heritage.
          </p>
        </div>

      </section>

      {/* CTA */}
      <section className="bg-[#8d8d88] text-white text-center py-6 px-6">
        <h2 className="text-3xl font-semibold mb-4">
          Experience The Purity Of Tradition
        </h2>

        <p className="text-gray-200 mb-6">
          Choose health. Choose Dirghayush Oils.
        </p>

        <button className="bg-[#F2C94C] text-[#5f1616] font-semibold px-6 py-3 rounded-full hover:bg-yellow-400 transition">
          Explore Products
        </button>
      </section>

    </div>
  );
}
