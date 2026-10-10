import authSeller from "@/lib/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import connectDB from "../../../../../config/db";
import Product from "../../../../../models/product";

// ==========================================
// CLOUDINARY CONFIGURATION
// ==========================================

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


// ==========================================
// POST /api/product/add
// ==========================================

export async function POST(request) {
    try {
        // --------------------------------------
        // 1. GET CLERK USER
        // --------------------------------------

        const { userId } = getAuth(request);

        console.log("USER ID:", userId);

        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }

        // --------------------------------------
        // 2. CHECK SELLER
        // --------------------------------------

        const isSeller = await authSeller(userId);

        console.log("IS SELLER:", isSeller);

        if (!isSeller) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Not Authorized",
                },
                { status: 403 }
            );
        }

        // --------------------------------------
        // 3. GET FORM DATA
        // --------------------------------------

        const formData = await request.formData();

        const name = formData.get("name");
        const description = formData.get("description");
        const benefits = formData.get("benefits");
        const pricesData = formData.get("prices");

        // Frontend must use formData.append("images", file)
        const files = formData.getAll("images");

        console.log("NAME:", name);
        console.log("DESCRIPTION:", description);
        console.log("BENEFITS:", benefits);
        console.log("PRICES:", pricesData);
        console.log("FILES:", files.length);

        // --------------------------------------
        // 4. VALIDATION
        // --------------------------------------

        if (!name || !name.trim()) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Product name is required",
                },
                { status: 400 }
            );
        }

        if (!description || !description.trim()) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Product description is required",
                },
                { status: 400 }
            );
        }

        if (!benefits || !benefits.trim()) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Product benefits are required",
                },
                { status: 400 }
            );
        }

        if (!pricesData) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Product prices are required",
                },
                { status: 400 }
            );
        }

        if (!files || files.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No product image uploaded",
                },
                { status: 400 }
            );
        }

        // --------------------------------------
        // 5. CHECK CLOUDINARY
        // --------------------------------------

        console.log("CLOUDINARY CHECK:", {
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            apiKeyExists: !!process.env.CLOUDINARY_API_KEY,
            apiSecretExists: !!process.env.CLOUDINARY_API_SECRET,
        });

        if (
            !process.env.CLOUDINARY_CLOUD_NAME ||
            !process.env.CLOUDINARY_API_KEY ||
            !process.env.CLOUDINARY_API_SECRET
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Cloudinary environment variables are missing",
                },
                { status: 500 }
            );
        }

        // --------------------------------------
        // 6. PARSE PRICES
        // --------------------------------------

        let prices;

        try {
            prices = JSON.parse(pricesData);
        } catch (error) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid prices format",
                },
                { status: 400 }
            );
        }

        console.log("PARSED PRICES:", prices);

        // --------------------------------------
        // 7. UPLOAD IMAGES TO CLOUDINARY
        // --------------------------------------

        const result = await Promise.all(
            files.map(async (file) => {
                console.log("Uploading file:", {
                    name: file.name,
                    type: file.type,
                    size: file.size,
                });

                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        {
                            resource_type: "image",
                            folder: "dirghayush/products",
                        },
                        (error, result) => {
                            if (error) {
                                console.error(
                                    "CLOUDINARY UPLOAD ERROR:",
                                    error
                                );

                                reject(error);
                            } else {
                                console.log(
                                    "CLOUDINARY SUCCESS:",
                                    result.secure_url
                                );

                                resolve(result);
                            }
                        }
                    );

                    stream.end(buffer);
                });
            })
        );

        // --------------------------------------
        // 8. GET IMAGE URLS
        // --------------------------------------

        const image = result.map(
            (item) => item.secure_url
        );

        console.log("CLOUDINARY IMAGES:", image);

        // --------------------------------------
        // 9. CONNECT MONGODB
        // --------------------------------------

        await connectDB();

        // --------------------------------------
        // 10. CREATE PRODUCT
        // --------------------------------------

        const newProduct = await Product.create({
            userId,
            name,
            description,
            benefits,
            prices,
            image,
            date: Date.now(),
        });

        console.log(
            "PRODUCT CREATED:",
            newProduct._id
        );

        // --------------------------------------
        // 11. SUCCESS
        // --------------------------------------

        return NextResponse.json(
            {
                success: true,
                message: "Product added successfully",
                product: newProduct,
            },
            { status: 201 }
        );

    } catch (error) {
        console.error(
            "ADD PRODUCT API ERROR:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    error.message ||
                    "Something went wrong",
            },
            { status: 500 }
        );
    }
}