import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Product from "../../../../../models/product";
import connectDB from "../../../../../config/db";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    console.log("Fetching product ID:", id);

    // Check if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product ID",
        },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Find the particular product
    const product = await Product.findById(id).lean();

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Product details API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}