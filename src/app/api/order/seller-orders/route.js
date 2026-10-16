import authSeller from "@/lib/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import connectDB from "../../../../../config/db";

import Address from "../../../../../models/Address";
import Product from "../../../../../models/product";
import Order from "../../../../../models/Order";

export async function GET(request) {
  try {
    // =========================
    // GET CLERK USER
    // =========================
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized. Please sign in.",
        },
        {
          status: 401,
        }
      );
    }

    // =========================
    // CHECK SELLER
    // =========================
    const isSeller = await authSeller(userId);

    if (!isSeller) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authorized. Seller access required.",
        },
        {
          status: 403,
        }
      );
    }

    // =========================
    // CONNECT DATABASE
    // =========================
    await connectDB();

    // These imports/register the models
    // so Mongoose can populate them.
    Address;
    Product;
    Order;

    // =========================
    // FETCH ALL ORDERS
    // =========================
    const orders = await Order.find({})
      .populate("address")
      .populate("items.product")
      .sort({ date: -1 });

    console.log(
      "Seller Orders Count:",
      orders.length
    );

    console.log(
      "Seller Orders:",
      JSON.stringify(orders, null, 2)
    );

    // =========================
    // SEND RESPONSE
    // =========================
    return NextResponse.json(
      {
        success: true,
        orders,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "SELLER ORDERS API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error?.message ||
          "Failed to fetch seller orders",
      },
      {
        status: 500,
      }
    );
  }
}