import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const MIN_BYTES = 100 * 1024;

function getMaxWidth(relativePath) {
  const name = relativePath.toLowerCase();

  if (name.includes("-mobile") || name === "bg-phone.png") return 828;
  if (name.includes("-main") || name === "bg-main.png") return 1920;
  if (name.startsWith("bg-")) return 1920;
  if (name.includes("card")) return 400;
  if (name.includes("person")) return 600;
  if (name.startsWith("characters/")) return 320;
  if (name.startsWith("obstacles/")) return 512;
  if (name.startsWith("track/")) return 512;

  return 1920;
}

async function walkPngFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkPngFiles(fullPath)));
      continue;
    }
    if (entry.name.toLowerCase().endsWith(".png")) {
      files.push(fullPath);
    }
  }

  return files;
}

async function optimizePng(filePath) {
  const stat = await fs.stat(filePath);
  if (stat.size < MIN_BYTES) {
    return null;
  }

  const relativePath = path.relative(PUBLIC_DIR, filePath).replace(/\\/g, "/");
  const maxWidth = getMaxWidth(relativePath);
  const image = sharp(filePath);
  const metadata = await image.metadata();

  let pipeline = image;
  if (metadata.width && metadata.width > maxWidth) {
    pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
  }

  const optimized = await pipeline
    .png({
      compressionLevel: 9,
      effort: 10,
      palette: metadata.hasAlpha,
    })
    .toBuffer();

  if (optimized.length >= stat.size) {
    return null;
  }

  await fs.writeFile(filePath, optimized);

  return {
    file: relativePath,
    beforeKb: Math.round(stat.size / 1024),
    afterKb: Math.round(optimized.length / 1024),
  };
}

const files = await walkPngFiles(PUBLIC_DIR);
const results = [];

for (const file of files) {
  const result = await optimizePng(file);
  if (result) results.push(result);
}

if (results.length === 0) {
  console.log("No PNG files were reduced.");
} else {
  let savedKb = 0;
  for (const result of results) {
    savedKb += result.beforeKb - result.afterKb;
    console.log(`${result.file}: ${result.beforeKb} KB -> ${result.afterKb} KB`);
  }
  console.log(`Optimized ${results.length} files, saved ~${savedKb} KB.`);
}
