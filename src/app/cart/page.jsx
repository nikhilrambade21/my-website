"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const router = useRouter();

  if (cart.length === 0)
    return (
      <p className="p-10 text-center text-lg text-gray-500">
        🛒 Your cart is empty
      </p>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">

      {/* Title */}
      <h1 className="text-3xl font-bold mb-8 text-[#8a4343]">
        Your Cart
      </h1>

      {/* Cart Items */}
      <div className="space-y-6">
        {cart.map((item) => (
          <div
            key={item.id + item.size}
            className="flex flex-col sm:flex-row items-center justify-between gap-6 border rounded-2xl p-5 shadow-sm hover:shadow-md transition"
          >
            {/* Left Section */}
            <div className="flex items-center gap-5">

              {/* Product Image */}
              <div className="relative w-24 h-24 rounded-xl overflow-hidden border">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Product Info */}
              <div>
                <h2 className="text-lg font-semibold">
                  {item.name}
                </h2>

                <p className="text-gray-500 text-sm">
                  Size: {item.size}
                </p>

                <p className="font-medium text-[#8a4343]">
                  ₹{item.price}
                </p>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex flex-col sm:flex-row items-center gap-4">

              {/* Quantity Controls */}
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button
                  onClick={() =>
                    updateQuantity(
                      item.id,
                      item.size,
                      Math.max(1, item.quantity - 1)
                    )
                  }
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                >
                  −
                </button>

                <span className="px-4">{item.quantity}</span>

                <button
                  onClick={() =>
                    updateQuantity(
                      item.id,
                      item.size,
                      item.quantity + 1
                    )
                  }
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                >
                  +
                </button>
              </div>

              {/* Subtotal */}
              <p className="font-semibold w-24 text-center">
                ₹{item.price * item.quantity}
              </p>

              {/* Remove Button */}
              <button
                onClick={() => removeFromCart(item.id, item.size)}
                className="text-red-500 hover:text-red-700 font-medium"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Total Section */}
      <div className="mt-10 border-t pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">

        <div>
          <h2 className="text-xl font-semibold">
            Total Amount
          </h2>

          <p className="text-sm text-gray-500">
            Shipping will be calculated at checkout
          </p>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold text-[#8a4343] mb-2">
            ₹{cartTotal}
          </p>

          <button
            onClick={() => router.push("/checkout")}
            className="bg-[#8a4343] text-white px-6 py-2 rounded-xl hover:bg-[#6e3232] transition"
          >
            Proceed to Checkout
          </button>
        </div>

      </div>
    </div>
  );
}
