import { auth } from "@clerk/nextjs/server";
import connectDB from "../../../../../config/db";
import Address from "../../../../../models/Address";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Get logged-in Clerk user
        const { userId } = await auth();

        // User is not logged in
        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized. Please login.",
                },
                { status: 401 }
            );
        }

        // Connect MongoDB
        await connectDB();

        // Get addresses belonging to this user
        const addresses = await Address.find({ userId })
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json(
            {
                success: true,
                addresses,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("GET ADDRESS ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: error?.message || "Unable to fetch addresses",
            },
            { status: 500 }
        );
    }
}