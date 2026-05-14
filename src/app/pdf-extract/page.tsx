"use client";

import { Button } from "@/components/ui/button";
import { ResolvedImage } from "@/lib/extractors";
import { useState, useRef, ChangeEvent, DragEvent, JSX } from "react";

type Stage = "upload" | "preview" | "done" | "error";

export default function PDFExtract(): JSX.Element {
  const [stage, setStage] = useState<Stage>("upload");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [links, setLinks] = useState<string[]>([]);
  const [resolvedImages, setResolvedImages] = useState<ResolvedImage[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [errorMsg, setErrorMsg] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const ACCEPTED = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const acceptFile = async (f: File | null | undefined): Promise<void> => {
    if (!f) return;

    const name = f.name.toLowerCase();
    const typeOk = ACCEPTED.includes(f.type);
    const extOk = name.endsWith(".pdf") || name.endsWith(".doc") || name.endsWith(".docx");

    if (!typeOk && !extOk) return;

    setFile(f);
    setIsScanning(true);
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("file", f);

      const parseRes = await fetch("/api/parse-doc", {
        method: "POST",
        body: formData,
      });

      const parseData = await parseRes.json();
      console.log("[PDFExtract] parse-doc response:", parseData);

      if (!parseRes.ok) {
        throw new Error(parseData.error ?? "Failed to parse document");
      }

      const rawUrls: string[] = parseData.urls ?? [];

      if (rawUrls.length === 0) {
        throw new Error("No links found in this document.");
      }

      const extractRes = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: rawUrls }),
      });

      const extractData = await extractRes.json();
      console.log("[PDFExtract] extract response:", extractData);

      if (!extractRes.ok) {
        throw new Error(extractData.error ?? "Failed to resolve image links");
      }

      const resolved: ResolvedImage[] = extractData.resolved ?? [];

      if (resolved.length === 0) {
        throw new Error("No images could be resolved from the links in this document.");
      }

      setLinks(resolved.map((r) => r.directUrl));
      setResolvedImages(resolved);
      setSelected(new Set(resolved.map((_, i) => i)));
      setIsScanning(false);
      setStage("preview");
    } catch (err) {
      console.error("[PDFExtract] error:", err);
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setIsScanning(false);
      setStage("error");
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    acceptFile(e.target.files?.[0]);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (): void => setIsDragging(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);
    acceptFile(e.dataTransfer.files?.[0]);
  };

  const toggleOne = (i: number): void => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const toggleAll = (): void => {
    setSelected(selected.size === links.length ? new Set() : new Set(links.map((_, i) => i)));
  };

  // const handleDownload = async (): Promise<void> => {
  //   const selectedImages = resolvedImages.filter((_, i) => selected.has(i));
  //   if (selectedImages.length === 0) return;
  //   setIsDownloading(true);

  //   try {
  //     const res = await fetch("/api/download", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ images: selectedImages }),
  //     });

  //     console.log("[PDFExtract] download status:", res.status);

  //     if (!res.ok) {
  //       const rawText = await res.text();
  //       console.error("[PDFExtract] download error:", rawText);
  //       throw new Error("We couldn't package your images. Please try again.");
  //     }

  //     const blob = await res.blob();
  //     console.log("[PDFExtract] zip blob size:", blob.size);

  //     const blobUrl = URL.createObjectURL(blob);
  //     const anchor = document.createElement("a");
  //     anchor.href = blobUrl;
  //     anchor.download = "zipdrift-images.zip";
  //     document.body.appendChild(anchor);
  //     anchor.click();
  //     anchor.remove();
  //     URL.revokeObjectURL(blobUrl);

  //     setIsDownloading(false);
  //     setStage("done");
  //   } catch (err) {
  //     console.error("[PDFExtract] download error:", err);
  //     setErrorMsg(err instanceof Error ? err.message : "Download failed. Please try again.");
  //     setIsDownloading(false);
  //     setStage("error");
  //   }
  // };

  const handleDownload = async (): Promise<void> => {
  const selectedImages = resolvedImages.filter((_, i) => selected.has(i));
  if (selectedImages.length === 0) return;
  setIsDownloading(true);

  try {
    const res = await fetch("/api/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ images: selectedImages }),
    });

    if (!res.ok) {
      const rawText = await res.text();
      console.error("[PDFExtract] download error:", rawText);
      throw new Error("We couldn't package your images. Please try again.");
    }

    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = blobUrl;
    anchor.download = "zipdrift-images.zip";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(blobUrl);

    setIsDownloading(false);
    setStage("done");
  } catch (err) {
    console.error("[PDFExtract] download error:", err);
    setErrorMsg(err instanceof Error ? err.message : "Download failed. Please try again.");
    setIsDownloading(false);
    setStage("error");
  }
};
  const handleReset = (): void => {
    setStage("upload");
    setFile(null);
    setLinks([]);
    setResolvedImages([]);
    setSelected(new Set());
    setIsScanning(false);
    setIsDownloading(false);
    setErrorMsg("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const ext = (url: string): string => url.split(".").pop()?.toUpperCase().split("?")[0] ?? "FILE";

  const filename = (url: string): string => {
    const parts = url.split("/");
    return parts[parts.length - 1] ?? url;
  };

  return (
    <div className="relative min-h-screen bg-black text-white font-nunito antialiased overflow-hidden">

      <div className="absolute inset-x-0 top-0 h-105 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,#6b21c8_0%,#3b0764_35%,#0d0014_65%,transparent_100%)]" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 pt-24 pb-32">

        {/* Heading */}
        <div data-aos="fade-up" className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight mb-4">
            Upload your file.
            <br />
            <span className="text-[#984cd6]">We'll find every link.</span>
          </h1>
        </div>

        {/* ERROR STATE */}
        {stage === "error" && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/8 px-5 py-4 text-sm text-red-300 flex items-start justify-between gap-4">
            <span>{errorMsg}</span>
            <button onClick={handleReset} className="text-xs text-red-400 hover:text-red-200 shrink-0 underline">
              Try again
            </button>
          </div>
        )}

        {/* ── STAGE: UPLOAD ── */}
        {(stage === "upload" || stage === "error") && (
          <div
            data-aos="fade-up"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={[
              "rounded-2xl border transition-all duration-200 overflow-hidden",
              isDragging
                ? "border-purple-600/70 shadow-[0_0_40px_rgba(147,51,234,0.15)] bg-purple-500/4"
                : "border-white/8 bg-white/3",
            ].join(" ")}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={handleInputChange}
            />

            <div className="flex items-center gap-4 px-5 py-4">
              <div className={[
                "w-10 h-10 rounded-lg shrink-0 flex items-center justify-center transition-colors duration-200",
                isDragging ? "bg-purple-500/20" : "bg-white/5",
              ].join(" ")}>
                {isScanning ? (
                  <svg className="animate-spin text-[#984cd6]" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeDasharray="31.4" strokeDashoffset="10" />
                  </svg>
                ) : (
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M7 3a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V9l-6-6H7z"
                      stroke={isDragging ? "#c084fc" : "#6b7280"}
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M13 3v5a1 1 0 001 1h5"
                      stroke={isDragging ? "#c084fc" : "#6b7280"}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </div>

              <div className="flex-1 min-w-0">
                {isScanning ? (
                  <>
                    <p className="text-sm font-medium text-white truncate">{file?.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Scanning for links…</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-white">
                      {isDragging ? "Drop to upload" : "Drop your file here"}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">PDF, DOC, DOCX · Max 100 MB</p>
                  </>
                )}
              </div>

              {!isScanning && (
                <button
                  onClick={() => inputRef.current?.click()}
                  className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-md border border-white/10 text-gray-300 hover:border-white/20 hover:text-white transition-all duration-150 select-none"
                >
                  Browse
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── STAGE: PREVIEW ── */}
        {stage === "preview" && (
          <div className="rounded-2xl border border-white/8 bg-white/3 overflow-hidden">

            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
              <div className="flex items-center gap-2 min-w-0">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                  <path d="M7 3a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V9l-6-6H7z" stroke="#c084fc" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M13 3v5a1 1 0 001 1h5" stroke="#c084fc" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span className="text-xs text-gray-400 truncate font-medium">{file?.name}</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-purple-500/20 text-[#c084fc] shrink-0 ml-3">
                {links.length} {links.length === 1 ? "image" : "images"} found
              </span>
            </div>

            <div className="flex items-center justify-between px-5 py-2.5 border-b border-white/5 bg-black/10">
              <button
                onClick={toggleAll}
                className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
              >
                <div className={[
                  "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                  selected.size === links.length
                    ? "bg-[#984cd6] border-[#984cd6]"
                    : selected.size > 0
                    ? "bg-[#984cd6]/40 border-[#984cd6]/60"
                    : "border-white/20 bg-transparent",
                ].join(" ")}>
                  {selected.size === links.length && (
                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {selected.size > 0 && selected.size < links.length && (
                    <div className="w-1.5 h-0.5 bg-white rounded-full" />
                  )}
                </div>
                {selected.size === links.length ? "Deselect all" : "Select all"}
              </button>
              <span className="text-xs text-gray-600">
                {selected.size} of {links.length} selected
              </span>
            </div>

            <ul className="divide-y divide-white/4 max-h-72 overflow-y-auto">
              {links.map((url: string, i: number) => (
                <li
                  key={i}
                  onClick={() => toggleOne(i)}
                  className="flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-white/3 transition-colors"
                >
                  <div className={[
                    "w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors",
                    selected.has(i) ? "bg-[#984cd6] border-[#984cd6]" : "border-white/20 bg-transparent",
                  ].join(" ")}>
                    {selected.has(i) && (
                      <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                        <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>

                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/6 text-gray-500 shrink-0 uppercase tracking-wide">
                    {ext(url)}
                  </span>

                  <span className="text-xs text-gray-300 truncate font-mono flex-1">{filename(url)}</span>

                  <span className="text-[10px] text-gray-600 truncate hidden sm:block max-w-45" title={url}>
                    {url.replace("https://", "").split("/").slice(0, -1).join("/")}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between px-5 py-4 border-t border-white/5 bg-black/20">
              <button
                onClick={handleReset}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                Upload different file
              </button>

              <Button
                disabled={selected.size === 0 || isDownloading}
                onClick={handleDownload}
                className="text-[15px] font-nunito px-4 py-2 rounded-lg bg-[#984cd6] font-medium hover:scale-105 hover:bg-[#984cd6] active:scale-95 transition-all duration-150 shadow-[0_0_16px_6px_#984cd6aa] disabled:opacity-40 disabled:shadow-none disabled:scale-100"
              >
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                {isDownloading ? "Packaging…" : `Download ${selected.size} ${selected.size === 1 ? "image" : "images"}`}
              </Button>
            </div>
          </div>
        )}

        {/* ── STAGE: DONE ── */}
        {stage === "done" && (
          <div className="rounded-2xl border border-purple-500/30 bg-purple-500/6 p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-purple-500/15 flex items-center justify-center mx-auto mb-5">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#c084fc" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Your zip is ready!</h2>
            <p className="text-gray-400 text-sm mb-8">
              {selected.size} {selected.size === 1 ? "image" : "images"} packaged cleanly.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={handleDownload}
                className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#984cd6] hover:scale-105 active:scale-95 transition-all duration-150 shadow-[0_0_16px_6px_#984cd6aa]"
              >
                Download again
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-lg text-sm font-semibold border border-white/10 text-gray-300 hover:border-white/20 transition-all"
              >
                Extract another
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}