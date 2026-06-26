/**
 * scripts/seed.mjs
 *
 * Wipes the products collection and inserts fresh seed data.
 * Run with:  node scripts/seed.mjs
 *
 * Reads DB_URI from .env.local via dotenv.
 */

import "dotenv/config";
import { readFileSync } from "fs";
import { resolve } from "path";
import mongoose from "mongoose";
import { faker } from "@faker-js/faker";

// ── Load .env.local manually (dotenv/config loads .env by default) ───────────
try {
  const envPath = resolve(process.cwd(), ".env.local");
  const lines = readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
} catch {
  // .env.local not found — fall back to process.env (CI / production)
}

const MONGODB_URI = process.env.DB_URI;
if (!MONGODB_URI) {
  console.error("❌  DB_URI is not set. Check your .env.local file.");
  process.exit(1);
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/--+/g, "-");
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPrice(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

// Stable placeholder — same slug always gives same image
function imageUrl(slug) {
  return `https://picsum.photos/seed/${slug}/600/600`;
}

// ── Category definitions ──────────────────────────────────────────────────────
const CATEGORIES = [
  {
    slug: "electronics",
    label: "Electronics",
    priceRange: [19.99, 799.99],
    products: [
      "Pro Wireless Earbuds",
      "Noise-Cancelling Headphones",
      "Portable Bluetooth Speaker",
      "Mechanical Gaming Keyboard",
      "Ergonomic Wireless Mouse",
      "27-inch LED Monitor",
      "4K Action Camera",
      "Smart Watch Series X",
      "USB-C Laptop Hub",
      "20000mAh Power Bank",
      "Wireless Fast Charger Pad",
      "Smart Home Controller Hub",
      "1080p HD Webcam",
      "Foldable Tablet Stand",
      "Mini Projector 1080p",
      "Gaming Headset 7.1 Surround",
      "RGB LED Light Strip",
      "Smart Doorbell Camera",
    ],
    featuredIndexes: [0, 1, 6],
  },
  {
    slug: "fashion",
    label: "Fashion",
    priceRange: [9.99, 249.99],
    products: [
      "Slim-Fit Chino Pants",
      "Oversized Cotton Hoodie",
      "Classic Leather Belt",
      "Polarised Aviator Sunglasses",
      "Slim Minimalist Wallet",
      "Premium Running Sneakers",
      "Casual Linen Shirt",
      "Windproof Bomber Jacket",
      "Ribbed Knit Turtleneck",
      "High-Waist Yoga Leggings",
      "Crossbody Canvas Bag",
      "Structured Tote Handbag",
      "Wool Blend Beanie",
      "Ankle Chelsea Boots",
      "Graphic Print T-Shirt",
      "Denim Straight Jeans",
      "Silk Blend Scarf",
    ],
    featuredIndexes: [1, 5, 13],
  },
  {
    slug: "home-living",
    label: "Home & Living",
    priceRange: [12.99, 399.99],
    products: [
      "Bamboo Cutting Board Set",
      "Non-Stick Ceramic Cookware Set",
      "Linen Duvet Cover King",
      "Aromatherapy Diffuser",
      "Adjustable Desk Lamp",
      "Modular Bookshelf Unit",
      "Memory Foam Pillow",
      "Stainless Steel Water Bottle",
      "Scented Soy Wax Candles Set",
      "Hanging Macramé Planter",
      "Blackout Curtain Panel Pair",
      "Wooden Floating Wall Shelf",
      "Velvet Throw Blanket",
      "Air Purifier HEPA Filter",
      "Digital Kitchen Scale",
      "Reusable Beeswax Food Wraps",
    ],
    featuredIndexes: [1, 3, 13],
  },
  {
    slug: "beauty",
    label: "Beauty",
    priceRange: [7.99, 129.99],
    products: [
      "Hyaluronic Acid Serum 30ml",
      "Vitamin C Brightening Moisturiser",
      "Retinol Night Repair Cream",
      "Hydrating Rose Water Toner",
      "SPF 50 Mineral Sunscreen",
      "Volumising Mascara",
      "Long-Lasting Lip Gloss Set",
      "Detoxifying Charcoal Face Mask",
      "Argan Oil Hair Treatment",
      "Exfoliating Sugar Scrub",
      "Nourishing Hand Cream Duo",
      "Eye Cream Depuffing Roller",
      "Organic Coconut Oil",
      "Sheet Mask Variety Pack",
      "Gentle Micellar Cleansing Water",
      "Jade Facial Roller & Gua Sha Set",
    ],
    featuredIndexes: [0, 2, 15],
  },
  {
    slug: "groceries",
    label: "Groceries",
    priceRange: [1.99, 49.99],
    products: [
      "Organic Extra Virgin Olive Oil 1L",
      "Raw Wildflower Honey 500g",
      "Premium Arabica Coffee Beans 1kg",
      "Himalayan Pink Salt Grinder",
      "Organic Rolled Oats 1kg",
      "Cold-Pressed Almond Butter 350g",
      "Mixed Nuts & Dried Fruit Pack",
      "Organic Green Tea 50 bags",
      "Whole Grain Pasta 500g",
      "Dark Chocolate 85% Cacao",
      "Coconut Milk 400ml (Pack of 6)",
      "Chia Seeds Organic 500g",
      "Hot Sauce Variety Pack",
      "Herbal Infusion Tea Gift Set",
      "Premium Basmati Rice 2kg",
      "Maple Syrup Grade A 330ml",
      "Freeze-Dried Instant Mushroom Broth",
    ],
    featuredIndexes: [1, 2, 8],
  },
  {
    slug: "toys",
    label: "Toys",
    priceRange: [8.99, 179.99],
    products: [
      "STEM Robotics Building Kit",
      "Wooden Rainbow Stacking Blocks",
      "Remote Control Monster Truck",
      "Creative Watercolour Paint Set",
      "Giant Floor Puzzle 100pc",
      "Magnetic Drawing Board",
      "Plush Dinosaur Collection Set",
      "Outdoor Bubble Wand Kit",
      "Strategy Board Game Family",
      "Solar System Science Kit",
      "Foam Dart Blaster Battle Set",
      "Musical Instrument Starter Kit",
      "Magnetic Tile Building Set 60pc",
      "Sand Art & Design Studio",
      "Coding Robot for Beginners",
      "Classic Wooden Chess Set",
    ],
    featuredIndexes: [0, 2, 14],
  },
];

// ── Product generator ─────────────────────────────────────────────────────────
function generateProducts(category) {
  const { slug: catSlug, products: names, priceRange, featuredIndexes } = category;
  const count = names.length;
  const docs = [];

  for (let i = 0; i < count; i++) {
    const name = names[i];
    const productSlug = `${catSlug}-${slugify(name)}`;
    const price = randomPrice(priceRange[0], priceRange[1]);

    // ~40% of products are "on sale"
    const onSale = Math.random() < 0.4;
    const compareAtPrice = onSale
      ? parseFloat((price * (1 + randomPrice(0.1, 0.45))).toFixed(2))
      : null;

    const isFeatured = featuredIndexes.includes(i);

    docs.push({
      name,
      slug: productSlug,
      price,
      compareAtPrice,
      category: catSlug,
      images: [imageUrl(productSlug)],
      stock: faker.number.int({ min: 0, max: 200 }),
      description: faker.commerce.productDescription(),
      rating: parseFloat(faker.number.float({ min: 3.2, max: 5.0, fractionDigits: 1 })),
      reviewCount: faker.number.int({ min: 4, max: 1240 }),
      featured: isFeatured,
      specs: [],
    });
  }

  return docs;
}

// ── Minimal inline schema (avoids importing ESM model files) ──────────────────
const ProductSchema = new mongoose.Schema(
  {
    name: String,
    slug: { type: String, unique: true },
    price: Number,
    compareAtPrice: { type: Number, default: null },
    category: String,
    images: [String],
    stock: Number,
    description: String,
    rating: Number,
    reviewCount: Number,
    featured: { type: Boolean, default: false },
    specs: [{ key: String, value: String }],
  },
  { timestamps: true },
);

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🔌  Connecting to MongoDB…");
  await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  console.log("✅  Connected.\n");

  const Product =
    mongoose.models.Product || mongoose.model("Product", ProductSchema);

  // Wipe existing data
  const deleted = await Product.deleteMany({});
  console.log(`🗑️   Cleared ${deleted.deletedCount} existing product(s).\n`);

  // Generate & insert
  let totalInserted = 0;

  for (const category of CATEGORIES) {
    const docs = generateProducts(category);
    await Product.insertMany(docs, { ordered: false });
    const featuredCount = docs.filter((d) => d.featured).length;
    console.log(
      `📦  ${category.label.padEnd(14)} — ${docs.length} products inserted  (${featuredCount} featured)`,
    );
    totalInserted += docs.length;
  }

  console.log(`\n✨  Done! ${totalInserted} products seeded across ${CATEGORIES.length} categories.`);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("❌  Seed failed:", err);
  mongoose.disconnect();
  process.exit(1);
});
