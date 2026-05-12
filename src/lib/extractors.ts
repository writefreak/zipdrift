export type SourceType = "smugmug" | "google_drive" | "direct" | "unknown";

export interface ResolvedImage {
  originalUrl: string;
  directUrl: string;
  filename: string;
  source: SourceType;
}

export interface ExtractionResult {
  resolved: ResolvedImage[];
  failed: { url: string; reason: string }[];
}

// ─── SmugMug ─────────────────────────────────────────────────────────────────
function isSmugMug(url: string): boolean {
  return /smugmug\.com/i.test(url);
}

async function resolveSmugMug(url: string): Promise<string> {
  const oembedEndpoint = `https://api.smugmug.com/services/oembed/?url=${encodeURIComponent(url)}&format=json`;
  const res = await fetch(oembedEndpoint, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`SmugMug oEmbed failed: ${res.status}`);
  const data = await res.json();
  if (data.type === "photo" && data.url) return data.url as string;
  if (data.thumbnail_url) return data.thumbnail_url as string;
  throw new Error("SmugMug oEmbed did not return a usable image URL");
}

// ─── Google Drive ─────────────────────────────────────────────────────────────
function isGoogleDrive(url: string): boolean {
  return /drive\.google\.com/i.test(url);
}

function resolveGoogleDrive(url: string): string {
  let fileId: string | null = null;
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) fileId = fileMatch[1];
  if (!fileId) {
    const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch) fileId = idMatch[1];
  }
  if (!fileId) throw new Error("Could not extract Google Drive file ID from URL");
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

// ─── Direct image check ───────────────────────────────────────────────────────
const IMAGE_EXTENSIONS = /\.(jpg|jpeg|png|gif|webp|bmp|svg|tiff|avif)(\?.*)?$/i;

function isDirectImage(url: string): boolean {
  return IMAGE_EXTENSIONS.test(url);
}

// ─── Universal resolver ───────────────────────────────────────────────────────
// Works for any platform: Dribbble, Freepik, Behance, Pexels, 500px, etc.
// If the URL is already a direct image it returns it immediately.
// Otherwise it fetches the page and pulls og:image or twitter:image.
async function resolveToDirectImage(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    },
  });

  if (!res.ok) throw new Error(`Failed to fetch URL: ${res.status}`);

  const contentType = res.headers.get("content-type") ?? "";

  // Already a direct image — no scraping needed
  if (contentType.startsWith("image/")) return url;

  // HTML page — extract og:image or twitter:image
  // HTML page — extract og:image or twitter:image
  if (contentType.includes("text/html")) {
    const html = await res.text();

    // Try all common meta tag attribute orderings
    const ogImage =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1] ??
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)?.[1] ??
      html.match(/property=["']og:image["'][^>]*content=["']([^"']+)["']/i)?.[1] ??
      html.match(/content=["']([^"']+)["'][^>]*property=["']og:image["']/i)?.[1];

    if (ogImage) return ogImage;

    const twitterImage =
      html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)?.[1] ??
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i)?.[1] ??
      html.match(/name=["']twitter:image(?::src)?["'][^>]*content=["']([^"']+)["']/i)?.[1] ??
      html.match(/content=["']([^"']+)["'][^>]*name=["']twitter:image(?::src)?["']/i)?.[1];

    if (twitterImage) return twitterImage;

    // Last resort: find any CDN-hosted image URL embedded in the HTML or inline scripts
    const cdnImage = html.match(
      /https:\/\/(?:cdn\.|assets\.|images\.|media\.|img\.)[^\s"'<>]+\.(?:jpg|jpeg|png|webp|gif|avif)/i
    )?.[0];

    if (cdnImage) return cdnImage;

    console.error("[extractors] og:image not found. HTML snippet:", html.slice(0, 2000));
    throw new Error("No image found in page metadata");
  }

  throw new Error(`Unexpected content type: ${contentType}`);
}

// ─── Filename helper ──────────────────────────────────────────────────────────
function deriveFilename(url: string, index: number): string {
  try {
    const pathname = new URL(url).pathname;
    const parts = pathname.split("/").filter(Boolean);
    const last = parts[parts.length - 1];
    if (last && IMAGE_EXTENSIONS.test(last)) return last;
  } catch {
    // ignore
  }
  return `image_${String(index + 1).padStart(3, "0")}.jpg`;
}

// ─── Main export ──────────────────────────────────────────────────────────────
export async function resolveUrls(rawUrls: string[]): Promise<ExtractionResult> {
  const resolved: ResolvedImage[] = [];
  const failed: { url: string; reason: string }[] = [];

  await Promise.allSettled(
    rawUrls.map(async (raw, index) => {
      const url = raw.trim();
      if (!url) return;

      try {
        let directUrl: string;
        let source: SourceType;

        if (isGoogleDrive(url)) {
          source = "google_drive";
          directUrl = resolveGoogleDrive(url);
        } else if (isSmugMug(url)) {
          source = "smugmug";
          directUrl = await resolveSmugMug(url);
        } else {
          source = isDirectImage(url) ? "direct" : "unknown";
          directUrl = await resolveToDirectImage(url);
        }

        resolved.push({
          originalUrl: url,
          directUrl,
          filename: deriveFilename(directUrl, index),
          source,
        });
      } catch (err) {
        console.error(`[extractors] Failed to resolve ${url}:`, err);
        failed.push({
          url,
          reason: err instanceof Error ? err.message : "Unknown error",
        });
      }
    })
  );

  return { resolved, failed };
}