"use server";

import dbConnect from "@/lib/db";
import Product from "@/models/Product";

// ── Serialisation helper ───────────────────────────────────────────────────────
// .lean() returns plain JS objects, but _id is still a BSON ObjectId.
// JSON round-trip converts it (and any nested ObjectIds/Dates) to strings
// so they can safely cross the server→client boundary.
function serialize(doc) {
  return JSON.parse(JSON.stringify(doc));
}

// ── Constants ──────────────────────────────────────────────────────────────────
const PAGE_SIZE = 16; // products per page on category / search pages

// ─────────────────────────────────────────────────────────────────────────────
// getFeaturedProducts
// Returns products marked featured: true — powers the homepage hero row
// and the "Trending" section.
// ─────────────────────────────────────────────────────────────────────────────
export async function getFeaturedProducts() {
  await dbConnect();

  const docs = await Product.find({ featured: true })
    .sort({ createdAt: -1 })
    .limit(12)
    .lean();

  return serialize(docs);
}

// ─────────────────────────────────────────────────────────────────────────────
// getProducts
// Paginated + filtered product list — used by category pages and search.
//
// Options:
//   category   — "electronics" | "fashion" | … | undefined (all categories)
//   page       — 1-based page number (default 1)
//   sort       — "newest" | "price-asc" | "price-desc" | "rating" (default "newest")
//   minPrice   — inclusive lower bound (default 0)
//   maxPrice   — inclusive upper bound (default Infinity)
//   search     — full-text search string (uses the text index on name + description)
// ─────────────────────────────────────────────────────────────────────────────
export async function getProducts({
  category,
  page = 1,
  sort = "newest",
  minPrice,
  maxPrice,
  search,
} = {}) {
  await dbConnect();

  // ── Build filter ────────────────────────────────────────────────────────────
  const filter = {};

  if (category) filter.category = category;

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
    if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
  }

  if (search) {
    filter.$text = { $search: search };
  }

  // ── Build sort ──────────────────────────────────────────────────────────────
  let sortObj = { createdAt: -1 }; // default: newest

  if (search) {
    // Text-search results: rank by relevance score first
    sortObj = { score: { $meta: "textScore" }, createdAt: -1 };
  } else if (sort === "price-asc") {
    sortObj = { price: 1 };
  } else if (sort === "price-desc") {
    sortObj = { price: -1 };
  } else if (sort === "rating") {
    sortObj = { rating: -1, reviewCount: -1 };
  }

  // ── Pagination ──────────────────────────────────────────────────────────────
  const currentPage = Math.max(1, Number(page));
  const skip = (currentPage - 1) * PAGE_SIZE;

  // Run query and count in parallel
  const [docs, total] = await Promise.all([
    Product.find(
      filter,
      search ? { score: { $meta: "textScore" } } : undefined,
    )
      .sort(sortObj)
      .skip(skip)
      .limit(PAGE_SIZE)
      .lean(),

    Product.countDocuments(filter),
  ]);

  return {
    products: serialize(docs),
    total,
    page: currentPage,
    pageSize: PAGE_SIZE,
    totalPages: Math.ceil(total / PAGE_SIZE),
    hasNextPage: currentPage < Math.ceil(total / PAGE_SIZE),
    hasPrevPage: currentPage > 1,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// getProductBySlug
// Full product detail — used by /products/[slug] page.
// Returns null if not found (page should call notFound() in that case).
// ─────────────────────────────────────────────────────────────────────────────
export async function getProductBySlug(slug) {
  await dbConnect();

  const doc = await Product.findOne({ slug }).lean();
  if (!doc) return null;

  return serialize(doc);
}

// ─────────────────────────────────────────────────────────────────────────────
// getRelatedProducts
// 4–6 products from the same category, excluding the current product.
// Used at the bottom of the product detail page.
// ─────────────────────────────────────────────────────────────────────────────
export async function getRelatedProducts(category, excludeId, limit = 6) {
  await dbConnect();

  const docs = await Product.find({
    category,
    _id: { $ne: excludeId },
  })
    .sort({ rating: -1 }) // show highest-rated related products first
    .limit(limit)
    .lean();

  return serialize(docs);
}

// ─────────────────────────────────────────────────────────────────────────────
// searchProducts
// Quick search across text index fields.
// Used by Navbar dropdown and /search page.
// ─────────────────────────────────────────────────────────────────────────────
export async function searchProducts(query, limit = 5) {
  if (!query || query.length < 2) return [];

  await dbConnect();

  const docs = await Product.find(
    { $text: { $search: query } },
    { score: { $meta: "textScore" } }
  )
    .sort({ score: { $meta: "textScore" } })
    .limit(limit)
    .select("_id name slug price images category")
    .lean();

  return docs.map((doc) => ({
    id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    price: doc.price,
    image: doc.images?.[0] || null,
    category: doc.category,
  }));
}
