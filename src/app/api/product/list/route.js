import { NextResponse } from "next/server";
import Product from "../../../../../models/product";
import connectDB from "../../../../../config/db";

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find({}).sort({ date: -1 });

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("PRODUCT LIST API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}