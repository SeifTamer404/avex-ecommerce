"use server";

import { headers } from "next/headers";
import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Order from "@/models/Order";

// ── Shipping cost lookup (must mirror DeliveryMethod.jsx constants) ─────────
const DELIVERY_COSTS = {
  standard: 0,
  priority: 12,
};

// ─────────────────────────────────────────────────────────────────────────────
// placeOrderAction
//
// Called by CheckoutClient after the client-side form validation passes.
//
// Payload shape:
// {
//   cartItems    : [{ productId: string, quantity: number }]
//   shippingAddress: {
//     fullName, phone, address, city, state, zip, country
//   }
//   deliveryMethod : "standard" | "priority"
//   paymentMethod  : "cod" | "card"
// }
//
// Returns:
//   { ok: true,  orderId: string }   — success
//   { ok: false, error:   string }   — any validation / auth failure
//
// ⚠ KNOWN LIMITATION — Steps 4 (create order) and 5 (decrement stock) are
//   NOT wrapped in a MongoDB transaction. If the process crashes between them
//   you get an order document with no matching stock reduction.
//   TODO: Wrap in a mongoose session with session.withTransaction() once the
//   Atlas cluster is confirmed to be a replica set (transactions require it).
// ─────────────────────────────────────────────────────────────────────────────
export async function placeOrderAction(payload) {
  // ── Step 1: Verify the session ─────────────────────────────────────────────
  // Auth check runs first, before any DB work. No unauthenticated order ever
  // gets to Step 2.
  let session;
  try {
    const instance = await auth();
    const headersList = await headers();
    session = await instance.api.getSession({ headers: headersList });
  } catch (err) {
    console.error("[placeOrder] auth error:", err);
    return { ok: false, error: "Authentication service unavailable. Please try again." };
  }

  if (!session?.user?.id) {
    return { ok: false, error: "You must be signed in to place an order." };
  }

  const userId = session.user.id;

  // ── Destructure & basic shape validation ───────────────────────────────────
  const { cartItems, shippingAddress, deliveryMethod, paymentMethod } = payload ?? {};

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return { ok: false, error: "Your cart is empty." };
  }

  if (!shippingAddress?.fullName || !shippingAddress?.address || !shippingAddress?.city) {
    return { ok: false, error: "Shipping address is incomplete." };
  }

  if (!DELIVERY_COSTS.hasOwnProperty(deliveryMethod)) {
    return { ok: false, error: "Invalid delivery method." };
  }

  // ── Step 2: Validate cart items against the database ──────────────────────
  // Never trust client-sent prices or stock levels.
  await dbConnect();

  // Parse and sanitise incoming productIds and quantities up front.
  // An invalid ObjectId string must never reach mongoose — it would throw.
  const parsedItems = [];
  for (const item of cartItems) {
    const qty = parseInt(item.quantity, 10);

    if (!item.productId || !mongoose.Types.ObjectId.isValid(item.productId)) {
      return { ok: false, error: `Invalid product ID: ${item.productId}` };
    }
    if (!Number.isInteger(qty) || qty < 1) {
      return { ok: false, error: `Invalid quantity for product ${item.productId}.` };
    }

    parsedItems.push({ productId: item.productId, quantity: qty });
  }

  // Bulk-fetch all referenced products in one query
  const productIds = parsedItems.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: productIds } })
    .select("_id name price stock")
    .lean();

  // Index by string ID for O(1) lookup
  const productMap = Object.fromEntries(
    products.map((p) => [p._id.toString(), p])
  );

  // Verify every cart item: exists + in stock
  for (const { productId, quantity } of parsedItems) {
    const product = productMap[productId];

    if (!product) {
      return { ok: false, error: `Product not found (it may have been removed): ${productId}` };
    }

    if (product.stock < quantity) {
      return {
        ok: false,
        error: `"${product.name}" only has ${product.stock} unit${product.stock === 1 ? "" : "s"} left in stock.`,
      };
    }
  }

  // ── Step 3: Recalculate the total server-side ──────────────────────────────
  // The client's displayed total is for UX only — this is the real figure.
  const shippingCost = DELIVERY_COSTS[deliveryMethod];
  const TAX_RATE = 0.08;

  let itemsSubtotal = 0;
  const verifiedItems = parsedItems.map(({ productId, quantity }) => {
    const product = productMap[productId];
    const lineTotal = product.price * quantity;
    itemsSubtotal += lineTotal;
    return {
      product: product._id,       // ObjectId reference — matches Order schema
      quantity,
      price: product.price,       // server-verified unit price at time of order
    };
  });

  const tax   = parseFloat((itemsSubtotal * TAX_RATE).toFixed(2));
  const total = parseFloat((itemsSubtotal + shippingCost + tax).toFixed(2));

  // ── Step 4: Create the Order document ─────────────────────────────────────
  // Map our checkout form fields onto the Order schema's address sub-document.
  const address = {
    fullName: shippingAddress.fullName.trim(),
    phone:    (shippingAddress.phone ?? "").trim(),
    street:   shippingAddress.address.trim(),   // form calls it "address"
    city:     shippingAddress.city.trim(),
    buildingDetails: [shippingAddress.state, shippingAddress.zip, shippingAddress.country]
      .filter(Boolean)
      .join(", "),
  };

  let newOrder;
  try {
    newOrder = await Order.create({
      user:           userId,
      items:          verifiedItems,
      status:         "processing",
      deliveryMethod,
      total,
      address,
    });
  } catch (err) {
    console.error("[placeOrder] order create error:", err);
    return { ok: false, error: "Failed to save your order. Please try again." };
  }

  // ── Step 5: Decrement stock ────────────────────────────────────────────────
  // ⚠ Not atomic with Step 4 — see the warning comment at the top of this file.
  // Using bulkWrite with individual $inc operations is faster than N separate saves.
  try {
    const stockOps = parsedItems.map(({ productId, quantity }) => ({
      updateOne: {
        filter: { _id: productId },
        update: { $inc: { stock: -quantity } },
      },
    }));
    await Product.bulkWrite(stockOps, { ordered: false });
  } catch (err) {
    // Log but don't fail the order — the order was already saved.
    // A background reconciliation job should catch negative stock values.
    console.error("[placeOrder] stock decrement error (order already saved):", err, {
      orderId: newOrder._id.toString(),
    });
  }

  // ── Step 6: Return the new order ID ───────────────────────────────────────
  return { ok: true, orderId: newOrder._id.toString() };
}
