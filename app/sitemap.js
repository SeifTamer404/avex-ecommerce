import dbConnect from "@/lib/db";
import Product from "@/models/Product";

const CATEGORIES = [
  "electronics",
  "fashion",
  "home-living",
  "beauty",
  "groceries",
  "toys",
];

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Connect to DB and fetch product slugs
  await dbConnect();
  const products = await Product.find({}, { slug: 1, updatedAt: 1 }).lean();

  // 1. Homepage
  const homeUrl = {
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1.0,
  };

  // 2. Category Pages
  const categoryUrls = CATEGORIES.map((cat) => ({
    url: `${baseUrl}/categories/${cat}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.9,
  }));

  // 3. Product Pages
  const productUrls = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: product.updatedAt || new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [homeUrl, ...categoryUrls, ...productUrls];
}
