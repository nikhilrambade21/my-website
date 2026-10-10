"use client";

import {
useAuth,
useUser,
} from "@clerk/nextjs";

import axios from "axios";

import {
createContext,
useContext,
useEffect,
useState,
} from "react";

import toast from "react-hot-toast";

/* ==================================================
CREATE CONTEXT
================================================== */

export const AppContext =
createContext();

/* ==================================================
CUSTOM HOOK
================================================== */

export const useAppContext = () => {
return useContext(AppContext);
};

/* ==================================================
PROVIDER
================================================== */

export const AppContextProvider = ({
children,
}) => {
const { user } = useUser();

const { getToken } = useAuth();

/* ==================================================
   STATE
================================================== */

const [userData, setUserData] =
    useState(null);

const [cartItems, setCartItems] =
    useState({});

const [products, setProducts] =
    useState([]);

/* ==================================================
   FETCH ALL PRODUCTS
================================================== */

const fetchProductData =
    async () => {
        try {
            const { data } =
                await axios.get(
                    "/api/product/list"
                );

            if (data.success) {
                setProducts(
                    Array.isArray(
                        data.products
                    )
                        ? data.products
                        : []
                );
            } else {
                toast.error(
                    data.message ||
                        "Unable to load products"
                );
            }
        } catch (error) {
            console.error(
                "Fetch products error:",
                error
            );

            toast.error(
                error.response
                    ?.data?.message ||
                    error.message ||
                    "Unable to load products"
            );
        }
    };

/* ==================================================
   FETCH LOGGED-IN USER DATA
================================================== */

const fetchUserData =
    async () => {
        try {
            /*
             * No logged-in user
             */

            if (!user) {
                setUserData(null);

                setCartItems({});

                return;
            }

            /*
             * Get Clerk token
             */

            const token =
                await getToken();

            /*
             * Fetch user data
             */

            const { data } =
                await axios.get(
                    "/api/user/data",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            if (data.success) {
                setUserData(
                    data.user
                );

                /*
                 * Make sure cart is
                 * always an object.
                 */

                setCartItems(
                    data.user
                        ?.cartItems || {}
                );
            } else {
                toast.error(
                    data.message ||
                        "Unable to load user data"
                );
            }
        } catch (error) {
            console.error(
                "Fetch user data error:",
                error
            );

            toast.error(
                error.response
                    ?.data?.message ||
                    error.message ||
                    "Unable to load user data"
            );
        }
    };

/* ==================================================
   ADD TO CART
================================================== */

const addToCart = async (
    itemId,
    size,
    price
) => {
    /*
     * Validate product
     */

    if (!itemId) {
        toast.error(
            "Invalid product"
        );

        return;
    }

    /*
     * Validate size
     */

    if (!size) {
        toast.error(
            "Please select a size"
        );

        return;
    }

    /*
     * Validate price
     */

    if (
        price === null ||
        price === undefined
    ) {
        toast.error(
            "Price is not available"
        );

        return;
    }

    try {
        /*
         * Copy current cart
         */

        const cartData =
            structuredClone(
                cartItems
            );

        /*
         * Each product size
         * gets its own cart key.
         *
         * Example:
         *
         * productId_500ml
         * productId_1L
         */

        const cartKey =
            `${itemId}_${size}`;

        /*
         * Existing item
         */

        if (
            cartData[cartKey]
        ) {
            /*
             * New cart format
             */

            if (
                typeof cartData[
                    cartKey
                ] === "object"
            ) {
                cartData[
                    cartKey
                ].quantity =
                    Number(
                        cartData[
                            cartKey
                        ].quantity ||
                            0
                    ) + 1;
            }

            /*
             * Old cart format
             */

            else {
                cartData[
                    cartKey
                ] =
                    Number(
                        cartData[
                            cartKey
                        ]
                    ) + 1;
            }
        }

        /*
         * New item
         */

        else {
            cartData[
                cartKey
            ] = {
                productId:
                    itemId,

                size: size,

                price:
                    Number(price),

                quantity: 1,
            };
        }

        /*
         * Update local state
         * immediately.
         */

        setCartItems(
            cartData
        );

        /*
         * Save to database
         * for logged-in users.
         */

        if (user) {
            const token =
                await getToken();

            await axios.post(
                "/api/cart/update",
                {
                    cartData,
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );
        }

        toast.success(
            "Item added to cart"
        );
    } catch (error) {
        console.error(
            "Add to cart error:",
            error
        );

        toast.error(
            error.response
                ?.data?.message ||
                error.message ||
                "Unable to add item to cart"
        );
    }
};

/* ==================================================
   UPDATE CART QUANTITY
================================================== */

const updateCartQuantity =
    async (
        cartKey,
        quantity
    ) => {
        /*
         * Make a copy of cart.
         */

        const cartData =
            structuredClone(
                cartItems
            );

        /*
         * Make sure item exists.
         */

        if (
            !cartData[cartKey]
        ) {
            return;
        }

        /*
         * Quantity 0 or less
         * means remove item.
         */

        if (quantity <= 0) {
            delete cartData[
                cartKey
            ];
        }

        /*
         * New cart format
         */

        else if (
            typeof cartData[
                cartKey
            ] === "object" &&
            cartData[
                cartKey
            ] !== null
        ) {
            cartData[
                cartKey
            ].quantity =
                Number(quantity);
        }

        /*
         * Old cart format
         *
         * Kept for backward
         * compatibility.
         */

        else {
            cartData[
                cartKey
            ] = Number(quantity);
        }

        /*
         * Update local state
         * immediately.
         */

        setCartItems(
            cartData
        );

        /*
         * Save to database
         * for logged-in users.
         */

        if (user) {
            try {
                const token =
                    await getToken();

                await axios.post(
                    "/api/cart/update",
                    {
                        cartData,
                    },
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

                toast.success(
                    "Cart updated"
                );
            } catch (error) {
                console.error(
                    "Update cart error:",
                    error
                );

                toast.error(
                    error.response
                        ?.data?.message ||
                        error.message ||
                        "Unable to update cart"
                );
            }
        }
    };

/* ==================================================
   REMOVE FROM CART
================================================== */

const removeFromCart =
    async (
        cartKey
    ) => {
        /*
         * Make a copy.
         */

        const cartData =
            structuredClone(
                cartItems
            );

        /*
         * Check item.
         */

        if (
            !cartData[cartKey]
        ) {
            return;
        }

        /*
         * Remove item.
         */

        delete cartData[
            cartKey
        ];

        /*
         * Update local state.
         */

        setCartItems(
            cartData
        );

        /*
         * Save to database
         * for logged-in users.
         */

        if (user) {
            try {
                const token =
                    await getToken();

                await axios.post(
                    "/api/cart/update",
                    {
                        cartData,
                    },
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

                toast.success(
                    "Item removed"
                );
            } catch (error) {
                console.error(
                    "Remove cart item error:",
                    error
                );

                toast.error(
                    error.response
                        ?.data?.message ||
                        error.message ||
                        "Unable to remove item"
                );
            }
        }
    };

/* ==================================================
   FETCH PRODUCTS ON MOUNT
================================================== */

useEffect(() => {
    fetchProductData();
}, []);

/* ==================================================
   FETCH USER DATA WHEN AUTH CHANGES
================================================== */

useEffect(() => {
    if (user) {
        fetchUserData();
    } else {
        /*
         * Reset user-specific data
         * when user signs out.
         */

        setUserData(null);

        setCartItems({});
    }
}, [user]);

/* ==================================================
   CONTEXT VALUE
================================================== */

const value = {
    /*
     * Authentication
     */

    user,

    /*
     * User
     */

    userData,

    /*
     * Products
     */

    products,

    /*
     * Cart
     */

    cartItems,

    setCartItems,

    /*
     * API / Data functions
     */

    fetchProductData,

    fetchUserData,

    /*
     * Cart functions
     */

    addToCart,

    updateCartQuantity,

    removeFromCart,
};

/* ==================================================
   PROVIDER
================================================== */

return (
    <AppContext.Provider
        value={value}
    >
        {children}
    </AppContext.Provider>
);

};