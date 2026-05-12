"use client";
import { useState } from "react";

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="bg-[#000000] px-5 md:px-14 pb-16  md:pb-20 py-10 flex flex-col">
      <h2 className="mb-10 text-4xl font-nunito font-extrabold leading-tight tracking-tight text-white md:text-5xl">
        Frequently Asked Questions
      </h2>

    {/* Desktop table */}
{/* Desktop table */}
<div
  className="hidden md:block rounded-xl overflow-hidden"
  style={{
    border: "1px solid transparent",
    backgroundImage:
      "linear-gradient(#0d0a12, #0d0a12), linear-gradient(to top, #984cd6 0%, rgba(255,255,255,0.08) 100%)",
    backgroundOrigin: "border-box",
    backgroundClip: "padding-box, border-box",
  }}
>
  <table className="w-full border-collapse text-sm">
    <thead className="font-nunito">
      <tr  className="border-b border-white/10 align-top bg-[#0d0a12]">
        <th className="text-left p-5 text-[11px] font-bold uppercase tracking-widest text-white/40 w-1/3">
          The Question
        </th>
        <th className="text-left p-5 text-[11px] font-bold uppercase tracking-widest text-white/40 w-1/3 border-l border-white/10">
          The Short Answer
        </th>
        <th className="text-left p-5 text-[11px] font-bold uppercase tracking-widest text-white w-1/3 border-l border-white/10">
          The Full Picture
        </th>
      </tr>
    </thead>
    <tbody>
      {faqs.map((faq, i) => (
        <tr key={i}  className="border-b border-white/10 align-top bg-[#0d0a12]">
          <td className="p-5 text-white/60 italic leading-relaxed font-nunito">
            "{faq.question}"
          </td>
          <td className="p-5 font-inter text-white leading-relaxed border-l border-white/10">
            {faq.short}
          </td>
          <td className="p-5 font-inter text-white leading-relaxed border-l border-white/10">
            {faq.full}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

{/* Mobile accordion */}
<div
  className="flex md:hidden flex-col rounded-xl overflow-hidden divide-y divide-white/10"
  style={{
    border: "1px solid transparent",
    backgroundImage:
      "linear-gradient(#0a0a0a, #0a0a0a), linear-gradient(to top, #984cd6 0%, rgba(255,255,255,0.08) 100%)",
    backgroundOrigin: "border-box",
    backgroundClip: "padding-box, border-box",
  }}
>
        {faqs.map((faq, i) => (
          <div key={i}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-start justify-between gap-4 p-5 text-left"
            >
              <span className="font-nunito text-white/70 italic text-sm leading-relaxed">
                "{faq.question}"
              </span>
              <span
                className={`text-white/40 text-lg shrink-0 mt-0.5 transition-transform duration-200 ${
                  open === i ? "rotate-45" : ""
                }`}
              >
                +
              </span>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                open === i ? "max-h-64" : "max-h-0"
              }`}
            >
              <div className="px-5 pb-5 flex flex-col gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-1">
                    The Short Answer
                  </p>
                  <p className="font-inter text-white text-sm leading-relaxed">
                    {faq.short}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-white mb-1">
                    The Full Picture
                  </p>
                  <p className="font-inter text-white text-sm leading-relaxed">
                    {faq.full}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const faqs = [
  {
    question: "Does my Google Drive link need to be public?",
    short: "Yes, set it to anyone with the link.",
    full: "ZipDrift builds a direct download URL from the file ID. If access is restricted the server gets denied and that link is flagged as failed in your summary.",
  },
  {
    question: "Is there a limit to how many links I can paste?",
    short: "No limit at all.",
    full: "ZipDrift processes your entire list in one pass. Larger batches take longer and produce a bigger zip but the job never gets split across sessions.",
  },
  {
    question: "What happens when a link fails?",
    short: "It gets flagged and left out of the zip.",
    full: "Every failure is reported individually with a plain reason — access denied, no image found, unsupported format. Nothing is silently skipped or included as a broken file.",
  },
  {
    question: "Are my links or images saved anywhere?",
    short: "Nothing is stored. Ever.",
    full: "ZipDrift has no database. Your URLs pass through the server only to handle extraction and avoid CORS restrictions. Nothing is logged or retained after the session ends.",
  },
  {
    question: "What does the source badge next to each link mean?",
    short: "It shows what ZipDrift detected before extracting.",
    full: "Each link is labelled as SmugMug, Google Drive, direct image, or unknown so you can spot anything misidentified before committing to the full extraction.",
  },
];