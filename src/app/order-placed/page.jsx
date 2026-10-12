"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

export default function OrderPlacedPage() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push("/my-orders");
        }, 5000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <main className="min-h-[calc(100vh-80px)] bg-white flex items-center justify-center">
            <div className="flex flex-col items-center justify-center text-center">

                {/* GREEN LOADING / SUCCESS CIRCLE */}
                <div className="relative w-24 h-24">

                    {/* Rotating loading border */}
                    <div
                        className="
                            absolute inset-0
                            rounded-full
                            border-4
                            border-green-200
                            border-t-green-500
                            animate-spin
                        "
                    />

                    {/* Check icon */}
                    <div
                        className="
                            absolute inset-2
                            rounded-full
                            flex items-center justify-center
                        "
                    >
                        <Check
                            size={45}
                            strokeWidth={2.5}
                            className="text-green-500"
                        />
                    </div>

                </div>

                {/* TEXT */}
                <h1 className="mt-6 text-2xl sm:text-3xl font-semibold text-gray-800">
                    Order Placed Successfully
                </h1>

            </div>
        </main>
    );
}