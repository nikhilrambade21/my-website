import { Inngest } from "inngest";
import connectDB from "./db";
import User from "../models/user";

export const inngest = new Inngest({
    id: "dirghayushoils-next",
});

// ==========================================
// CREATE USER
// ==========================================

export const syncUserCreation = inngest.createFunction(
    {
        id: "sync-user-from-clerk",

        triggers: {
            event: "clerk/user.created",
        },
    },

    async ({ event }) => {
        console.log("=================================");
        console.log("CLERK USER CREATED EVENT");
        console.log(JSON.stringify(event, null, 2));
        console.log("=================================");

        const {
            id,
            first_name,
            last_name,
            email_addresses,
            image_url,
        } = event.data;

        const email =
            email_addresses?.[0]?.email_address;

        const name =
            `${first_name || ""} ${last_name || ""}`.trim() ||
            email?.split("@")[0] ||
            `User-${id}`;

        console.log("=================================");
        console.log("FINAL USER DATA");
        console.log({
            id,
            email,
            first_name,
            last_name,
            name,
            image_url,
        });
        console.log("=================================");

        const userData = {
            _id: id,
            email: email,
            name: name,
            imageUrl: image_url || "",
        };

        await connectDB();

        console.log(
            "CREATING MONGODB USER:",
            userData
        );

        await User.create(userData);

        console.log(
            "USER CREATED SUCCESSFULLY"
        );

        return {
            success: true,
            message: "User created successfully",
        };
    }
);

// ==========================================
// UPDATE USER
// ==========================================

export const syncUserUpdation = inngest.createFunction(
    {
        id: "update-user-from-clerk",

        triggers: {
            event: "clerk/user.updated",
        },
    },

    async ({ event }) => {
        const {
            id,
            first_name,
            last_name,
            email_addresses,
            image_url,
        } = event.data;

        const email =
            email_addresses?.[0]?.email_address;

        const name =
            `${first_name || ""} ${last_name || ""}`.trim() ||
            email?.split("@")[0] ||
            "User";

        const userData = {
            email,
            name,
            imageUrl: image_url || "",
        };

        await connectDB();

        await User.findByIdAndUpdate(
            id,
            userData
        );

        console.log(
            "USER UPDATED SUCCESSFULLY:",
            id
        );

        return {
            success: true,
            message: "User updated successfully",
        };
    }
);

// ==========================================
// DELETE USER
// ==========================================

export const syncUserDeletion = inngest.createFunction(
    {
        id: "delete-user-with-clerk",

        triggers: {
            event: "clerk/user.deleted",
        },
    },

    async ({ event }) => {
        const { id } = event.data;

        await connectDB();

        await User.findByIdAndDelete(id);

        console.log(
            "USER DELETED SUCCESSFULLY:",
            id
        );

        return {
            success: true,
            message: "User deleted successfully",
        };
    }
);

// ==========================================
// PROCESS CREATED ORDER
// ==========================================
//
// IMPORTANT:
// The order is already created by
// /api/order/create.
//
// Therefore this Inngest function MUST NOT
// create another Order document.
//
// It only processes the event in background.
// ==========================================
export const createUserOrder = inngest.createFunction(
    {
        id: "create-user-order",
        triggers: { event: "order/created" },
        batchEvents: {
            maxSize: 5,
            timeout: "5s",
        },
    },
    async ({ events }) => {
        try {
            console.log("=================================");
            console.log("INNGEST CREATE USER ORDER");
            console.log("EVENTS RECEIVED:", events.length);
            console.log("=================================");

            const orders = events.map((event) => {
                console.log("ORDER EVENT DATA:", event.data);

                return {
                    userId: event.data.userId,
                    items: event.data.items,
                    amounts: event.data.amounts,
                    address: event.data.address,
                    date: event.data.date || Date.now(),
                };
            });

            await connectDB();

            console.log("CREATING ORDERS IN MONGODB...");

            const createdOrders = await Order.insertMany(orders);

            console.log("=================================");
            console.log("ORDERS CREATED SUCCESSFULLY");
            console.log("COUNT:", createdOrders.length);
            console.log("=================================");

            return {
                success: true,
                processed: createdOrders.length,
            };
        } catch (error) {
            console.error("=================================");
            console.error("INNGEST CREATE ORDER ERROR");
            console.error(error);
            console.error("=================================");

            throw error;
        }
    }
);