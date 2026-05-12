import { NextRequest, NextResponse } from "next/server";

// URL regex — matches http/https URLs, stops at whitespace or common punctuation
const URL_REGEX = /https?:\/\/[^\s"'<>\]\[)(\s]+/gi;

function extractUrls(text: string): string[] {
  const matches = text.match(URL_REGEX) ?? [];
  // Deduplicate and clean trailing punctuation that got captured
  const cleaned = matches.map((u) => u.replace(/[.,;:!?)\]}>]+$/, "").trim());
  return [...new Set(cleaned)].filter(Boolean);
}

async function extractTextFromDocx(buffer: ArrayBuffer): Promise<string> {
  // mammoth works server-side in Next.js
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ buffer: Buffer.from(buffer) });
  return result.value;
}

// async function extractTextFromPdf(buffer: ArrayBuffer): Promise<string> {
// const pdfParse = await import("pdf-parse");
// const data = await pdfParse(Buffer.from(buffer));
//   return data.text;
// }

async function extractTextFromPdf(buffer: ArrayBuffer): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require("pdf-parse") as (buffer: Buffer) => Promise<{ text: string }>;
  const data = await pdfParse(Buffer.from(buffer));
  return data.text;
}
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const type = file.type;
    const name = file.name.toLowerCase();

    let text = "";

    if (
      type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      name.endsWith(".docx")
    ) {
      text = await extractTextFromDocx(buffer);
    } else if (type === "application/msword" || name.endsWith(".doc")) {
      return NextResponse.json(
        { error: "Legacy .doc files aren't supported. Please convert to .docx first." },
        { status: 415 }
      );
    } else if (type === "application/pdf" || name.endsWith(".pdf")) {
      text = await extractTextFromPdf(buffer);
    } else {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload a PDF or DOCX." },
        { status: 415 }
      );
    }

    const urls = extractUrls(text);
    console.log(`[parse-doc] Extracted ${urls.length} URLs from "${file.name}"`);

    return NextResponse.json({ urls });
  } catch (err) {
    console.error("[parse-doc]", err);
    return NextResponse.json({ error: "Failed to parse document" }, { status: 500 });
  }
}