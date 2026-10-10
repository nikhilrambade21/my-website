import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import Product from "../../../../../models/product";
import User from "../../../../../models/user";
import Order from "../../../../../models/Order";
import { inngest } from "../../../../../config/inngest";

export async function POST(request) {
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

        const { address, items } = await request.json();

        if (!address || !items || items.length === 0) {
            return NextResponse.json({
                success: false,
                message: "Invalid data",
            });
        }

        // Calculate total amount
        let amount = 0;

        for (const item of items) {
            const product = await Product.findById(item.product);

            if (!product) {
                return NextResponse.json({
                    success: false,
                    message: `Product not found: ${item.product}`,
                });
            }

            amount += product.price * item.quantity;
        }

        // Create order
        const order = await Order.create({
            userId,
            address,
            items,
            amount,
            date: Date.now(),
        });

        // Send order event to Inngest
        await inngest.send({
            name: "order/created",
            data: {
                userId,
                address,
                items,
                amount,
                date: Date.now(),
                orderId: order._id.toString(),
            },
        });

        // Clear user cart
        const user = await User.findById(userId);

        if (user) {
            user.cartItems = {};
            await user.save();
        }

        return NextResponse.json({
            success: true,
            message: "Order Placed",
            orderId: order._id,
        });
    } catch (error) {
        console.error("ORDER CREATE ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            { status: 500 }
        );
    }
}