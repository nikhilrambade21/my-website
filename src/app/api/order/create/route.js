import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import Product from "../../../../../models/product";
import User from "../../../../../models/user";
import Order from "../../../../../models/Order";
import { inngest } from "../../../../../config/inngest";

export async function POST(request) {
    try {
        /* =====================================================
           AUTHENTICATION
        ===================================================== */

        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        /* =====================================================
           GET REQUEST DATA
        ===================================================== */

        const body = await request.json();

        const {
            address,
            items,
            amounts,
        } = body;

        console.log(
            "================================="
        );

        console.log(
            "ORDER REQUEST DATA:"
        );

        console.log({
            userId,
            address,
            items,
            amounts,
        });

        console.log(
            "================================="
        );

        /* =====================================================
           VALIDATE ADDRESS
        ===================================================== */

        if (!address) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Address is required",
                },
                {
                    status: 400,
                }
            );
        }

        /* =====================================================
           VALIDATE ITEMS
        ===================================================== */

        if (
            !items ||
            !Array.isArray(items) ||
            items.length === 0
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Order items are required",
                },
                {
                    status: 400,
                }
            );
        }

        /* =====================================================
           VALIDATE AMOUNT
        ===================================================== */

        const orderAmount = Number(amounts);

        if (
            !Number.isFinite(orderAmount) ||
            orderAmount <= 0
        ) {
            console.error(
                "INVALID ORDER AMOUNT:",
                amounts
            );

            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid order amount",
                },
                {
                    status: 400,
                }
            );
        }

        /* =====================================================
           VALIDATE PRODUCTS
        ===================================================== */

        for (const item of items) {
            /* -----------------------------------------------
               PRODUCT ID
            ----------------------------------------------- */

            if (!item.product) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Product ID is missing",
                    },
                    {
                        status: 400,
                    }
                );
            }

            /* -----------------------------------------------
               QUANTITY
            ----------------------------------------------- */

            const quantity = Number(
                item.quantity || 0
            );

            if (
                !Number.isFinite(quantity) ||
                quantity <= 0
            ) {
                return NextResponse.json(
                    {
                        success: false,
                        message:
                            "Invalid product quantity",
                    },
                    {
                        status: 400,
                    }
                );
            }

            /* -----------------------------------------------
               CHECK PRODUCT EXISTS
            ----------------------------------------------- */

            const product =
                await Product.findById(
                    item.product
                );

            if (!product) {
                return NextResponse.json(
                    {
                        success: false,
                        message:
                            `Product not found: ${item.product}`,
                    },
                    {
                        status: 404,
                    }
                );
            }
        }

        /* =====================================================
           CREATE ORDER
        ===================================================== */

        const order = await Order.create({
            userId,

            address,

            items,

            amounts: orderAmount,

            date: Date.now(),
        });

        console.log(
            "================================="
        );

        console.log(
            "ORDER CREATED SUCCESSFULLY"
        );

        console.log(
            "ORDER ID:",
            order._id.toString()
        );

        console.log(
            "ORDER AMOUNT:",
            orderAmount
        );

        console.log(
            "================================="
        );

        /* =====================================================
           SEND EVENT TO INNGEST
        ===================================================== */

        try {
            await inngest.send({
                name: "order/created",

                data: {
                    userId,

                    address,

                    items,

                    amounts: orderAmount,

                    date: Date.now(),

                    orderId:
                        order._id.toString(),
                },
            });

            console.log(
                "ORDER EVENT SENT TO INNGEST"
            );

        } catch (inngestError) {
            /*
             * IMPORTANT:
             *
             * The order is already saved in MongoDB.
             *
             * If Inngest temporarily fails,
             * we should NOT delete the order.
             *
             * The customer has successfully placed
             * the order.
             */

            console.error(
                "INNGEST ERROR:",
                inngestError
            );
        }

        /* =====================================================
           CLEAR USER CART
        ===================================================== */

        const user =
            await User.findById(userId);

        if (user) {
            user.cartItems = {};

            await user.save();

            console.log(
                "USER CART CLEARED"
            );
        } else {
            console.warn(
                "USER NOT FOUND WHILE CLEARING CART:",
                userId
            );
        }

        /* =====================================================
           SUCCESS RESPONSE
        ===================================================== */

        return NextResponse.json(
            {
                success: true,

                message:
                    "Order Placed Successfully",

                orderId:
                    order._id.toString(),
            },
            {
                status: 200,
            }
        );

    } catch (error) {
        /* =====================================================
           MAIN ERROR
        ===================================================== */

        console.error(
            "================================="
        );

        console.error(
            "ORDER CREATE ERROR:"
        );

        console.error(error);

        console.error(
            "================================="
        );

        return NextResponse.json(
            {
                success: false,

                message:
                    error?.message ||
                    "Unable to create order",
            },
            {
                status: 500,
            }
        );
    }
}