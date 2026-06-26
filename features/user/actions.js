"use server";

import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Order from "@/models/Order";
import Product from "@/models/Product"; // Ensure Product is registered for population
import { auth } from "@/lib/auth";
import { headers } from "next/headers";


export async function getDashboardData(userId) {
  if (!userId) throw new Error("Unauthorized");
  await dbConnect();

  const [totalOrders, activeDeliveries, user, recentOrders] = await Promise.all([
    Order.countDocuments({ user: userId }),
    Order.countDocuments({ user: userId, status: { $in: ["processing", "shipped", "in_transit"] } }),
    User.findById(userId).select("points").lean(),
    Order.find({ user: userId }).sort({ createdAt: -1 }).limit(3).lean()
  ]);

  return {
    totalOrders,
    activeDeliveries,
    points: user?.points || 0,
    recentOrders: JSON.parse(JSON.stringify(recentOrders)),
  };
}

export async function getOrders(userId, { page = 1, status, limit = 10 } = {}) {
  if (!userId) throw new Error("Unauthorized");
  await dbConnect();

  const query = { user: userId };
  if (status && status !== "all") {
    query.status = status;
  }

  const skip = (page - 1) * limit;

  const [orders, totalCount] = await Promise.all([
    Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Order.countDocuments(query)
  ]);

  return {
    orders: JSON.parse(JSON.stringify(orders)),
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
    totalCount
  };
}

export async function getOrderById(orderId, userId) {
  if (!userId) throw new Error("Unauthorized");
  await dbConnect();

  const order = await Order.findOne({ _id: orderId, user: userId })
    .populate("items.product", "name images price slug")
    .lean();

  if (!order) return null;

  return JSON.parse(JSON.stringify(order));
}

export async function updateUserProfile(userId, { name, avatar }) {
  if (!userId) throw new Error("Unauthorized");
  await dbConnect();

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (avatar !== undefined) updateData.avatar = avatar;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true }
  ).lean();

  return JSON.parse(JSON.stringify(updatedUser));
}

export async function addAddress(userId, addressData) {
  if (!userId) throw new Error("Unauthorized");
  await dbConnect();

  // Use native MongoDB driver — better-auth owns the 'user' collection
  // and its schema doesn't match our Mongoose UserSchema, so .save() fails.
  const db = mongoose.connection.getClient().db();
  const col = db.collection("user");

  const { ObjectId } = mongoose.Types;
  const userOid = new ObjectId(userId);

  const user = await col.findOne({ _id: userOid });
  if (!user) throw new Error("User not found");

  const addresses = user.addresses || [];

  // New address is the first → auto-default
  if (addresses.length === 0) addressData.isDefault = true;

  // If marking new one as default, clear all others
  const updatedAddresses = addressData.isDefault
    ? addresses.map((a) => ({ ...a, isDefault: false }))
    : addresses;

  const newAddr = {
    _id: new ObjectId(),
    fullName:        addressData.fullName        || "",
    phone:           addressData.phone           || "",
    street:          addressData.street          || "",
    city:            addressData.city            || "",
    state:           addressData.state           || "",
    zip:             addressData.zip             || "",
    country:         addressData.country         || "",
    buildingDetails: addressData.buildingDetails || "",
    isDefault:       !!addressData.isDefault,
  };

  updatedAddresses.push(newAddr);

  await col.updateOne({ _id: userOid }, { $set: { addresses: updatedAddresses } });

  return JSON.parse(JSON.stringify(updatedAddresses));
}

export async function updateAddress(userId, addressId, addressData) {
  if (!userId) throw new Error("Unauthorized");
  await dbConnect();

  const db = mongoose.connection.getClient().db();
  const col = db.collection("user");

  const { ObjectId } = mongoose.Types;
  const userOid    = new ObjectId(userId);
  const addressOid = new ObjectId(addressId);

  const user = await col.findOne({ _id: userOid });
  if (!user) throw new Error("User not found");

  let addresses = (user.addresses || []).map((a) => {
    const isTarget = a._id.toString() === addressId;
    if (!isTarget) {
      // If we're setting a new default, clear all others
      return addressData.isDefault ? { ...a, isDefault: false } : a;
    }
    return {
      ...a,
      fullName:        addressData.fullName        ?? a.fullName,
      phone:           addressData.phone           ?? a.phone,
      street:          addressData.street          ?? a.street,
      city:            addressData.city            ?? a.city,
      state:           addressData.state           ?? a.state,
      zip:             addressData.zip             ?? a.zip,
      country:         addressData.country         ?? a.country,
      buildingDetails: addressData.buildingDetails ?? a.buildingDetails,
      isDefault:       addressData.isDefault !== undefined ? !!addressData.isDefault : a.isDefault,
    };
  });

  await col.updateOne({ _id: userOid }, { $set: { addresses } });

  return JSON.parse(JSON.stringify(addresses));
}

export async function deleteAddress(userId, addressId) {
  if (!userId) throw new Error("Unauthorized");
  await dbConnect();

  const db = mongoose.connection.getClient().db();
  const col = db.collection("user");

  const { ObjectId } = mongoose.Types;
  const userOid = new ObjectId(userId);

  const user = await col.findOne({ _id: userOid });
  if (!user) throw new Error("User not found");

  let addresses = (user.addresses || []).filter(
    (a) => a._id.toString() !== addressId,
  );

  // If we just removed the default, promote the first remaining address
  if (addresses.length > 0 && !addresses.some((a) => a.isDefault)) {
    addresses[0] = { ...addresses[0], isDefault: true };
  }

  await col.updateOne({ _id: userOid }, { $set: { addresses } });

  return JSON.parse(JSON.stringify(addresses));
}

export async function setDefaultAddress(userId, addressId) {
  if (!userId) throw new Error("Unauthorized");
  await dbConnect();

  const db = mongoose.connection.getClient().db();
  const col = db.collection("user");

  const { ObjectId } = mongoose.Types;
  const userOid = new ObjectId(userId);

  const user = await col.findOne({ _id: userOid });
  if (!user) throw new Error("User not found");

  const addresses = (user.addresses || []).map((a) => ({
    ...a,
    isDefault: a._id.toString() === addressId,
  }));

  await col.updateOne({ _id: userOid }, { $set: { addresses } });

  return JSON.parse(JSON.stringify(addresses));
}


export async function updateNotificationPreferences(userId, prefs) {
  if (!userId) throw new Error("Unauthorized");
  await dbConnect();

  const updateData = {};
  if (prefs.emailOrderUpdates !== undefined) updateData.emailOrderUpdates = prefs.emailOrderUpdates;
  if (prefs.emailPromotions !== undefined) updateData.emailPromotions = prefs.emailPromotions;
  if (prefs.emailNewArrivals !== undefined) updateData.emailNewArrivals = prefs.emailNewArrivals;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true }
  ).lean();

  return JSON.parse(JSON.stringify(updatedUser));
}

export async function changeUserPassword(currentPassword, newPassword) {
  const instance = await auth();
  
  try {
    await instance.api.changePassword({
      body: { newPassword, currentPassword, revokeOtherSessions: true },
      headers: await headers()
    });
    return { success: true };
  } catch (err) {
    throw new Error(err?.body?.message || "Failed to change password. Ensure your current password is correct.");
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Wishlist Actions
// ─────────────────────────────────────────────────────────────────────────────

export async function addToWishlist(productId) {
  const instance = await auth();
  const session = await instance.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  await dbConnect();
  const db = mongoose.connection.getClient().db();
  const col = db.collection("user");
  const { ObjectId } = mongoose.Types;

  await col.updateOne(
    { _id: new ObjectId(session.user.id) },
    { $addToSet: { wishlist: productId } }
  );

  return { success: true };
}

export async function removeFromWishlist(productId) {
  const instance = await auth();
  const session = await instance.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  await dbConnect();
  const db = mongoose.connection.getClient().db();
  const col = db.collection("user");
  const { ObjectId } = mongoose.Types;

  await col.updateOne(
    { _id: new ObjectId(session.user.id) },
    { $pull: { wishlist: productId } }
  );

  return { success: true };
}

export async function getWishlist() {
  const instance = await auth();
  const session = await instance.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  await dbConnect();
  const db = mongoose.connection.getClient().db();
  const col = db.collection("user");
  const { ObjectId } = mongoose.Types;

  const user = await col.findOne({ _id: new ObjectId(session.user.id) });
  if (!user || !user.wishlist || user.wishlist.length === 0) {
    return [];
  }

  // Fetch populated product data
  const products = await Product.find({
    _id: { $in: user.wishlist }
  }).lean();

  return JSON.parse(JSON.stringify(products));
}
