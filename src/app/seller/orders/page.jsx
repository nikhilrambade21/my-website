"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Package } from "lucide-react";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSellerOrders = async () => {
    // Temporary dummy order data
    // Later we will replace this with your database/API
    setOrders([
      {
        _id: "order-001",
        items: [
          {
            product: {
              name: "Groundnut Oil",
            },
            quantity: 2,
          },
        ],
        address: {
          fullName: "Customer Name",
          area: "Pune",
          city: "Pune",
          state: "Maharashtra",
          phoneNumber: "9876543210",
        },
        amount: 680,
        date: new Date().toISOString(),
      },
      {
        _id: "order-002",
        items: [
          {
            product: {
              name: "Coconut Oil",
            },
            quantity: 1,
          },
          {
            product: {
              name: "Mustard Oil",
            },
            quantity: 2,
          },
        ],
        address: {
          fullName: "Customer Name",
          area: "Hadapsar",
          city: "Pune",
          state: "Maharashtra",
          phoneNumber: "9876543210",
        },
        amount: 920,
        date: new Date().toISOString(),
      },
    ]);

    setLoading(false);
  };

  useEffect(() => {
    fetchSellerOrders();
  }, []);

  return (
    <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
      {loading ? (
        <Loading />
      ) : (
        <div className="md:p-10 p-4 space-y-5">
          <h2 className="text-lg font-medium">
            Orders
          </h2>

          <div className="max-w-4xl rounded-md">
            {orders.length === 0 ? (
              <div className="p-10 text-center border border-gray-200 rounded-md bg-white">
                <p className="text-gray-500">
                  No orders found.
                </p>
              </div>
            ) : (
              orders.map((order, index) => (
                <div
                  key={order._id || index}
                  className="flex flex-col md:flex-row gap-5 justify-between p-5 border-t border-gray-300"
                >
                  {/* Order Products */}
                  <div className="flex-1 flex gap-5 max-w-80">
                    <div className="w-16 h-16 flex items-center justify-center bg-orange-50 rounded-md">
                      <Package
                        size={32}
                        strokeWidth={1.5}
                        className="text-orange-600"
                      />
                    </div>

                    <p className="flex flex-col gap-3">
                      <span className="font-medium">
                        {order.items
                          .map(
                            (item) =>
                              `${item.product.name} x ${item.quantity}`
                          )
                          .join(", ")}
                      </span>

                      <span>
                        Items : {order.items.length}
                      </span>
                    </p>
                  </div>

                  {/* Customer Address */}
                  <div>
                    <p>
                      <span className="font-medium">
                        {order.address.fullName}
                      </span>

                      <br />

                      <span>
                        {order.address.area}
                      </span>

                      <br />

                      <span>
                        {`${order.address.city}, ${order.address.state}`}
                      </span>

                      <br />

                      <span>
                        {order.address.phoneNumber}
                      </span>
                    </p>
                  </div>

                  {/* Order Amount */}
                  <p className="font-medium my-auto">
                    ₹{order.amount}
                  </p>

                  {/* Order Details */}
                  <div>
                    <p className="flex flex-col">
                      <span>
                        Method : COD
                      </span>

                      <span>
                        Date :{" "}
                        {new Date(
                          order.date
                        ).toLocaleDateString("en-IN")}
                      </span>

                      <span>
                        Payment : Pending
                      </span>
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Orders;