"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
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

export default function StartExtracting(): JSX.Element {
  const [urls, setUrls] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [urlCount, setUrlCount] = useState<number>(0);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const countLines = (value: string): number =>
    value.split("\n").filter((l: string) => l.trim().length > 0).length;
  const router = useRouter()

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

  const handleSubmit = (): void => {
    if (!urls.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 2200);
  };

  const handleClear = (): void => {
    setUrls("");
    setUrlCount(0);
    setSubmitted(false);
  };

  return (
    <div
      className="min-h-screen text-white bg-black font-nunito"
      
    >
     

      {/* ── GLOW ── */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-x-0 top-0 h-90 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(147,51,234,0.28) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto px-6 pt-20 pb-32">
          {/* Heading */}
          <div className="text-center mb-12">
            
            <h1
              className="text-4xl md:text-5xl font-extrabold leading-tight mb-4"
              style={{ letterSpacing: "-0.02em" }}
            >
              Paste your URLs.
              <br />
              <span style={{ color: "#984cd6" }}>We'll handle the rest.</span>
            </h1>
            
          </div>

          {/* ── INPUT CARD ── */}
          {!submitted ? (
            <div
              className="rounded-2xl border overflow-hidden transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.03)",
                borderColor: isDragging ? "rgba(147,51,234,0.7)" : "rgba(255,255,255,0.08)",
                boxShadow: isDragging ? "0 0 40px rgba(147,51,234,0.2)" : "none",
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {/* Top bar */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
                  
                
                {urlCount > 0 && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: "rgba(147,51,234,0.2)", color: "#c084fc" }}
                  >
                    {urlCount} {urlCount === 1 ? "URL" : "URLs"}
                  </span>
                )}
              </div>

              <textarea
                ref={textareaRef}
                value={urls}
                onChange={handleChange}
                onPaste={handlePaste}
                rows={6}
                placeholder={
                  "https://example.com/product/sneakers\nhttps://dribbble.com/shots/12345678\nhttps://unsplash.com/photos/abc123"
                }
                className="w-full bg-transparent px-5 py-4 text-sm text-gray-200 placeholder-gray-600 resize-none outline-none leading-relaxed"
                style={{ fontFamily: "'DM Mono', 'Fira Code', monospace", fontSize: "13px" }}
              />

              {/* Drag hint */}
              {urls === "" && (
                <div className="flex items-center gap-2 px-5 pb-4 text-xs text-gray-600">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  You can also drag &amp; drop text links here
                </div>
              )}

              {/* Bottom bar */}
              <div
                className="flex items-center justify-between px-5 py-4 border-t border-white/5"
                style={{ background: "rgba(0,0,0,0.2)" }}
              >
                <button
                  onClick={handleClear}
                  disabled={!urls}
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors disabled:opacity-30"
                >
                  Clear all
                </button>

                
                  <Button disabled={!urls.trim() || isLoading} onClick={() => router.push("/extract")} className="text-[15px] font-nunito px-4 py-2 rounded-lg bg-[#984cd6] font-medium hover:scale-105 hover:bg-[#984cd6] active:scale-95 transition-all duration-150 shadow-[0_0_16px_6px_#984cd6aa]">
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
           
            <div
              className="rounded-2xl border p-10 text-center"
              style={{ background: "rgba(147,51,234,0.06)", borderColor: "rgba(147,51,234,0.3)" }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: "rgba(147,51,234,0.15)" }}
              >
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#c084fc" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">Your zip is ready!</h2>
              <p className="text-gray-400 text-sm mb-8">
                {urlCount} {urlCount === 1 ? "URL" : "URLs"} processed — all images packaged cleanly.
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <button
                  className="px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                  style={{ background: "linear-gradient(135deg, #9333ea, #7c3aed)" }}
                >
                  Download zip
                </button>
                <button
                  onClick={handleClear}
                  className="px-6 py-2.5 rounded-full text-sm font-semibold border border-white/10 text-gray-300 hover:border-white/20 transition-all"
                >
                  Extract more
                </button>
              </div>
            </div>
          )}

         
        </div>
      </div>
    </div>
  );
}