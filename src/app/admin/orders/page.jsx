"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const isAdmin = sessionStorage.getItem("adminAuth");

    if (!isAdmin) {
      router.push("/admin");
      return;
    }

    const storedOrders =
      JSON.parse(localStorage.getItem("orders")) || [];

    setOrders(storedOrders);
  }, []);

  return (
    <div className="min-h-screen p-8 bg-[#FFF8E7]">
      <h1 className="text-3xl font-bold mb-6">
        Orders Dashboard
      </h1>

      {orders.length === 0 ? (
        <p>No Orders Found</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className="bg-white p-6 rounded-xl shadow mb-6"
          >
            <h2 className="font-bold text-lg">
              Order ID: {order.id}
            </h2>
            <p className="text-sm text-gray-500">
              {order.date}
            </p>

            {/* Billing Details */}
            <div className="mt-4">
              <h3 className="font-semibold">
                Billing / Shipping Details
              </h3>

              <p>
                {order.billingDetails.firstName}{" "}
                {order.billingDetails.lastName}
              </p>
              <p>{order.billingDetails.street}</p>
              <p>
                {order.billingDetails.city},{" "}
                {order.billingDetails.state}
              </p>
              <p>{order.billingDetails.country}</p>
              <p>Pin: {order.billingDetails.pin}</p>
              <p>Phone: {order.billingDetails.phone}</p>
            </div>

            {/* Items */}
            <div className="mt-4">
              <h3 className="font-semibold">Items</h3>

              {order.items.map((item, index) => (
                <p key={index}>
                  {item.name} ({item.size}) ×{" "}
                  {item.quantity} — ₹
                  {item.price * item.quantity}
                </p>
              ))}
            </div>

            {/* Total */}
            <div className="mt-4 font-bold">
              Total Amount: ₹{order.totalAmount}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
