"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";

const ProductList = () => {
  const router = useRouter();
  const { getToken } = useAuth();

  const { user } = useAppContext();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected size for each product
  const [selectedSizes, setSelectedSizes] = useState({});

  // Fetch seller products
  const fetchSellerProduct = async () => {
    try {
      const token = await getToken();

      const { data } = await axios.get("/api/product/seller-list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Fetch seller products error:", error);
      toast.error(error.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSellerProduct();
    }
  }, [user]);

  // Change selected size
  const handleSizeChange = (productId, size) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }));
  };

  // Get available sizes
  const getAvailableSizes = (product) => {
    if (!product.prices) {
      return [];
    }

    return Object.entries(product.prices)
      .filter(
        ([_, price]) =>
          price !== null &&
          price !== undefined
      )
      .map(([size]) => size);
  };

  // Get first Cloudinary image
  const getProductImage = (product) => {
    if (!product?.image) {
      return null;
    }

    // If image is an array
    if (Array.isArray(product.image)) {
      return product.image[0] || null;
    }

    // If image is already a string
    return product.image || null;
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between bg-[#F5E9D3]">

      {loading ? (
        <Loading />
      ) : (
        <div className="w-full p-4 sm:p-6 md:p-10">

          <div className="max-w-7xl mx-auto">

            {/* ========================================= */}
            {/* PAGE HEADER */}
            {/* ========================================= */}

            <div className="mb-7">

              <div className="flex items-center gap-3 mb-2">

                <div className="h-9 w-1 rounded-full bg-[#C5A059]"></div>

                <div>

                  <h1 className="text-2xl sm:text-3xl font-semibold text-[#350303]">
                    All Products
                  </h1>

                </div>

              </div>

              <p className="text-sm text-gray-600 ml-4 sm:ml-7">
                Manage your Dirghayush Oils products and prices.
              </p>

            </div>


            {/* ========================================= */}
            {/* MOBILE PRODUCT CARDS */}
            {/* ========================================= */}

            <div className="flex flex-col gap-5 md:hidden">

              {products.length === 0 ? (

                <div className="bg-[#FFF9ED] border border-[#E6D3A3] rounded-2xl p-10 text-center">

                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F5E9D3] flex items-center justify-center">
                    <span className="text-2xl">🛢️</span>
                  </div>

                  <h3 className="text-lg font-semibold text-[#350303]">
                    No Products Found
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Add your first Dirghayush Oils product.
                  </p>

                </div>

              ) : (

                products.map((product) => {

                  const availableSizes =
                    getAvailableSizes(product);

                  const selectedSize =
                    selectedSizes[product._id] ||
                    availableSizes[0];

                  const selectedPrice =
                    selectedSize && product.prices
                      ? product.prices[selectedSize]
                      : 0;

                  const productImage =
                    getProductImage(product);

                  return (

                    <div
                      key={product._id}
                      className="
                        bg-[#FFF9ED]
                        rounded-2xl
                        border
                        border-[#E6D3A3]
                        p-4
                        shadow-[0_5px_20px_rgba(123,22,22,0.06)]
                      "
                    >

                      {/* PRODUCT TOP */}

                      <div className="flex items-center gap-4">

                        {/* IMAGE */}

                        <div
                          className="
                            w-20
                            h-20
                            bg-[#F5E9D3]
                            rounded-xl
                            p-2
                            flex
                            items-center
                            justify-center
                            flex-shrink-0
                            border
                            border-[#E6D3A3]
                          "
                        >

                          {productImage ? (

                            <Image
                              src={productImage}
                              alt={product.name || "Product"}
                              width={80}
                              height={80}
                              className="w-full h-full object-contain rounded-lg"
                            />

                          ) : (

                            <div className="text-xs text-gray-400 text-center">
                              No Image
                            </div>

                          )}

                        </div>


                        {/* NAME */}

                        <div className="min-w-0 flex-1">

                          <h3 className="font-semibold text-[#350303] text-base truncate">
                            {product.name}
                          </h3>

                        </div>

                      </div>


                      {/* DIVIDER */}

                      <div className="border-t border-[#E6D3A3] my-4"></div>


                      {/* SIZE + PRICE */}

                      <div className="flex items-end justify-between gap-3">

                        {/* SIZE */}

                        <div className="flex flex-col gap-1 flex-1">

                          <label className="text-xs font-semibold text-[#7B1616]">
                            Select Size
                          </label>

                          <select
                            value={selectedSize || ""}
                            onChange={(e) =>
                              handleSizeChange(
                                product._id,
                                e.target.value
                              )
                            }
                            className="
                              w-full
                              bg-white
                              border
                              border-[#DCC795]
                              rounded-lg
                              px-3
                              py-2.5
                              text-sm
                              text-[#350303]
                              outline-none
                              focus:border-[#7B1616]
                              focus:ring-2
                              focus:ring-[#7B1616]/10
                            "
                          >

                            {availableSizes.map((size) => (

                              <option
                                key={size}
                                value={size}
                              >
                                {size}
                              </option>

                            ))}

                          </select>

                        </div>


                        {/* PRICE */}

                        <div className="text-right min-w-[80px]">

                          <p className="text-xs text-gray-500 mb-1">
                            Price
                          </p>

                          <p className="text-lg font-bold text-[#7B1616]">
                            ₹{selectedPrice}
                          </p>

                        </div>

                      </div>


                      {/* VISIT BUTTON */}

                      <button
                        onClick={() =>
                          router.push(
                            `/products/${product._id}`
                          )
                        }
                        className="
                          w-full
                          mt-4
                          py-2.5
                          bg-[#7B1616]
                          hover:bg-[#5f1010]
                          text-white
                          rounded-lg
                          font-semibold
                          text-sm
                          transition
                          cursor-pointer
                          flex
                          items-center
                          justify-center
                          gap-2
                        "
                      >
                        Visit Product
                        <span>→</span>
                      </button>

                    </div>

                  );

                })

              )}

            </div>


            {/* ========================================= */}
            {/* DESKTOP TABLE */}
            {/* ========================================= */}

            <div
              className="
                hidden
                md:block
                w-full
                overflow-hidden
                rounded-2xl
                bg-[#FFF9ED]
                border
                border-[#E6D3A3]
                shadow-[0_8px_30px_rgba(123,22,22,0.07)]
              "
            >

              {products.length === 0 ? (

                <div className="p-14 text-center">

                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F5E9D3] flex items-center justify-center">
                    <span className="text-2xl">🛢️</span>
                  </div>

                  <h3 className="text-lg font-semibold text-[#350303]">
                    No Products Found
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Add your first Dirghayush Oils product.
                  </p>

                </div>

              ) : (

                <table className="w-full">

                  {/* TABLE HEADER */}

                  <thead className="bg-[#fffaf0] text-[#350303] text-sm text-left border-b border-[#E6D3A3]">

                    <tr>

                      <th className="px-6 py-4 font-semibold">
                        Product
                      </th>

                      <th className="px-6 py-4 font-semibold">
                        Select Size
                      </th>

                      <th className="px-6 py-4 font-semibold">
                        Price
                      </th>

                      <th className="px-6 py-4 font-semibold text-center">
                        Action
                      </th>

                    </tr>

                  </thead>


                  {/* PRODUCTS */}

                  <tbody className="text-sm text-gray-600">

                    {products.map((product) => {

                      const availableSizes =
                        getAvailableSizes(product);

                      const selectedSize =
                        selectedSizes[product._id] ||
                        availableSizes[0];

                      const selectedPrice =
                        selectedSize && product.prices
                          ? product.prices[selectedSize]
                          : 0;

                      const productImage =
                        getProductImage(product);

                      return (

                        <tr
                          key={product._id}
                          className="
                            border-t
                            border-[#E6D3A3]
                            hover:bg-[#fffaf0]
                            transition
                          "
                        >

                          {/* PRODUCT */}

                          <td className="px-6 py-5">

                            <div className="flex items-center gap-4">

                              {/* IMAGE */}

                              <div
                                className="
                                  w-16
                                  h-16
                                  bg-[#F5E9D3]
                                  rounded-xl
                                  p-1.5
                                  flex
                                  items-center
                                  justify-center
                                  flex-shrink-0
                                  border
                                  border-[#E6D3A3]
                                "
                              >

                                {productImage ? (

                                  <Image
                                    src={productImage}
                                    alt={
                                      product.name ||
                                      "Product"
                                    }
                                    width={64}
                                    height={64}
                                    className="w-full h-full object-contain rounded-lg"
                                  />

                                ) : (

                                  <div className="text-xs text-gray-400 text-center">
                                    No Image
                                  </div>

                                )}

                              </div>


                              {/* PRODUCT NAME */}

                              <div>

                                <span className="font-semibold text-[#350303]">
                                  {product.name}
                                </span>

                              </div>

                            </div>

                          </td>


                          {/* SIZE */}

                          <td className="px-6 py-5">

                            <select
                              value={selectedSize || ""}
                              onChange={(e) =>
                                handleSizeChange(
                                  product._id,
                                  e.target.value
                                )
                              }
                              className="
                                bg-white
                                border
                                border-[#DCC795]
                                rounded-lg
                                px-4
                                py-2.5
                                text-sm
                                text-[#350303]
                                outline-none
                                focus:border-[#7B1616]
                                focus:ring-2
                                focus:ring-[#7B1616]/10
                                cursor-pointer
                              "
                            >

                              {availableSizes.map((size) => (

                                <option
                                  key={size}
                                  value={size}
                                >
                                  {size}
                                </option>

                              ))}

                            </select>

                          </td>


                          {/* PRICE */}

                          <td className="px-6 py-5">

                            <span className="font-bold text-[#7B1616]">
                              ₹{selectedPrice}
                            </span>

                          </td>


                          {/* ACTION */}

                          <td className="px-6 py-5">

                            <div className="flex justify-center">

                              <button
                                onClick={() =>
                                  router.push(
                                    `/products/${product._id}`
                                  )
                                }
                                className="
                                  flex
                                  items-center
                                  gap-2
                                  px-5
                                  py-2.5
                                  bg-[#7B1616]
                                  hover:bg-[#5f1010]
                                  text-white
                                  rounded-lg
                                  font-medium
                                  transition
                                  cursor-pointer
                                  shadow-sm
                                "
                              >

                                <span>
                                  Visit
                                </span>

                                <span>
                                  →
                                </span>

                              </button>

                            </div>

                          </td>

                        </tr>

                      );

                    })}

                  </tbody>

                </table>

              )}

            </div>

          </div>

        </div>
      )}

      <Footer />

    </div>
  );
};

export default ProductList;