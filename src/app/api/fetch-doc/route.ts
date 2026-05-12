import { NextRequest, NextResponse } from "next/server";

function isGoogleDoc(url: string): boolean {
  return /docs\.google\.com\/document/i.test(url);
}

async function extractUrlsFromGoogleDoc(docUrl: string): Promise<string[]> {
  // Convert to export URL to get plain text
  const docId = docUrl.match(/\/document\/d\/([a-zA-Z0-9_-]+)/)?.[1];
  if (!docId) throw new Error("Could not extract Google Doc ID from URL");

  const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=txt`;

  const res = await fetch(exportUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    },
  });

  if (!res.ok) throw new Error(`Failed to fetch Google Doc: ${res.status}. Make sure the document is set to public.`);

  const text = await res.text();

  const URL_REGEX = /https?:\/\/[^\s"'<>\]\[)(]+/gi;
  const matches = text.match(URL_REGEX) ?? [];
  const cleaned = matches.map((u) => u.replace(/[.,;:!?)\]}>]+$/, "").trim());
  return [...new Set(cleaned)].filter(Boolean);
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json() as { url: string };

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    if (!isGoogleDoc(url)) {
      return NextResponse.json({ error: "Only Google Docs URLs are supported" }, { status: 400 });
    }

    const urls = await extractUrlsFromGoogleDoc(url);
    return NextResponse.json({ urls });
  } catch (err) {
    console.error("[/api/fetch-doc]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch document" },
      { status: 500 }
    );
  }
}