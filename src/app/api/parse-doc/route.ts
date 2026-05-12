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
  const { extractText } = await import("unpdf");
  const { text } = await extractText(new Uint8Array(buffer), { mergePages: true });

  // unpdf splits long URLs across lines at hyphens and spaces.
  // Collapse all whitespace into single spaces first, then
  // aggressively rejoin any token that looks like a URL fragment
  // following an existing URL start.
  const lines = text.split(/\s+/).filter(Boolean);
  const rejoined: string[] = [];
  let current = "";

  for (const token of lines) {
    if (!current) {
      current = token;
    } else if (current.startsWith("http") && !token.startsWith("http")) {
      // Keep appending tokens to the current URL as long as they
      // look like URL path segments (no spaces, valid URL chars)
      if (/^[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=%]+$/.test(token)) {
        current += token;
      } else {
        rejoined.push(current);
        current = token;
      }
    } else {
      rejoined.push(current);
      current = token;
    }
  }

  if (current) rejoined.push(current);

  return rejoined.join(" ");
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