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

    const email = email_addresses?.[0]?.email_address;

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

    console.log("CREATING MONGODB USER:", userData);

    await User.create(userData);

    console.log("USER CREATED SUCCESSFULLY");
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

    const email = email_addresses?.[0]?.email_address;

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

    await User.findByIdAndUpdate(id, userData);

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

    return {
      success: true,
      message: "User deleted successfully",
    };
  }
);