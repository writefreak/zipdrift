import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import { ResolvedImage } from "@/lib/extractors";
import puppeteer from "puppeteer";

async function fetchImagesWithBrowser(
  images: ResolvedImage[]
): Promise<({ filename: string; buffer: ArrayBuffer } | null)[]> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const results: ({ filename: string; buffer: ArrayBuffer } | null)[] = new Array(images.length).fill(null);
  const CONCURRENCY = 5;

  try {
    // Process in parallel batches
    for (let batch = 0; batch < images.length; batch += CONCURRENCY) {
      const slice = images.slice(batch, batch + CONCURRENCY);

      await Promise.all(
        slice.map(async (img, sliceIndex) => {
          const i = batch + sliceIndex;
          const page = await browser.newPage();
          try {
            const response = await page.goto(img.directUrl, { waitUntil: "networkidle0", timeout: 15000 });

            if (!response || !response.ok()) {
              console.warn(`[download] ${img.directUrl} → ${response?.status()}`);
              return;
            }

            const contentType = response.headers()["content-type"] ?? "";
            if (!contentType.startsWith("image/")) {
              console.warn(`[download] Not an image: ${contentType}`);
              return;
            }

            const nodeBuffer = await response.buffer();
            const arrayBuffer = nodeBuffer.buffer.slice(
              nodeBuffer.byteOffset,
              nodeBuffer.byteOffset + nodeBuffer.byteLength
            ) as ArrayBuffer;

            const ext = contentType.split("/")[1]?.split(";")[0] ?? "jpg";
            results[i] = { filename: `img${i + 1}.${ext}`, buffer: arrayBuffer };
            console.log(`[download] ✓ img${i + 1}.${ext}`);
          } catch (err) {
            console.warn(`[download] Failed: ${img.directUrl}`, err);
          } finally {
            await page.close();
          }
        })
      );
    }
  } finally {
    await browser.close();
  }

  return results;
}

export async function POST(req: NextRequest) {
  try {
    const { images } = (await req.json()) as { images: ResolvedImage[] };

    if (!Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: "No images provided" }, { status: 400 });
    }

    const fetched = await fetchImagesWithBrowser(images);

    const successCount = fetched.filter(Boolean).length;

    if (successCount === 0) {
      return NextResponse.json(
        { error: "None of the images could be fetched. They may be private or unsupported." },
        { status: 422 }
      );
    }

    const zip = new JSZip();
    const folder = zip.folder("zipdrift-images")!;

    fetched.forEach((item) => {
      if (item) folder.file(item.filename, item.buffer);
    });

    const zipBuffer = await zip.generateAsync({
      type: "arraybuffer",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    });

    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="zipdrift-images.zip"`,
        "Content-Length": String(zipBuffer.byteLength),
        "X-Success-Count": String(successCount),
      },
    });
  } catch (err) {
    console.error("[/api/download]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}