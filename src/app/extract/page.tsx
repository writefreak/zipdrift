"use client";

import { Button } from "@/components/ui/button";
import { ResolvedImage } from "@/lib/extractors";
import { useState, useRef, ChangeEvent, DragEvent, ClipboardEvent, JSX } from "react";

interface Step {
  n: string;
  title: string;
  desc: string;
}

const STEPS: Step[] = [
  { n: "01", title: "Paste your URLs", desc: "Any platform — product pages, portfolios, social posts." },
  { n: "02", title: "We extract everything", desc: "Our engine visits every URL and pulls every image it finds." },
  { n: "03", title: "Download your zip", desc: "Everything packaged cleanly in one file, ready in moments." },
];

type Stage = "idle" | "extracting" | "ready" | "downloading" | "error";

export default function StartExtracting(): JSX.Element {
  const [urls, setUrls] = useState<string>("");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [urlCount, setUrlCount] = useState<number>(0);
  const [stage, setStage] = useState<Stage>("idle");
  const [resolvedImages, setResolvedImages] = useState<ResolvedImage[]>([]);
  const [successCount, setSuccessCount] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const countLines = (value: string): number =>
    value.split("\n").filter((l: string) => l.trim().length > 0).length;

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setUrls(e.target.value);
    setUrlCount(countLines(e.target.value));
  };

  const handlePaste = (_e: ClipboardEvent<HTMLTextAreaElement>): void => {
    setTimeout(() => {
      const value = textareaRef.current?.value ?? "";
      setUrlCount(countLines(value));
    }, 50);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (): void => setIsDragging(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);
    const text = e.dataTransfer.getData("text/plain");
    if (!text) return;
    const next = urls ? `${urls}\n${text}` : text;
    setUrls(next);
    setUrlCount(countLines(next));
  };

  const handleSubmit = async (): Promise<void> => {
    if (!urls.trim()) return;

    const rawUrls = urls
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    setStage("extracting");
    setErrorMsg("");

    try {
      const isGoogleDocUrl = (u: string) => /docs\.google\.com\/document/i.test(u);
      let resolvedRawUrls = rawUrls;

      if (rawUrls.length === 1 && isGoogleDocUrl(rawUrls[0])) {
        const docRes = await fetch("/api/fetch-doc", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: rawUrls[0] }),
        });

        const docData = await docRes.json();

        if (!docRes.ok) {
          throw new Error(docData.error ?? "Failed to fetch Google Doc");
        }

        resolvedRawUrls = docData.urls ?? [];

        if (resolvedRawUrls.length === 0) {
          throw new Error("No image links found in this Google Doc. Make sure the document is public.");
        }
      }

      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: resolvedRawUrls }),
      });

      const rawText = await res.text();
      let data: { resolved?: ResolvedImage[]; error?: string };
      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error("Something went wrong on our end. Please try again.");
      }

      if (!res.ok) {
        throw new Error("Something went wrong while extracting. Please try again.");
      }

      const resolved: ResolvedImage[] = data.resolved ?? [];

      if (resolved.length === 0) {
        throw new Error("We couldn't find any images at those URLs. Make sure they're public.");
      }

      setResolvedImages(resolved);
      setUrlCount(resolved.length);
      setStage("ready");
    } catch (err) {
      console.error("[ZipDrift] handleSubmit error:", err);
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStage("error");
    }
  };

  const handleDownload = async (): Promise<void> => {
    if (resolvedImages.length === 0) return;
    setStage("downloading");

    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: resolvedImages }),
      });

      if (!res.ok) {
        const rawText = await res.text();
        console.error("[ZipDrift] /api/download error raw response:", rawText);
        throw new Error("We couldn't package your images. Please try again.");
      }

      const succeeded = Number(res.headers.get("X-Success-Count") ?? resolvedImages.length);
      setSuccessCount(succeeded);

      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = "zipdrift-images.zip";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(blobUrl);

      setStage("ready");
    } catch (err) {
      console.error("[ZipDrift] handleDownload error:", err);
      setErrorMsg(err instanceof Error ? err.message : "Download failed. Please try again.");
      setStage("error");
    }
  };

  const handleClear = (): void => {
    setUrls("");
    setUrlCount(0);
    setStage("idle");
    setResolvedImages([]);
    setSuccessCount(0);
    setErrorMsg("");
  };

  const isLoading = stage === "extracting";
  const submitted = stage === "ready" || stage === "downloading";

  return (
    <div className="relative min-h-screen bg-black text-white font-nunito antialiased overflow-hidden flex flex-col md:block">

      <div className="absolute inset-x-0 top-0 h-105 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,#6b21c8_0%,#3b0764_35%,#0d0014_65%,transparent_100%)]" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 pt-16 md:pt-24 flex-1 flex flex-col justify-center md:block md:flex-none">

        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight mb-4">
            Paste your URLs.
            <br />
            <span className="text-[#984cd6]">We'll handle the rest.</span>
          </h1>
        </div>

        {/* ERROR STATE */}
        {stage === "error" && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/8 px-5 py-4 text-sm text-red-300">
            {errorMsg}
          </div>
        )}

        {/* INPUT CARD */}
        {!submitted ? (
          <div
            className={[
              "rounded-2xl border overflow-hidden transition-all duration-300 bg-white/3",
              isDragging
                ? "border-purple-600/70 shadow-[0_0_40px_rgba(147,51,234,0.2)]"
                : "border-white/8",
            ].join(" ")}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <textarea
              ref={textareaRef}
              value={urls}
              onChange={handleChange}
              onPaste={handlePaste}
              rows={4}
              placeholder={[
                "https://images.unsplash.com/photo-abc123...",
                "https://cdn.dribbble.com/users/123/screenshots/...",
                "https://drive.google.com/file/d/ABC123/view",
              ].join("\n")}
              className="w-full text-xs bg-transparent px-5 py-4 md:text-sm text-gray-200 placeholder-gray-600 resize-none outline-none leading-relaxed font-inter"
            />
            <p className="px-5 pb-3 text-xs text-white/80">
              Tip: right-click an image and choose <span className="text-gray-400">Copy image address</span> for best results.
            </p>

            <div className="flex items-center justify-between px-5 py-4 border-t border-white/5 bg-black/20">
              <button
                onClick={handleClear}
                disabled={!urls}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors disabled:opacity-30"
              >
                Clear all
              </button>

              <Button
                disabled={!urls.trim() || isLoading}
                onClick={handleSubmit}
                className="text-[15px] font-nunito px-4 py-2 rounded-lg bg-[#984cd6] font-medium hover:scale-105 hover:bg-[#984cd6] active:scale-95 transition-all duration-150 shadow-[0_0_16px_6px_#984cd6aa]"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" />
                    </svg>
                    Extracting…
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Start extracting
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-purple-500/30 bg-purple-500/6 p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-purple-500/15 flex items-center justify-center mx-auto mb-5">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#c084fc" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Your zip is ready!</h2>
            <p className="text-gray-400 text-sm mb-8">
              {urlCount} {urlCount === 1 ? "image" : "images"} resolved — all packaged cleanly.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={handleDownload}
                disabled={stage === "downloading"}
                className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#984cd6] hover:scale-105 active:scale-95 transition-all duration-150 shadow-[0_0_16px_6px_#984cd6aa] disabled:opacity-60 disabled:scale-100 disabled:shadow-none"
              >
                {stage === "downloading" ? "Downloading…" : "Download zip"}
              </button>
              <button
                onClick={handleClear}
                className="px-6 py-2.5 rounded-lg text-sm font-semibold border border-white/10 text-gray-300 hover:border-white/20 transition-all"
              >
                Extract more
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}