import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";

// GET /api/products/related?category=electronics&exclude=<id>&limit=6
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const excludeId = searchParams.get("exclude");
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "6", 10), 12);

  if (!category) {
    return NextResponse.json({ error: "category is required" }, { status: 400 });
  }

  try {
    await dbConnect();

    const filter = { category };
    if (excludeId) filter._id = { $ne: excludeId };

    const docs = await Product.find(filter)
      .sort({ rating: -1 })
      .limit(limit)
      .lean();

    // Serialize ObjectIds and Dates
    const products = JSON.parse(JSON.stringify(docs));

    return NextResponse.json({ products });
  } catch (err) {
    console.error("[related] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
