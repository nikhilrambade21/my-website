"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Package } from "lucide-react";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSellerOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/order/seller-orders", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      // Read response as text first.
      // This prevents "Unexpected end of JSON input"
      // if the API returns an empty/non-JSON response.
      const responseText = await response.text();

      console.log("Seller Orders Status:", response.status);
      console.log("Seller Orders Raw Response:", responseText);

      if (!responseText) {
        throw new Error(
          `Server returned an empty response. Status: ${response.status}`
        );
      }

      let data;

      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error(
          "Seller Orders Invalid JSON:",
          responseText
        );

        throw new Error(
          `Server returned invalid JSON. Status: ${response.status}`
        );
      }

      console.log("Seller Orders API Response:", data);

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to fetch orders"
        );
      }

      setOrders(data.orders || []);
    } catch (error) {
      console.error(
        "Fetch Seller Orders Error:",
        error
      );

      setError(
        error?.message ||
          "Something went wrong while fetching orders."
      );

      setOrders([]);
    } finally {
      setLoading(false);
    }
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

          {/* Error */}
          {error && (
            <div className="p-4 rounded-md border border-red-200 bg-red-50 text-red-600">
              {error}
            </div>
          )}

          <div className="max-w-5xl rounded-md bg-white">
            {orders.length === 0 ? (
              <div className="p-10 text-center border border-gray-200 rounded-md">
                <p className="text-gray-500">
                  No orders found.
                </p>
              </div>
            ) : (
              orders.map((order, index) => (
                <div
                  key={order._id || index}
                  className="flex flex-col md:flex-row gap-6 justify-between p-5 border-t border-gray-300"
                >
                  {/* =========================
                      PRODUCT DETAILS
                  ========================== */}
                  <div className="flex-1 flex gap-4 max-w-md">
                    {/* Product Image */}
                    <div className="w-16 h-16 min-w-16 flex items-center justify-center bg-orange-50 rounded-md overflow-hidden">
                      {order.items?.[0]?.product?.image?.[0] ? (
                        <Image
                          src={
                            order.items[0].product.image[0]
                          }
                          alt={
                            order.items[0].product.name ||
                            "Product"
                          }
                          width={64}
                          height={64}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <Package
                          size={32}
                          strokeWidth={1.5}
                          className="text-orange-600"
                        />
                      )}
                    </div>

                    {/* Product Names */}
                    <div className="flex flex-col gap-3">
                      <div className="font-medium">
                        {order.items?.map(
                          (item, itemIndex) => (
                            <div
                              key={
                                item._id || itemIndex
                              }
                            >
                              {item.product?.name ||
                                "Product"}{" "}
                              x {item.quantity}
                            </div>
                          )
                        )}
                      </div>

                      <span>
                        Items :{" "}
                        {order.items?.length || 0}
                      </span>
                    </div>
                  </div>

                  {/* =========================
                      CUSTOMER ADDRESS
                  ========================== */}
                  <div className="min-w-48">
                    <p>
                      <span className="font-medium">
                        {order.address?.fullName ||
                          "Customer"}
                      </span>

                      <br />

                      <span>
                        {order.address?.area || ""}
                      </span>

                      <br />

                      <span>
                        {[
                          order.address?.city,
                          order.address?.state,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </span>

                      <br />

                      <span>
                        {order.address?.phoneNumber ||
                          ""}
                      </span>
                    </p>
                  </div>

                  {/* =========================
                      ORDER AMOUNT
                  ========================== */}
                  <p className="font-medium my-auto whitespace-nowrap">
                    ₹{order.amounts || 0}
                  </p>

                  {/* =========================
                      ORDER DETAILS
                  ========================== */}
                  <div className="min-w-40">
                    <p className="flex flex-col gap-1">
                      <span>
                        Method : COD
                      </span>

                      <span>
                        Date :{" "}
                        {order.date
                          ? new Date(
                              order.date
                            ).toLocaleDateString(
                              "en-IN"
                            )
                          : "N/A"}
                      </span>

                      <span>
                        Payment : Pending
                      </span>

                      <span>
                        Status :{" "}
                        {order.status ||
                          "Order Placed"}
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