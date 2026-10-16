import { getAuth } from "@clerk/nextjs/server";
import connectDB from "../../../../../config/db";

import Address from "../../../../../models/Address";
import Product from "../../../../../models/product";
import Order from "../../../../../models/Order";

import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }

        await connectDB();

        // These imports register the Mongoose models
        Address;
        Product;
        Order;

        const orders = await Order.find({ userId })
            .populate("address")
            .populate("items.product")
            .sort({ date: -1 });

        console.log("========== ORDERS ==========");
        console.log(JSON.stringify(orders, null, 2));
        console.log("============================");

        return NextResponse.json({
            success: true,
            orders,
        });
    } catch (error) {
        console.error("Order List Error:", error);

        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            { status: 500 }
        );
    }
}