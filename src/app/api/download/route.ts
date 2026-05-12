import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import { ResolvedImage } from "@/lib/extractors";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { images } = body as { images: ResolvedImage[] };

    if (!Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: "No images provided" }, { status: 400 });
    }

    const zip = new JSZip();
    const folder = zip.folder("zipdrift-images")!;

    // Fetch all images in parallel, skip ones that fail
    const results = await Promise.allSettled(
      images.map(async (img) => {
      const res = await fetch(img.directUrl, {
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Referer": new URL(img.originalUrl).origin + "/",
    "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
  },
});

console.log(`[download] ${img.directUrl} → status ${res.status} | content-type: ${res.headers.get("content-type")}`);

if (!res.ok) throw new Error(`Fetch failed for ${img.directUrl}: ${res.status}`);

        const contentType = res.headers.get("content-type") ?? "";
        if (!contentType.startsWith("image/")) {
          throw new Error(`URL did not return an image (got ${contentType})`);
        }

        const buffer = await res.arrayBuffer();
        return { filename: img.filename, buffer };
      })
    );

    // Track what succeeded vs failed
    const fetchFailed: string[] = [];

    results.forEach((result, i) => {
      if (result.status === "fulfilled") {
        const { filename, buffer } = result.value;
        // Deduplicate filenames if needed
        const safeFilename = filename || `image_${String(i + 1).padStart(3, "0")}.jpg`;
        folder.file(safeFilename, buffer);
      } else {
        fetchFailed.push(images[i].originalUrl);
        console.warn("[/api/download] Failed to fetch:", images[i].directUrl, result.reason);
      }
    });

    const successCount = results.filter((r) => r.status === "fulfilled").length;
    if (successCount === 0) {
      return NextResponse.json(
        { error: "None of the images could be fetched. They may be private or unsupported." },
        { status: 422 }
      );
    }

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
        // Pass back how many succeeded so the client can reflect it
        "X-Success-Count": String(successCount),
        "X-Failed-Count": String(fetchFailed.length),
      },
    });
  } catch (err) {
    console.error("[/api/download]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}