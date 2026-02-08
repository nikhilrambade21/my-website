"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();

  const SHIPPING_CHARGE = cartTotal > 2999 ? 0 : 150;
  const finalTotal = cartTotal + SHIPPING_CHARGE;

  const [agreed, setAgreed] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  // ⭐ Billing Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    country: "",
    street: "",
    city: "",
    state: "",
    pin: "",
    phone: "",
  });

  // ---------- Handle Input ----------
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ---------- Submit Checkout ----------
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!agreed) {
      alert("Please agree to Terms and Conditions");
      return;
    }

    setShowQR(true);
  };

  // ---------- Save Order ----------
  const saveOrder = () => {
    const order = {
      id: Date.now(),
      billingDetails: formData,
      items: cart,
      totalAmount: finalTotal,
      date: new Date().toLocaleString(),
    };

    const existingOrders =
      JSON.parse(localStorage.getItem("orders")) || [];

    localStorage.setItem(
      "orders",
      JSON.stringify([...existingOrders, order])
    );
  };

  // ---------- Payment Success ----------
  const handlePaymentSuccess = () => {
    saveOrder(); // ⭐ Save Order

    setPaymentDone(true);

    clearCart();

    setTimeout(() => {
      router.push("/");
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-[#8a4343] text-center">
        Checkout
      </h1>

      {/* ================= QR SCREEN ================= */}
      {showQR ? (
        <div className="max-w-md mx-auto border rounded-2xl p-8 shadow-lg text-center space-y-5">
          {!paymentDone ? (
            <>
              <h2 className="text-xl font-semibold text-[#8a4343]">
                Scan & Pay
              </h2>

              <Image
                src="/images/payment.jpeg"
                alt="Payment QR"
                width={250}
                height={250}
                className="mx-auto"
              />

              <p className="text-lg font-semibold">
                Pay ₹{finalTotal}
              </p>

              <label className="flex justify-center gap-2">
                <input
                  type="checkbox"
                  onChange={handlePaymentSuccess}
                />
                Payment Successful
              </label>
            </>
          ) : (
            <>
              <h2 className="text-green-600 text-xl font-semibold">
                ✅ Order Placed Successfully
              </h2>

              <p className="text-gray-600">
                You will receive your order within 5 days 🚚
              </p>
            </>
          )}
        </div>
      ) : (
        /* ================= CHECKOUT FORM ================= */
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-10">

          {/* Billing Form */}
          <div className="space-y-5 border rounded-2xl p-6 shadow-sm">

            <h2 className="text-xl font-semibold text-[#8a4343]">
              Billing / Shipping Details
            </h2>

            <input name="firstName" onChange={handleChange} required placeholder="First Name" className="input" />
            <input name="lastName" onChange={handleChange} required placeholder="Last Name" className="input" />
            <input name="country" onChange={handleChange} required placeholder="Country" className="input" />
            <input name="street" onChange={handleChange} required placeholder="Street Address" className="input" />
            <input name="city" onChange={handleChange} required placeholder="City" className="input" />
            <input name="state" onChange={handleChange} required placeholder="State" className="input" />
            <input name="pin" onChange={handleChange} required placeholder="Pin Code" className="input" />
            <input name="phone" onChange={handleChange} required placeholder="Phone Number" className="input" />

            <label className="flex gap-2 text-sm">
              <input
                type="checkbox"
                checked={agreed}
                onChange={() => setAgreed(!agreed)}
              />
              I agree to Terms and Conditions
            </label>
          </div>

          {/* Order Summary */}
          <div className="border rounded-2xl p-6 shadow-sm space-y-4 h-fit">

            <h2 className="text-xl font-semibold text-[#8a4343]">
              Order Summary
            </h2>

            <div className="flex justify-between">
              <span>Oil Total</span>
              <span>₹{cartTotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>
                {SHIPPING_CHARGE === 0 ? "FREE" : `₹${SHIPPING_CHARGE}`}
              </span>
            </div>

            {cartTotal > 2999 && (
              <p className="text-green-600 text-sm">
                🎉 Free Shipping Applied
              </p>
            )}

            <div className="border-t pt-4 flex justify-between font-bold text-lg text-[#8a4343]">
              <span>Total</span>
              <span>₹{finalTotal}</span>
            </div>

            <button
              type="submit"
              disabled={!agreed}
              className={`w-full py-3 rounded-xl text-white font-semibold transition
                ${
                  agreed
                    ? "bg-[#8a4343] hover:bg-[#6e3232]"
                    : "bg-gray-400"
                }`}
            >
              Place Order ₹{finalTotal}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
