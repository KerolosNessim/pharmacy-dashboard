import sharp from "sharp";

/**
 * Resizes and compresses an image to WebP format.
 * Max dimensions: 1920x1080
 * Format: WebP
 * Target: Under 2MB
 */
export async function compressImage(file: File): Promise<{ buffer: Buffer; fileName: string; contentType: string }> {
  const buffer = Buffer.from(await file.arrayBuffer());
  
  let quality = 80;
  let compressedBuffer = await sharp(buffer)
    .resize(1920, 1080, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality })
    .toBuffer();

  // If still over 2MB, reduce quality
  while (compressedBuffer.length > 2 * 1024 * 1024 && quality > 10) {
    quality -= 10;
    compressedBuffer = await sharp(buffer)
      .resize(1920, 1080, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality })
      .toBuffer();
  }

  // Generate new filename with .webp extension
  const originalName = file.name.split(".").slice(0, -1).join(".");
  const newFileName = `${originalName || "image"}.webp`;

  return {
    buffer: compressedBuffer,
    fileName: newFileName,
    contentType: "image/webp",
  };
}
