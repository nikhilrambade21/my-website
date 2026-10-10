"use client";

import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

const AddProduct = () => {
    // Get Clerk authentication directly
    const { getToken } = useAuth();

    const [file, setFile] = useState(null);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [benefits, setBenefits] = useState("");

    const [prices, setPrices] = useState({
        "50ml": "",
        "100ml": "",
        "200ml": "",
        "500ml": "",
        "1 Liter": "",
        "2 Liter": "",
        "5 Liter": "",
    });

    const [loading, setLoading] = useState(false);

    // -----------------------------
    // PRICE CHANGE
    // -----------------------------

    const handlePriceChange = (size, value) => {
        setPrices((prev) => ({
            ...prev,
            [size]: value,
        }));
    };

    // -----------------------------
    // IMAGE CHANGE
    // -----------------------------

    const handleImageChange = (e) => {
        const selectedFile = e.target.files?.[0];

        if (!selectedFile) return;

        // Check image type
        if (!selectedFile.type.startsWith("image/")) {
            toast.error("Please select a valid image");
            return;
        }

        // Check image size - 5MB
        if (selectedFile.size > 5 * 1024 * 1024) {
            toast.error("Image size should be less than 5MB");
            return;
        }

        setFile(selectedFile);
    };

    // -----------------------------
    // SUBMIT
    // -----------------------------

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("🔥 ADD PRODUCT BUTTON CLICKED");

        // -----------------------------
        // VALIDATION
        // -----------------------------

        if (!file) {
            toast.error("Please select a product image");
            return;
        }

        if (!name.trim()) {
            toast.error("Please enter product name");
            return;
        }

        if (!description.trim()) {
            toast.error("Please enter product description");
            return;
        }

        if (!benefits.trim()) {
            toast.error("Please enter product benefits");
            return;
        }

        // At least one price
        const hasPrice = Object.values(prices).some(
            (price) => price !== "" && Number(price) > 0
        );

        if (!hasPrice) {
            toast.error("Please enter at least one product price");
            return;
        }

        try {
            setLoading(true);

            // -----------------------------
            // GET CLERK TOKEN
            // -----------------------------

            console.log("🔥 Getting Clerk token...");

            const token = await getToken();

            console.log("🔥 Token received:", !!token);

            if (!token) {
                toast.error("You are not authenticated");
                return;
            }

            // -----------------------------
            // CREATE FORM DATA
            // -----------------------------

            const formData = new FormData();

            formData.append("name", name.trim());

            formData.append(
                "description",
                description.trim()
            );

            formData.append(
                "benefits",
                benefits.trim()
            );

            // Send prices object as JSON
            formData.append(
                "prices",
                JSON.stringify(prices)
            );

            // IMPORTANT:
            // API expects "images"
            formData.append("images", file);

            console.log("🔥 Product data:");
            console.log({
                name,
                description,
                benefits,
                prices,
                file,
            });

            console.log(
                "🔥 Sending request to /api/product/add..."
            );

            // -----------------------------
            // API REQUEST
            // -----------------------------

            const { data } = await axios.post(
                "/api/product/add",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("🔥 API RESPONSE:", data);

            // -----------------------------
            // SUCCESS
            // -----------------------------

            if (data.success) {
                toast.success(
                    data.message || "Product added successfully"
                );

                // Reset form
                setFile(null);

                setName("");

                setDescription("");

                setBenefits("");

                setPrices({
                    "50ml": "",
                    "100ml": "",
                    "200ml": "",
                    "500ml": "",
                    "1 Liter": "",
                    "2 Liter": "",
                    "5 Liter": "",
                });

                // Reset file input
                const fileInput =
                    document.getElementById("product-image");

                if (fileInput) {
                    fileInput.value = "";
                }

            } else {
                toast.error(
                    data.message ||
                    "Failed to add product"
                );
            }

        } catch (error) {

            console.error(
                "🔥 ADD PRODUCT ERROR:",
                error
            );

            console.error(
                "API RESPONSE:",
                error.response?.data
            );

            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Something went wrong"
            );

        } finally {
            setLoading(false);
        }
    };

    // -----------------------------
    // UI
    // -----------------------------

    return (
        <div className="flex-1 min-h-screen bg-[#F5E9D3] px-4 py-6 sm:px-6 md:px-10">

            <div className="max-w-5xl mx-auto">

                {/* =========================
                    PAGE HEADER
                ========================= */}

                <div className="mb-7">

                    <div className="flex items-center gap-3 mb-2">

                        <div className="h-9 w-1 rounded-full bg-[#C5A059]"></div>

                        <div>
                            
                            <h1 className="text-2xl sm:text-3xl font-semibold text-[#350303]">
                                Add New Product
                            </h1>
                        </div>

                    </div>

                    <p className="text-sm text-gray-600 ml-4 sm:ml-7">
                        Add your authentic cold pressed oil product
                        details and pricing.
                    </p>

                </div>


                {/* =========================
                    FORM CARD
                ========================= */}

                <form
                    onSubmit={handleSubmit}
                    className="bg-[#FFF9ED] rounded-2xl border border-[#E6D3A3] shadow-[0_8px_30px_rgba(123,22,22,0.08)] overflow-hidden"
                >

                    {/* =========================
                        CARD HEADER
                    ========================= */}

                    <div className="px-5 sm:px-8 py-5 border-b border-[#E6D3A3] bg-[#fffaf0]">

                        <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-full bg-[#7B1616] flex items-center justify-center shadow-sm">

                                <span className="text-[#F5E9D3] text-lg">
                                    ✦
                                </span>

                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-[#350303]">
                                    Product Information
                                </h2>

                                <p className="text-xs text-gray-500 mt-0.5">
                                    Enter the details of your oil product
                                </p>
                            </div>

                        </div>

                    </div>


                    {/* =========================
                        FORM CONTENT
                    ========================= */}

                    <div className="p-5 sm:p-8">


                        {/* =========================
                            PRODUCT IMAGE
                        ========================= */}

                        <div className="mb-8">

                            <label className="block text-sm font-semibold text-[#350303] mb-3">
                                Product Image
                            </label>

                            <div className="border border-[#DCC795] rounded-xl bg-[#FFFDF7] overflow-hidden">

                                {file ? (

                                    <div className="p-5 sm:p-6">

                                        <div className="flex flex-col sm:flex-row items-center gap-5">

                                            {/* IMAGE PREVIEW */}

                                            <div className="w-36 h-36 sm:w-40 sm:h-40 bg-[#F5E9D3] rounded-xl border border-[#E6D3A3] p-2 flex items-center justify-center flex-shrink-0">

                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt="Product preview"
                                                    className="w-full h-full object-contain rounded-lg"
                                                />

                                            </div>


                                            {/* FILE DETAILS */}

                                            <div className="text-center sm:text-left">

                                                <p className="text-sm font-semibold text-[#350303] mb-1">
                                                    Product image selected
                                                </p>

                                                <p className="text-xs text-gray-500 mb-4 break-all">
                                                    {file.name}
                                                </p>

                                                <label
                                                    htmlFor="product-image"
                                                    className="inline-flex items-center gap-2 bg-[#7B1616] hover:bg-[#5f1010] text-white px-5 py-2.5 rounded-lg cursor-pointer text-sm font-medium transition"
                                                >
                                                    <span>↻</span>
                                                    Change Image
                                                </label>

                                            </div>

                                        </div>

                                    </div>

                                ) : (

                                    <div className="p-7 sm:p-10 text-center">

                                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F5E9D3] border border-[#E6D3A3] flex items-center justify-center">

                                            <span className="text-2xl">
                                                📷
                                            </span>

                                        </div>

                                        <p className="text-sm font-semibold text-[#350303] mb-1">
                                            Upload Product Image
                                        </p>

                                        <p className="text-xs text-gray-500 mb-5">
                                            Use a clear image of your Dirghayush Oils product
                                        </p>

                                        <label
                                            htmlFor="product-image"
                                            className="inline-flex items-center gap-2 bg-[#7B1616] hover:bg-[#5f1010] text-white px-6 py-2.5 rounded-lg cursor-pointer text-sm font-medium transition shadow-sm"
                                        >
                                            Choose Image
                                            <span>→</span>
                                        </label>

                                        <p className="text-[11px] text-gray-400 mt-4">
                                            JPG, PNG, WEBP • Maximum 5MB
                                        </p>

                                    </div>

                                )}

                                <input
                                    id="product-image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />

                            </div>

                        </div>


                        {/* =========================
                            PRODUCT NAME
                        ========================= */}

                        <div className="mb-7">

                            <label className="block text-sm font-semibold text-[#350303] mb-2">
                                Product Name
                            </label>

                            <input
                                type="text"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                placeholder="e.g. Wooden Cold Pressed Groundnut Oil"
                                className="
                                    w-full
                                    bg-white
                                    border
                                    border-[#DCC795]
                                    rounded-lg
                                    px-4
                                    py-3
                                    text-sm
                                    text-[#350303]
                                    placeholder:text-gray-400
                                    outline-none
                                    transition
                                    focus:border-[#7B1616]
                                    focus:ring-2
                                    focus:ring-[#7B1616]/10
                                "
                            />

                        </div>


                        {/* =========================
                            DESCRIPTION + BENEFITS
                        ========================= */}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

                            {/* DESCRIPTION */}

                            <div>

                                <label className="block text-sm font-semibold text-[#350303] mb-2">
                                    Description
                                </label>

                                <textarea
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    placeholder="Describe your product, ingredients, process, quality, etc."
                                    rows={6}
                                    className="
                                        w-full
                                        bg-white
                                        border
                                        border-[#DCC795]
                                        rounded-lg
                                        px-4
                                        py-3
                                        text-sm
                                        text-[#350303]
                                        placeholder:text-gray-400
                                        outline-none
                                        resize-none
                                        transition
                                        focus:border-[#7B1616]
                                        focus:ring-2
                                        focus:ring-[#7B1616]/10
                                    "
                                />

                            </div>


                            {/* BENEFITS */}

                            <div>

                                <label className="block text-sm font-semibold text-[#350303] mb-2">
                                    Benefits
                                </label>

                                <textarea
                                    value={benefits}
                                    onChange={(e) =>
                                        setBenefits(e.target.value)
                                    }
                                    placeholder="Enter the health and quality benefits of this product."
                                    rows={6}
                                    className="
                                        w-full
                                        bg-white
                                        border
                                        border-[#DCC795]
                                        rounded-lg
                                        px-4
                                        py-3
                                        text-sm
                                        text-[#350303]
                                        placeholder:text-gray-400
                                        outline-none
                                        resize-none
                                        transition
                                        focus:border-[#7B1616]
                                        focus:ring-2
                                        focus:ring-[#7B1616]/10
                                    "
                                />

                            </div>

                        </div>


                        {/* =========================
                            PRICES
                        ========================= */}

                        <div className="border-t border-[#E6D3A3] pt-7">

                            <div className="mb-5">

                                <div className="flex items-center gap-3">

                                    <div className="w-9 h-9 rounded-lg bg-[#7B1616] flex items-center justify-center">

                                        <span className="text-[#F5E9D3] text-sm">
                                            ₹
                                        </span>

                                    </div>

                                    <div>

                                        <h2 className="text-lg font-semibold text-[#350303]">
                                            Product Prices
                                        </h2>

                                        <p className="text-xs text-gray-500">
                                            Set prices for different product sizes
                                        </p>

                                    </div>

                                </div>

                            </div>


                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

                                {Object.keys(prices).map((size) => (

                                    <div
                                        key={size}
                                        className="bg-white border border-[#DCC795] rounded-xl p-4 hover:border-[#C5A059] transition"
                                    >

                                        <label className="block text-xs font-semibold text-[#7B1616] mb-2">
                                            {size}
                                        </label>

                                        <div className="relative">

                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#7B1616]">
                                                ₹
                                            </span>

                                            <input
                                                type="number"
                                                min="0"
                                                value={prices[size]}
                                                onChange={(e) =>
                                                    handlePriceChange(
                                                        size,
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter price"
                                                className="
                                                    w-full
                                                    border
                                                    border-gray-200
                                                    rounded-lg
                                                    pl-8
                                                    pr-3
                                                    py-2.5
                                                    text-sm
                                                    text-[#350303]
                                                    outline-none
                                                    focus:border-[#7B1616]
                                                    focus:ring-2
                                                    focus:ring-[#7B1616]/10
                                                "
                                            />

                                        </div>

                                    </div>

                                ))}

                            </div>

                        </div>


                        {/* =========================
                            SUBMIT SECTION
                        ========================= */}

                        <div className="mt-8 pt-6 border-t border-[#E6D3A3] flex flex-col sm:flex-row items-center justify-between gap-4">

                            <div className="text-center sm:text-left">

                                <p className="text-sm font-medium text-[#350303]">
                                    Ready to add your product?
                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                    Make sure all product information is correct.
                                </p>

                            </div>


                            <button
                                type="submit"
                                disabled={loading}
                                className="
                                    w-full
                                    sm:w-auto
                                    min-w-[180px]
                                    bg-[#7B1616]
                                    hover:bg-[#5f1010]
                                    text-white
                                    px-7
                                    py-3
                                    rounded-lg
                                    font-semibold
                                    text-sm
                                    transition
                                    shadow-sm
                                    hover:shadow-md
                                    disabled:opacity-50
                                    disabled:cursor-not-allowed
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                "
                            >

                                {loading ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                                        ADDING PRODUCT...
                                    </>
                                ) : (
                                    <>
                                        ADD PRODUCT
                                        <span>→</span>
                                    </>
                                )}

                            </button>

                        </div>

                    </div>

                </form>


                {/* =========================
                    FOOTER NOTE
                ========================= */}

                <div className="text-center mt-5 mb-3">

                    <p className="text-xs text-gray-500">
                        Pure • Natural • Traditional • Dirghayush Oils
                    </p>

                </div>

            </div>

        </div>
    );
};

export default AddProduct;