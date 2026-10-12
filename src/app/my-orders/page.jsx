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
                setError(error.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [isLoaded, isSignedIn]);

    // Loading
    if (!isLoaded || loading) {
        return (
            <main className="min-h-[calc(100vh-80px)] bg-[#fffaf5] px-5 py-10">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold text-[#5f1616]">
                        My Orders
                    </h1>

                    <div className="mt-10 text-center text-gray-500">
                        Loading your orders...
                    </div>
                </div>
            </main>
        );
    }

    // Not logged in
    if (!isSignedIn) {
        return (
            <main className="min-h-[calc(100vh-80px)] bg-[#fffaf5] flex items-center justify-center px-5">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-[#5f1616]">
                        My Orders
                    </h1>

                    <p className="mt-3 text-gray-600">
                        Please sign in to view your orders.
                    </p>

                    <Link
                        href="/"
                        className="inline-block mt-6 px-6 py-3 rounded-lg bg-[#5f1616] text-white font-semibold"
                    >
                        Go to Home
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-[calc(100vh-80px)] bg-[#fffaf5] px-5 py-10">
            <div className="max-w-6xl mx-auto">

                {/* PAGE TITLE */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-[#5f1616]">
                        My Orders
                    </h1>

                    <p className="mt-2 text-gray-600">
                        View your recent orders and their status.
                    </p>
                </div>

                {/* ERROR */}
                {error && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
                        {error}
                    </div>
                )}

                {/* NO ORDERS */}
                {!error && orders.length === 0 && (
                    <div className="bg-white border border-[#eaded2] rounded-2xl p-10 text-center shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-800">
                            No orders yet
                        </h2>

                        <p className="mt-2 text-gray-500">
                            Your orders will appear here after you place an
                            order.
                        </p>

                        <Link
                            href="/"
                            className="inline-block mt-6 px-6 py-3 rounded-lg bg-[#5f1616] text-white font-semibold"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                )}

                {/* ORDERS */}
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="bg-white border border-[#eaded2] rounded-2xl shadow-sm overflow-hidden"
                        >
                            {/* ORDER HEADER */}
                            <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Order ID
                                    </p>

                                    <p className="font-semibold text-gray-800 break-all">
                                        {order._id}
                                    </p>
                                </div>

                                <div className="text-left sm:text-right">
                                    <p className="text-sm text-gray-500">
                                        Order Date
                                    </p>

                                    <p className="font-medium text-gray-800">
                                        {order.date
                                            ? new Date(
                                                  order.date
                                              ).toLocaleDateString("en-IN")
                                            : "N/A"}
                                    </p>
                                </div>
                            </div>

                            {/* ORDER ITEMS */}
                            <div className="p-5 sm:p-6">
                                <div className="space-y-4">
                                    {order.items?.map((item, index) => {
                                        const product = item.product;

                                        return (
                                            <div
                                                key={
                                                    item._id ||
                                                    `${order._id}-${index}`
                                                }
                                                className="flex items-center gap-4"
                                            >
                                                {/* PRODUCT IMAGE */}
                                                <div className="relative w-20 h-20 bg-[#fffaf5] rounded-xl overflow-hidden flex-shrink-0">
                                                    {product?.image ? (
                                                        <Image
                                                            src={
                                                                product.image
                                                            }
                                                            alt={
                                                                product.name ||
                                                                "Product"
                                                            }
                                                            fill
                                                            className="object-contain p-2"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                                            No Image
                                                        </div>
                                                    )}
                                                </div>

                                                {/* PRODUCT DETAILS */}
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-800">
                                                        {product?.name ||
                                                            "Product"}
                                                    </h3>

                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Quantity:{" "}
                                                        {item.quantity}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* BOTTOM INFO */}
                                <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                                    {/* STATUS */}
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Status
                                        </p>

                                        <span className="inline-block mt-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                                            {order.status || "Order Placed"}
                                        </span>
                                    </div>

                                    {/* TOTAL */}
                                    <div className="sm:text-right">
                                        <p className="text-sm text-gray-500">
                                            Total Amount
                                        </p>

                                        <p className="text-xl font-bold text-[#5f1616]">
                                            ₹
                                            {Number(
                                                order.amounts || 0
                                            ).toLocaleString("en-IN")}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}