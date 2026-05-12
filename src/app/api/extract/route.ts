import { resolveUrls } from "@/lib/extractors";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { urls } = body as { urls: string[] };

    if (!Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: "No URLs provided" }, { status: 400 });
    }

    const result = await resolveUrls(urls);

    return NextResponse.json(result);
  } catch (err) {
    console.error("[/api/extract]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}