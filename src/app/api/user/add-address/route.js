import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "../../../../../config/db";
import Address from "../../../../../models/Address";

export async function POST(request) {
  try {
    // Get logged-in Clerk user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first",
        },
        { status: 401 }
      );
    }

    // Get address from request
    const { address } = await request.json();

    if (!address) {
      return NextResponse.json(
        {
          success: false,
          message: "Address is required",
        },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!address.name?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Full name is required",
        },
        { status: 400 }
      );
    }

    if (!address.phone) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number is required",
        },
        { status: 400 }
      );
    }

    if (!address.pincode) {
      return NextResponse.json(
        {
          success: false,
          message: "Pincode is required",
        },
        { status: 400 }
      );
    }

    if (!address.address?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Address is required",
        },
        { status: 400 }
      );
    }

    if (!address.city?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "City is required",
        },
        { status: 400 }
      );
    }

    if (!address.state?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "State is required",
        },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Map frontend field names to your Address schema field names
    const newAddress = await Address.create({
      userId,

      fullName: address.name.trim(),

      phoneNumber: address.phone,

      pinCode: address.pincode,

      area: address.address.trim(),

      city: address.city.trim(),

      state: address.state.trim(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Address added successfully",
        newAddress,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("ADD ADDRESS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Unable to add address",
      },
      { status: 500 }
    );
  }
}