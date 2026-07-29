"use client";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";

/* ================================================================== */
/* FONTS — add these once in your root layout (app/layout.tsx), e.g.  */
/*                                                                     */
/*   import { Fraunces, Work_Sans, JetBrains_Mono } from "next/font/google"; */
/*   const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-display", weight: ["500","600","700","900"] }); */
/*   const workSans = Work_Sans({ subsets: ["latin"], variable: "--font-body" }); */
/*   const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" }); */
/*   <body className={`${fraunces.variable} ${workSans.variable} ${mono.variable}`}> */
/*                                                                     */
/* Until then this file falls back to serif/sans-serif/monospace.     */
/* ================================================================== */

/* ================================================================== */
/* Signature: the ghani wheel.                                         */
/* This is not a decorative heritage stamp — it is a top-down drawing  */
/* of the actual wooden cold-press: a mortar at the centre, a beam     */
/* that sweeps the circular track a bullock or hand-crank walks, and   */
/* uneven wood-grain rings instead of a perfect circle. It's the one   */
/* recurring device on the page — large and turning in the hero, small */
/* and still as a divider between sections.                            */
/* ================================================================== */
function GhaniWheel({ size = 320, spinning = true }) {
  const cx = 160;
  const cy = 160;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const grainRings = [
    { r: 128, dash: "2 3", opacity: 0.35 },
    { r: 112, dash: "0", opacity: 0.5 },
    { r: 94, dash: "6 4", opacity: 0.3 },
    { r: 76, dash: "0", opacity: 0.45 },
    { r: 58, dash: "3 5", opacity: 0.3 },
  ];

  const seeds = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => {
      const angle = (i / 10) * Math.PI * 2;
      const radius = 118;

      return {
        x: +(cx + radius * Math.cos(angle)).toFixed(2),
        y: +(cy + radius * Math.sin(angle)).toFixed(2),
        delay: i * 0.15,
      };
    });
  }, []);

  return (
    <svg
      viewBox="0 0 320 320"
      width={size}
      height={size}
      aria-hidden="true"
    >
      {/* Outer Rings */}

      <circle
        cx={cx}
        cy={cy}
        r={134}
        fill="none"
        stroke="#C99A3B"
        strokeWidth="2.5"
      />

      <circle
        cx={cx}
        cy={cy}
        r={140}
        fill="none"
        stroke="#C99A3B"
        strokeWidth="1"
        opacity="0.4"
      />

      {/* Grain */}

      {grainRings.map((ring, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={ring.r}
          fill="none"
          stroke="#5A1A1F"
          strokeWidth="1"
          strokeDasharray={ring.dash}
          opacity={ring.opacity}
        />
      ))}

      {/* Walking Track */}

      <circle
        cx={cx}
        cy={cy}
        r={118}
        fill="none"
        stroke="#D98527"
        strokeWidth="1"
        strokeDasharray="1 6"
        opacity="0.55"
      />

      {/* Animated Seeds */}

      {seeds.map((seed, i) =>
        mounted ? (
          <motion.circle
            key={i}
            cx={seed.x}
            cy={seed.y}
            r={2.6}
            fill="#D98527"
            initial={{ x: 0, y: 0, opacity: 0.9 }}
            animate={
              spinning
                ? {
                    x: cx - seed.x,
                    y: cy - seed.y,
                    opacity: [0.9, 0],
                  }
                : {}
            }
            transition={{
              duration: 3.2,
              delay: seed.delay,
              repeat: Infinity,
              ease: "easeIn",
            }}
          />
        ) : (
          <circle
            key={i}
            cx={seed.x}
            cy={seed.y}
            r={2.6}
            fill="#D98527"
            opacity="0.9"
          />
        )
      )}

      {/* Center */}

      <circle cx={cx} cy={cy} r={20} fill="#5A1A1F" />

      <circle
        cx={cx}
        cy={cy}
        r={20}
        fill="none"
        stroke="#C99A3B"
        strokeWidth="1.5"
      />

      <circle
        cx={cx}
        cy={cy}
        r={7}
        fill="#241C14"
      />

      {/* Rotating Beam */}

      {mounted ? (
        <motion.g
          style={{
            transformOrigin: `${cx}px ${cy}px`,
          }}
          animate={
            spinning
              ? {
                  rotate: 360,
                }
              : {}
          }
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <rect
            x={cx - 3}
            y={cy - 132}
            width="6"
            height="122"
            rx="3"
            fill="#241C14"
          />

          <circle
            cx={cx}
            cy={cy - 132}
            r="7"
            fill="#C99A3B"
          />
        </motion.g>
      ) : (
        <g>
          <rect
            x={cx - 3}
            y={cy - 132}
            width="6"
            height="122"
            rx="3"
            fill="#241C14"
          />

          <circle
            cx={cx}
            cy={cy - 132}
            r="7"
            fill="#C99A3B"
          />
        </g>
      )}
    </svg>
  );
}
/* Small still version used as a section divider mark */
function GhaniMark({ className = "" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="27" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="32" cy="32" r="19" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <circle cx="32" cy="32" r="6" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <line x1="32" y1="6" x2="32" y2="26" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/* Tiny line icons for the process strip — kept in the same hand-drawn register */
function ProcessIcon({ kind }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" };
  if (kind === "seed") {
    return (
      <svg viewBox="0 0 40 40" width="34" height="34" {...common}>
        <path d="M20 8 C28 8 32 16 32 22 C32 30 26 33 20 33 C14 33 8 30 8 22 C8 16 12 8 20 8 Z" />
        <path d="M20 8 C20 16 20 26 20 33" />
      </svg>
    );
  }
  if (kind === "crush") {
    return (
      <svg viewBox="0 0 40 40" width="34" height="34" {...common}>
        <circle cx="20" cy="24" r="12" />
        <line x1="20" y1="24" x2="20" y2="4" />
        <circle cx="20" cy="4" r="2.4" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (kind === "press") {
    return (
      <svg viewBox="0 0 40 40" width="34" height="34" {...common}>
        <path d="M11 14 C11 24 15 32 20 34 C25 32 29 24 29 14" />
        <path d="M20 22 L20 34" />
        <ellipse cx="20" cy="14" rx="9" ry="4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 40 40" width="34" height="34" {...common}>
      <path d="M17 6 h6 v5 l3 4 v17 a2 2 0 0 1 -2 2 h-8 a2 2 0 0 1 -2 -2 v-17 l3 -4 z" />
      <line x1="15" y1="20" x2="25" y2="20" />
    </svg>
  );
}

export default function Hero() {
  const [showAll, setShowAll] = useState(false);

  const products = [
    { id: "groundnut", image: "/images/groundnut.jpeg", title: "Groundnut Oil", note: "Wood-pressed, unrefined" },
    { id: "sunflower", image: "/images/sunflower.jpeg", title: "Sunflower Oil", note: "Light, single origin" },
    { id: "coconut", image: "/images/coconut.jpeg", title: "Coconut Oil", note: "Cold extracted" },
    { id: "safflower", image: "/images/safflower.png", title: "Safflower Oil", note: "Heart-friendly press" },
    { id: "mustard", image: "/images/mustard.png", title: "Mustard Oil", note: "Sharp, traditional" },
    { id: "sesame", image: "/images/sesame.png", title: "White Sesame Oil", note: "Slow ground, nutty" },
    { id: "niger", image: "/images/niger.png", title: "Niger Oil", note: "Rare, small batch" },
    { id: "flaxseed", image: "/images/flaxseed.png", title: "Flaxseed Oil", note: "Omega rich" },
    { id: "almond", image: "/images/almond.png", title: "Almond Oil", note: "Fine, aromatic" },
  ];

  const visibleProducts = showAll ? products : products.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#F6EFDF] font-[family-name:var(--font-body),'Work_Sans',sans-serif]">
      {/* ================= HERO ================= */}
      <section className="relative w-full min-h-[100svh] md:min-h-[calc(100vh-96px)] overflow-hidden">
        {/* faint watermark wordmark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="whitespace-nowrap font-[family-name:var(--font-display),'Fraunces',serif] text-[22vw] md:text-[15vw] font-black text-[#5A1A1F]/[0.045] tracking-tight">
            DIRGHAYUSH
          </span>
        </div>

        {/* thin card-edge frame */}
        <div className="absolute inset-4 sm:inset-6 border border-[#C99A3B]/50 rounded-[1.5rem] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 w-full h-full min-h-[100svh] md:min-h-[calc(100vh-96px)] grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] items-center gap-10 py-16">
          {/* Left: text block */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#C99A3B]" />
              <h2 className="text-[#B08A2E] text-xs sm:text-sm tracking-[0.3em] uppercase font-semibold font-[family-name:var(--font-mono),monospace]">
                Welcome to
              </h2>
            </div>

            <h1 className="mt-4 text-5xl sm:text-6xl md:text-8xl font-black text-[#5A1A1F] font-[family-name:var(--font-display),'Fraunces',serif] leading-[0.95] tracking-tight">
              Dirghayush
            </h1>

            <h2 className="mt-5 text-xl sm:text-2xl md:text-3xl text-[#241C14] font-semibold font-[family-name:var(--font-display),'Fraunces',serif]">
              Pressed slow. Pressed cold. Pressed whole.
            </h2>

            <p className="mt-6 text-lg sm:text-xl text-[#5A1A1F] font-[family-name:var(--font-display),'Fraunces',serif] italic max-w-md">
              १००% शुद्ध लाकडी घाण्यावरचे तेल
            </p>

            <p className="mt-4 text-sm sm:text-base text-[#241C14]/60 tracking-wide max-w-md font-[family-name:var(--font-mono),monospace]">
              No heat. No solvents. No shortcuts — the same wooden press for generations.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#products"
                className="bg-[#5A1A1F] hover:bg-[#241C14] text-[#F6EFDF] font-semibold px-8 py-3.5 rounded-full transition-colors duration-300"
              >
                Explore the catalog
              </a>
              <a
                href="#process"
                className="text-[#5A1A1F] font-semibold px-2 py-3.5 border-b-2 border-[#C99A3B] hover:border-[#5A1A1F] transition-colors duration-300"
              >
                How it's pressed
              </a>
            </div>
          </motion.div>

          {/* Right: the ghani wheel, turning */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative mx-auto flex items-center justify-center"
          >
            <GhaniWheel size={320} />
            <div className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-[#5A1A1F]/20 shadow-xl bg-[#F6EFDF]">
              <img src="/images/logo6.png" alt="Dirghayush" className="w-full h-full object-cover" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="flex justify-center py-2 text-[#C99A3B]">
        <GhaniMark className="w-8 h-8" />
      </div>

      {/* ================= PROCESS — a real sequence, so numbering earns its place ================= */}
      <section className="py-14 sm:py-20" id="process">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <span className="text-xs sm:text-sm tracking-[0.3em] uppercase text-[#B08A2E] font-semibold font-[family-name:var(--font-mono),monospace]">
              The Press
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-black text-[#5A1A1F] font-[family-name:var(--font-display),'Fraunces',serif]">
              From seed to bottle
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-4 relative">
            {/* connecting line, sits behind icons on larger screens */}
            <div className="hidden sm:block absolute top-[17px] left-[12.5%] right-[12.5%] h-px bg-[#C99A3B]/50" />
            {[
              { kind: "seed", title: "Select the seed", desc: "Hand-sorted, whole and unbroken." },
              { kind: "crush", title: "Stone crush", desc: "Slow rotation keeps the oil below body heat." },
              { kind: "press", title: "Cold press", desc: "No solvents, no added heat, ever." },
              { kind: "bottle", title: "Filter & bottle", desc: "Settled, filtered, sealed the same day." },
            ].map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative text-center"
              >
                <div className="mx-auto w-9 h-9 rounded-full bg-[#F6EFDF] border border-[#C99A3B] flex items-center justify-center text-[#5A1A1F]">
                  <ProcessIcon kind={step.kind} />
                </div>
                <p className="mt-2 text-[10px] tracking-[0.2em] uppercase text-[#B08A2E] font-[family-name:var(--font-mono),monospace]">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-1 text-sm sm:text-base font-bold text-[#241C14] font-[family-name:var(--font-display),'Fraunces',serif]">
                  {step.title}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-[#241C14]/60 max-w-[16ch] mx-auto">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PRODUCTS — catalog / ledger style ================= */}
      <section className="py-12 sm:py-16" id="products">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <span className="text-xs sm:text-sm tracking-[0.3em] uppercase text-[#B08A2E] font-semibold font-[family-name:var(--font-mono),monospace]">
              The Catalog
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-black text-[#5A1A1F] font-[family-name:var(--font-display),'Fraunces',serif]">
              Our Oils
            </h2>
            <p className="mt-2 text-sm sm:text-lg text-[#241C14]/60">Every batch pressed to order, never stockpiled.</p>
          </div>

          <div className="grid gap-6 sm:gap-8 mt-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {visibleProducts.map((product, i) => (
              <motion.div
                key={product.id}
                id={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: (i % 4) * 0.08 }}
                className="relative"
              >
                <div className="rounded-2xl border border-[#C99A3B]/40 bg-white/70 p-2 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <ProductCard id={product.id} image={product.image} title={product.title} />
                  <p className="mt-1 mb-1 text-center text-[11px] tracking-wide text-[#5A1A1F]/70 font-[family-name:var(--font-mono),monospace]">
                    {product.note}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="mt-12 bg-transparent hover:bg-[#5A1A1F] text-[#5A1A1F] hover:text-[#F6EFDF] font-semibold px-8 sm:px-10 py-3 rounded-full transition-all duration-300 border-2 border-[#5A1A1F]"
            >
              {showAll ? "Show Less" : "View All Products"}
            </button>
          </div>
        </div>
      </section>

      {/* ================= FEATURES — inverted band ================= */}
      <section className="py-16 sm:py-20 bg-[#5A1A1F] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]">
          <svg className="w-full h-full">
            <filter id="grain2">
              <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" />
            </filter>
            <rect width="100%" height="100%" filter="url(#grain2)" />
          </svg>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs sm:text-sm tracking-[0.3em] uppercase text-[#D98527] font-semibold font-[family-name:var(--font-mono),monospace]">
              Why It's Different
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#C99A3B]/20">
            {[
              { title: "No heat, ever", lines: ["Friction stays under 40°C", "Nutrients survive the press"] },
              { title: "One wooden ghani", lines: ["Same rotation speed as 1950", "No steel roller, no shortcuts"] },
              { title: "Nothing added", lines: ["No preservatives, no blending", "Just the seed and the press"] },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.12 }}
                className="text-center px-6 py-8 sm:py-2"
              >
                <h3 className="text-lg sm:text-xl font-bold text-[#D98527] font-[family-name:var(--font-display),'Fraunces',serif]">
                  {f.title}
                </h3>
                {f.lines.map((line) => (
                  <p key={line} className="mt-2 text-[#F6EFDF]/70 text-sm sm:text-base">
                    {line}
                  </p>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}