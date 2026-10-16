
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

export default function MyOrdersPage() {
    const { isSignedIn, isLoaded } = useAuth();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isLoaded) return;

        if (!isSignedIn) {
            setLoading(false);
            return;
        }

        const fetchOrders = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch("/api/order/list");

                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(
                        data.message || "Failed to fetch orders"
                    );
                }

                setOrders(data.orders || []);
            } catch (error) {
                console.error("FETCH ORDERS ERROR:", error);

                setError(
                    error.message || "Something went wrong"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [isLoaded, isSignedIn]);

    // --------------------------------------------------
    // LOADING
    // --------------------------------------------------

    if (!isLoaded || loading) {
        return (
            <main className="min-h-[calc(100vh-80px)] bg-[#fffaf5] px-5 py-10">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl sm:text-4xl font-bold text-[#5f1616]">
                        My Orders
                    </h1>

                    <div className="mt-10 flex justify-center">
                        <div className="flex items-center gap-3 text-gray-500">
                            <div className="w-5 h-5 border-2 border-[#5f1616] border-t-transparent rounded-full animate-spin" />

                            <span>
                                Loading your orders...
                            </span>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    // --------------------------------------------------
    // NOT LOGGED IN
    // --------------------------------------------------

    if (!isSignedIn) {
        return (
            <main className="min-h-[calc(100vh-80px)] bg-[#fffaf5] flex items-center justify-center px-5">
                <div className="text-center bg-white border border-[#eaded2] rounded-2xl p-10 shadow-sm max-w-md w-full">
                    <div className="w-16 h-16 mx-auto rounded-full bg-[#fff3e8] flex items-center justify-center text-2xl">
                        🛍️
                    </div>

                    <h1 className="mt-5 text-3xl font-bold text-[#5f1616]">
                        My Orders
                    </h1>

                    <p className="mt-3 text-gray-600">
                        Please sign in to view your orders.
                    </p>

                    <Link
                        href="/"
                        className="inline-block mt-6 px-6 py-3 rounded-lg bg-[#5f1616] text-white font-semibold hover:bg-[#481010] transition"
                    >
                        Go to Home
                    </Link>
                </div>
            </main>
        );
    }

    // --------------------------------------------------
    // PAGE
    // --------------------------------------------------

    return (
        <main className="min-h-[calc(100vh-80px)] bg-[#fffaf5] px-4 sm:px-5 py-8 sm:py-10">
            <div className="max-w-6xl mx-auto">

                {/* PAGE HEADER */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-[#5f1616]">
                        My Orders
                    </h1>

                    <p className="mt-2 text-gray-600">
                        View your orders, delivery details and payment status.
                    </p>
                </div>

                {/* ERROR */}
                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
                        {error}
                    </div>
                )}

                {/* NO ORDERS */}
                {!error && orders.length === 0 && (
                    <div className="bg-white border border-[#eaded2] rounded-2xl p-10 text-center shadow-sm">
                        <div className="w-16 h-16 mx-auto rounded-full bg-[#fff3e8] flex items-center justify-center text-2xl">
                            📦
                        </div>

                        <h2 className="mt-5 text-xl font-semibold text-gray-800">
                            No orders yet
                        </h2>

                        <p className="mt-2 text-gray-500">
                            Your orders will appear here after you place an
                            order.
                        </p>

                        <Link
                            href="/"
                            className="inline-block mt-6 px-6 py-3 rounded-lg bg-[#5f1616] text-white font-semibold hover:bg-[#481010] transition"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                )}

                {/* ORDERS */}
                <div className="space-y-6">
                    {orders.map((order) => {
                        // --------------------------------------------------
                        // ADDRESS
                        // --------------------------------------------------

                        const address =
                            typeof order.address === "object"
                                ? order.address
                                : null;

                        const addressText = address
                            ? [
                                  address.fullName,
                                  address.address,
                                  address.area,
                                  address.city,
                                  address.state,
                                  address.pinCode,
                              ]
                                  .filter(Boolean)
                                  .join(", ")
                            : order.address ||
                              "Address not available";

                        // --------------------------------------------------
                        // PAYMENT
                        // --------------------------------------------------

                        const paymentMethod =
                            order.paymentMethod ||
                            "Cash on Delivery";

                        const paymentStatus =
                            order.paymentStatus ||
                            "Pending";

                        return (
                            <div
                                key={order._id}
                                className="bg-white border border-[#eaded2] rounded-2xl shadow-sm overflow-hidden"
                            >
                                {/* ==========================================
                                    ORDER HEADER
                                ========================================== */}

                                <div className="px-5 sm:px-6 py-5 border-b border-gray-100">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                                        {/* ORDER ID */}
                                        <div>
                                            <p className="text-xs uppercase tracking-wide text-gray-500">
                                                Order ID
                                            </p>

                                            <p className="mt-1 font-semibold text-gray-800 break-all">
                                                {order._id}
                                            </p>
                                        </div>

                                        {/* DATE */}
                                        <div className="lg:text-right">
                                            <p className="text-xs uppercase tracking-wide text-gray-500">
                                                Order Date
                                            </p>

                                            <p className="mt-1 font-medium text-gray-800">
                                                {order.date
                                                    ? new Date(
                                                          order.date
                                                      ).toLocaleDateString(
                                                          "en-IN",
                                                          {
                                                              day: "2-digit",
                                                              month: "short",
                                                              year: "numeric",
                                                          }
                                                      )
                                                    : "N/A"}
                                            </p>
                                        </div>

                                        {/* ORDER STATUS */}
                                        <div>
                                            <p className="text-xs uppercase tracking-wide text-gray-500">
                                                Order Status
                                            </p>

                                            <span className="inline-flex mt-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                                                {order.status ||
                                                    "Order Placed"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* ==========================================
                                    ORDER CONTENT
                                ========================================== */}

                                <div className="p-5 sm:p-6">

                                    {/* PRODUCTS */}
                                    <div>
                                        <h2 className="text-lg font-semibold text-[#5f1616] mb-4">
                                            Order Details
                                        </h2>

                                        <div className="space-y-4">
                                            {order.items?.map(
                                                (item, index) => {
                                                    const product =
                                                        item.product;

                                                    // IMPORTANT:
                                                    // Only use Image when a
                                                    // non-empty image URL exists.
                                                   const imageUrl = Array.isArray(product?.image)
    ? product.image[0]
    : typeof product?.image === "string"
        ? product.image
        : null;

                                                    return (
                                                        <div
                                                            key={
                                                                item._id ||
                                                                `${order._id}-${index}`
                                                            }
                                                            className="flex items-center gap-4"
                                                        >
                                                            {/* PRODUCT IMAGE */}
                                                            <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-[#fffaf5] rounded-xl overflow-hidden flex-shrink-0 border border-[#f1e6dc]">
                                                                {imageUrl ? (
                                                                    <Image
                                                                        src={
                                                                            imageUrl
                                                                        }
                                                                        alt={
                                                                            product?.name ||
                                                                            "Product"
                                                                        }
                                                                        fill
                                                                        sizes="96px"
                                                                        className="object-contain p-2"
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 text-center px-2">
                                                                        No Image
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* PRODUCT DETAILS */}
                                                            <div className="flex-1 min-w-0">
                                                                <h3 className="font-semibold text-gray-800">
                                                                    {product?.name ||
                                                                        "Product"}
                                                                </h3>

                                                                <p className="text-sm text-gray-500 mt-1">
                                                                    Quantity:{" "}
                                                                    {
                                                                        item.quantity
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </div>

                                    {/* ======================================
                                        INFORMATION GRID
                                    ====================================== */}

                                    <div className="mt-7 pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-5">

                                        {/* DELIVERY ADDRESS */}
                                        <div className="rounded-xl bg-[#fffaf5] border border-[#f0e4d9] p-5">
                                            <p className="text-xs uppercase tracking-wide text-gray-500">
                                                Delivery Address
                                            </p>

                                            <p className="mt-2 text-gray-800 font-medium leading-relaxed">
                                                {addressText}
                                            </p>

                                            {address?.phoneNumber && (
                                                <p className="mt-2 text-sm text-gray-500">
                                                    Phone:{" "}
                                                    {
                                                        address.phoneNumber
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        {/* PAYMENT */}
                                        <div className="rounded-xl bg-[#fffaf5] border border-[#f0e4d9] p-5">
                                            <p className="text-xs uppercase tracking-wide text-gray-500">
                                                Payment Information
                                            </p>

                                            <div className="mt-3 flex items-center justify-between gap-4">
                                                <span className="text-gray-700">
                                                    Method
                                                </span>

                                                <span className="font-semibold text-gray-800 text-right">
                                                    {paymentMethod}
                                                </span>
                                            </div>

                                            <div className="mt-3 flex items-center justify-between gap-4">
                                                <span className="text-gray-700">
                                                    Payment Status
                                                </span>

                                                <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-semibold">
                                                    {paymentStatus}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ======================================
                                        TOTAL
                                    ====================================== */}

                                    <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Payment Status
                                            </p>

                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />

                                                <span className="font-semibold text-yellow-700">
                                                    Pending
                                                </span>
                                            </div>
                                        </div>

                                        <div className="sm:text-right">
                                            <p className="text-sm text-gray-500">
                                                Total Amount
                                            </p>

                                            <p className="text-2xl font-bold text-[#5f1616]">
                                                ₹
                                                {Number(
                                                    order.amounts || 0
                                                ).toLocaleString("en-IN")}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
