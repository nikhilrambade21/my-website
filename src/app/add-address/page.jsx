"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";

import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  MapPinned,
  Home,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

import toast from "react-hot-toast";

export default function AddAddressPage() {
  const router = useRouter();
  const { getToken } = useAuth();

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    pincode: "",
    address: "",
    city: "",
    state: "",
  });

  const [isSaving, setIsSaving] = useState(false);

  /* ==================================================
     INPUT CHANGE
  ================================================== */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setAddress((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* ==================================================
     SAVE ADDRESS
  ================================================== */

  const handleSaveAddress = async () => {
    /* ==================================================
       NAME VALIDATION
    ================================================== */

    if (!address.name.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    /* ==================================================
       PHONE VALIDATION
    ================================================== */

    const phone = address.phone.replace(/\D/g, "");

    if (!phone) {
      toast.error("Please enter your phone number");
      return;
    }

    if (phone.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    /* ==================================================
       PINCODE VALIDATION
    ================================================== */

    const pincode = address.pincode.replace(/\D/g, "");

    if (!pincode) {
      toast.error("Please enter your pincode");
      return;
    }

    if (pincode.length !== 6) {
      toast.error("Please enter a valid 6-digit pincode");
      return;
    }

    /* ==================================================
       ADDRESS VALIDATION
    ================================================== */

    if (!address.address.trim()) {
      toast.error("Please enter your address");
      return;
    }

    /* ==================================================
       CITY VALIDATION
    ================================================== */

    if (!address.city.trim()) {
      toast.error("Please enter your city");
      return;
    }

    /* ==================================================
       STATE VALIDATION
    ================================================== */

    if (!address.state.trim()) {
      toast.error("Please enter your state");
      return;
    }

    /* ==================================================
       CREATE ADDRESS OBJECT
    ================================================== */

    const newAddress = {
      id: Date.now().toString(),
      name: address.name.trim(),
      phone: phone,
      pincode: pincode,
      address: address.address.trim(),
      city: address.city.trim(),
      state: address.state.trim(),
    };

    try {
      setIsSaving(true);

      /* ==================================================
         GET CLERK TOKEN
      ================================================== */

      const token = await getToken();

      if (!token) {
        toast.error("Please login to save your address");
        return;
      }

      /* ==================================================
         API CALL
         POST /api/user/add-address
      ================================================== */

      const { data } = await axios.post(
        "/api/user/add-address",
        {
          address: newAddress,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      /* ==================================================
         API RESPONSE
      ================================================== */

      if (data.success) {
        toast.success(data.message || "Address saved successfully");

        /* ----------------------------------------------
           Save selected address locally
        ---------------------------------------------- */

        localStorage.setItem(
          "dirghayush_selected_address",
          JSON.stringify(newAddress)
        );

        /* ----------------------------------------------
           Redirect to cart
        ---------------------------------------------- */

        router.push("/cart");
      } else {
        toast.error(data.message || "Unable to save address");
      }
    } catch (error) {
      console.error("Add address error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Something went wrong while saving address"
      );
    } finally {
      setIsSaving(false);
    }
  };

  /* ==================================================
     INPUT CLASS
  ================================================== */

  const inputClass = `
    w-full
    h-12
    rounded-xl
    border
    border-[#E5D8C4]
    bg-[#FFFDF9]
    px-4
    text-[14px]
    text-[#3E2723]
    placeholder:text-[#A59A8C]
    outline-none
    transition-all
    duration-200
    focus:border-[#7B1616]
    focus:ring-4
    focus:ring-[#7B1616]/10
    hover:border-[#C5A059]
  `;

  return (
    <main className="min-h-screen bg-[#F8F3EA]">

      {/* ==================================================
          TOP HEADER
      ================================================== */}

      <div className="border-b border-[#E8DDCE] bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4">

          <button
            type="button"
            onClick={() => router.back()}
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-medium
              text-[#6D6258]
              hover:text-[#7B1616]
              transition
            "
          >
            <ArrowLeft size={18} />

            Back to Cart
          </button>

        </div>
      </div>

      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-8 sm:py-12">

        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-[1fr_0.9fr]
            gap-8
            lg:gap-14
            items-center
          "
        >

          {/* ==================================================
              LEFT SIDE
          ================================================== */}

          <div>

            {/* SMALL LABEL */}

            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-[#7B1616]/10
                px-4
                py-2
                mb-5
              "
            >
              <MapPinned
                size={16}
                className="text-[#7B1616]"
              />

              <span
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.15em]
                  text-[#7B1616]
                "
              >
                Delivery Details
              </span>
            </div>

            {/* TITLE */}

            <h1
              className="
                text-3xl
                sm:text-4xl
                lg:text-5xl
                leading-tight
                font-semibold
                text-[#3E2723]
              "
            >
              Where should we
              <br />

              <span className="text-[#7B1616]">
                deliver your order?
              </span>
            </h1>

            <p
              className="
                mt-4
                max-w-xl
                text-sm
                sm:text-base
                leading-7
                text-[#776B60]
              "
            >
              Enter your delivery details below and we’ll
              make sure your pure, wood-pressed oils reach
              you safely and fresh.
            </p>

            {/* ==================================================
                FORM CARD
            ================================================== */}

            <div
              className="
                mt-8
                max-w-[620px]
                rounded-3xl
                border
                border-[#E8DDCE]
                bg-white
                p-5
                sm:p-7
                shadow-[0_15px_50px_rgba(82,47,27,0.08)]
              "
            >

              {/* CARD HEADER */}

              <div
                className="
                  flex
                  items-center
                  gap-3
                  pb-5
                  mb-5
                  border-b
                  border-[#EFE6DA]
                "
              >

                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#7B1616]/10
                    text-[#7B1616]
                  "
                >
                  <Home size={21} />
                </div>

                <div>
                  <h2
                    className="
                      text-base
                      font-semibold
                      text-[#3E2723]
                    "
                  >
                    Shipping Address
                  </h2>

                  <p
                    className="
                      text-xs
                      text-[#94887A]
                      mt-0.5
                    "
                  >
                    Please enter your complete address
                  </p>
                </div>

              </div>

              {/* ==================================================
                  FORM
              ================================================== */}

              <div className="space-y-4">

                {/* NAME */}

                <div>
                  <label
                    className="
                      block
                      mb-1.5
                      text-xs
                      font-semibold
                      text-[#55483F]
                    "
                  >
                    Full Name
                  </label>

                  <div className="relative">

                    <User
                      size={18}
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-[#9B8E80]
                      "
                    />

                    <input
                      type="text"
                      name="name"
                      value={address.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className={`${inputClass} pl-11`}
                    />

                  </div>
                </div>

                {/* PHONE + PINCODE */}

                <div
                  className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    gap-4
                  "
                >

                  {/* PHONE */}

                  <div>
                    <label
                      className="
                        block
                        mb-1.5
                        text-xs
                        font-semibold
                        text-[#55483F]
                      "
                    >
                      Mobile Number
                    </label>

                    <div className="relative">

                      <Phone
                        size={18}
                        className="
                          absolute
                          left-4
                          top-1/2
                          -translate-y-1/2
                          text-[#9B8E80]
                        "
                      />

                      <input
                        type="tel"
                        name="phone"
                        value={address.phone}
                        onChange={handleChange}
                        placeholder="10-digit number"
                        maxLength={10}
                        inputMode="numeric"
                        className={`${inputClass} pl-11`}
                      />

                    </div>
                  </div>

                  {/* PINCODE */}

                  <div>
                    <label
                      className="
                        block
                        mb-1.5
                        text-xs
                        font-semibold
                        text-[#55483F]
                      "
                    >
                      Pincode
                    </label>

                    <div className="relative">

                      <MapPin
                        size={18}
                        className="
                          absolute
                          left-4
                          top-1/2
                          -translate-y-1/2
                          text-[#9B8E80]
                        "
                      />

                      <input
                        type="text"
                        name="pincode"
                        value={address.pincode}
                        onChange={handleChange}
                        placeholder="6-digit pincode"
                        maxLength={6}
                        inputMode="numeric"
                        className={`${inputClass} pl-11`}
                      />

                    </div>
                  </div>

                </div>

                {/* ADDRESS */}

                <div>

                  <label
                    className="
                      block
                      mb-1.5
                      text-xs
                      font-semibold
                      text-[#55483F]
                    "
                  >
                    Address
                  </label>

                  <div className="relative">

                    <MapPin
                      size={18}
                      className="
                        absolute
                        left-4
                        top-4
                        text-[#9B8E80]
                      "
                    />

                    <textarea
                      name="address"
                      value={address.address}
                      onChange={handleChange}
                      placeholder="House No., Building, Area, Street..."
                      rows={3}
                      className="
                        w-full
                        rounded-xl
                        border
                        border-[#E5D8C4]
                        bg-[#FFFDF9]
                        px-4
                        py-3.5
                        pl-11
                        text-[14px]
                        text-[#3E2723]
                        placeholder:text-[#A59A8C]
                        outline-none
                        resize-none
                        transition-all
                        duration-200
                        focus:border-[#7B1616]
                        focus:ring-4
                        focus:ring-[#7B1616]/10
                        hover:border-[#C5A059]
                      "
                    />

                  </div>
                </div>

                {/* CITY + STATE */}

                <div
                  className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    gap-4
                  "
                >

                  {/* CITY */}

                  <div>

                    <label
                      className="
                        block
                        mb-1.5
                        text-xs
                        font-semibold
                        text-[#55483F]
                      "
                    >
                      City / District
                    </label>

                    <input
                      type="text"
                      name="city"
                      value={address.city}
                      onChange={handleChange}
                      placeholder="Enter city"
                      className={inputClass}
                    />

                  </div>

                  {/* STATE */}

                  <div>

                    <label
                      className="
                        block
                        mb-1.5
                        text-xs
                        font-semibold
                        text-[#55483F]
                      "
                    >
                      State
                    </label>

                    <input
                      type="text"
                      name="state"
                      value={address.state}
                      onChange={handleChange}
                      placeholder="Enter state"
                      className={inputClass}
                    />

                  </div>

                </div>

                {/* ==================================================
                    SAVE BUTTON
                ================================================== */}

                <button
                  type="button"
                  onClick={handleSaveAddress}
                  disabled={isSaving}
                  className="
                    group
                    w-full
                    h-13
                    mt-2
                    rounded-xl
                    bg-[#7B1616]
                    hover:bg-[#641010]
                    disabled:bg-[#9D7777]
                    disabled:cursor-not-allowed
                    text-white
                    font-semibold
                    text-sm
                    tracking-wide
                    shadow-[0_8px_25px_rgba(123,22,22,0.22)]
                    hover:shadow-[0_10px_30px_rgba(123,22,22,0.30)]
                    transition-all
                    duration-300
                    flex
                    items-center
                    justify-center
                    gap-2
                  "
                >
                  {isSaving ? "SAVING..." : "SAVE & CONTINUE"}

                  {!isSaving && (
                    <ArrowLeft
                      size={18}
                      className="
                        rotate-180
                        transition-transform
                        duration-300
                        group-hover:translate-x-1
                      "
                    />
                  )}
                </button>

              </div>

              {/* SECURITY NOTE */}

              <div
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  mt-5
                  pt-4
                  border-t
                  border-[#EFE6DA]
                "
              >

                <ShieldCheck
                  size={15}
                  className="text-[#7B1616]"
                />

                <p
                  className="
                    text-[11px]
                    text-[#94887A]
                  "
                >
                  Your address details are securely stored
                </p>

              </div>

            </div>
          </div>

          {/* ==================================================
              RIGHT SIDE IMAGE
          ================================================== */}

          <div
            className="
              hidden
              lg:flex
              relative
              items-center
              justify-center
            "
          >

            {/* BACKGROUND DECORATION */}

            <div
              className="
                absolute
                w-[470px]
                h-[470px]
                rounded-full
                bg-[#E9DCC5]
                opacity-50
              "
            />

            <div
              className="
                absolute
                w-[390px]
                h-[390px]
                rounded-full
                border
                border-[#C5A059]/40
              "
            />

            {/* IMAGE */}

            <div
              className="
                relative
                z-10
                w-[520px]
                h-[520px]
              "
            >

              <Image
                src="/images/address.png"
                alt="Add Shipping Address"
                fill
                priority
                className="
                  object-contain
                  drop-shadow-[0_25px_30px_rgba(65,38,20,0.15)]
                "
              />

            </div>

            {/* FLOATING CARD */}

            <div
              className="
                absolute
                z-20
                left-2
                bottom-16
                rounded-2xl
                border
                border-[#E8DDCE]
                bg-white
                px-5
                py-4
                shadow-[0_15px_35px_rgba(63,39,20,0.12)]
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    bg-[#F4EBDD]
                  "
                >

                  <CheckCircle2
                    size={21}
                    className="text-[#7B1616]"
                  />

                </div>

                <div>

                  <p
                    className="
                      text-sm
                      font-semibold
                      text-[#3E2723]
                    "
                  >
                    Safe & Reliable
                  </p>

                  <p
                    className="
                      text-[11px]
                      text-[#94887A]
                      mt-0.5
                    "
                  >
                    Delivery to your doorstep
                  </p>

                </div>

              </div>

            </div>

            {/* GOLD BADGE */}

            <div
              className="
                absolute
                z-20
                top-16
                right-3
                rounded-full
                bg-[#C5A059]
                px-4
                py-2
                shadow-lg
              "
            >

              <p
                className="
                  text-[11px]
                  font-bold
                  text-white
                  tracking-wide
                "
              >
                PURE • NATURAL • TRUSTED
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* ==================================================
          BOTTOM BENEFITS
      ================================================== */}

      <div
        className="
          border-t
          border-[#E8DDCE]
          bg-white/60
        "
      >

        <div
          className="
            max-w-7xl
            mx-auto
            px-5
            sm:px-8
            py-5
            flex
            flex-wrap
            items-center
            justify-center
            gap-x-10
            gap-y-3
            text-xs
            text-[#776B60]
          "
        >

          <div className="flex items-center gap-2">

            <CheckCircle2
              size={15}
              className="text-[#7B1616]"
            />

            Secure checkout

          </div>

          <div className="flex items-center gap-2">

            <CheckCircle2
              size={15}
              className="text-[#7B1616]"
            />

            Doorstep delivery

          </div>

          <div className="flex items-center gap-2">

            <CheckCircle2
              size={15}
              className="text-[#7B1616]"
            />

            Fresh wood-pressed oils

          </div>

        </div>

      </div>

    </main>
  );
}