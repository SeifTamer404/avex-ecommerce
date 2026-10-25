/**
 * Import catalog photographs and replace only existing products' image arrays.
 * --download: download/optimise assets without accessing MongoDB.
 * --verify: validate all local assets without accessing MongoDB.
 * no flag: preview database changes. --apply: back up and apply those changes.
 * Optional: --slug=<product-slug> --force (download one asset again).
 */
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createHash } from "node:crypto";
import dotenv from "dotenv";
import mongoose from "mongoose";
import sharp from "sharp";

const root = fileURLToPath(new URL("../", import.meta.url));
const catalogPath = path.join(root, "data/product-images.json");
const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
const args = new Set(process.argv.slice(2));
const slug = [...args].find((arg) => arg.startsWith("--slug="))?.slice(7);
const entries = slug ? catalog.filter((entry) => entry.slug === slug) : catalog;
if (!entries.length) throw new Error("No matching products in the image catalog.");
if (new Set(catalog.map((entry) => entry.slug)).size !== catalog.length) {
  throw new Error("Duplicate product slugs in the image catalog.");
}

function assetPath(entry) {
  const expected = `/images/products/${entry.slug}.webp`;
  if (entry.image !== expected || !/^[a-z0-9-]+$/.test(entry.slug)) {
    throw new Error(`Invalid local image path for ${entry.slug}`);
  }
  return path.join(root, "public", entry.image.slice(1));
}

async function verify(entry) {
  const metadata = await sharp(assetPath(entry)).metadata();
  if (metadata.format !== "webp" || metadata.width !== 800 || metadata.height !== 800) {
    throw new Error(`Invalid image dimensions or format: ${entry.slug}`);
  }
}

async function download(entry) {
  const destination = assetPath(entry);
  if (!args.has("--force")) {
    try {
      await access(destination);
      await verify(entry);
      return;
    } catch {
      // Missing or invalid assets are imported below.
    }
  }
  const errors = [];
  for (const source of entry.sources) {
    try {
      const response = await fetch(source.url, {
        signal: AbortSignal.timeout(25000),
        headers: { "User-Agent": "AVEX-Demo-Catalog/1.0", Accept: "image/*" },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      if (Number(response.headers.get("content-length")) > 20_000_000) {
        throw new Error("Source image is too large");
      }
      const buffer = Buffer.from(await response.arrayBuffer());
      if (buffer.length > 20_000_000) throw new Error("Source image is too large");
      const metadata = await sharp(buffer, { limitInputPixels: 40_000_000 }).metadata();
      if (metadata.width < 250 || metadata.height < 250) {
        throw new Error("Source image is too small");
      }
      await sharp(buffer, { limitInputPixels: 40_000_000 })
        .rotate()
        .resize(800, 800, { fit: "contain", background: "#ffffff" })
        .flatten({ background: "#ffffff" })
        .webp({ quality: 85 })
        .toFile(destination);
      entry.selectedSource = source;
      console.log(`Downloaded: ${entry.name}`);
      return;
    } catch (error) {
      errors.push(`${new URL(source.url).hostname}: ${error.message}`);
    }
  }
  throw new Error(`${entry.name}: ${errors.join("; ")}`);
}

async function writeCredits() {
  const rows = catalog.map((entry) => {
    const source = entry.selectedSource;
    return `| ${entry.name.replaceAll("|", "\\|")} | ${source ? `[${source.title.replaceAll("|", "\\|")}](${source.page || source.url})` : "Not downloaded"} |`;
  });
  await writeFile(path.join(root, "public/images/products/SOURCES.md"),
    "# Product image sources\n\n" +
    "Catalog reference imagery used to illustrate AVEX's demo products. The seed titles are generic; source brands, package sizes and specifications may differ. Source attribution does not transfer ownership or grant a license to the original imagery.\n\n" +
    "Assets are stored locally as 800 × 800 WebP files. Original source URLs are retained in `data/product-images.json`.\n\n" +
    "| AVEX demo product | Original catalog source |\n|---|---|\n" + rows.join("\n") + "\n");
}

function unchangedFieldsHash(products) {
  return createHash("sha256").update(JSON.stringify(products
    .map(({ images: _images, ...rest }) => rest)
    .sort((a, b) => String(a._id).localeCompare(String(b._id)))))
    .digest("hex");
}

async function updateDatabase() {
  dotenv.config({ path: path.join(root, ".env.local"), quiet: true });
  if (!process.env.DB_URI) throw new Error("DB_URI is not configured.");
  try {
    await mongoose.connect(process.env.DB_URI, { serverSelectionTimeoutMS: 15000 });
    const collection = mongoose.connection.db.collection("products");
    const before = await collection.find({}).toArray();
    const bySlug = new Map(catalog.map((entry) => [entry.slug, entry]));
    const targets = slug ? before.filter((product) => product.slug === slug) : before;
    if (!targets.length) throw new Error("No matching products in the database.");
    const unknown = targets.filter((product) => !bySlug.has(product.slug));
    if (unknown.length) {
      throw new Error(`Missing image mappings: ${unknown.map((product) => product.slug).join(", ")}`);
    }
    const changes = targets.filter((product) =>
      JSON.stringify(product.images) !== JSON.stringify([bySlug.get(product.slug).image]));
    console.log(`${targets.length} products matched; ${changes.length} image arrays need updating.`);
    if (!args.has("--apply")) {
      console.log("Preview only. Run with --apply to update image arrays.");
      return;
    }
    if (!changes.length) return;
    const backupDir = path.join(root, ".backups");
    await mkdir(backupDir, { recursive: true });
    const backupPath = path.join(backupDir,
      `product-images-${new Date().toISOString().replaceAll(/[:.]/g, "-")}.json`);
    await writeFile(backupPath, JSON.stringify(changes.map((product) => ({
      _id: product._id.toString(), slug: product.slug, images: product.images,
    })), null, 2) + "\n", { flag: "wx" });
    const result = await collection.bulkWrite(changes.map((product) => ({
      updateOne: {
        filter: { _id: product._id, images: product.images },
        update: { $set: { images: [bySlug.get(product.slug).image] } },
      },
    })), { ordered: true });
    if (result.matchedCount !== changes.length) {
      throw new Error(`Concurrent product change detected. Backup: ${backupPath}`);
    }
    const after = await collection.find({}).toArray();
    if (unchangedFieldsHash(before) !== unchangedFieldsHash(after)) {
      throw new Error("Verification failed: product fields other than images changed.");
    }
    for (const product of after.filter((item) => targets.some((target) => target._id.equals(item._id)))) {
      if (JSON.stringify(product.images) !== JSON.stringify([bySlug.get(product.slug).image])) {
        throw new Error(`Image update verification failed: ${product.slug}`);
      }
    }
    console.log(`Updated and verified ${result.modifiedCount} products. Only images changed.`);
    console.log(`Previous image arrays saved to ${backupPath}`);
  } finally {
    await mongoose.disconnect();
  }
}

async function main() {
  if (args.has("--download")) {
    await mkdir(path.join(root, "public/images/products"), { recursive: true });
    let cursor = 0;
    const failures = [];
    await Promise.all(Array.from({ length: 6 }, async () => {
      while (cursor < entries.length) {
        const entry = entries[cursor++];
        try { await download(entry); } catch (error) { failures.push(error.message); }
      }
    }));
    await writeFile(catalogPath, JSON.stringify(catalog, null, 2) + "\n");
    await writeCredits();
    if (failures.length) throw new Error(failures.join("\n"));
  }
  await Promise.all(entries.map(verify));
  console.log(`Verified ${entries.length} local product images (800 x 800 WebP).`);
  if (!args.has("--download") && !args.has("--verify")) await updateDatabase();
}

main().catch((error) => {
  console.error(error.message.replace(/mongodb(?:\+srv)?:\/\/[^\s]+/g, "[redacted]"));
  process.exitCode = 1;
});
